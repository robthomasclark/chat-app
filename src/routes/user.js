const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
//const sendmail = require('../emails/account');


const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        //await user.save();
        const token = await user.generateAuthToken();
        //sendmail.sendWelcomeEmail(user.email, user.name);
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.delete('/users/me', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        //sendmail.sendCancelEmail(req.user.email, req.user.name);
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/users/me', auth, async (req, res) => {

    const _id = req.params.id;
    const _update = req.body;
    const updates = Object.keys(_update);
    const allowedUpdates = ['name', 'email', 'password', 'age'];

    if (!updates.every((update) => allowedUpdates.includes(update))) {
        return res.status(400).send("{ Error: 'Invalid Update!'}");
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(undefined, true);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
        try {
            const buffer = await sharp(req.file.buffer).resize({height: 250, width: 250}).png().toBuffer();
            req.user.avatar = buffer;
            await req.user.save();
            res.send(req.user);
        } catch (e) {
            res.status(400).send(e);
        }
    }
    ,
    (error, req, res, next) => {
        res.status(400).send({Error: error.message});
    }
);

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error({Error: 'Avatar not found'});
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    } catch (e) {
        res.status(404).send(e);
    }
});

module.exports = router;