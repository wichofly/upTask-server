import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Auth route is working from /api/auth');
});

export default router;
