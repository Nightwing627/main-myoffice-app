/*
  Created by Dimov Daniel
  Mobidonia
*/
import React, {Component} from "react";
import {View,TouchableOpacity,FlatList} from "react-native";
import Navbar from '@components/Navbar'
import firebase from '@datapoint/Firebase'
import css from '@styles/global'
import Smartrow from '@smartrow'
import Config from '../../../config'
import appConfig from '../../../app.json';
import {Block} from 'galio-framework'
var md5 = require('md5');
import fun from '@functions/common';

export default class ListOfUsers extends Component {
  //Key extractor for the Flat list
  _keyExtractor = (item, index) => item.id;

  //The constructor
  constructor(props) {
    var isDataInProps = props.navigation.state.params == null;
    super(props);
    var theProps = isDataInProps ? "" : props.navigation.state.params;
    //Init state
    this.state = {
      items:[],
      showSearch: false,
      listOf:theProps.listOf,
      userId:theProps.userId,
      isRoot: false,
      itemsStore:[],
      selected:"all",
      isLoggedIn:false,
      waitingForStatus:true,
    }

    //Bind functions
    this.renderItem=this.renderItem.bind(this);
    this.getAllUsers=this.getAllUsers.bind(this);
    this.searchChange=this.searchChange.bind(this);
  }

  componentDidMount(){
    this.getAllUsers();
  }

  /*
  * searchChange - on search
  * @param {String} e, the entered string
  */
  searchChange(e){
    if(e.length==0){
      //User has removed all the string, or it has
      this.setState({items:this.state.itemsStore,selected:"all"})
    }else if(e.length>2){
      //Do filter
      var filtered=this.state.itemsStore.filter(function (el) {return  el.username?el.username.toLowerCase().indexOf(e.toLowerCase())>-1:false});
      this.setState({items:filtered})
    }
  }
   
    /**
     * Gets all the app users
     */
    getAllUsers(){
      var _this=this;
      //var data=[];
      firebase.database().ref(appConfig.expo.extra.firebaseMetaPath+'/users/').once('value', function(snapshot) {
        var data=[];
          snapshot.forEach(childSnap=>{
            
              var user=childSnap.val();
              user.uid=childSnap.key;
              if(childSnap.key != firebase.auth().currentUser.uid){
                var objToAdd=user
                //Add the id, on each object, easier for referencing
                objToAdd.id=childSnap.key;
                objToAdd.username=objToAdd.username||"/"; //Username is required
                data.push(objToAdd);
              
            }else{
              //do nothing
            }
              
              
          })

          _this.setState({
            items:data,
            itemsStore:data,
          })
        
        });
    }


    /**
    * renderItem - render a row
    * @param {Object} data
    */
  renderItem(data){
      //We have our real data in data.item since FlatList wraps the data
      var item=data.item;
      if(item.avatar==""||item.avatar==null||item.avatar==undefined){
        item.avatar=fun.FunctionDirectory.gravatar(item.email);
      }
      var listingSetup={
          "fields": {
            "title": "username",
            "image": "avatar",
            "subtitle": "email",
          },
          "listing_style": ""
        };
      return (
        <TouchableOpacity  onPress={()=>{this.openProfile(item)}}>
          <Smartrow isListing={true} from="listOfUsers" item={item} display={{listingSetup:listingSetup}}>
          </Smartrow>
        </TouchableOpacity>
      )
    }
 

  openProfile(item){
    //alert(item.uid);
    var chatID=firebase.auth().currentUser.uid[0]>item.uid[0]?firebase.auth().currentUser.uid+item.uid:item.uid+firebase.auth().currentUser.uid
    this.props.navigation.navigate('Chat', { chatID:chatID,selectedUser: item.uid, title:item.username, path: "messages/" });
    //var profileScreen=Config.profileScreensInSubMenu?"SubProfile":"Profile";
    //this.props.navigation.navigate(profileScreen,{data:item.uid,showBackButton:true,showFollow:true,listOf:this.state.listOf})
  }

  render() {
    return (
      <Block flex style={[css.layout.containerBackground]}>
          <Navbar 
            navigation={this.props.navigation} 
            back={!this.state.isRoot}
            showRightButton={true} 
            hasSearch={true}
            seachPlaceholder={"Find your contact"}
            title={"Start a chat"}
            searchCallback={this.searchChange}
          />
          <FlatList
            //style={{marginBottom: 70}}
            data={this.state.items}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderItem}
            />
      </Block>
      )
    
    }
}