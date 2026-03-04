const multer = require("multer")

const FILE_TYPE = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
    'image/avif': 'avif'
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const isValid = FILE_TYPE[file.mimetype]
        let uploadError = new Error('invalid image type')

        if(isValid){
            uploadError = null
        }

        cb(uploadError, 'uploads')
    },

    filename: function(req, file, cb){
        const fileName = file.originalname.split(' ').join('-')
        const extenstion = FILE_TYPE[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extenstion}`)
    }
})

const upload = multer({storage: storage})

module.exports = upload