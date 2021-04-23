// This library acts as the one and only cloud-storage interface,
// in this server. 

// If you want to substitute the way you store
// files in the cloud you only need to make changes here.

// The default implementation uses the AWS s3 javascript SDK(library). 

const { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')

const helpers = require('./helpers.js')

const s3 = new S3Client({ 
    region: process.env.AWS_HOSTING_REGION, 
    credentials: { 
        secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
        accessKeyId: process.env.AWS_S3_ACCESS_ID   
    } 
})

const Bucket = process.env.NODE_ENV === 'production' ? "khateeb-remind-storage" : "khateeb-remind-storage-test"

const getFile = async (filePath="img/filename.png") => {
    try {
        const s3Res = await s3.send(new GetObjectCommand({ 
            Bucket,
            Key: filePath 
        }))
        const arrayBuffer = await helpers.streamToArrayBuffer(s3Res.Body)
        return { file: arrayBuffer, status: s3Res.Body.statusCode }
    } catch(err) {
        console.log(err)
        return { 
            file: new ArrayBuffer(), 
            status: err.$metadata.httpStatusCode, 
            msg: `Couldn't get file from cloud storage. Err trace: ${err}` 
        }
    }
}

const uploadFile = async (bytes=new Uint8Array(), targetFilePath="img/filename") => {
    try {
        await s3.send(new PutObjectCommand({ 
            Bucket,
            Key: targetFilePath,
            Body: bytes 
        }))
        return { code: 0 } 
    } catch(err) {
        console.log(err)
        return {
            code: err.$metadata.httpStatusCode < 1 ? 1 : err.$metadata.httpStatusCode,
            msg: `Couldn't upload file to cloud storage. Err trace: ${err}`
        }
    }
}

const deleteFile = async (targetFilePath="img/filename") => {
    try {
        await s3.send(new DeleteObjectCommand({ 
            Bucket,
            Key: targetFilePath
        }))
        return { code: 0 }
    } catch(err) {
        console.log(err)
        return {
            code: err.$metadata.httpStatusCode < 1 ? 1 : err.$metadata.httpStatusCode,
            msg: `Couldn't delete file from cloud storage. Err trace: ${err}`
        }
    }
}

module.exports = {
    getFile,
    uploadFile,
    deleteFile
}