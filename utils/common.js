//@external module
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

//@internal module
const { unlinkFile } = require("../middlewares/fileDeleteHandler");

//@function for regular expression string
const escapeString = function(str){
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"); 
};

//@function for pagination
const pagination = async(pageNo, pageLimit, data) => {
    
    try {
        const page = parseInt(pageNo) || 1;
        const limit = parseInt(pageLimit) || 10;
        const skip = (page -1) * limit;

        return await data.skip(skip).limit(limit);

    } catch (error) {
        return error;
    }
}

//@function for hash the password
const hashedPassword = async(password) => {
    try {
        return await bcrypt.hash(password,10);
    } catch (error) {
        return error;
    }
}

//@function for verify password
const varifyPassword = async(inputPassword, hashPassword) => {
    try {
        return await bcrypt.compare(inputPassword,hashPassword);
    } catch (error) {
        return error;
    }
}

//@function for create an Authentication token for an account using jwt
const generateAuthToken = (id,role,concern) => {
    return jwt.sign({ id,role,concern }, process.env.JWT_SECRET, { expiresIn: "14d" });
};

//@function for verify Authentication token of an account using jwt
const verifyAuthToken = function(authToken){
    return jwt.verify(authToken,process.env.JWT_SECRET);
}

//@function for decode an account of user or admin
const decodeAccount = function(authToken){
    return jwt.decode(authToken);
}

//@make the files array
const filesArray = function(allFiles){

    let sobFiles =  [];

    if(allFiles.length > 0){
        for(let i = 0 ; i < allFiles.length ; i++){
            sobFiles.push(allFiles[i].filename);
        }
    }else{
        sobFiles.push("File not found !");
    }
    return sobFiles;
}

//@uploader function for file upload
const uploader = function (subFolderPath, allowedFileType, maxFileSize, maxCount, errorMsg){
    
    //File upload folder
    const mainDirectory = path.resolve (__dirname,"..");
    const uploadFolder = `${mainDirectory}/public/${subFolderPath}/`;

    //define the storage
    const storage = multer.diskStorage({

        //define destination
        destination : (req,file,cb)=>{
            cb(null,uploadFolder);
        },

        //define fileName
        filename:(req,file,cb)=>{

            //extract file extention
            const fileExtention = path.extname(file.originalname);

            //make a unique file name
            const fileName = file.originalname.replace(fileExtention,"").split(" ").join("-")+ "-" + Date.now() + fileExtention;

            cb(null,fileName);
        },
    });

    const upload = multer({
        storage: storage,
        limits: {
          fileSize: maxFileSize,
          files : maxCount
        },
        fileFilter: (req, file, cb) => {
          if (allowedFileType.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(errorMsg);
          }
        },
      });
    
      return upload;
}

//@function for unlink file from local
const unlinkFileFromLocal = async(allFiles, subFolder) => {
    
    try {
        
        if(allFiles[0] !== "File not found !"){

            const promises = allFiles.map((fileName)=>{
                unlinkFile(fileName,subFolder)
                .then(res => {
                    console.log("File deleted successfully !");
                })
                .catch(error => {
                    console.log(error.message)
                })
            });
            return await Promise.all(promises);
        }   
        return;
    } catch (error) {
        
    }
}

//@generate a slug from the given string
const generateSlug = function(str){
    return str.toLowerCase().replace(/\s+/g, "-");
};

//@exports
module.exports = {  escapeString,
                    pagination,
                    hashedPassword,
                    varifyPassword,
                    generateAuthToken,
                    verifyAuthToken,
                    decodeAccount,
                    filesArray,
                    uploader,
                    unlinkFileFromLocal,
                    generateSlug
                }