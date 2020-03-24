const express = require('express');
const https = require('https');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const deployer = require('./deployer.js');

require('dotenv').config();

let app = express();

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(fileUpload({
  createParentPath: true,
  limits: { 
      fileSize: 50 * 1024 * 1024 * 1024 //50MB max file(s) size
  },
}));

app.post('/deploy-function', async (req, res) => {
  try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No files uploaded'
          });
      } else {

          let zipStream = req.files.zip.data;
          let funcDataObj = JSON.parse(req.files.funcData.data);

          deployer.uploadFile(funcDataObj, zipStream, (err, data) => {
            if (err) {
              console.log(err, err.stack); // an error occurred
            } else {
              console.log(data);           // successful response
              //send response
              res.send({
                status: true,
                message: 'Function was uploaded correctly',
                data: {
                    name: funcDataObj.funcName
                }
              });
            }
          });
          
          
      }
  } catch (err) {
      res.status(500).send(err);
  }
});

https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: process.env.HTTPS_PEM_PASSPHRASE
}, app).listen(3000);