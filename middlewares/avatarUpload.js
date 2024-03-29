import multer from "multer";
import HttpError from "http-errors";

const avatarUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (['image/pnh', 'image/jpeg', 'application/octet-stream'].includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(HttpError(422, 'Invalid file type'))
        }
    },
});

export default avatarUpload.single('avatar');