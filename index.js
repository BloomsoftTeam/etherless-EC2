const AWS = require('aws-sdk');
const deployer = require('./deployer.js');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

let lambda = new AWS.Lambda();

//deployFunctions sarà quella da tenere sempre accesa

let params = {
    Code: {
    },
    Description: "Function to create Lambda functions from code deployed from Etherless", 
    FunctionName: "deployFunctions", 
    Handler: "delpoyFunctions", // is of the form of the name of your source file and then name of your function handler
    MemorySize: 128, 
    Publish: true, 
    Role: "arn:aws:iam::123456789012:role/service-role/role-name", // replace with the actual arn of the execution role you created
    Runtime: "nodejs12.x", 
    Timeout: 900, 
    VpcConfig: {
    }
};

const ethers = require("ethers");
const fs = require("fs");

const provider = new ethers.providers.InfuraProvider('ropsten', '048704ebedbd4239bc0d528e70e40ff9'); 
//da cambiare col nuovo contratto
const indirizzoContratto = '0x6C9a34F5343B15314869b839b1b2e2dC1F8cE016';
let abiContratto = "[{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"fCode\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"fParameters\",\"type\":\"string\"}],\"name\":\"runRequest\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"fResult\",\"type\":\"uint256\"}],\"name\":\"runResult\",\"type\":\"event\"},{\"constant\":true,\"inputs\":[],\"name\":\"getString\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"string\",\"name\":\"fCode\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"fParameters\",\"type\":\"string\"}],\"name\":\"sendRunEvent\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"fResult\",\"type\":\"uint256\"}],\"name\":\"sendRunResult\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]" ;

const userWallet = new ethers.Wallet("0xc06d007178f5141e3ef38725c1f4be28507e3c10d85eba1eb519ccefbb3ad12a", provider);

const contractRun = new ethers.Contract(indirizzoContratto, abiContratto, provider).connect(userWallet);
    //da cambiare col nome dell'evento e con i parametri giusti //nel caso passi direttamente code basta eliminare la lettura
contractRun.on("deployRequest", (functionPath, functionName, token) => {
    //Caricamento della funzione su S3
    functionCode = fs.readFileSync(functionPath);
    try{
        deployer.uploadFile(functionName, functionCode);
    }catch(S3Err){
        console.log("Errore nel caricamento di s3");
        return;
    }
    //manca da gestire il caso esista già (in teoria si fa nel contratto ma boh)
    let params = {
        Code: {
            S3Bucket: 'etherless',
            S3Key: `functions/${funcName}.js`
            //S3ObjectVersion: 'STRING_VALUE',
            //ZipFile: Buffer.from('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */
        },
        Description: "", //ci mettiamo la descrizione caricata da dynamo????
        FunctionName: functionName, 
        Handler: functionName.append(".js"),
        MemorySize: 128, 
        Publish: true, 
        Role: "arn:aws:iam::123456789012:role/service-role/role-name", // replace with the actual arn of the execution role you created
        Runtime: "nodejs12.x", 
        Timeout: 900, 
        VpcConfig: {
        }
    };    
    lambda.createFunction(params, function(token) {
        let deployResult;
        //Distruzione del token (distruzione standard finchè non abbiamo la struttura definitiva del token)
        try{
            delete(token);
            deployResult = "Successfully deployed function.";
        }catch(error){
            deployResult = "An error occured during the deploy of your function.";
        }
        contractRun.deploySuccess(deployResult); //come si chiamerà l'evento di ritorno... da cambiare (quello che darà conferma del successo dell'operazione)
    })       
    })
     

//contractRun.removeAllListeners("deployRequest");   //in teoria non serve rimuovere i listeners perchè sarà sempre accesa questa su EC2