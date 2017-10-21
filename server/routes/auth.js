import express from 'express';

const router = express.Router();

router.get('/current_user', (req, res) => {
  if (req.user) {
    const { id, displayname } = req.user;
    return res.send({
      id,
      displayname
    });
  }
  return res.send({});
});

router.get('/logout', (req, res) => {
  req.logout();
  return res.redirect('/');
});

export default router;
