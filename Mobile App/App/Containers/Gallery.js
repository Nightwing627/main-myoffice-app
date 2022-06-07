/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, {Component} from "react";
import { 
  Button,
  Image,
  Text,
  View,
  StyleSheet,
  Platform,
  CameraRoll
} from "react-native";
import * as MediaLibrary from 'expo-media-library';
import Navbar from '@components/Navbar'
import css from '@styles/global'
import RNIGallery from 'react-native-image-gallery';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions'

export default class Gallery extends Component {

  //The constructor
  constructor(props) {
    super(props);




    //Set the state
    this.state = {
      MediaLibraryUri:null,
      data:this.props.navigation.state.params.data,
      index:this.props.navigation.state.params.index,
      initialPage:this.props.navigation.state.params.index,
      isLoading:false,
    }


    this.saveImage=this.saveImage.bind(this);
  }

  //Component Mount function
  componentDidMount(){
    
  }

  _saveToMediaLibraryAsyncAndroid = async (imagePath) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      var stordeIn=FileSystem.documentDirectory + Date.now()+ '_image.jpg';
      console.log(stordeIn);
      this.setState({
        isLoading:true
      })
      FileSystem.downloadAsync(
        imagePath,
        stordeIn
      )
        .then(({ uri }) => {
          console.log('Finished downloading to ', uri);
          this.saveToMediaLibrary(uri);
        })
        .catch(error => {
          console.error(error);
        });

    } else {
      throw new Error('You need to approve this permission in order to download the image');
    }
  }

  saveToMediaLibrary= async (uri)=>{
    ///alert(uri)
    await MediaLibrary.saveToLibraryAsync(uri).then((ii) => {
      alert("Image downloaded!")
      this.setState({
        isLoading:false
      })
      
    })
    .catch(error => {
      //alert("there is err")
      console.error(error);
    });
    
    
  }

  _saveToMediaLibraryAsynciOS = async (imagePath) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      var stordeIn=FileSystem.documentDirectory + Date.now()+ '_image.jpg';
      console.log(stordeIn);
      this.setState({
        isLoading:true
      })
      FileSystem.downloadAsync(
        imagePath,
        stordeIn
      )
        .then(({ uri }) => {
          console.log('Finished downloading to ', uri);
          this.saveToMediaLibrary(uri);
        })
        .catch(error => {
          console.error(error);
        });

    } else {
      throw new Error('You need to approve this permission in order to download the image');
    }
  }

  saveImage(){
    var index=this.state.index;
    var imagePath=this.state.data[index].source.uri;
    if(Platform.OS === 'android'){
      this._saveToMediaLibraryAsyncAndroid(imagePath);
    }else{
      this._saveToMediaLibraryAsynciOS(imagePath)
    }
  }

  render() {
    return (
        <View style={[{flex:1},css.layout.containerBackground]}>
          <Navbar 
            navigation={this.props.navigation} 
            isRoot={false} 
            detailsView={true} 
            showRightButton
            rightButton={"download"}
            rightAction={this.saveImage}
            isLoading={this.state.isLoading}
            back
            
            transparent
           />
           
            <RNIGallery
              style={{ flex: 1 }}
              initialPage={this.state.initialPage}
              images={this.state.data}
              onPageScroll={(event)=>{
                this.state.index=event.position
              }}
             
            /> 
          
        </View>
      )
  }

}
