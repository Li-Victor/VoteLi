import express from 'express';

const router = express.Router();

router.get('/current_user', (req, res) => {
  if (req.user) {
    const { id, displayname } = req.user;
    const db = req.app.get('db');
    return db.poll
      .find({
        userid: id
      })
      .then(polls => res.send({
        id,
        displayname,
        polls
      }));
  }
  return res.send({});
});

router.get('/logout', (req, res) => {
  req.logout();
  return res.redirect('/');
});

export default router;
