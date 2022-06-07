import React from 'react';
import {TouchableWithoutFeedback,Dimensions,Alert,StyleSheet} from 'react-native';
import * as firebase from 'firebase';
import Config from '../../../config'
import T from '@functions/translation';
import LoginScreenUI from '@components/LoginUI/LoginScreenUI';
import AppEventEmitter from "@functions/emitter"
import * as Google from 'expo-google-app-auth'
import { Block,Text, Input, theme, Button } from 'galio-framework';
import Navbar from '@components/Navbar';
import { LinearGradient } from 'expo-linear-gradient'


const { width, height, scale } = Dimensions.get("screen");
import { materialTheme } from './../../../constants';

class LoginScreen extends React.Component {

  static navigationOptions = {
    
    title: 'Login',
    header: null,
  };

  
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      isReqUserVarification:false

    };
    
    
    this.loginWithFacebook=this.loginWithFacebook.bind(this);
    this.signInWithGoogleAsync=this.signInWithGoogleAsync.bind(this);
    this.onLoginPress=this.onLoginPress.bind(this)
    this.checkAllowedUsers=this.checkAllowedUsers.bind(this);
    this.forgotPassword=this.forgotPassword.bind(this);
    this.onSignInPress=this.onSignInPress.bind(this);
  }

  /**
   * Check if the entered mail is in the allowed list of users
   * @param {String} email 
   */
  checkAllowedUsers(email)
    {
      users=[]
      this.props.allowedUsers.map((item)=>{
        users.push(item.email)
        
      })
      if(users.indexOf(email) > -1){
        this.onLoginPress()
      }else{
        alert(T.userWithNoAccess)
      }
  }

  /**
   * Login button pressed
   * @param {String} email 
   * @param {String} password 
   */
  onLoginPress()
  {
      this.setState({
        loading: true
      })

      var email=this.state.email;
      var password=this.state.password;

      
      var _this=this;
      firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        _this.setState({
          loading: false
        })
        AppEventEmitter.emit('goToAppScreensNavi');
        this.props.navigation.navigate(Config.defaultRoute);
        this.props.navigation.openDrawer()
      }).catch(function(error){
      
        Alert.alert(error.message)
        _this.setState({
          loading: false
        })
        
      })
      
  }

  /**
   * Login with fb
   */
  async loginWithFacebook() {
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(Config.loginSetup.facebookID, { permissions: ['public_profile'] })
          if (type == 'success') {
            const credential = firebase.auth.FacebookAuthProvider.credential(token)
            firebase.auth().signInWithCredential(credential).catch((error) => {
              AppEventEmitter.emit('goToAppScreensNavi');
          })
        }
  }

  /**
   * Login with google
   */
  async signInWithGoogleAsync() {
    try {
      const result = await Google.logInAsync({
        iosClientId: Config.loginSetup.googleIOSid,
        androidClientId: Config.loginSetup.googleAndroidId,
        iosStandaloneAppClientId: Config.loginSetup.iosStandaloneAppClientId,
        androidStandaloneAppClientId: Config.loginSetup.androidStandaloneAppClientId,
        scopes: ['profile', 'email'],
        redirectUri: "${AppAuth.OAuthRedirect}:/oauth2redirect/google"
      });

      if (result.type === 'success') {
      AppEventEmitter.emit('goToAppScreensNavi');

        //return result.accessToken;
        const { idToken, accessToken } = result;
        const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);

        firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function (error) {
          console.log(error)
        });


        // Sign in with credential from the Google user.

      } else {
        console.log("cancelled")
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e)
      return { error: true };

    }
  };


  /**
   * Go to the SignUp screen
   */
  onSignInPress()
  {
    this.props.navigation.navigate('SignUp')
  }

  

  shouldComponentUpdate() {
    return false
  }

  

/**
 * Go to forget password screen
 */
  forgotPassword(){
      this.props.navigation.navigate('ForgetPassword')
  }

  

  render() {
    return (
      <Block flex>
       
          <Navbar
            navigation={this.props.navigation}
            title="Sign In"
            transparent
            />
          <Block style={styles.loginbox}>
            <Input  onChangeText={text=>{this.setState({email:text})}}  placeholderTextColor={materialTheme.COLORS.MUTED} placeholder="Email" style={styles.inputStyle} />
            <Input  onChangeText={text=>{this.setState({password:text})}} placeholderTextColor={materialTheme.COLORS.MUTED}  style={styles.inputStyle} password viewPass placeholder="Password"/>
            <Block right>
              <TouchableWithoutFeedback onPress={this.forgotPassword}>
                <Text style={styles.secondaryLinks}>Forgot your password?</Text>
              </TouchableWithoutFeedback>
            </Block>

            <Block center style={styles.actions}>
              <Button shadowless style={[styles.button, styles.shadow,{backgroundColor:materialTheme.COLORS.BUTTON_COLOR}]} onPress={this.onLoginPress}>
                  SIGN IN
              </Button>
              <Block center>
                <TouchableWithoutFeedback onPress={this.onSignInPress}>
                  <Text style={styles.secondaryLinks}>Don't have an account? Sign up</Text>
                </TouchableWithoutFeedback>
                
              </Block>
            </Block>
          </Block>
      </Block>
    )
    return (
      <LoginScreenUI
        loading={this.state.loading}
        isReqUserVarification={this.props.isReqUserVarification}
        callBackLogin={this.onLoginPress}
        callBackCheckAllowedUsers = {this.checkAllowedUsers}
        callBackForgetPass = {this.forgotPassword}
        callbackOnSignInPress = {this.onSignInPress}
        callBackLoginWithFacebook = {this.loginWithFacebook}
        callBackSignInWithGoogleAsync= {this.signInWithGoogleAsync}
      >
      </LoginScreenUI>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  inputStyle:{
    backgroundColor:null
  },
  loginbox:{
    padding:16,
    marginTop:30
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - (theme.SIZES.BASE * 2),
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    width: width
  },
  actions:{
    marginTop:40
  },
  secondaryLinks:{
    opacity:0.7
  }
});
