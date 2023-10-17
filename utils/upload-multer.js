const path = require("path");
const multer = require("multer");
const uuid = require("uuid");


/* MULTER IMAGE UPLOADER */
function getTargetImageStorage(address) { /* Diskstorage bu method */
  return multer.diskStorage ({
    destination: function(req, file, cb) {
      cb(null, `./uploads/${address}`);
    },
    filename: function(req, file, cb) {
      console.log(file);
      const extension = path.parse(file.originalname).ext; /* path packagega parse methoda file nomini kirityapmiz .ext bu .file formati */
      const random_name = uuid.v4() + extension;
      cb(null, random_name);
    },
  });
}

const makeUploader = (address) => {
  const storage = getTargetImageStorage(address);
  return multer({storage: storage});
}

module.exports = makeUploader;

// const product_storage = multer.diskStorage ({
//   destination: function(req, file, cb) {
//     cb(null, `./uploads/${address}`);
//   },
//   filename: function(req, file, cb) {
//     console.log(file);
//     const extension = path.parse(file.originalname).ext; /* path packagega parse methoda file nomini kirityapmiz .ext bu .file formati */
//     const random_name = uuid.v4() + extension;
//     cb(null, random_name);
//   },
// });

// /* Pastdagi package ichiga path qilib olinyapti */
// module.exports.uploadProductImage = multer({ storage: product_storage }); 
