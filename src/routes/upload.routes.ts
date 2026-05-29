import { Router, Request, Response } from 'express';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/', upload.single('file'), (req: Request, res: Response) => {
  const file = req.file as any;
  if (!file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });

  return res.json({
    data: {
      url: file.path,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    },
  });
});

export default router;
