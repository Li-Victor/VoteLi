import express from 'express';

import passportConfig from '../config/passport';

const router = express.Router();

router.get('/current_user', passportConfig.currentUser);
router.get('/logout', passportConfig.logout);

export default router;
