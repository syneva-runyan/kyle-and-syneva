var AWS = require('aws-sdk');

const BUCKET_NAME = 'katie-and-brians-wedding';

exports.handler = async (event, context, callback) => {
    let S3 = new AWS.S3({ region: process.env.AWS_REGION });
   var params = {
         Bucket: BUCKET_NAME,
    };
     
    let res;
    try {
        const s3Response = await S3.listObjectsV2(params).promise();
        const files = s3Response && s3Response.Contents;
        if (!files || files.length === 0) {
           return onError('no files returned');
        }

        const fileData = {};
        for (let file of files) {
            let data = await S3.getObject({
                Key: file.Key,
                Bucket: BUCKET_NAME, 
            }).promise();
            fileData[file.Key] = data.Body.toString();
        }
        res = {
            'statusCode': 200,
            'headers': { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" },
            'body': JSON.stringify({fileData})
        }
    } catch (error) {
        console.log('Failed to get RSVP data', error);
        return onError(error);
    }

    return res;
};

const onError = (err) => {
    return {
        'statusCode': 404,
        'headers': { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" },
        'body': err,
    }
}
