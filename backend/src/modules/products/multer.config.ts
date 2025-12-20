import { memoryStorage } from 'multer';

export const multerConfig = {
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max par image
  },
  fileFilter: (req, file, cb) => {
    // Accepter seulement les images
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      cb(null, true);
      return;
    }

    cb(new Error('Only image files are allowed!'), false);
  },
};
