"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerConfig = void 0;
const multer_1 = require("multer");
exports.multerConfig = {
    storage: (0, multer_1.memoryStorage)(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            cb(null, true);
            return;
        }
        cb(new Error('Only image files are allowed!'), false);
    },
};
//# sourceMappingURL=multer.config.js.map