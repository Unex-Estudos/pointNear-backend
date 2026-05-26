import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { environment } from '../config/environment';
import { UserRole } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { AppError } from '../utils/AppError';

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async register(data: { fullName: string; email: string; password: string }) {
    // No MVP: sem verificação de e-mail nem aceite de termos.
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) throw new AppError('E-mail já cadastrado.', 409);

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      fullName: data.fullName,
      email: data.email,
      passwordHash,
      role: UserRole.OWNER,
    });

    return this.buildAuthenticationResponse(user.id, user.fullName, user.email, user.role);
  }

  async login(data: { email: string; password: string }) {
    // No MVP: proteção contra brute force e auditoria não implementadas.
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new AppError('Credenciais inválidas.', 401);

    const passwordMatches = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordMatches) throw new AppError('Credenciais inválidas.', 401);

    return this.buildAuthenticationResponse(user.id, user.fullName, user.email, user.role);
  }

  private buildAuthenticationResponse(id: string, fullName: string, email: string, role: UserRole) {
    const signOptions: SignOptions = {
      subject: id,
      expiresIn: environment.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    };
    const token = jwt.sign({ role }, environment.JWT_SECRET as Secret, signOptions);

    return { token, user: { id, fullName, email, role } };
  }
}
