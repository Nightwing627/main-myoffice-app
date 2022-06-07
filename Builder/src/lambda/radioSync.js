require('dotenv').config({silent: true});
//require('dotenv').config({path: __dirname + '/.env'});
import * as admin from 'firebase-admin';
const Reader = require('radio-song');
const http = require('http');

var doDebug=false;




function debugLog(message){
 
    console.log(message);
 
}

debugLog("Before init");



const app=admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.REACT_APP_projectId,
      clientEmail: process.env.REACT_APP_serviceAccount?process.env.REACT_APP_serviceAccount:"",
      privateKey: process.env.REACT_APP_privateKey?process.env.REACT_APP_privateKey.replace(/\\n/g, '\n'):"",
    }),
    databaseURL: "https://"+process.env.REACT_APP_projectId+".firebaseio.com"
  });

exports.handler = async (event, context,)=>{

  try{
      // Get a database reference to our blog
      await app.database().ref("listOfFirestoreCollections").once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
           var childData = childSnapshot.val();
            if(childData.indexOf("_radios") >= 0){
                //Get all radio station
                console.log("Collection =>"+childData);
                getRadioStations(childData)
            }
          });
    });
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

//Lopp into the collections documents
function getRadioStations(collection){
    app.firestore().collection(collection).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            getStreamTitle(doc.data(),doc.id,collection)
         });
    })
}

function getStreamTitle(doc,id,collection){
    
    url=doc.stream;
    console.log("Stream to check => "+url);
    var reader = new Reader(url)
    reader.on('metadata', function(songName) {
        data=songName.split(" - ");
        
        var song=songName;
        if(songName.length>0&&data.length==2){
            song=data[1];
            artist=data[0];
        }
        getSongImage(artist,song,id,doc,collection);
    });
    reader.on('error', function(e){
        console.log(e)
      });
}

//3. Get photo of the current song
function getSongImage(artist,song,id,doc,collection) {
    //console.log(song+" <---> "+artist+" <---> "+id);
     var myreq = http.get("http://ws.audioscrobbler.com/2.0/?method=track.search&track="+song+"&api_key=fbf511a1574db0f922ee0cd2a9f5897c&format=json", 
                           function(r) {
                       
                                   var str="";
                                   var response={};
                                   
                                     
                                   r.setEncoding('utf8');
                                   r.on('data', function (chunk) {
                                      str += chunk;
                                   });
     
                     
     
                                   r.on('end', function () {
                                     var jsonObject = JSON.parse(str);
                                     if(jsonObject.results&&jsonObject.results.trackmatches&&jsonObject.results.trackmatches.track){
                                       jsonObject=jsonObject.results.trackmatches.track;
                                         //console.log('Number of tracks: '+jsonObject.length);
                                         if(jsonObject.length>0){
                                                 var match=jsonObject[0];
                                                 if(!match.image){
                                                     response.index=0;
                                                     for(var i=0;i<jsonObject.length;i++){
                                                         response.checkIndex=i;
                                                         if(jsonObject[i].image){
                                                             match=jsonObject[i];
                                                             response.index=i;
                                                             //break;
                                                         }
                                                     }
                                                 }
                                                 response.length=jsonObject.length;
                                                 if(match.image){
                                                     response.photo=match.image[3]['#text']
                                                     response.icon=match.image[0]['#text']
                                                 }
                                         }
                                     }
                                     
                                     //console.log(response)
                                     updatePhotoAndSong(song,artist,id,doc,response,collection);
                                     
                                     
                                   });
     
      });
 
 
 
 }
 
 
 
 
 
 //4. Update the photo and current song
 function updatePhotoAndSong(song,artist,id,doc,imageresponse,collection) {

 
     doc.currentSong=song;
     doc.currentArtist=artist;
     if(imageresponse!=null&&imageresponse.photo){
         doc.image=imageresponse.photo;
     }
 
     //console.log(id);
     app.firestore().collection(collection).doc(id).set(doc);
     //var setDoc = FirebaseHolder.fbs.collection(Config.settings.firestoreCollectionForRadios).doc(id+"").set(doc);
 
 }