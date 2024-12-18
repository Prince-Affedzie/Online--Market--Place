const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file.fieldname === "profileImage"){
            cb(null, './uploads/profiles/')

        }
        else if(file.fieldname==="storeBanner" || file.fieldname==="storeLogo"){
            cb(null, './uploads/stores/')
        }else if(file.fieldname==="productImages"){
            cb(null, './uploads/productImages/')
        }
        else if(file.fieldname === "homePageBanner" || file.fieldname === "homePageLogo"){
            cb(null,'./uploads/homePageBanners')

        }
    },

    filename:(req,file,cb)=>{
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const fileFilter = (req, file, cb) => {
    const fileTypes = /\.(jpeg|jpg|png)$/i;
    const mimeTypes = /^image\/(jpeg|jpg|png)$/i;
    
    const extname = fileTypes.test(path.extname(file.originalname));
    const mimetype = mimeTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb('Error: Images Only');
    }
  };

const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{fieldSize:1000000}
})

module.exports = {upload}