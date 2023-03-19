import multer from "multer";
import HttpError from "http-errors";
import {v4 as uniqueId} from "uuid";

const upload = (mimTypes = []) => {
    return multer({
        storage: multer.diskStorage({
            filename: (req, file, cb) => {
                cb(null, uniqueId() + '-' + file.originalname)
            },
        }),
        limits: {
            fileSize: 50 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (mimTypes.includes(file.mimetype)) {
                cb(null, true)
            } else {
                cb(HttpError(422, 'Invalid file type'))
            }
        },
    });
}

export default upload;