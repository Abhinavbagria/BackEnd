require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwtverify =  require('./auth.middleware');
const upload = require("./multer.middleware")
const user = require('./model');
const Subscribers = require('./subscriber.model');
// console.log("MONGODB_URL =>", process.env.MONGODB_URL);
const connectDB = require('./DB/db')
const express = require('express')
const uploadResult = require("./cloudnary")
const jwt = require("jsonwebtoken");
const { users } = require('./model');
// const REFRESH_TOKEN_SECRET="thisissecret"
const REFRESH_TOKEN_SECRET = "JAAT_RAAJ";

const app = express()
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Or your frontend domain
  credentials: true
}));
app.use(express.json());
// app.use(express.urlencoded());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(cookieParser());
connectDB()

const accesstokenandrefreshtoken= async(userId)=>{

const userdoc= await user.findOne(userId)
const accesstoken=  userdoc.generateAccessToken(); // this generateAccessToken() is a function which we have made in model.js files 
const refreshtoken= userdoc.generateRefreshToken();  //this generateRefreshToken() is a function which we have made in model.js files 
userdoc.refreshtoken= refreshtoken; // this is used to save refreshtoken in Db
await userdoc.save({validateBeforeSave : false}) // validatebeforesave means not need of validation in this 

return {accesstoken, refreshtoken};
}

// app.get("/regester", (req, res) => {
//   res.status(200).json({
//     message: "ok"
//   })
// })

app.post("/regester", upload.fields([

  {
    name: "avatar",
    maxCount: 1
  }, {
    name: "coverimage",
    maxCount: 1
  }

]), async (req, res) => {
  // upload.fields([

  // {
  //   name:"avatar",
  //   maxCount:1
  // },{
  //     name:"coverimage",
  //   maxCount:1
  // }

  // ])
  const { name, email, password } = req.body;

  if (name === "") {
    console.error("name is empty please fill it ")
  }
  if (email === "") {
    console.error("Email is empty please fill it ")
  }
  if (password === "") {
    console.error("password is empty please fill it ")
  }

  const userfind = await user.findOne({ email });
  if (userfind) {
    return res.status(404).json({ message: "email already exists" })
  }

  const avatarlocalpath = req.files?.avatar[0]?.path;
  const coverimagelocalpath = req.files?.coverimage[0]?.path;
  // if (!avatarlocalpath) {
  //   console.error("avatar link is not available ")
  // }

  // const avatarcloud=await uploadResult(avatarlocalpath);
  // if(!avatarcloud){
  //    return res.status(404).json({ message: "avatar cloudnary is not there " })
  // }

 const result= await user.create({
    name,
    email,
    password,
    // avatar
  })

  const createduser= await result.findById(result._id);
 console.log(createduser);

  return res.status(201).json({massege:"user created succefully",result})
  // console.log("name", name, password, createduser);

})


app.post("/login",async(req,resp)=>{

 const {email,name,password}=req.body;
if(!name || !email){
  resp.send("please enter name or email")
};

const User=await user.findOne({
  $or:[{name},{email}]
});

if(!User){
  resp.send("no user exists")
}

// const validpassword=await User.ispasswordcorrect(password); 

// if(!validpassword){
//   resp.send("password is incorrect ")
// }
//  const loggedInUser = await user.findById(User._id).select("-password -refreshToken")

const {accesstoken, refreshtoken}= await accesstokenandrefreshtoken(User._id); // calling function we have made upper side 
const option={
  httpOnly:true,
  secure:false
};

resp.status(200)
.cookie("accesstoken",accesstoken,option)
.cookie("refreshtoken",refreshtoken,option)  // coookies are just used to display access and refrence data on postman or client side 
.json({
  massege:"user succefully loggedIn",accesstoken,refreshtoken
  // ,loggedInUser
})


})


app.post("/newrefreshtoken", async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshtoken;
 
  if (!incomingRefreshToken) {
    return res.status(400).json({ message: "Refresh token not found in cookies" });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
     REFRESH_TOKEN_SECRET
    );
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired refresh token",err });
  }

  const uuser = await user.findById(decodedToken._id);
  if (!uuser) {
    return res.status(404).json({ message: "User not found" });
  }

  const { accesstoken,refreshtoken: newrefreshtoken } = accesstokenandrefreshtoken(uuser._id);

  const cookieOptions = {
    httpOnly: true,
    secure: true, // set to false if testing locally without HTTPS
    sameSite: "Strict"
  };

  res
    .status(200)
    .cookie("accessToken", accesstoken, cookieOptions)
    .cookie("refreshtoken", newrefreshtoken, cookieOptions)
    .json({ message: "Successfully generated new tokens" });
});


  app.post("/setpassword",async(req,resp)=>{
const{oldpassword,newpassword}= req.body;
const pass= await user.findOne({oldpassword})
// console.log("req.user---"+req.user?._id)
const id=pass._id;
console.log(id);
await user.findByIdAndUpdate(
id
,{
  $set:{password:newpassword}
},
{new:true}

)

// console.log(pass+"pass")
// const User= await user.findById(pass._id)
// // console.log(User);
// const checkpass= await User.ispasswordcorrect(oldpassword);
// console.log(checkpass)
// if(!checkpass){
//   resp.send("password is incorect ")
// }

// const passnew= User.save({newpassword});
// console.log(passnew);
resp.status(200);
  })



app.post("/subscribe",async(req,resp)=>{
const {channel}= req.body;
// const data= await Subscribers({
//   channel,
//   subscriber
// });
console.log("Incoming channel name from body:", channel);
const Db= await user.find({ channnelName: "chaiorcode" }) // include trailing space if needed
console.log(Db);

const userDoc = await user.findOne({ channnelName: channel });
console.log("userdoc",userDoc)
const DocId=  userDoc?._id;
console.log(DocId);
const data= await Subscribers({
  channel: DocId
})
// const data = await Subscribers.save(DocId)
await data.save();
console.log(data);

resp.status(200).json({message:"added"},data)

})



app.get("/subscribers",async(req,resp)=>{
// const {channelname}= req.params;
// if(!channelname){
//   resp.send("please enter channel name !! ")
// }

const channel= await Subscribers.aggregate([

// {
//   $match:{
//     channelname: channelname?.toLowerCase()
//   }
// },
 {
    $group: {
      _id: "$channel", // group by channel ID
      subscriberCount: { $sum: 1 }
    }
  },
{
  $lookup:{
    from: "users",
  localField: "channel",
  foreignField: "_id",
  as: "channelDetails"

  },
},
// {
//  $addFields :{
//   subscribercount:{
//     $size:"$test"
//   }

//   }
// }
{
    $project: {
      _id: 0,
      channelId: "$_id",
      subscriberCount: 1,
      channelName: { $arrayElemAt: ["$channelDetails.channnelName", 1] }
    }
  }

])

resp.status(200).json({
  massege: channel
})

})

app.get("/secure", jwtverify, (req, res) => {
 
  res.send("You accessed a protected route!");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// export const cookiesaccesstoken= req.cookies.accesstoken;

