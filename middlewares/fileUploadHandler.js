const { uploader } = require("../utils/common");

const fileUploader = function(subFolder){
    try {
        return function(req, res, next){
            const uploadFile = uploader(subFolder,["application/pdf", "text/plain", 
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                "image/jpeg","image/jpg","image/png"],10000000,3,"This format is not allowed!");

            //call the upload middleware
            uploadFile.any()(req, res, (err) => {
                if(err){
                    return res.status(400).json(err.message);
                }else{
                    next();
                }
            });
        }
    } catch (error) {
        return res.status(400).json({Error: error.message});
    }
}

//@exports
module.exports = {  fileUploader
                }