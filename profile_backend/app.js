const express = require('express');
const path = require('path');
const app = express();
const databaseConnection = require('./app/config/dbcon');
const rateLimiter = require('./app/utils/limiter')

databaseConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const authRoute = require('./app/routes/authRoute');
app.use('/api/v1',rateLimiter, authRoute)




const port = 4005;
app.listen(port,(error)=>{
    if(error){
        console.log('Error starting server:', error);
        
    }else{
        console.log(`Server is running on port ${port}`);
    }
})