import express from 'express';

const router = express.Router();

router.all('*', (req, res) =>
  res.status(404).json({ error: 'There is something wrong with your request' })
);

export default router;
