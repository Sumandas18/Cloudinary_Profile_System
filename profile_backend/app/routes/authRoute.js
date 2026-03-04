

const express=require('express');
const authController = require('../controllers/authController');
const upload = require('../utils/profileImageUpload')
const middleware = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/register',upload.single('profile_image'),authController.register)
router.post('/login', authController.login)
router.get('/me',middleware, authController.getUser)
router.put('/update/:id', middleware, upload.single('profile_image'), authController.update)
router.delete('/delete/:id', middleware, authController.delete)



module.exports = router