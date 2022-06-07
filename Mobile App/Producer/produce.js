/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
  Makes expo app
*/
var firebaseConfig = require('./../firebase_config');
var chalk = require('chalk');
var inquirer = require('inquirer');
var appJSONTemplate = require('./../app.json');
var Spinner = require('cli-spinner').Spinner;
const https = require('https');
const fs = require('fs');
const nodemailer = require('nodemailer');

//Is Server - when you have the script on server
var isServer=process.argv.includes('--server');
console.log(isServer?"It is server":"Normal");

try {
    // a path we KNOW is totally bogus and not a module
    var serviceJSON = require('./service-account-file.json');
   }
   catch (e) {
    console.log(chalk.red('We can\'t find the file service-account-file.json in Mobile App/Producer/ folder. Pls refeer to docs'));
    process.exit(0);
   }

var admin = require('firebase-admin');

var exec = require('./lib/exec');
var Config = require('./config.js');
const isTesting=Config.isTesting;

const pathToPointers="/rab_pointers/";
var IS_CYCLE=false;
var userEmail="";
var userDisplayName="";
var appName="";


function debugIt(message){
    console.log("\n"+message);
}

/**
 * START - THE MAIN ENTRY POINT OF THE PRODUCER IF REGULAR
 */
function start(){

    admin.initializeApp({
        credential: admin.credential.cert(serviceJSON),
        databaseURL: "https://"+serviceJSON.project_id+".firebaseio.com"
      });

    var opsys = process.platform;

    //Default
    var choices=[
        "Make Android app",
        "Exit"
    ];

    //On MAC you can make iPhone apps
    if (opsys == "darwin") {
        choices=[
            "Make Android app",
            "Make iPhone app",
            "Exit"
        ];
    }

    //On Cloud, we can make build 
    if(process.env.REACT_APP_isCloudAppBuilder){
        choices=[
            "Make Android app",
            "Start build cycle",
            "Exit"
        ];
    }


    //Main List, ask user what to do
    inquirer.prompt(
        [{
            type: "list",
            name: "selector",
            message: "What you want to do next?",
            choices: choices,
            filter: function( val ) { return val; }
        }]
    ).then( answers => {
            var selected=answers.selector.toLowerCase().replace(/\s/g,"");
            if(selected=="makeiphoneapp"||selected=="makeandroidapp"){
                IS_CYCLE=false;
                //But first, check if user has entered confing in firebase_config
                if(firebaseConfig&&firebaseConfig.config&&firebaseConfig.config.apiKey){
                    //ok, we have an API key
                    //But do we have is set up with out database
                    if(firebaseConfig.config.apiKey=="AIzaSyDsPufr5Dhusqal0bB8VDD9N6yv9u0Lo1E"){
                        //This is the prefiled, alert user to enter his data
                        console.log(chalk.red("ERROR 2: Firebase configuration is not connected to your Database. Please read documentation regarding how to set it up."))
                    }else{
                        //ALL ok, proceed with making app
                        makeAnApp(selected);
                    }
                }else{
                    console.log(chalk.red("ERROR 1: Firebase configuration file is not ok"));
                }
                
            }else if(selected=="startbuildcycle"){
                //Start build cycle
                IS_CYCLE=true;
                startBuildCycle();
            }else{
                //EXIT
                process.exit(0);
            }
        }
    );
}


//GO WITH SERVER OR LOCAL PRODUCER
if(isServer){
    //It is server
    IS_CYCLE=true;

    admin.initializeApp({
        credential: admin.credential.cert(serviceJSON),
        databaseURL: "https://"+serviceJSON.project_id+".firebaseio.com"
      });

    startBuildCycle();
}else{
    //Regular, ask questions
    start();
}


/**
 *
 * Start making app, ask for the number
 *
 * @param {String} whatKindOfApp makeiphoneapp or makeandroidapp
 */
function makeAnApp(whatKindOfApp){
    inquirer.prompt([
        {
            type: 'input',
            name: 'app_id',
            message: "What is the APP ID you want to make?",
            validate: function(value) {
                var pass = value.match(
                  /^[0-9]+$/i
                );
                if (pass) {
                  return true;
                }
          
                return 'Please enter a number';
              }
          },
    ]).then(answers => {
            userEmail="";
            userDisplayName="";
            appName="";
            startFetchingAppData(answers.app_id,whatKindOfApp);
      });
}

/**
 *  Start the get process for the app data
 *
 * @param {Number} app_id
 * @param {String} whatKindOfApp
 */
function startFetchingAppData(app_id,whatKindOfApp){
    var spinner = new Spinner('%s Fetching App Data..');
        spinner.setSpinnerString('|/-\\');
        

    //Now connect to firebase to get the data
    var path=pathToPointers+"data/"+app_id
    debugIt(path);
    
    var db = admin.database();
    var ref = db.ref(path);
    ref.on("value", function(snapshot) {
        var rab_pointers=snapshot.val();
        debugIt(rab_pointers);
        if(rab_pointers!=null){
            //Pointer exists
            db.ref(rab_pointers).on("value",function(snapPointer){
                spinner.stop(true);
                response=snapPointer.val();
                if(response!=null){
                    //debugIt(JSON.stringify(response));
                    makeAppJSON(response,whatKindOfApp,rab_pointers,app_id);
                }else{
                    spinner.stop(true);
                    var errora="\nError 3a: The pointer of app with ID: "+app_id+" doesn't exists in your database";
                    console.log(chalk.red(errora));
                }
            });
           
        }else{
            spinner.stop(true);
            //Pointer doesn't existin, notify user
            var error="\nError 3: The app with ID: "+app_id+" doesn't exists in your database";
            console.log(chalk.red(error));

            //Dead end, notify admin and stop
            notifyAdminAndStop(error);

        }
      }, function (errorObject) {
        console.log(chalk.red("\nThe read failed: " + errorObject.code));
        spinner.stop();
        process.exit(0);
      });
      spinner.start();

}

/**
 * For givven versoni, changes last .0 to the current date
 * @param {String} currentVersion 
 */
function updateVersion(currentVersion){
    return currentVersion.substring(0,currentVersion.lastIndexOf("."))+"."+getVersionCode();
}

/**
 * Get version code YEAR+DAY_OF_YEAR
 */
function getVersionCode(){
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return parseInt(now.getFullYear()+""+day);
}

/**
 * Make the app.json
 *
 * @param {Object} response
 * @param {String} whatKindOfApp makeiphoneapp or makeandroidapp
 * @param {String} firebaseMetaPath meta path for the app
 * @param {Number} app_id - app if to make
 */
function makeAppJSON(response,whatKindOfApp,firebaseMetaPath,app_id){
    appJSONTemplate.expo.name=response.name;
    appJSONTemplate.expo.description="Made with react app builder";
    appJSONTemplate.expo.slug=response.slug?response.slug:response.name.toLowerCase().replace(/\s/g,"");
    appJSONTemplate.expo.extra.firebaseMetaPath=firebaseMetaPath;
    appJSONTemplate.expo.android.package=response.id+"expo";
    appJSONTemplate.expo.ios.bundleIdentifier=response.id+"expo";
    appJSONTemplate.expo.version=updateVersion(appJSONTemplate.expo.version);
    appJSONTemplate.expo.android.versionCode=getVersionCode();
    appName=response.name;

    if(Config.isCloud&&response.firebaseConfig!=null){
        var strToSave="var firebaseConfig = ";
        strToSave+=JSON.stringify(response.firebaseConfig);
        strToSave+=";\nexports.config = firebaseConfig;";

        fs.writeFile("./firebase_config.js", strToSave, function(err) {
            
            if(err) {
                console.log(err);
                process.exit();
            }else{
                 //Now save in a app.json
                var stringToSave=JSON.stringify(appJSONTemplate, null, 2)
                fs.writeFile((isTesting?"app_test.json":"app.json"), stringToSave, function(err) {
                    if(err) {
                        return console.log(err);
                    }

                    console.log(chalk.green("Set up of app.json for app "+appJSONTemplate.expo.name+" is done."));
                    downloadAppImages(response,whatKindOfApp,app_id);
                }); 
            }
            
        }); 
    }else{
         //Now save in a app.json
         var stringToSave=JSON.stringify(appJSONTemplate, null, 2)
         fs.writeFile((isTesting?"app_test.json":"app.json"), stringToSave, function(err) {
             if(err) {
                 return console.log(err);
             }

             console.log(chalk.green("Set up of app.json for app "+appJSONTemplate.expo.name+" is done."));
             downloadAppImages(response,whatKindOfApp,app_id);
         }); 
    }


    
   

    
    
}

/**
 *
 * Downloads all the images
 * @param {Objec} response
 * @param {String} whatKindOfApp makeiphoneapp or makeandroidapp
 * @param {Number} app_id - app if to make
 */
function downloadAppImages(response,whatKindOfApp,app_id){
    
    //Create the spinner
    var spinner = new Spinner('%s Downloading image...  ');
    spinner.start();

    //Create location to the files
    const appIcon = (isTesting?"./test/images/app.png":"./assets/icons/app.png");
    const appLoading = (isTesting?"./test/images/loading.png":"./assets/icons/loading.png");
    const appLogo = (isTesting?"./test/images/logo.png":"./App/Images/logo.png");
    const appNavLogo = (isTesting?"./test/images/navlogo.png":"./App/Images/navlogo.png");
    const appSplash = (isTesting?"./test/images/splash.png":"./assets/images/splash.png");

    //Download all the images
    dowloadSingleImage(response.appImage,appIcon,"App logo",spinner,function(){
        dowloadSingleImage(response.appImage,appLoading,"App loading",spinner,function(){
            dowloadSingleImage(response.appLogo,appLogo,"App logo",spinner,function(){
                dowloadSingleImage(response.appNavLogo,appNavLogo,"App Navigation logo",spinner,function(){
                    dowloadSingleImage(response.appSplash,appSplash,"App Splash image",spinner,function(){
                        spinner.stop(true);
                        if(IS_CYCLE){
                            publishApp(app_id);
                        }else{
                            informUserAboutNextSteps(whatKindOfApp);
                        }
                    })
                })
            })
        })
    })
}


/**
 * Download image
 *
 * @param {String} imageFile
 * @param {String} locationToSave
 * @param {String} elementName
 * @param {Objec} spinner
 * @param {Funciton} callBack
 */
function dowloadSingleImage(imageFile,locationToSave,elementName,spinner,callBack){
    if(imageFile){
        https.get(imageFile, function(response) {
            response.pipe(fs.createWriteStream(locationToSave));
            console.log(chalk.green(elementName+" is downloaded."));
            setTimeout(callBack,3000);
        });
    }else{
        console.log(chalk.red('Error 4: '+elementName+' is not set'));
        //spinner.stop(true);
        callBack();
    }
    
}


/**
 * Console ouptut - Local producers ends here
 * @param {String} whatKindOfApp 
 */
function informUserAboutNextSteps(whatKindOfApp){
    console.log(chalk.green("Great, app is sucesfully set up. Next you need to execute the following commands"));
    console.log(chalk.blue("To run your app on simulator or device locally"));
    console.log(chalk.yellow("expo start"));
    console.log(chalk.green("Then you can use the 'Publish' action to publish the app on expo server"));
    console.log(chalk.blue("To build your app "));
    if(whatKindOfApp=="makeiphoneapp"){
        console.log(chalk.yellow("expo build:ios"))
    }else{
        console.log(chalk.yellow("expo build:android"))
    }
    
    process.exit(0);
    
}

//
function notifyAdminAndStop(message){
    //TODO IMPROUVE - send on email
    console.log(chalk.red(message));
    if(Config.adminEmail!=""){
        sendEmal(Config.adminEmail,"Error on producer",message+"<br />You need to restart the system");
    }
    

    setTimeout(function(){process.exit(0)},10000);
    
}



/**
 * 
 * 
 * 
 *    SERVER APP PRODUCER SPECIFIC FUNCTIONS FROM NOW ON
 * 
 * 
 */


/**
 *Publishes an build on expo server
 *
 * @param {*} app_id
 */
function publishApp(app_id){
    console.log(chalk.green("Start publishing build to expo"));
    var completePath=pathToPointers+"apps_queue/"+app_id+"_both";
    debugIt(completePath);

    var db = admin.database();
    var ref = db.ref(completePath);
    ref.once("value", function(snapshot) {
         var response=snapshot.val();

         console.log(JSON.stringify(response));
         //updateQueue(7,'both',"https://mobidonia.com",{"appId":2,"userDisplayName":"Daniel Dimov","userEmail":"daniel@mobidonia.com"});
         //notifyAdminAndStop("Some error");

         if(response!=null){
                //All ok, start building,

                //There is common problem, 
                //connect ECONNREFUSED 127.0.0.1:19001
                //It can be resolved in expo-cli start is executed first, then stopped
                var metroBuilder=exec('npx', ['expo-cli','start'], {cwd:"./"}, function(output){
                    console.log(chalk.cyan('Starting local Metro builder'));
                });

                setTimeout(()=>{
                    console.log("Kill the builder after 20sec");
                    metroBuilder.kill('SIGINT');

                     //The build parameters
                    var makeApp = ['expo-cli','publish'];

                    //Start making
                    exec('npx', makeApp, {cwd:"./"}, function(output){
                        console.log(chalk.cyan('App publishing completed, make android app'));
                        console.log("\n");
                        //updateQueue(app_id,"both");
                        createAndroidApk(app_id,"both",response);
                    });

                },20000)


         }else{
            var error='Error 6: Submit data not set for app: '+app_id;
            console.log(chalk.red(error));
            
            //Dead end, notify admin and stop
            notifyAdminAndStop(error);
         }

    })

}

/**
 *
 * Make the android app apk
 * @param {String} whatKindOfApp makeiphoneapp or makeandroidapp
 * @param {Number} app_id - app if to make
 * @param {Object} response - {"appId":7,"userDisplayName":"admin","userEmail":"somemail@gmail.com"}
 */
function createAndroidApk(app_id,whatKindOfApp,response){
    //========== ANDROID APP CREATION ==============
    console.log(chalk.green("Start making Android app"));
    exec('npx', ['mexpo-cli','ba','--managed','expo','--no-publish','-t','app-bundle'], {cwd:"./"}, function(output){
        console.log(chalk.cyan('App building completed'));
        console.log("\n");
        console.log(chalk.green("Android app created. Now send to user."));
        exec('npx',['mexpo-cli','url:apk'],{cwd:"./",capture:true}, function(link){
            if(link&&link.length>10){
                updateQueue(app_id,whatKindOfApp,link,response)
            }else{
                var error="ERROR 5: Android app creation failed for id:"+app_id;
                console.log(chalk.red(error));
                
                //Dead end, notify admin and stop
                notifyAdminAndStop(error);
            }
        })
        

    });
}

function jobDone(){
    //If we are in build cicle -- Continue
    //If not, Stop
    if(IS_CYCLE){
        //Start build cycle all over
        console.log("Let's make a short break of 15 sec.");
        setTimeout(()=>{
            //Make 10 sec break
            startBuildCycle();
        },15000)
       
    }else{
        process.exit(0)
    }
}

async function sendMailToTheUser(androidAppLink,userEmail){
    if(userEmail!=""){
        var subject=Config.subject;
        subject=subject.replace("{appName}",appName);
        var message=Config.mailText;
        message = message.replace("{userName}",userDisplayName);
        message = message.replace("{androidAppLink}",androidAppLink);
        message = message.replace("{appName}",appName);

        await sendEmal(userEmail,subject,message);
    }else{
        jobDone();
    }
}


async function sendEmal(to,subject,body){
    console.log(body);
    let transporter = nodemailer.createTransport({
        host: Config.SMTP.host,
        port: Config.SMTP.port,
        secure: Config.SMTP.port==465, // true for 465, false for other ports
        auth: {
            user:  Config.SMTP.auth.user, // generated ethereal user
            pass: Config.SMTP.auth.pass // generated ethereal password
        }
    });

    let info = await transporter.sendMail({
        from: Config.mailFrom, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: '-', // plain text body
        html: body // html body
    });
}



/**
 * 
 * @param {*} appID 
 * @param {*} aplicationType 
 * @param {*} link 
 * @param {*} response 
 */
function updateQueue(appID,aplicationType,link,response){
    /**
     * 1. Get email  response.userEmail
     * 2. Get URL    link
     * 3. Send email
     * 4. Delete node
     */
    var appQuePath=pathToPointers+"apps_queue/"+appID+"_both";
    debugIt(appQuePath);
    sendMailToTheUser(link,response.userEmail);
    admin.database().ref(appQuePath).remove()
      .then(function() {
        debugIt("app is deleted");
        jobDone();
      })
      .catch(function(error) {
        console.log('Error deleting data:', error);
    });
}

function startBuildCycle(){

       //Now connect to firebase to get the data
       var path=pathToPointers+"apps_queue";
       debugIt("Path to APPS_QUEUE");
       debugIt(path);
       
       var db = admin.database();
       var ref = db.ref(path);
       ref.once("value", function(snapshot) {
            var rab_queue=snapshot.val();
            if(rab_queue!=null){
                debugIt(JSON.stringify(rab_queue));

                //Will provide array of appId_type to make
                var keys=Object.keys(rab_queue); 
                appsInQueue=keys.length;
                var nextAppToMake=(keys[0]).split("_");
                var appId=nextAppToMake[0];
                var appType=nextAppToMake[1];
                if(rab_queue[keys[0]].userEmail){
                    userEmail=rab_queue[keys[0]].userEmail;

                    //Check if userDisplayName exists
                    if(rab_queue[keys[0]].userDisplayName){
                        userDisplayName=rab_queue[keys[0]].userDisplayName;
                    }
                    else{
                        userDisplayName="";
                    }
                }else{
                    userEmail="";
                    userDisplayName="";
                }
                console.log("App we are going to make: App ID: "+appId+" Type: "+appType);
                startFetchingAppData(appId,appType);

            }else{
                console.log(chalk.yellow("No apps to make now. Try in 1 minute"));
                setTimeout(startBuildCycle,60000);
            }
       })
}







