//@external module
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const path = require("path");

//@configure AWS SDK with your credentials and region
const awsConfig = {
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    },
};

//@create s3 client instance
const s3Client = new S3Client(awsConfig);

//@create storage configuration
const storageConfig = multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
            const fileExtention = path.extname(file.originalname);
            const key = file.originalname.replace(fileExtention,"").split(" ").join("-")+ "-" + Date.now() + fileExtention;
        cb(null, key);
    },
});

//@exports
module.exports = { storageConfig };