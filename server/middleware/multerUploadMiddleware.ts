// src/middleware/upload.ts
import multer from "multer";

const storage = multer.memoryStorage();

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const multerUploadMiddleware = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});
