const express= require('express')
const app=express()

require('dotenv').config()
const dbcon=require('./config/dbconfig')
const userRoute= require('./routes/userRoute')
app.use(express.json())
app.use('/api/user',userRoute)
const blogRoute=require('./routes/blogRoute')
app.use('/api/blogs',blogRoute)
const commentRoute=require('./routes/commentRoute')
app.use('/api/comment',commentRoute)
app.listen(6666,()=>{
    console.log("Server is on !!")
})

