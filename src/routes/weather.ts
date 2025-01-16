import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Predicting weather for today');
});

router.get('/:day', (req, res) => {
    res.send('Predicting weather for ' + req.params.day);
});

export default router;