const AWS = require('aws-sdk');

require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

exports.uploadFile = (funcName, sourceCode) => {

  const params = {
    Bucket: 'etherless',
    Key: `functions/${funcName}.js`,
    Body: sourceCode,
  };

  s3.upload(params, function(s3Err, data) {
    if (s3Err) throw s3Err
    console.log(`File uploaded successfully at ${data.Location}`)
  });

};

