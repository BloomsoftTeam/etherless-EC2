const AWS = require('aws-sdk');
let lambda = new AWS.Lambda();

//deployFunctions sarà quella da tenere sempre accesa

let params = {
    Code: {
        S3Bucket: 'deploybucketsamu',
        S3Key: 'STRING_VALUE', //penso che la si metta quando hai messo qualcosa nel bucket
        S3ObjectVersion: 'STRING_VALUE',
        ZipFile: Buffer.from('...') || 'STRING_VALUE'
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

//Lambda di deploy (ts-node . deploy)
lambda.createFunction(params, function(){
    const ethers = require("ethers");
    const fs = require("fs");

    const provider = new ethers.providers.InfuraProvider('ropsten', '048704ebedbd4239bc0d528e70e40ff9'); 
    //da cambiare col nuovo contratto
    const indirizzoContratto = '0x6C9a34F5343B15314869b839b1b2e2dC1F8cE016';
    let abiContratto = "[{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"fCode\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"fParameters\",\"type\":\"string\"}],\"name\":\"runRequest\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"fResult\",\"type\":\"uint256\"}],\"name\":\"runResult\",\"type\":\"event\"},{\"constant\":true,\"inputs\":[],\"name\":\"getString\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"payable\":false,\"stateMutability\":\"view\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"string\",\"name\":\"fCode\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"fParameters\",\"type\":\"string\"}],\"name\":\"sendRunEvent\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"fResult\",\"type\":\"uint256\"}],\"name\":\"sendRunResult\",\"outputs\":[],\"payable\":false,\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]" ;

    const userWallet = new ethers.Wallet("0xc06d007178f5141e3ef38725c1f4be28507e3c10d85eba1eb519ccefbb3ad12a", provider);

    const contractRun = new ethers.Contract(indirizzoContratto, abiContratto, provider).connect(userWallet);
        //da cambiare col nome dell'evento e con i parametri giusti
        contractRun.on("deployRequest", (functionPath, functionName) => {

            //manca da gestire il caso esista già (in teoria si fa nel contratto ma boh)
            let params = {
                Code: {
                },
                Description: "", //ci mettiamo la descrizione caricata da dynamo????
                FunctionName: functionName, 
                Handler: functionName.append(".js"), // is of the form of the name of your source file and then name of your function handler
                MemorySize: 128, 
                Publish: true, 
                Role: "arn:aws:iam::123456789012:role/service-role/role-name", // replace with the actual arn of the execution role you created
                Runtime: "nodejs12.x", 
                Timeout: 900, 
                VpcConfig: {
                }
            };
            functionParameters = [];
            //Usare functionPath per estrarre i nomi dei parametri come fatto con vm
            functionCode = fs.readFileSync(functionPath);
            
            lambda.createFunction(params, function() {
                //capire come buttare dentro il codice della funzione (scrivere functionCode non funziona)
            })
        })

        contractRun.deploySuccess(); //come si chiamerà l'evento di ritorno... da cambiare (quello che darà conferma del successo dell'operazione)
        contractRun.removeAllListeners("deployRequest");   
})