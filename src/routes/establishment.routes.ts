import { Router } from 'express';
import multer from 'multer';
import { environment } from '../config/environment';
import { EstablishmentController } from '../controllers/EstablishmentController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createEstablishmentSchema, establishmentIdSchema, listEstablishmentsSchema, updateEstablishmentSchema } from '../schemas/establishment.schema';
import { AppError } from '../utils/AppError';

const upload = multer({
  dest: environment.UPLOAD_DIRECTORY,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new AppError('Formato de imagem não permitido.', 400));
      return;
    }

    callback(null, true);
  },
});
const establishmentRoutes = Router();
const establishmentController = new EstablishmentController();

establishmentRoutes.get('/', validateRequest(listEstablishmentsSchema), establishmentController.list);
establishmentRoutes.get('/mine', authMiddleware, establishmentController.mine);
establishmentRoutes.post('/images/upload', authMiddleware, upload.single('image'), establishmentController.uploadImage);
establishmentRoutes.get('/:id', validateRequest(establishmentIdSchema), establishmentController.show);
establishmentRoutes.post('/', authMiddleware, validateRequest(createEstablishmentSchema), establishmentController.create);
establishmentRoutes.put('/:id', authMiddleware, validateRequest(updateEstablishmentSchema), establishmentController.update);
establishmentRoutes.delete('/:id', authMiddleware, validateRequest(establishmentIdSchema), establishmentController.remove);

export { establishmentRoutes };
