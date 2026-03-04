const Limiter=require('express-rate-limit')

const limiter=Limiter({
    windowMs: 1 * 60 * 1000, 
    limit: 100, 
    standardHeaders: 'draft-8', 
    legacyHeaders: false, 
    ipv6Subnet: 56, 
    message: 'Too many requests. Please try after 2 minute .'
})



module.exports=limiter