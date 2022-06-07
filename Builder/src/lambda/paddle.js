require('dotenv').config({silent: true});
//require('dotenv').config({path: __dirname + '/.env'});
import * as admin from 'firebase-admin';
const querystring = require('querystring')
var md5 = require('md5');

var doDebug=false;
function debugLog(message){
  if(process.env.REACT_APP_DEBUG||doDebug){
    console.log(message);
  }
}

debugLog("Before init");
debugLog(process.env.REACT_APP_projectId);
debugLog(process.env.REACT_APP_serviceAccount);
if(process.env.REACT_APP_privateKey){
  debugLog(process.env.REACT_APP_privateKey.replace(/\\n/g, '\n'));
}

const app=admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.REACT_APP_projectId,
    clientEmail: process.env.REACT_APP_serviceAccount?process.env.REACT_APP_serviceAccount:"",
    privateKey: process.env.REACT_APP_privateKey?process.env.REACT_APP_privateKey.replace(/\\n/g, '\n'):"",
  }),
  databaseURL: "https://"+process.env.REACT_APP_projectId+".firebaseio.com"
});


exports.handler = async (event, context,)=>{
  let body = Object.assign({}, querystring.parse(event.body));
  debugLog(body)
 
  debugLog("Will print now");
  debugLog(process.env.REACT_APP_projectId);
  debugLog(process.env.REACT_APP_serviceAccount);
  debugLog(process.env.REACT_APP_privateKey);
  try{
      // Get a database reference to our blog
      await app.database().ref("/paddlePayments/"+md5(body.email)+"/").update(body);
      return {
          statusCode: 200,
          body: 'Function executed '
      }

  }catch(err){
      
      return {
          statusCode: 200,
          body: err.message
      }
  }

};

  /**
   * 
   * 
   *   exports.paddleIntegration = functions.https.onRequest((req, res) => {
      return admin.database().ref("/paddlePayments/"+md5(req.body.email)+"/").update(
        req.body
      ).then(function() {
        res.status(200).send("Paddle Payment informations updated");
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
  });

   */