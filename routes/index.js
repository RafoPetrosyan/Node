import {Router} from "express";
import users from "./users";
import countries from "./countries.js";
import people from "./people.js";
import candidates from "./candidates.js";
import multer from "multer";
import path from "path";
import fs from 'fs';
import {v4 as uniqueId} from 'uuid';
import HttpError from "http-errors";
import _ from 'lodash';

const router = Router();

router.get('/', (req, res, next) => {
    res.json({status: 'ok'});
})

router.use('/users', users);
router.use('/countries', countries);
router.use('/people', people);
router.use('/candidates', candidates);

const upload = multer({
    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            cb(null, `${uniqueId()}-${file.originalname}`)
        },
        fileFilter: (req, file, cb) => {
            if (['image/png', 'image/jpeg', 'application/octet-stream'].includes(file.mimetype)) {
                cb(null, true)
            } else {
                cb(HttpError(422, 'Invalid file type'))
            }
        },
    }),
});

const upload2 = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (['image/png', 'image/jpeg', 'application/octet-stream'].includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(HttpError(422, 'Invalid file type'))
        }
    },
});

router.post('/upload', upload2.fields([
    {name: 'avatar', maxCount: 1},
    {name: 'passport', maxCount: 1},
], 5), (req, res, next) => {
    try {
        if (!_.isEmpty(req.files.avatar)) {
            const [file] = req.files.avatar;
            const fileName = `${uniqueId()}-${file.originalname}`;
            fs.writeFileSync(path.resolve(path.join('./public/avatars', fileName)), file.buffer);
        }
        if (!_.isEmpty(req.files.passport)) {
            const [file] = req.files.passport;
            const fileName = `${uniqueId()}-${file.originalname}`;
            fs.writeFileSync(path.resolve(path.join('./public/passports', fileName)), file.buffer);
        }

        // req.files.forEach(file => {
        //     const fileName = `${uniqueId()}-${file.originalname}`;
        //     fs.writeFileSync(path.resolve(path.join('./public', fileName)), file.buffer);
        // })

        if (false) {
            const fileName = `${uniqueId()}-${req.file.originalname}`;
            fs.writeFileSync(path.resolve(path.join('./public', fileName)), req.file.buffer);
        }
        if (false) {
            fs.renameSync(req.file.path, path.resolve(path.join('./public', req.file.filename)));
        }
    } catch (e) {
        console.log(55555)
        next(e)
    }
})

export default router;
