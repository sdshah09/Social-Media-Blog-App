const express = require('express') // importing express
require('dotenv').config() // able to use enviornment variables from .env file

//express serer
const app = express() // express = request response handler

// rest endpoint
app.get('/rest',function(req,res){ // rest is an endpoint
    res.json({
        data: 'Shaswat Shah'
    })
}) 

//port
//nodemon make the changes in real time and whenever we make changes we don't need to restart the server
// When we make changes in env file we make sure to restart the server
app.listen(process.env.PORT,function() {
    console.log(`server is ready at http://localhost:${process.env.PORT}`)
    
});