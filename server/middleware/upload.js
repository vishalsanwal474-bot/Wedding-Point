const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AppError = require('../utils/AppError');

const uploadsRoot = path.join(__dirname, '..', 'uploads');

const ALLOWED_MIME_TYPES = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

ensureDir(uploadsRoot);

const storage = multer.diskStorage({
  destination(req, _file, cb) {
    const folder = req.uploadFolder || 'general';
    const destination = path.join(uploadsRoot, folder);
    ensureDir(destination);
    cb(null, destination);
  },
  filename(_req, file, cb) {
    const extension = ALLOWED_MIME_TYPES[file.mimetype] || path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 40);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeBase || 'image'}-${unique}${extension}`);
  },
});

function fileFilter(_req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = Object.values(ALLOWED_MIME_TYPES);
  const mimeAllowed = Boolean(ALLOWED_MIME_TYPES[file.mimetype]);
  const extensionAllowed = allowedExtensions.includes(extension);

  if (!mimeAllowed || !extensionAllowed) {
    return cb(
      new AppError('Only image uploads are allowed (JPEG, PNG, WebP, GIF).', 400),
      false
    );
  }

  return cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

function setUploadFolder(folder) {
  return (req, _res, next) => {
    req.uploadFolder = folder;
    next();
  };
}

module.exports = {
  upload,
  setUploadFolder,
  uploadsRoot,
};
