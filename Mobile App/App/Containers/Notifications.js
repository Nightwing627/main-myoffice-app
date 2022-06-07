/*
  Created by Dimov Daniel
  Mobidonia
*/
import React, {Component} from "react";
import {TouchableOpacity,AsyncStorage,FlatList,ImageBackground,Text,View,Linking} from "react-native";
import Navbar from '@components/Navbar'
import firebase from '@datapoint/Firebase'
import css from '@styles/global'
import Smartrow from '@smartrow'
import T from '@functions/translation'
import { LinearGradient } from 'expo-linear-gradient'
import Config from '../../config'
import Empty from '@components/Empty'

const ConditionalWrap = ({condition, wrap, children}) => condition ? wrap(children) : children;
const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;

export default class Notifications extends Component {
  //The key extraxtor
  _keyExtractor = (item, index) => item.id+index;
  
  //The constructor
  constructor(props) {
    super(props);

    //Init state
    this.state = {
      items:[],
      animating: true,
      result: null,
      itemsLoaded:false
    }

    //Bind functions
    this.getNotifications=this.getNotifications.bind(this);
    this.renderItem=this.renderItem.bind(this);
    this.checkIfIDAlreadyExist=this.checkIfIDAlreadyExist.bind(this);
    this.checkReadStatus=this.checkReadStatus.bind(this);
    this.addReadedContent=this.addReadedContent.bind(this);
  
    
  }

  //Component mount function
  componentDidMount(){

    //Reference to this
    var _this=this;
    this.getNotifications()
  
  }

  async addReadedContent(object,property,callback){
    var _this=this;
    this.getReadedContent(property, async function(data,error){
      if(error==false){
        var items=data;
        if(object instanceof Array){
           object.forEach(element => {
           items.push(element);
         });
        }else{
          if(items.indexOf(object)==-1){
            items.push(object);
          }
        }
       
        
        try {
            await AsyncStorage.setItem('@MySuperStore:'+property, JSON.stringify(items),function(done){
              _this.getReadedContent(property,callback);
           });
         } catch (error) {
           // Error saving data
         }
      }
    })
 }

  async  getReadedContent(property,callback) {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:'+property);
      if (value !== null){
        // We have data!!
        callback(JSON.parse(value),false);
      }else{
        callback([],false);
      }
    } catch (error) {
      // Error retrieving data
      callback(error,true);
    }
  }


  async checkReadStatus(allNotifications,property,callback){
    this.getReadedContent(property,  function(readItems,error){
      for (let index = 0; index < allNotifications.length; index++) {
        allNotifications[index].isRead=readItems.indexOf(allNotifications[index].id)>-1?true:false;
      }
      callback(allNotifications,false);
    });
  }

  /**
  * renderItem - render single order in the FlatList
  * @param {Object} data data to display
  */
  renderItem(data){
    var item=data.item;
      var listingSetup={
        "fields": {
          "description": "message",
          "title": "title",
        },
        "listing_style": "notification"
      };

      return (
        <TouchableOpacity  onPress={()=>{this.openNotification(item)}}>
          <Smartrow
            min={0}
            isListing={true}
            isCart={false}
            isRead={item.isRead}
            item={item}
            id={item.id}
            key={item.id}
            display={{listingSetup:listingSetup}}
            />
        </TouchableOpacity>         
      )
    }


  checkIfIDAlreadyExist = (item) => {
    AsyncStorage.getItem(item, (err, result) => {
      
        if (result !== null) {
          
          
        } else {
          
          AsyncStorage.setItem(item, JSON.stringify(item));
          
        }
      });
    }
  
    async openNotification(item){
      item.fromNotification=true;
      var _this=this;
       this.addReadedContent(item.id,"readedNotification",async function(updatedIds,error){
       
        _this.checkReadStatus(_this.state.items,"readedNotification",function(alteredNotification,errorOccured){
         
          _this.setState({
            items:alteredNotification,
          })
          if(item.message.match(/^http?\:\//))
          {
            _this.handleOpenWebBrowser(item.message)
          }else{
            _this.openDetails(item)
          }

        })

        
      
      })
    }
      

  handleOpenWebBrowser = async (item) => {
    Linking.canOpenURL(item).then(supported => {
      if (supported) {
        Linking.openURL(item);
      } else {

      }
    });
  };

  openDetails(item){
    this.props.navigation.navigate('WebNotificationsSub',{data:item,fromNotification:true})
  }

  /**
  * getNotifications - Get the notifications
  *
  */
 getNotifications(){
    //Get the meta data
    var defPath="/notifications";
    var pathFBConf = Config.config.notifications_data_point

    var path = pathFBConf != null?pathFBConf:defPath
    var _this=this;

    var db=firebase.firestore();
    var data = [];
    var ref=db.collection(path);
    
    ref.get()
    .then(snapshot => {
        snapshot
        .docs
        .forEach(doc => {
          var objToAdd=doc.data();
          objToAdd.id=doc.id;
          objToAdd.isRead=false;
          data.push(objToAdd);
        });

        _this.checkReadStatus(data,"readedNotification",function(alteredNotification,errorOccured){
          _this.setState({
            items:alteredNotification,
            animating:false,
            itemsLoaded:true,
          })
        })
      

    }).catch(function(error) {
      console.log("Error getting cached document:", error);
  });
  }

  render() {
    var shouldWeShowImageBg=css.dynamic.general.backgroundImage;
    if(shouldWeShowImageBg){
      var bgGradient=['rgba(0,0,0,0)','rgba(0,0,0,0)'];
    }else{
    var bgGradient=[css.dynamic.general.backgroundColor,css.dynamic.general.backgroundColor];
      if(css.dynamic.general.backgroundGradient){
        bgGradient=[];
        css.dynamic.general.backgroundGradient.map((item,index)=>{
        bgGradient.push(item.color);
      })
     }
    }
    return (
      <ConditionalWrap
        condition={shouldWeShowImageBg}
        wrap={children => <ImageBackground 
        source={require('@images/bg.jpg')}
        style={[css.layout.imageBackground,{flex:1}]}
        >{children}</ImageBackground>}
      >
      <LinearGradient colors={bgGradient} style={[{flex:1},css.layout.containerBackground]}>
          <Navbar navigation={this.props.navigation} back={!this.props.isRoot} showRightButton={false} title={"Notifications"}  />
          <ConditionalDisplay condition={this.state.items.length==0&&this.state.itemsLoaded}>
            <Empty text={T.no_notifications} />
          </ConditionalDisplay>
          <FlatList
            data={this.state.items}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderItem}
          />
        </LinearGradient>
        </ConditionalWrap>
      )
  }
}