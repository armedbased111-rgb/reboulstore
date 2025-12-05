import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = join(process.cwd(), 'uploads');
      
      // Créer le dossier s'il n'existe pas
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      // Générer un nom unique : timestamp-random.extension
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = extname(file.originalname);
      cb(null, `${timestamp}-${randomString}${extension}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Accepter seulement les images
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
};