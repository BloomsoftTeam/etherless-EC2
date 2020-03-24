const AWS = require('aws-sdk');

require('dotenv').config();

var config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: 'eu-west-2'
});

exports.uploadFile = (funcData, sourceCodeStream, callback) => {

  const lambda = new AWS.Lambda(config);

  const params = {
    Code: {
        ZipFile: sourceCodeStream,
    },
    Description: funcData.description, 
    FunctionName: funcData.funcName, 
    Handler: `${funcData.indexPath}.handler`, // is of the form of the name of your source file and then name of your function handler
    MemorySize: 128,
    Publish: true,
    Role: process.env.AWS_LAMBDA_ROLE,
    Runtime: "nodejs12.x", 
    Timeout: funcData.timeout,
    VpcConfig: {
    }
  };

  lambda.createFunction(params, callback);

};

