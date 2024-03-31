require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const s3 = new S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

//@ Upload a file to S3
function uploadFile(file){
console.log(file)
    const fileStrem = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fileStrem,
        Key: file.filename
    }
    return s3.upload(uploadParams).promise()
}

module.exports = { uploadFile }