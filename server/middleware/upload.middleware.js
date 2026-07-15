// middlewares/upload.js
// npm i multer cloudinary
// Handles document/resume/asset-photo uploads. Validates MIME type + size
// before storage, then verifies the real file signature (magic bytes) so an
// executable renamed as .pdf is rejected regardless of extension (TC-SEC-06,
// TC-EMP-03/04).
//
// Pipeline: upload.single(field) -> verifyFileSignature -> controller calls
// uploadBufferToCloudinary() and writes the returned url onto the document.

import multer from 'multer';
import cloudinary from 'cloudinary';
import AppError from './appError.middleware.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB — configurable per TC-EMP-03

// File-signature (magic byte) prefixes — extension/mimetype header alone is
// never trusted.
const MAGIC_BYTES = {
  'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
};

function matchesMagicBytes(buffer, mimeType) {
  const signature = MAGIC_BYTES[mimeType];
  if (!signature || !buffer) return false;
  return signature.every((byte, i) => buffer[i] === byte);
}

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new AppError(400, 'INVALID_FILE_TYPE', 'Only PDF, JPG, and PNG files are allowed'));
    }
    return cb(null, true);
  },
});

function verifyFileSignature(req, res, next) {
  const file = req.file;
  if (!file) return next();

  if (!matchesMagicBytes(file.buffer, file.mimetype)) {
    return next(new AppError(400, 'INVALID_FILE_SIGNATURE', 'File content does not match its declared type'));
  }

  return next();
}

function uploadBufferToCloudinary(buffer, folder = 'hrms/documents') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: 'auto' }, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
    stream.end(buffer);
  });
}

export default {
  single: (fieldName) => multerUpload.single(fieldName),
  verifyFileSignature,
  uploadBufferToCloudinary,
};