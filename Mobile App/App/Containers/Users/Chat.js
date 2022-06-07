/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, { Component, PropTypes } from "react";
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'
import ChatUI from '@components/LoginUI/ChatUI';
import { create } from 'apisauce'
import AppEventEmitter from "@functions/emitter"
import appConfig from '../../../app.json';
import fun from '@functions/common';

const api = create({
  baseURL: 'https://exp.host/--/api/v2/push/send',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, deflate'
  },
})


export default class Chat extends Component {

  static navigationOptions = {
    title: '',
    header: null,
  };

  //The constructor
  constructor(props) {
    var isDataInProps = props.navigation.state.params == null

    super(props);
    this.state = {
      chatName:this.props.navigation.state.params.title, //The title that appears on top
      selectedUser: isDataInProps == true ? null : this.props.navigation.state.params.selectedUser, //The user id we are chatting with  - can be null
      chatID: this.props.navigation.state.params.chatID, //The chat id - combination of current user id and selected user id
      messages: [],
      animating: false,
      currentMessage: [],
      currentMessageText: [],
      path: this.props.data.path == null ? this.props.navigation.state.params.path : this.props.data.path,
      userID: firebase.auth().currentUser.uid,
      avatar: "",
      name: "",
      selectedUserAvatar: "",
      selectedUserFullname: "",
      selectedUserToken: "",
      //userID: "",
      //imageUrl: "",
      //documentID: this.props.data.objectIdToShow == null ? this.props.navigation.state.params.id : this.props.data.objectIdToShow,
      //image: isDataInProps == true ? null : this.props.navigation.state.params.image,
      //title: isDataInProps == true ? null : this.props.navigation.state.params.title,
      //waitingForStatus: true,
      //isLoggedIn: false,
      //groupChatIds: [],
      //groupChatName: []

    }

    this.writeChatsInDB = this.writeChatsInDB.bind(this);
    this.pushTheMessageTo = this.pushTheMessageTo.bind(this);
    this.addToChatsInDataBase = this.addToChatsInDataBase.bind(this);
    this.getDataForSelectedUser = this.getDataForSelectedUser.bind(this);
    
    /*this.setUpCurrentUser = this.setUpCurrentUser.bind(this);
    
    
    
    
    this.back = this.back.bind(this);
    this.sendPushNotification = this.sendPushNotification.bind(this);
    this._openCamera = this._openCamera.bind(this);
    this.writeTheGroupChatInDB = this.writeTheGroupChatInDB.bind(this);
    this.changeTheName = this.changeTheName.bind(this);*/
  }

  componentDidMount() {
    this.getMessages();
    this.getDataForSelectedUser();
  }


  /**
   * Get the message from database
   */
  getMessages() {
    var _this = this;
    var id = this.state.path == "comments/" ? this.state.documentID : this.state.chatID;
   //alert(id)
    firebase.database().ref(this.state.path + id).on('value', function (snapshot) {
      var theMessages = []
      snapshot.forEach(function (childSnapshot) {
        var messageToAdd = childSnapshot.val()
        messageToAdd.id = childSnapshot.key;
        theMessages.push(messageToAdd);
      });
      _this.setState({
        messages: theMessages.reverse()
      })
    });

  }


  /**
   * Get data for the selected user
   */
  getDataForSelectedUser() {
    var _this = this;
    firebase.database().ref(appConfig.expo.extra.firebaseMetaPath+'/users/' + this.state.selectedUser).once('value').then(function (snapshot) {
      _this.setState({
        selectedUserAvatar: fun.FunctionDirectory.gravatar(snapshot.val().email),
        selectedUserFullname: snapshot.val().username,
        selectedUserToken: snapshot.val().token == null ? "" : snapshot.val().token
      })
    })


    firebase.database().ref(appConfig.expo.extra.firebaseMetaPath+'/users/' +firebase.auth().currentUser.uid).once('value').then(function (snapshot) {
      _this.setState({
        avatar: fun.FunctionDirectory.gravatar(snapshot.val().email),
        name: snapshot.val().username
      })
    })


  }

  /**
   * Write in CHATS
   * @param {string} message
   */
  writeChatsInDB(message) {

    var currentID=firebase.auth().currentUser.uid;
    var selectedUser=this.state.selectedUser;
    
    //For owner
    firebase.database().ref('chats/' + currentID + "/" + selectedUser).update({
      avatar: this.state.selectedUserAvatar,
      name: this.state.selectedUserFullname,
      lastChat: Date.now(),
      id: selectedUser,
      lastMessage: message
    });


    //For Selected user
    firebase.database().ref('chats/' + selectedUser  + "/" +currentID ).update({
      avatar: firebase.auth().currentUser.displayPhoto|"",
      name: firebase.auth().currentUser.displayName|"",
      lastChat: Date.now(),
      id: currentID,
      lastMessage: message
    });

  }

 
  
  /**
   * Add in the list of chats as last message to both users
   * @param {Object} message 
   */
  addToChatsInDataBase(message) {
    this.writeChatsInDB(message);
  }

  /**
   * Push the message to Realtime Database
   * @param {Object} message 
   */
  pushTheMessageTo(message) {
    //alert(this.state.path + this.state.chatID);
    //alert(JSON.stringify(message))
    firebase.database().ref(this.state.path + this.state.chatID).push().set(message);
  }

  /**
   * Sending push notification
   */
  sendPushNotification(message) {

    api.post("", {
      "to": this.state.selectedUserToken, "title": this.state.name,
      "body": message.text, "sound": "default"
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json', 'Accept-Encoding': 'gzip, deflate'
      }
      }).then((result) => {
        if (result.ok) {
          console.log("Ok");
        } else {
          console.log("Error");
        }
      })
  }

  /**
   * Image Picker
   */
  _pickImage = async (fromEdit) => {

    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      await this.uploadAsFile(result.uri, fromEdit, (progress) => { })
    }
  }

  _openCamera = async (fromEdit) => {

    await Permissions.askAsync(Permissions.CAMERA);
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      await this.uploadAsFile(result.uri, fromEdit, (progress) => { })
    }
  }

  /**
   * Upload the file picked from image picker
   */
  uploadAsFile = async (uri, fromEdit, progressCallback) => {
    const response = await fetch(uri);

    var _this = this;
    this.setState({
      animating: true
    })
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed')); // error occurred, rejecting
      };
      xhr.responseType = 'blob'; // use BlobModule's UriHandler
      xhr.open('GET', uri, true); // fetch the blob from uri in async mode
      xhr.send(null); // no initial data
    });
    var metadata = {
      contentType: 'image/png',
    };

    let name = new Date().getTime() + "-media.png"
    const ref = firebase
      .storage()
      .ref()
      .child('chatPhotos/' + name)


    const task = ref.put(blob, metadata);

    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        (snapshot) => {
          progressCallback && progressCallback(snapshot.bytesTransferred / snapshot.totalBytes)

          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress)

        },
        (error) => {
          reject(error)
          alert(error)
        }, /* this is where you would put an error callback! */
        () => {
          task.snapshot.ref.getDownloadURL().then(function (downloadURL) {

            var id = _this.state.path == "comments/" ? _this.state.documentID : _this.state.chatID

            if (!fromEdit) {

              var fullMessage = {
                _id: Math.random(),
                text: 'Image sent',
                createdAt: (new Date()).getTime(),
                image: downloadURL,
                user: {
                  _id: _this.state.userID,
                  name: _this.state.name,
                  avatar: _this.state.avatar,
                },
              }
              firebase.database().ref(_this.state.path + id).push().set(fullMessage)
              _this.addToChatsInDataBase(fullMessage)
            } else {

              //Here put the code for group chat
              _this.state.groupChatIds.forEach(function (element) {
                firebase.database().ref('chats/' + element + "/" + _this.state.chatID + "/").update({
                  avatar: downloadURL,
                });
              })

            }


            _this.setState({
              imageUrl: downloadURL,
              animating: false
            })
            blob.close();
          });
        }
      );
    });
  }


  back() {
    this.props.navigation.pop();
    AppEventEmitter.emit('ChangeGroupName');
  }



  render() {
      return (
        <ChatUI
          isPublic={this.props.data&&this.props.data.isPublic}
          selectedUser={this.state.selectedUser}
          selectedUserFullname={this.state.selectedUserFullname}
          selectedUserAvatar={this.state.selectedUserAvatar}
          selectedUserToken={this.state.selectedUserToken}
          userID={this.state.userID}
          chatName={this.state.chatName}
          name={this.state.name}
          avatar={this.state.avatar}
          messages={this.state.messages}
          path={this.state.path}
          documentID={this.state.documentID}
          chatID={this.state.chatID}
          imageUrl={this.state.imageUrl}
          addToChatsInDataBase={this.addToChatsInDataBase}
          pushTheMessageTo={this.pushTheMessageTo}
          callBackPickImage={this._pickImage}
          sendPushNotification={this.sendPushNotification}
          animating={this.state.animating}
          callBackOpenCamera={this._openCamera}
        >
        </ChatUI>
      )
    
  }
}
