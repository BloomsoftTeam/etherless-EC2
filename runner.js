const AWS = require('aws-sdk');

require('dotenv').config();
//vi serve un .env con le chiavi di un account AWS NON EDUCATE, e dovete aver creato vari ruoli con diversi permessi
var config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: 'eu-west-2'
});

const s3 = new AWS.S3(config);
//parameters deve essere un JSON con i parametri di esecuzione
exports.runLambda = (funcName, parameters) => {
  const lambda = new AWS.Lambda(config);
//da capire come settare i params
  const params = {
    ClientContext: "etherless", 
    FunctionName: funcName, 
    InvocationType: "Event", 
    LogType: "Tail", 
    //payload = il JSON con i parametri
    Payload: parameters,  
    Qualifier: "1"
   };

    lambda.invoke(params, function(err, data) {
        //da aggiungere che rimanda il risultato con l'evento
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });

};