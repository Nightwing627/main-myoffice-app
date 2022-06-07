import React from "react";
import { DrawerItems } from 'react-navigation-drawer';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView, StyleSheet, Dimensions, Image } from "react-native";
import { Block, Text, theme } from "galio-framework";
import { materialTheme } from "./../constants/";
import DrawerComp from './Drawer';
import firebase from '@datapoint/Firebase'
import { LinearGradient } from 'expo-linear-gradient'
import appConfig from './../app.json'
import fun from '@functions/common';

var md5 = require('md5');
var logoimage = require('@images/logo.png');

const { width } = Dimensions.get('screen');

class theMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn:false,
      displayName:"",
      email:""
    }
  }

  componentDidMount(){
    var _this=this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        _this.setState({
          loggedIn:true,
          displayName:user.displayName,
          email:user.email
        })
      }else{
        _this.setState({
          loggedIn:false,
          displayName:"",
          email:""
        })
      }
    });
  }

  logoOutFromFirebase(){
    firebase.auth().signOut()
  }



  printLoggedIn(){
    return (
      <Block style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <Block flex={0.15}  >
        
        <LinearGradient style={[styles.header,{flex:1,minHeight:170}]}  colors={[materialTheme.COLORS.PRIMARY, materialTheme.COLORS.PRIMARY]} >
          
          <TouchableWithoutFeedback  /*onPress={() => this.props.navigation.navigate('profilePATH')}*/ >
            <Block style={styles.profile}>
          
              <Image source={{ uri: fun.FunctionDirectory.gravatar(this.state.email)}} style={styles.avatar} />
              <Text h5 color="white">{this.state.displayName}</Text>
              <Text p size={13} color="white">{this.state.email}</Text>
              
            </Block>
          </TouchableWithoutFeedback>
        
      </LinearGradient>

       
      </Block>
      
      <Block flex={0.7}>
        <ScrollView  showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop:50 }}>
          <DrawerItems {...this.props} />
        </ScrollView>
        
      </Block>
      <Block flex={0.15} >
        <TouchableOpacity style={{height:59,paddingHorizontal: 10,}} onPress={this.logoOutFromFirebase} >
          <DrawerComp focused={false} title={"Logout"} icon={"fe-user"} />
        </TouchableOpacity>
      </Block>
    </Block>
    )
  }

  printLoginButton(showIt=true){
    if(showIt){
      return (
      <TouchableOpacity style={{height:59,paddingHorizontal: 10,}} onPress={() => { console.log("go to login"); this.props.navigation.navigate('loginPATH')}} >
        <DrawerComp focused={false} title={"Login"} icon={"fe-user"} />
    </TouchableOpacity>);
    }else{
      return null;
    }
  }

  printNotLoggedIn(){
    return (
      <Block style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <Block flex={0.15} style={{minHeight:100,maxHeight:160}}>
      <LinearGradient style={[styles.header,{flex:1}]}  colors={[materialTheme.COLORS.PRIMARY, materialTheme.COLORS.PRIMARY]} >
          
          <TouchableWithoutFeedback  /*onPress={() => this.props.navigation.navigate('profilePATH')}*/ >
            <Block style={styles.profile}>
              <Block>
                <Image source={logoimage} style={styles.avatar} />
              </Block>
              
              <Text h6 bold color="white">{appConfig.expo.name}</Text>
            </Block>
          </TouchableWithoutFeedback>
        
      </LinearGradient>

      </Block>
      <Block flex={0.7}>
        <ScrollView  showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <DrawerItems {...this.props} />
        </ScrollView>
        
      </Block>
      <Block flex={0.15} >
        {this.printLoginButton(!this.props.hideLogin)}
      </Block>
    </Block>
    )
  }

  prnitSideNav(){
    if(this.state.loggedIn){
      return this.printLoggedIn();
    }else{
      return this.printNotLoggedIn();
    }
  }
  render(){
    return(
      <Block flex>
        {this.prnitSideNav()}
      </Block>
      
    )
    
  }
}
export default theMenu;

const Menu = {
  contentComponent: props => <Drawer {...props} />,
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerNotLogged:{
    backgroundColor: '#fff',
    paddingBottom: 0,
    paddingTop: 0,
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 4,
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 28,
    justifyContent: 'flex-end'
  },
  profile: {
    marginBottom: theme.SIZES.BASE / 2,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: theme.SIZES.BASE,
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: 8,
    borderRadius: 4,
    height: 19,
    width: 38,
  },
  seller: {
    marginRight: 16,
  }
});

//export default Menu;
