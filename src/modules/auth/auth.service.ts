import crypto from 'node:crypto';
import { UserRole } from '@prisma/client';
import { env } from '../../config/env';
import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/app-error';
import { comparePassword, compareToken, hashPassword, hashToken } from '../../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';

function sanitizeUser(user: { id: string; name: string; email: string; role: UserRole; avatarUrl?: string | null; phone?: string | null }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
  };
}

async function issueTokens(user: { id: string; email: string; role: UserRole }) {
  const payload = { sub: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const tokenHash = await hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + env.JWT_REFRESH_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
}

export const authService = {
  async register(data: { name: string; email: string; password: string; role: UserRole }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });

    if (existing) {
      throw new AppError('E-mail já cadastrado.', 409);
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: await hashPassword(data.password),
        role: data.role,
      },
    });

    const tokens = await issueTokens(user);
    return { user: sanitizeUser(user), ...tokens };
  },

  async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });

    if (!user || !(await comparePassword(data.password, user.passwordHash))) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    await prisma.refreshToken.deleteMany({
      where: {
        userId: user.id,
        OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }],
      },
    });

    const tokens = await issueTokens(user);
    return { user: sanitizeUser(user), ...tokens };
  },

  async refresh(token?: string) {
    if (!token) {
      throw new AppError('Refresh token não informado.', 401);
    }

    const payload = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      throw new AppError('Usuário não encontrado.', 401);
    }

    const activeTokens = await prisma.refreshToken.findMany({
      where: {
        userId: user.id,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    const matchedToken = await Promise.all(
      activeTokens.map(async (stored) => ((await compareToken(token, stored.tokenHash)) ? stored : null)),
    ).then((tokens) => tokens.find(Boolean));

    if (!matchedToken) {
      throw new AppError('Refresh token inválido.', 401);
    }

    await prisma.refreshToken.update({
      where: { id: matchedToken.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await issueTokens(user);
    return { user: sanitizeUser(user), ...tokens };
  },

  async logout(userId?: string, token?: string) {
    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        const tokens = await prisma.refreshToken.findMany({
          where: { userId: userId ?? payload.sub, revokedAt: null },
        });
        const matched = await Promise.all(tokens.map(async (stored) => ((await compareToken(token, stored.tokenHash)) ? stored : null))).then((items) => items.find(Boolean));

        if (matched) {
          await prisma.refreshToken.update({ where: { id: matched.id }, data: { revokedAt: new Date() } });
          return;
        }
      } catch {
        return;
      }
    }

    if (userId) {
      await prisma.refreshToken.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    return sanitizeUser(user);
  },

  generateSecret() {
    return crypto.randomBytes(32).toString('hex');
  },
};
