const { v2 : cloudinary } = require('cloudinary');
const fs = require('fs');

//   cloudinary.config({ 
//         cloud_name: 'dj1ygdwvd', 
//         api_key: '475842383646783', 
//         api_secret: '12345678' // Click 'View API Keys' above to copy your API secret
//     });

cloudinary.config({
  cloud_name: 'dj1ygdwvd',
  api_key: '475842383646783',
  api_secret: '12345678',
});

const filepath ='../public/temp'


function resultupld() {

  try {
    const uploadResult = cloudinary.uploader.upload(
      filepath,
      { public_id: 'shoes' }
    );
    console.log(uploadResult);
  } catch (error) {
    console.error("Upload failed:", error);
    fs.unlinkSync(filepath)
  }

} resultupld();

// const upload = require('./uploadFile');

// upload('https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 'shoes')
//   .then(res => console.log("Uploaded:", res))
//   .catch(err => console.error(err));


module.exports = resultupld;
