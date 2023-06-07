require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const bucketName = process.env.AWS_BUCKET_NAME
var region = process.env.AWS_BUCKET_REGION
const accessKeyId = "AKIAZ4SRXWJ33XPMAGWU"
var secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: 'AKIAZ4SRXWJ33XPMAGWU',
    secretAccessKey: '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'
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