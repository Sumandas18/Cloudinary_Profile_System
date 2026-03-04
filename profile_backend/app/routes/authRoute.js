

const express=require('express');
const authController = require('../controllers/authController');
const upload = require('../utils/profileImageUpload')
const middleware = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/register',upload.single('profile_image'),authController.register)
router.post('/login', authController.login)
router.use(middleware)
router.get('/me', authController.getUser)
router.put('/update/:id', upload.single('profile_image'), authController.update)
router.delete('/delete/:id', authController.delete)



module.exports = router