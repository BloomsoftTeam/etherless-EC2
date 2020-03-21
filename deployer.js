const AWS = require('aws-sdk');

require('dotenv').config();
//vi serve un .env con le chiavi di un account AWS NON EDUCATE, e dovete aver creato vari ruoli con diversi permessi
var config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: 'eu-west-2'
});

const s3 = new AWS.S3(config);

exports.uploadFile = (funcName, sourceCodeStream) => {

  // const params = {
  //   Bucket: 'etherless',
  //   Key: `functions/${funcName}.zip`,
  //   ContentType: 'application/zip',
  //   Body: sourceCodeStream,
  // };

  // s3.upload(params, function(s3Err, data) {
  //   if (s3Err) throw s3Err
  //   console.log(`File uploaded successfully at ${data.Location}`)

  //   const lambda = new AWS.Lambda(config);

  //   const params = {
  //     Code: {
  //         S3Bucket: 'etherless',
  //         S3Key: `functions/${funcName}.zip`,
  //     },
  //     Description: "user generated contento to describe the func behavior", 
  //     FunctionName: funcName, 
  //     Handler: funcName, // is of the form of the name of your source file and then name of your function handler
  //     MemorySize: 128, 
  //     Publish: true, 
  //     Role: "arn:aws:iam::509208239844:role/lambda-full-api-gateway",
  //     Runtime: "nodejs12.x", 
  //     Timeout: 900, 
  //     VpcConfig: {
  //     }
  //   };

  //   lambda.createFunction(params, function(err, data) {
  //     if (err) console.log(err, err.stack); // an error occurred
  //     else     console.log(data);           // successful response
  //   });

  // });

  const lambda = new AWS.Lambda(config);

    const params = {
      Code: {
          // S3Bucket: 'etherless',
          // S3Key: `functions/${funcName}.zip`,
          ZipFile: sourceCodeStream,
      },
      Description: "user generated contento to describe the func behavior", 
      FunctionName: funcName, 
      Handler: `extra-module/index.handler`, // is of the form of the name of your source file and then name of your function handler
      MemorySize: 128, 
      Publish: true, 
      Role: "arn:aws:iam::509208239844:role/lambda-full-api-gateway",
      Runtime: "nodejs12.x", 
      Timeout: 900, 
      VpcConfig: {
      }
    };

    lambda.createFunction(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });

};

