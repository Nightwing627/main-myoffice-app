console.log("---- Start Building the .env file -----");
const fs = require('fs')
fs.writeFileSync('./src/lambda/.env', `REACT_APP_projectId=${process.env.REACT_APP_projectId}\nREACT_APP_serviceAccount=${process.env.REACT_APP_serviceAccount}\nREACT_APP_privateKey=${process.env.REACT_APP_privateKey}\n`);

console.log("---- DONE Building the .env file -----");