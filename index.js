const ethers = require('./ethersManager.js');
const fs = require('fs');
const contractAddress = '0x59Acf9e0e4fAdE6b845810d02C27e6eFEfDd7eA4';

// ethers.loadSmartContract(contractAddress)
// .then((watchContract) => {
//   watchContract.on('DeploySuccessEvent', (result) => {
//     const now = new Date()
//     const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(now)
//     const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(now)
//     const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(now)
//     const hour = now.getHours();
//     const min = now.getMinutes();
//     const sec = now.getSeconds();
//     const today = `${da}-${mo}-${ye} ${hour}:${min}:${sec}`;
//     fs.appendFileSync('./log.txt', `\n${today}  ${result} - added to etherless\n`);
//   });
// })
// .catch(console.log);

const deployer = require('./deployer.js');
//da mettere che inserirà il nome dello zip caricato dall'utente
var sourceStream = Buffer.from(fs.readFileSync('extra-module.zip'));

deployer.uploadFile('extra-module', sourceStream);



