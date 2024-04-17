const router=require('express').Router()
const User= require('../Schema/userModel')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

// User Registration ROute

router.post('/register',async (req,res)=>{
    try {
         // Validate email format
         const emailRegex = /^[^\s@]+@gmail\.com$/i;
         const email = req.body.email;
 
         if (!emailRegex.test(email)) {
             return res.status(400).send({
                 success: false,
                 message: "Invalid email format. Only Gmail addresses are allowed."
             });
         }
        const userExists=await User.findOne({email:req.body.email})
        if(userExists){
            return res.send({
                success:false,
                message:"User already Exists!!!"
            })
        }
     
        // hashing the password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(req.body.password,salt)
        req.body.password=hashedPassword
        const newUser= new User(req.body)
        await newUser.save()

        res.send({
            success:true,
            message:"Registration Successfull!!!!"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})


// login Router

router.post('/login',async(req,res)=>{
    try{
    const{email,password}=req.body
    const user = await User.findOne({email})
    if(!user){
        return res.send({
            success:false,
            message:"User doesnt Exist!!!"
        })
    }
    const validPassword= await bcrypt.compare(password,user.password)
    if(!validPassword){
        return res.send({
            success:false,
            message:"Wrong Password!!"
        })
    }
    const accessToken = generateAccessToken({ _id: user._id });
    console.log("Access Token:", accessToken);
    res.send({
        success:true,
        message:"User Logged in!!1",
        accessToken

    })
    }
    catch(error){
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})



// Function to generate access token
function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
}


// Fetch all users
router.get('/all', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
});

module.exports=router