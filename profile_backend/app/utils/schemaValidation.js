

const joi = require('joi');

const authValidation = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email({
        minDomainSegments: 2, tlds:{allow:['com', 'net', 'in', 'org']}
    }),
    password: joi.string().min(6).max(10).required(),
    about: joi.string().max(200).allow({}, ''),
    profile_image: joi.string().optional()
})



module.exports = authValidation