import multer from "multer";

const storage = multer.memoryStorage();

const MAX_SIZE = 5 * 1024 * 1024; // 5 MiB

const fileFilter = (
  _: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (["image/jpeg", "image/png", "image/gif", "image/bmp", "image/tiff"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }
};

export const multerUploadMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_SIZE,
    files: 1,
    fields: 0,
    parts: 2, // Busboy signals at this threshold; files/fields enforce one file only.
    fieldNameSize: 100,
    fieldSize: 0,
    fieldArrayIndexLimit: 0,
  },
  fileFilter,
});
