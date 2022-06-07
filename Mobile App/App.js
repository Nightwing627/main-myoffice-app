/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
console.disableYellowBox = true; //Set to false in development

import React from 'react';
import { LinearGradient } from 'expo-linear-gradient'
import * as Font from 'expo-font'
import { Button, StyleSheet, TextInput, View, Image, ScrollView,FlatList,TouchableOpacity,AsyncStorage,LayoutAnimation,Dimensions} from 'react-native';
import { MaterialIcons, Ionicons,Feather } from '@expo/vector-icons';
import firebase from '@datapoint/Firebase'
import * as firebase2 from 'firebase';
require("firebase/firestore");
import css from '@styles/global'
import AppListStyle from "@components/Smartrow/style";
import Master from '@containers/Master'
import MapScreen from '@containers/MapScreen'
import Categories from '@containers/Categories'
import Details from '@containers/Details'
import Gallery from '@containers/Gallery'
import NotificationScreen from '@containers/Notifications'
import Cart from '@ecommerce/Cart'
import Orders from '@ecommerce/Orders'
import OrderDetail from '@ecommerce/OrderDetail'
import WebScreen from '@containers/WebScreen'
import Home from '@containers/Home';
import Review from '@containers/Review';
import NavigationIcon from '@navigationicon'
import Config from './config'
import fun from '@functions/common';
var to = require('to-case')
import appConfig from './app.json'
import SmartIcon from '@smarticon';
import { Notifications } from 'expo';
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import {version} from './package.json';
import AppEventEmitter from "@functions/emitter"
import Login from '@containers/Users/LoginScreen'
import ForgetPassword from '@containers/Users/ForgetPassword'
import SignUp from '@containers/Users/SignUpScreen'
import ProfileSettings from '@containers/Users/ProfileSettings'
import {AdMobInterstitial} from 'expo-ads-admob';
import Profile from '@containers/Users/Profile'
import ListOfUsers from '@containers/Users/ListOfUsers'
import AddContact from '@containers/Users/AddContact'
import CreateGroupChat from '@containers/Users/CreateGroupChat'
import Chats from '@containers/Users/Chats'
import Form from '@containers/Form'
import Scanner from '@ecommerce/Scanner'
import Grid from './App/Containers/MenuLayouts/Grid'
import OrderAction from '@ecommerce/OrderAction'
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import Chat from '@containers/Users/Chat'
import AppIntroSlider from 'react-native-app-intro-slider';
import {createAppContainer } from 'react-navigation';
import LocationScreen from '@containers/LocationScreen';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator,DrawerItems } from 'react-navigation-drawer';
import { create } from 'apisauce'
import { Block, GalioProvider, Text } from 'galio-framework';
import Navbar from '@components/Navbar'
import Menu from './navigation/Menu';
import Drawer from './navigation/Drawer';
import Checkout from '@ecommerce/Checkout'

var defaultRoute=null;

import { materialTheme } from './constants';

const { width } = Dimensions.get('screen');

const api = create({
  baseURL: 'https://install.reactappbuilder.com/appids/',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, deflate'
  },
})

/**
* MyMastSreen  - creates master screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
*/
const MyMastSreen = ({ navigation, data, design,isRoot,config}) => (
  <Master data={data} navigation={navigation} design={design} isRoot={isRoot} config={config}/>
);

/**
* Home  - creates master screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
*/
const MyHomeSreen = ({ navigation, data, design,isRoot,config}) => (
  <Home data={data} navigation={navigation} design={design} isRoot={isRoot} config={config}/>
);
/**
* MyMapSreen  - creates mao screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
*/
const MyMapSreen = ({ navigation, data, design,isRoot,config }) => (
  <MapScreen data={data} navigation={navigation} design={design} isRoot={isRoot} config={config} />
);


/**
* MyCategoriesSreen  - creates categoris screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyCategoriesSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Categories data={data} navigation={navigation} isRoot={isRoot} subMenus={subMenus} config={config}/>
);

/**
* MyWebSreen  - creates web screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
*/
const MyWebSreen = ({ navigation, data, design,isRoot,config,fromNotification }) => (
  <WebScreen data={data} navigation={navigation} isRoot={isRoot} config={config} fromNotification={fromNotification} />
);

const MyLocationScreen = ({ navigation, data, design,isRoot,config }) => (
  <LocationScreen data={data} navigation={navigation} isRoot={isRoot} config={config} />
);

const MyScannerScreen = ({ navigation, data, design,isRoot,isReqUserVarification,config }) => (
  <Scanner data={data} navigation={navigation} isRoot={isRoot} isReqUserVarification={isReqUserVarification} config={config} />
);

const MyDetailsFromScanner = ({ navigation, data, design,isRoot,config }) => (
  <OrderAction data={data} navigation={navigation} isRoot={isRoot} config={config} />
);


/**
* MyDetailsSreen  - creates details screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
* @param {Object} config - configuration data
*/
const MyDetailsSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Details data={data} navigation={navigation} design={design} config={config} />
);

const MyReviewSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Review data={data} navigation={navigation} design={design} config={config} />
);

/**
* MyGallerySreen  - creates gallery screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyGallerySreen = ({ navigation, data, design,isRoot,subMenus, config }) => (
  <Gallery data={data} navigation={navigation} design={design} isRoot={isRoot} config={config} />
);

/**
* MyCartSreen  - creates cart screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyCartSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Cart data={data} navigation={navigation} design={design} config={config}  />
);

/**
* MyCartSreen  - creates cart screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyCheckoutScreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Checkout data={data} navigation={navigation} design={design} config={config}  />
);


/**
* MyOrdersSreen  - creates orders screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyOrdersSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Orders data={data} navigation={navigation} design={design} isRoot={isRoot} config={config}  />
);

/**
* MyOrdersDetailSreen  - creates orders screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyOrderDetailSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <OrderDetail data={data} navigation={navigation} design={design} isRoot={isRoot} config={config}  />
);


/**
* MyNotificationsSreen  - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyNotificationsSreen = ({ navigation, data, design,isRoot,subMenus, config }) => (
  <NotificationScreen data={data} navigation={navigation} design={design} isRoot={isRoot} config={config} />
);



/**
* MyProfileSettingsSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyProfileSettingsSreen = ({ navigation, data, design,isRoot,subMenus,isReqUserVarification,allowedUsers,config }) => (
  <ProfileSettings data={data} navigation={navigation} design={design} isRoot={isRoot} isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} config={config} />
);

/**
* MyProfileSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyProfileSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Profile data={data} navigation={navigation} design={design} config={config}  />
);

const MyChatSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <Chat data={data} navigation={navigation} design={design}/>
);

/**
* MyListOfUsersSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyListOfUsersSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <ListOfUsers data={data} navigation={navigation} design={design} config={config}  />
);

/**
* MyListOfUsersSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyChatsSreen = ({ navigation, data, design,isRoot,subMenus,config, id, path}) => (
  <Chats data={data} navigation={navigation} design={design} config={config} id={id} path={path}  />
);

/**
* MyListOfUsersSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyCreateGroupChatSreen = ({ navigation, data, design,isRoot,subMenus,config, id, path}) => (
  <CreateGroupChat data={data} navigation={navigation} design={design} config={config} id={id} path={path}  />
);
/**
* MyAddContactSreen - creates notifications screen
* @param {Object} navigation - the navigation data
* @param {Object} data - informations about the current screen
* @param {Object} design - design informations
* @param {Boolean} isRoot - how we should display the navigation bar
* @param {Object} [subMenus] - list of submenus to display
*/
const MyAddContactSreen = ({ navigation, data, design,isRoot,subMenus,config }) => (
  <AddContact data={data} navigation={navigation} design={design} config={config}  />
);
const MyLoginSreen = ({ isReqUserVarification, allowedUsers,config }) => (
  <Login  isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} config={config}/>
);

const MyCommentsSreen = ({  navigation, data, design,isRoot,subMenus,config, id, path }) => (
  <Chat data={data} navigation={navigation} design={design} config={config} id={id} path={path}  />
);

const MyForgetPassSreen = ({ isReqUserVarification, allowedUsers,config }) => (
  <ForgetPassword isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} config={config}/>
);
const MySignUpSreen = ({ isReqUserVarification, allowedUsers,config}) => (
  <SignUp isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} config={config}/>
);


const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;
const paddingValue = 8;
const screenWidth = Dimensions.get('window').width;
    this.itemSize = {
      width: (screenWidth - (paddingValue * 6)) / 2,
      height: (screenWidth - (paddingValue * 6)) / 2,
    };
export default class App extends React.Component {
  //The drawler nav, initialy null, this is build while in runtime
  static navi=null;
  static loginNavi=null;
  
  //The construcor
  constructor(props){
    super(props);
    this.state = {
            isReady:false,
            metaLoaded:false,
            meta:{},
            allAppsData:[],
            notification: {},
            fontLoaded: false,
            userAuthenticated:false,
            avatar:require('@images/logo.png'),
            userEmail:"",
            name:'',
            bio:"",
            openBCScanner:false,
            hasCameraPermission: true,
            lastScannedData:null,
            showSliders:false,
            showRealApp: false,
            slides: [],
            status:false,
            data:[],
            isGridView:false,
            showAppScreens:true, //Show directly app screens
            
        };

    //Bind functions to this
    this.retreiveMeta=this.retreiveMeta.bind(this);
    this.createNavigation=this.createNavigation.bind(this);
    this.chekIfHaveSliders=this.chekIfHaveSliders.bind(this);
    this.retreiveAppDemos=this.retreiveAppDemos.bind(this);
    this.renderAppRow=this.renderAppRow.bind(this);
    this.alterUserState=this.alterUserState.bind(this);
    this.setUpCurrentUser=this.setUpCurrentUser.bind(this);
    this.setUpUserDataFromFB=this.setUpUserDataFromFB.bind(this);
    this.openScanner=this.openScanner.bind(this);
    this.back=this.back.bind(this);
    this.goToLoginScreens = this.goToLoginScreens.bind(this);
    this.appScreensNavi = this.appScreensNavi.bind(this);
    this.checkIfPushTokenExist = this.checkIfPushTokenExist.bind(this);
    this._handleBarCodeRead=this._handleBarCodeRead.bind(this);
  }

alterUserState(isLoggedIn){
    this.setState({
      showAppScreens:isLoggedIn
    })
}

setUpUserDataFromFB(){
    firebase.auth().onAuthStateChanged(this.setUpCurrentUser)
}

setUpCurrentUser(user){
    if (user != null) 
    {
      var _this=this;
      firebase.database().ref('/users/' + firebase.auth().currentUser.uid).once('value').then(function(snapshot) {
          
          _this.setState({
            avatar:user.photoURL != null?{uri: user.photoURL}:require('@images/blank-image.jpg'),
              name:snapshot.val().username,
              bio:snapshot.val().bio,
          })
      });
      
      //Check if Push Tocken exist
      setTimeout(function(){
        _this.checkIfPushTokenExist()
      }, 2000);
    } else {
        // No user is signed in.
       this.setState({
         showAppScreens:true
       })
      }
}

componentDidMount(){
  //Check if user is logged i
  AppEventEmitter.addListener('goToAppScreensNavi',this.appScreensNavi);
  AppEventEmitter.addListener('goToLoginScreensNavi',this.goToLoginScreens);
  AppEventEmitter.addListener('profileUpdateDefInfo', this.setUpUserDataFromFB.bind(this));
  this.setUpUserDataFromFB()


  

  if(Config.loginSetup.anonymousLogin){
    firebase.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode+" : "+errorMessage);
    });
  }

  this.fetchTheCodeForApp=this.fetchTheCodeForApp.bind(this);

}

componentWillUnmount() {
 
  //var _this=this;
  //NetInfo.isConnected.removeEventListener('change', this.handleConnectionChange);

 
}


handleConnectionChange = (isConnected) => {
 this.setState({ status: isConnected });
}


/**
 * Show the App Screens, HOME + Settings by updating state
 * @memberof App
 */
appScreensNavi(){
  this.setState({
    showAppScreens:true
  })
  //this.navi.dispatch( NavigationActions.navigate({ routeName: defaultRoute }));

}

/**
 * Open the login screen, by updating state
 * @memberof App
 */
goToLoginScreens(){
  this.setState({
    showAppScreens:false
  })
}

async checkIfPushTokenExist(){
  const value = await AsyncStorage.getItem("token");
  if(value != null){
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid).update({
      token:value
    })
  }else{

  }
}

  //When component is mounted
  async componentWillMount() {

    
    //ASK FOR CAMERA ONLT IF IS PREVIEW TRUE AND SHOWBARCODE TRUE
    if(Config.isPreview&&Config.showBCScanner){
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({hasCameraPermission: status === 'granted'});
    }
  
    

      AppEventEmitter.addListener('user.state.changes', this.alterUserState);

      //Check login status
      // Listen for authentication state to change.
      firebase.auth().onAuthStateChanged((user) => {
        if (user != null) {
          this.setState({
            showAppScreens:true
          });
        }else{
          this.state.showAppScreens=false;
        }
      });

      if(!Config.isPreview&&!Config.isDemo){
        
        //Load the data automatically, this is normal app and refister for Push notification
        this.registerForPushNotificationsAsync();
        Notifications.addListener(this._handleNotification);
        this.retreiveMeta();
      }else{
        //Load list of apps
        this.retreiveAppDemos();
      }

      await Font.loadAsync({
        //"Material Icons": require("@expo/vector-icons/fonts/MaterialIcons.ttf"),
        //"Ionicons": require("@expo/vector-icons/fonts/Ionicons.ttf"),
       // "Feather": require("@expo/vector-icons/fonts/Feather.ttf"),
        'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
        'lato-light': require('./assets/fonts/Lato-Light.ttf'),
        'lato-regular': require('./assets/fonts/Lato-Regular.ttf'),
        'lato-bold': require('./assets/fonts/Lato-Bold.ttf'),
        'lato-black': require('./assets/fonts/Lato-Black.ttf'),
        'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'roboto-light': require('./assets/fonts/Roboto-Light.ttf'),
        'roboto-thin': require('./assets/fonts/Roboto-Thin.ttf'),
        
      });
      
      this.setState({ isReady: true,fontLoaded: true });
}

  openScanner(){
    this.setState({
      openBCScanner:true
    });
  }
 
  _handleBarCodeRead = ({ data }) => {

    data = data.replace(/(\r\n|\n|\r)/gm, "").replace(/ /g,'');
   
    
    if (data !== this.state.lastScannedData) {
      LayoutAnimation.spring();
      this.setState({ lastScannedData: data });
      var decodedData = decodeURIComponent(data);
      
    var spl = decodedData.split(";");
    console.log("1->"+spl[0]);
    console.log("2->"+spl[1]);
    console.log("3->"+spl[2]);
    var url = ".firebaseapp.com"

    // Configure firebaseConfig from config.js
    Config.firebaseConfig = {
      apiKey : spl[0],
      authDomain : spl[1] + url ,
      databaseURL : "https://" + spl[1] + ".firebaseio.com",
      projectId : spl[1],
      storageBucket : spl[1] + ".appspot.com"
    }

    console.log(JSON.stringify(Config.firebaseConfig))
  
    var _this=this;
     //Configure firebaseMetaPath  from app.json
     appConfig.expo.extra.firebaseMetaPath = spl[2];

    //Set the preview to false
    Config.isPreview = false

    firebase.app("[DEFAULT]").delete().then(function() {
      


      firebase.initializeApp(Config.firebaseConfig);
      
      
      // Fix for latest version on Firestore
       
      //const firestore=firebase.firestore();
      
      //firestore.settings({timestampsInSnapshots:true});
      //END FIX 
      
      _this.retreiveMeta()
      
     
     
    });
    }
    
    
  }


  _handleNotification = (notification) => {
    this.setState({notification: notification});
  };


// Function for register For PushNotifications
  async registerForPushNotificationsAsync() {

    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;

    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

      const value = await AsyncStorage.getItem("token");

      var pathToTokens="/expoPushTokens";
      if(appConfig.expo.extra.firebaseMetaPath!="/meta"){
        pathToTokens+=appConfig.expo.extra.firebaseMetaPath;
      }


      // Get a key for a new Post.
       var newPostKey = firebase.database().ref(pathToTokens).push().key;


       if(value == null)
       {
         //Set the token in FireBase
         firebase.database().ref(pathToTokens+"/"+ newPostKey).set({
           token: token
         });
         // Save the value of the token in AsyncStorage

         try {
           await AsyncStorage.setItem("token", await Notifications.getExpoPushTokenAsync());
         } catch (error) {
           // Error saving data
         }
       }
       else {
       }
    }


  //STEP 1 - Retrive metadata from Firebase db
   retreiveMeta(){
    
    //Get the meta data
    var _this=this;
    

    if(firebase.apps.length){
      //firebase.database().ref("/saasapps/wgnKPcLZE1W1PJLBDD79JwBe9K42/antenna5exampleapp").once('value').then(function(snapshot) {
      firebase.database().ref(appConfig.expo.extra.firebaseMetaPath).once('value').then(function(snapshot) {

        console.log("Start chekIfHaveSliders  "+appConfig.expo.extra.firebaseMetaPath+"!----")
        console.log(snapshot.val())
        if(snapshot.val().settings!=undefined){
          //AdMob settings
          //console.log("Start settings")
          if(snapshot.val().settings.adMob!=null){
            Config.showBannerAds=snapshot.val().settings.adMob.showBannerAds == null ? false:snapshot.val().settings.adMob.showBannerAds;
           Config.showinterstitialAds=snapshot.val().settings.adMob.showinterstitialAds == null ? false:snapshot.val().settings.adMob.showinterstitialAds;
            Config.bannerID=snapshot.val().settings.adMob.bannerID == null ? "":snapshot.val().settings.adMob.bannerID;

            AdMobInterstitial.setAdUnitID(snapshot.val().settings.adMob.interstitialID == null ? "":snapshot.val().settings.adMob.interstitialID);
          
            
  
            if(Config.isTesting){
              AdMobInterstitial.setTestDeviceID("EMULATOR");
            }
            
      
            if(Config.showinterstitialAds == true)
            {
              AdMobInterstitial.requestAdAsync().then(() => AdMobInterstitial.showAdAsync());
            }
    
          }
         
          if(snapshot.val().settings.login!=null){
               //LoginSettings
            Config.loginSetup={
            welcomeText: snapshot.val().settings.login.welcomeText == null ? "":snapshot.val().settings.login.welcomeText,
            facebookLogin: snapshot.val().settings.login.facebookLogin == null ? false:snapshot.val().settings.login.facebookLogin, 
            facebookID: snapshot.val().settings.login.facebookID == null?"178511486175063":snapshot.val().settings.login.facebookID,
            googleLogin: snapshot.val().settings.login.googleLogin == null ?false:snapshot.val().settings.login.googleLogin, 
            googleIOSid: snapshot.val().settings.login.googleIOSid == null ? "148773293873-o35mgo7q5ceea45v4fhd9uqivgtjlh4j.apps.googleusercontent.com":snapshot.val().settings.login.googleIOSid,
            googleAndroidId: snapshot.val().settings.login.googleAndroidId == null? "419235345147-5ld8h97mhnk6qq257djds3bu1l9acfuu.apps.googleusercontent.com":snapshot.val().settings.login.googleAndroidId
          }

          }
         
          if(snapshot.val().settings.paypal!=null){
              //PayPal settings
          Config.paypal={
            acceptPayments: snapshot.val().settings.paypal.acceptPayments != null ? snapshot.val().settings.paypal.acceptPayments: true,
            sandBoxMode: snapshot.val().settings.paypal.sandBoxMode == null?true: snapshot.val().settings.paypal.sandBoxMode,
            clientID: snapshot.val().settings.paypal.clientID == null ? "Af_H2HSMUFkVQsDfIggWgobv-QK59pLOR6iX77TpEWLUN8ob0eBGCg48CBX1gcifFKUdu0YHRfyS6Tnl":snapshot.val().settings.paypal.clientID,
            secretKey: snapshot.val().settings.paypal.secretKey == null ? "EHrmFLREuoQ7FMIEITEKckqydqhtQan07pIy0Uhc1TnNmmE33_xWfqlFoBXHg7gjuismQQaNoSzMLWIS" : snapshot.val().settings.paypal.secretKey,
            return_url: snapshot.val().settings.paypal.return_url == null? "https://envato.com/#products": snapshot.val().settings.paypal.return_url,
            cancel_url: snapshot.val().settings.paypal.cancel_url == null? "https://market.envato.com/": snapshot.val().settings.paypal.cancel_url,
            includeShippingInfo: snapshot.val().settings.paypal.includeShippingInfo == null ? true : snapshot.val().settings.paypal.includeShippingInfo,
            currency: snapshot.val().settings.paypal.currency == null ? "USD": snapshot.val().settings.paypal.currency,
            state: snapshot.val().settings.paypal.state == null? "CA":snapshot.val().settings.paypal.state ,
            country_code: snapshot.val().settings.paypal.country_code == null?"US":snapshot.val().settings.paypal.country_code,
            postal_code: snapshot.val().settings.paypal.postal_code == null ? "95131":snapshot.val().settings.paypal.postal_code,
            city: snapshot.val().settings.paypal.city == null? "San Jose":snapshot.val().settings.paypal.city,
          }

          }
          
          if(snapshot.val().settings.orders!=null){
             //Order setup
            Config.sendToEmail= snapshot.val().settings.orders.sendToEmail == null ? "contact@mobidonia.com":snapshot.val().settings.orders.sendToEmail
          }
         

          
      }else {
        //Defined from local

      }
      console.log("Start chekIfHaveSliders3")
         _this.chekIfHaveSliders(snapshot.val())
        
      });
     
    } 
    
    

  }

  _renderNextButton = () => {
    return (
      <View style={css.buttonCircle}>
        <SmartIcon
          defaultIcons={"MaterialIcons"}
          name="MdArrowForward"
          color="rgba(0, 0, 0, .9)"
          size={30}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    );
  }

  _renderDoneButton = () => {
    return (
      <View style={css.buttonCircle}>
        <SmartIcon
          defaultIcons={"MaterialIcons"}
          name="MdDone"
          color="rgba(0, 0, 0, .9)"
          size={30}
          style={{ backgroundColor: 'transparent' }}
          
        />
      </View>
    );
  }

  _onDone = async ()  => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.createNavigation(this.state.data)
    
    try {
      await AsyncStorage.setItem('hasSeenTheSliders', "yes");
    } catch (error) {
      // Error saving data
    }
    
  }

   async chekIfHaveSliders(data){
   

    const hasSeenTheSliders = await AsyncStorage.getItem("hasSeenTheSliders");

    if(data.config.showSlides && data.navigation.slides != null && (hasSeenTheSliders == null||Config.isPreview) ){
      for (let index = 0; index < data.navigation.slides.length; index++) {
        data.navigation.slides[index].image={uri:  data.navigation.slides[index].image};
        data.navigation.slides[index].imageStyle = { 
          width:  data.navigation.slides[index].width|320,
          height: data.navigation.slides[index].height|267 }
          data.navigation.slides[index].textStyle={color: '#838191'};
          data.navigation.slides[index].titleStyle={color: '#302c48',fontWeight: '500'};
      }
      this.setState({
        slides:data.navigation.slides,
        showSliders:true,
        data:data
      })
     
    }
    else{
      this.createNavigation(data)
    }
  }

  //STEP 2 - Create the drawer and all the tree navigation
  createNavigation(data){
    
    var config = data.config
    //Routes structure
    var routes={};
    defaultRoute=data.navigation.menus[0].name;
    Config.defaultRoute=defaultRoute;
   
    
   
    
    //Initialize the global design - user in other components on render
    var design=data.design;
    css.dynamic=data.design;

    //materialTheme.COLORS.PRIMARY="red";
    //materialTheme.COLORS.PRIMARY="red";
    
    materialTheme.COLORS.BUTTON_COLOR=design.general.buttonColor;
    materialTheme.COLORS.PRIMARY=design.general.buttonColor;
    materialTheme.COLORS.ACTIVE=design.general.buttonColor;
    materialTheme.COLORS.SWITCH_ON=design.general.buttonColor;
    materialTheme.COLORS.PRICE_COLOR=design.general.buttonColor;
    materialTheme.COLORS={...materialTheme.COLORS, ...design.COLORS}

    /*Object.keys(design.COLORS).map((key)=>{
      materialTheme.COLORS[key]=design.COLORS[key];
    })*/
    
    //alert(JSON.stringify(design.COLORS))
    AppEventEmitter.emit('colors.loaded');
    isReqUserVarification=data.config.userVarification
    allowedUsers=data.config.allowedUsers
    
    Config.config = data.config
    
    //Loop in the menus, for each item create StackNavigator with routes
    //Basicaly, for each item, create his appropriate screens inside StackNavigator
    //The master-detail type is the core one - contains Master, Categories , Master Sub and Details sceen
    //Other screens like cart and orders contains single windows
    data.navigation.menus.map((item,index)=>{
      var theScreen=null;
      var addIt=true;
      
      //Each menu has stack nav with 3 routes, if type is master-detail or undefined
      if(item.type=="cart"||item.sectionType=="cart"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Cart: { screen: ({ navigation })=>(<MyCartSreen data={item} navigation={navigation} design={design} isRoot={true} config={config} />) },
          Checkout: { screen: ({ navigation })=>(<MyCheckoutScreen data={item} navigation={navigation} design={design} isRoot={true} config={config} />) },
        },{
          initialRouteName:"Cart",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      } else if(item.sectionType=="web"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Web: { screen: ({ navigation })=>(<MyWebSreen data={item} navigation={navigation} design={design} isRoot={true} fromNotification={false} />) },
        },{
          initialRouteName:"Web",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="orders"||item.sectionType=="orders"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Orders: { screen: ({ navigation })=>(<MyOrdersSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          OrderDetail: { screen: ({ navigation })=>(<MyOrderDetailSreen data={item} navigation={navigation} design={design}/>) },
        },{
          initialRouteName:"Orders",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="map"||item.sectionType=="map"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Map: { screen: ({ navigation })=>(<MyMapSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          DetailsFromMap: { screen:({ navigation })=>(<MyDetailsSreen data={item} navigation={navigation} design={design} />) },
          Gallery: { screen:({ navigation })=>(<MyGallerySreen data={item} navigation={navigation} design={design} />) },
        },{
          initialRouteName:"Map",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="notifications"||item.sectionType=="notifications"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Notifications: { screen: ({ navigation })=>(<MyNotificationsSreen data={item} navigation={navigation} design={design} isRoot={true} config={config} />) },
          WebNotifications: { screen:({ navigation })=>(<MyWebSreen data={item} navigation={navigation} design={design} fromNotification={true}/>) },
        },{
          initialRouteName:"Notifications",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }
      else if(item.type=="addContact"||item.sectionType=="addContact"){
        
        addIt=false;
      }
      else if(item.type=="profile"||item.sectionType=="profile"){
        addIt=false;
        
      }
      else if(item.type=="scanner"||item.sectionType=="scanner"){
        
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Scanner: { screen: ({ navigation })=>(<MyScannerScreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          OrderAction: { screen: ({ navigation })=>(<MyDetailsFromScanner data={item} navigation={navigation} design={design} />) },
         },{
          initialRouteName:"Scanner",
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="chats"||item.sectionType=="chats"){
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Chats: { screen:({ navigation })=>(<MyChatsSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          Chat: { screen: ({ navigation })=>(<MyChatSreen data={item} navigation={navigation} design={design} />)},
          ListOfUsers: { screen:({ navigation })=>(<MyListOfUsersSreen data={item} navigation={navigation} design={design} />) },
          Profile: { screen: ({ navigation })=>(<MyProfileSreen data={item} navigation={navigation} design={design} />)},
          Login: { screen: ({})=>(<MyLoginSreen  isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} />),  navigationOptions: ({ navigation }) => ({ title: '',
        header: null,
      })
    },
        },{
          initialRouteName:'Chats',
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }else if(item.type=="comments"||item.sectionType=="comments"){
        //Create the required screens in StackNavigator
        
        var theScreen = createStackNavigator({
          
          Comments: { screen: ({ navigation })=>(<MyCommentsSreen data={item} navigation={navigation} design={design} id={item.objectIdToShow} path="comments/"  public={true} />)},
          Profile: { screen: ({ navigation })=>(<MyProfileSreen data={item} navigation={navigation} design={design} />)},
          Login: { screen: ({})=>(<MyLoginSreen  isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers} />),  navigationOptions: ({ navigation }) => ({ title: '',
        header: null,
      })
    },
   
        },{
          initialRouteName:'Comments',
          headerMode:"none",
          navigationOptions: {
          headerTintColor: 'blue',
          }
        });
      }else if(item.type=="listOfUsers"||item.sectionType=="listOfUsers"){
        //Create the required screens in StackNavigator
        addIt=false;
      }else if(item.type==""||item.type==null||item.type=="master-detail"||item.sectionType=="master-detail"||item.type=="wish-list"||item.sectionType=="wish-list"){
        
        //Default
         var initialRootName = item.initialRootName != null? item.initialRootName:"Master"

        //In case categories are the one that should be shown first
        if(item.category_first){
          initialRootName="Categories"
        }else if(item.subMenus&&item.subMenus.length>0){
          //When we have sub menus
          initialRootName="MasterSUB"
        }else if(item.goDirectlyToDetails){
          //Goes directly to details
          
          initialRootName="Details"
        }
        
        console.log(JSON.stringify(item))
        //Create the required screens in StackNavigator
        var theScreen = createStackNavigator({
          Master: { screen: ({ navigation })=>(<MyMastSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          Home: { screen: ({ navigation })=>(<MyHomeSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          LocationScreen: { screen: ({ navigation })=>(<MyLocationScreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          Categories: { screen: ({ navigation })=>(<MyCategoriesSreen data={item} navigation={navigation} design={design} isRoot={item.category_first} subMenus={[]} />) },
          Review: { screen: ({ navigation })=>(<MyReviewSreen data={item} navigation={navigation} design={design} isRoot={false} subMenus={[]} />) },
          MasterSUB: { screen: ({ navigation })=>(<MyCategoriesSreen data={{'categorySetup':item}} navigation={navigation} design={design} isRoot={true} subMenus={item.subMenus} />) },
          Details: {  screen:({ navigation })=>(<MyDetailsSreen data={item} navigation={navigation} design={design} isRoot={true} />) },
          Gallery: { screen:({ navigation })=>(<MyGallerySreen data={item} navigation={navigation} design={design} />) },
          WebSub: { screen: ({ navigation })=>(<MyWebSreen data={item} navigation={navigation} design={design} isRoot={true} fromNotification={true} />) },
          NotificationsSub: { screen: ({ navigation })=>(<MyNotificationsSreen data={item} navigation={navigation} design={design} isRoot={false} />) },
          OrdersSub: { screen: ({ navigation })=>(<MyOrdersSreen data={item} navigation={navigation} design={design} isRoot={false} />) },
          OrderDetail: { screen: ({ navigation })=>(<MyOrderDetailSreen data={item} navigation={navigation} design={design}/>) },
          ProfileSettingsSub: { screen:({ navigation })=>(<MyProfileSettingsSreen data={item} navigation={navigation} design={design} isRoot={false} />) },
          SubProfile: { screen: ({ navigation })=>(<MyProfileSreen data={item} navigation={navigation} design={design} isRoot={false} />)},
          ProfileSettings: { screen:({ navigation })=>(<MyProfileSettingsSreen data={item} navigation={navigation} design={design} />) },
          ListOfUsersSub: { screen:({ navigation })=>(<MyListOfUsersSreen data={item} navigation={navigation} design={design} />) },
          Chats: { screen:({ navigation })=>(<MyChatsSreen data={item} navigation={navigation} design={design} />) },
          Chat: { screen: ({ navigation })=>(<MyChatSreen data={item} navigation={navigation} design={design} />)},
          WebNotificationsSub: { screen:({ navigation })=>(<MyWebSreen data={item} navigation={navigation} design={design} fromNotification={true}/>) },
          
        },{
          //initialRouteName:item.category_first?"Categories":(item.subMenus&&(item.subMenus.length>0?"MasterSUB":"Details")),
          initialRouteName:initialRootName,
          headerMode:"none",
          navigationOptions: {
            headerTintColor: 'blue',
          }
        });
      }

      //Add navigation options to each StackNavigator
      //Create icon and name
      

     
        //For each item, inside the routes, add the route with givven name
        if(addIt){

          theScreen.navigationOptions = {
            drawerLabel: ({focused}) => (
              <Drawer focused={focused} screen={item.name} title={item.name} icon={item.icon} />
            )
          };

          routes[item.name]={
            path: '/'+item.name,
            screen: theScreen,
          }
        }
        
      

      
    });
    //END of the loop of menus
    //At this point we have all the routes created.

   /**
    * FIXED NAV 
    */


    //Login
    this.loginNavi=createAppContainer(createStackNavigator({
      ForgetPassword: {screen: ForgetPassword},
      SignUp: { screen: SignUp },
      Login: {screen: Login},
    },{
        initialRouteName:'Login',
        headerMode:"none", 
        screenOptions:{
          defaultRoute:defaultRoute
        }
    }));

    this.loginNavi.navigationOptions = {
      drawerLabel: ({focused}) => (
       <View></View>
      )
    };

    routes["loginPATH"]={
      path: 'loginPATH',
      screen: this.loginNavi,
    }

    //Profile
    var profileNavi=createAppContainer(createStackNavigator({
      TheProfileSettings: { screen:({ navigation })=>(<MyProfileSettingsSreen  navigation={navigation} design={design} isReqUserVarification={isReqUserVarification} allowedUsers={allowedUsers}/>) },
    },{
        initialRouteName:'TheProfileSettings',
        headerMode:"none", 
    }));

    profileNavi.navigationOptions = {
      drawerLabel: ({focused}) => (
       <View></View>
      )
    };

    routes["profilePATH"]={
      path: 'profilePATH',
      screen: profileNavi,
    }



    /**
     * THE LOGIN ROUTE
     */
    
    


   
      //SIDE Navigation
      this.navi = createAppContainer(createDrawerNavigator(
        routes,
        {
          contentComponent: props => <Menu {...props} hideLogin={data&&data.settings&&data.settings.login?data.settings.login.hideLogin:false} />,
          drawerBackgroundColor: 'white',
          drawerWidth: width * 0.8,
          contentOptions: {
            activeTintColor: 'red',
            inactiveTintColor: '#000',
            activeBackgroundColor: 'transparent',
            itemStyle: {
              width: width * 0.75,
              backgroundColor: 'transparent',
            },
            labelStyle: {
              fontSize: 18,
              marginLeft: 12,
              fontWeight: 'normal',
            },
            itemsContainerStyle: {
              paddingVertical: 16,
              paddingHorizonal: 12,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            },
          },
        }
        /*{
          initialRouteName: defaultRoute,
          contentComponent: props =>
            <ScrollView style={{backgroundColor:design.sideMenu.sideNavBgColor}}>
              <View style={css.static.imageLogoHolder}>
                <Image style={css.layout.profileImageEdit} source={this.state.avatar} ></Image>
              </View>
              <View style={css.layout.sideNavTxtParent}>
                  <Text style={css.layout.sideNavText}>{this.state.name}</Text>
                  <Text style={css.layout.sideNavText}>{this.state.bio}</Text>
              </View>
             
              <DrawerItems {...props}></DrawerItems>
            </ScrollView>,
          contentOptions: {
            activeTintColor: tintColor,
            activeBackgroundColor: design.sideMenu.activeBackgroundColor,
            inactiveTintColor:design.sideMenu.inactiveTintColor,
            inactiveBackgroundColor:design.sideMenu.inactiveBackgroundColor
          },
        }*/
        ));
    

    //=== END LAYOUT ============

    //Notify the state that we have the routes and drwer created, it should rerender the initial screen
    this.setState({
      metaLoaded:true,
      meta:data,
    })
  }
 
  

  back(){
    this.setState({
      openBCScanner:false
    })
  }

  fetchTheCodeForApp(code){
    //index.php?action=getString&id=1003
    api.get('index.php?action=getString&id='+code)
    .then(response => response)
    .then(this._handleBarCodeRead)
  }

  

  //DEMO STEP 1 - Retreive list of demo apps
  retreiveAppDemos(){
    var _this=this;
    
    //Get list of apps, and put the data in the state
    firebase.database().ref("apps").once('value').then(function(snapshot) {
      var allAppsData=snapshot.val();
      var apps=[];
      Object.keys(allAppsData).map(function(key, index) {
         allAppsData[key]["key"]=key;
         apps.push(allAppsData[key])

      });
      _this.setState({allAppsData:apps})
      
    });
  }

   //DEMO STEP 2 - Crerea an app row, opens single app
   renderAppRow = ({item,index}) => (
    <TouchableOpacity onPress={()=>{
      appConfig.expo.extra.firebaseMetaPath=item.key;
      this.chekIfHaveSliders(item)
      }}>
      <View style={[AppListStyle.standardRow,{backgroundColor:"#ffffff",borderRadius:10,margin:4,marginBottom:15,paddingLeft:10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        }]}>
        <LinearGradient  colors={gradients[(index%gradients.length)]}
        style={{backgroundColor:"white",width:50,height:50,borderRadius:25,justifyContent:"center",alignItems:"center"}}>
            <SmartIcon defaultIcons={"MaterialIcons"} name={item.appListIcon}  size={30} color='#ffffff'/>
        </LinearGradient>
        <View style={[AppListStyle.standardRowTitleArea,{marginLeft:15}]} >
          <Text style={{color:"#434F64",fontWeight:'300',fontFamily: 'lato-bold',}}>{fun.callFunction(item.key,"capitalizeFirstLetter,append~ App") }</Text>
        </View>
        <View style={[AppListStyle.standardRowArrowArea,{opacity:0.5}]} >
        
          <MaterialIcons name={"navigate-next"} size={24} color="#434F64"  />
        </View>
      </View>
    </TouchableOpacity>
  );

  
  //STEP 3 - render
  render() {


    
    if(this.state.metaLoaded&&this.state.isReady){
      //Data IS Loaded
      return (
            <GalioProvider>
              <ActionSheetProvider>
                <this.navi defaultRoute={defaultRoute} isLoggedIn={this.state.showAppScreens} isReqUserVarification={this.state.meta.config.userVarification}  />
              </ActionSheetProvider>
            </GalioProvider>
            
            );
    }else{
      if(!Config.isPreview&&!Config.isDemo){
        //Normal App, Data is not yet loaded, show the loading screen
        return (
          <View style={css.static.container}>
            <View style={css.static.imageHolder}>
              <Image style={css.static.image} source={require('@images/logo.png')} />
            </View>
            <View style={css.static.loading} >
              <Text style={css.static.text}>v {version} Loading ...</Text>
            </View>
          </View>
        )
      }else{
          //Preview app
            if(this.state.fontLoaded){
              if(Config.isPreview){
                //UNQUE ID
                return (
                  <View style={{padding:10,paddingTop:60,backgroundColor:"#f7f7f7",flex:1}}>
                      <Text h4 bold muted style={[{marginTop:20}]}>Unique App id</Text>
                      {/** START */}
                      <View style={{flexDirection:"row"}}>
                      <TouchableOpacity >
                          <View style={[{backgroundColor:"#ffffff",borderRadius:10,margin:4,marginBottom:15,padding:10,
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            shadowOffset: { width: 0, height: 4 },
                            elevation: 5,
                            height:70
                            }]}>
                              
                            <View>
                            <TextInput maxLength = {4} selectionColor={"gray"} keyboardType={"number-pad"} placeholder={"ID"} style={{fontSize:50}} onChangeText={(text)=>{
                              console.log(text);
                              if(text.length==4){
                                this.fetchTheCodeForApp(text);
                              }
                            }} />
                             
                            </View>
                          </View>
                        </TouchableOpacity>
                        </View>
  
                      {/** END */}
                  </View>
                )
              }else if(Config.isDemo){
                //LIST OF APPS
                return (
                  <View style={{padding:10,paddingTop:60,backgroundColor:"#f7f7f7",flex:1}}>
                      <Text h4 bold muted style={[{marginTop:20}]}>Preview a demo app</Text>
                      
                      <FlatList
                        style={{marginTop:20,backgroundColor:"#f7f7f7"}}
                        data={this.state.allAppsData}
                        renderItem={this.renderAppRow}
                      />
                  </View>
                )
              }
              
            }else{
              return <View></View>
            }
      }

    }
  }

}

const gradients=[
  ['#fad0c4','#ff9a9e'],
  ['#fbc2eb','#a18cd1'],
  ['#ffecd2','#fcb69f'],
  ['#ff9a9e','#fecfef'],
  ['#f6d365','#fda085'],
  ['#fbc2eb','#a6c1ee'],
  ['#fdcbf1','#e6dee9'],
  ['#a1c4fd','#c2e9fb'],
  ['#d4fc79','#96e6a1'],
  ['#84fab0','#8fd3f4'],
  ['#cfd9df','#e2ebf0'],
  ['#a6c0fe','#f68084'],
  ['#fccb90','#d57eeb'],
  ['#e0c3fc','#8ec5fc'],
  ['#f093fb','#f5576c'],
  ['#4facfe','#00f2fe'],
  ['#43e97b','#38f9d7'],
  ['#fa709a','#fee140'],
  ['#a8edea','#fed6e3'],
  ['#89f7fe','#66a6ff']
];
