import {Router} from 'express'
import { PostController } from './controller'
import { authenticate } from '../../middlewares/authenticate'

const router = Router();

router.post('/', authenticate, PostController.createPost);
router.get('/', PostController.getAllPosts);

export default router;