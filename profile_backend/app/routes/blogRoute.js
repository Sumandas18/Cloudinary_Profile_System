const router = require('express').Router();
const BlogController = require('../controllers/blogController');
const middlewareAuthCheck = require('../middleware/authMiddleware');
const upload = require('../utils/blogImageUpload');


router.post('/api/posts', middlewareAuthCheck, upload.single('blog_image'), BlogController.createPost);
router.get('/api/posts', BlogController.getAllPosts);
router.get('/api/posts/:id', BlogController.getSinglePost);
router.put('/api/posts/:id', middlewareAuthCheck, upload.single('blog_image'), BlogController.updatePost);
router.delete('/api/posts/:id', middlewareAuthCheck, BlogController.deletePost);

module.exports = router;