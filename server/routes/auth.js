import express from 'express';

const router = express.Router();

router.get('/current_user', (req, res) => {
  if (req.user) {
    return res.send({
      id: req.user.id,
      username: req.user.username,
      displayName: req.user.displayName,
      emails: req.user.emails
    });
  }
  return res.send({});
});

router.get('/logout', (req, res) => {
  req.logout();
  return res.redirect('/');
});

export default router;
