"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
exports.multerConfig = {
    storage: (0, multer_1.diskStorage)({
        destination: (req, file, cb) => {
            const uploadPath = (0, path_1.join)(process.cwd(), 'uploads');
            if (!(0, fs_1.existsSync)(uploadPath)) {
                (0, fs_1.mkdirSync)(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const extension = (0, path_1.extname)(file.originalname);
            cb(null, `${timestamp}-${randomString}${extension}`);
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
};
//# sourceMappingURL=multer.config.js.map