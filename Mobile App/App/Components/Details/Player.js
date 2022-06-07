import React, {Component} from "react";
import { View, TouchableOpacity, Image,Linking,Slider,Platform} from "react-native";
import css from '@styles/global'
import SmartIcon from '@smarticon';

import { materialTheme } from './../../../constants';
import {Block, Text} from 'galio-framework';





const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;

export default class Stream extends Component {
  constructor(props) {
    super(props);
    this.playbackInstance = null;
    this.state = {
      
      isPlaying:true,
      setup:this.props.display,
      rtl:css.dynamic.general.isRTL,
     
      song:this.props.song,
      name:this.props.name,
      subtitle:this.props.subtitle,
      img:this.props.img,
      facebook:"https://www.facebook.com/"+this.props.fb,
      twitter:'https://twitter.com/'+this.props.twitt,
      hasTwitter:this.props.twitt != "",
      hasFacebook:this.props.fb!="",
      initValue:0.5,
      value: 0.5,
    }
}

componentDidUpdate(prevProps) {
    
  // Typical usage (don't forget to compare props):
  if (this.props.isPlaying !== prevProps.isPlaying) {
    this.setState({
      isPlaying: this.props.isPlaying,
      
    })
 }
}



render() {
    return (
      <Block flex center>
        <Text h4>{this.state.subtitle}</Text>
        <Text h5 muted>{this.state.song}</Text>

       <View style={{flexDirection: 'row'}}>
            <View style={{marginRight:30,marginTop:10,opacity:0}}>
              <SmartIcon defaultIcons={"MaterialIcons"} name={"MdFastRewind"} size={35} color="rgba(161,161,161,1)" style={{margin:35}} />
            </View>
            <TouchableOpacity onPress={()=>{this.props.playPause()}}>
              <SmartIcon   defaultIcons={"MaterialIcons"} name={this.state.isPlaying ?"MdPause":"MdPlayArrow"} size={54} color={materialTheme.COLORS.PRIMARY} style={{margin:35}}/>
            </TouchableOpacity>
            <View style={{marginLeft:30,marginTop:10,opacity:0}}>
              <SmartIcon defaultIcons={"MaterialIcons"} name={"MdFastForward"} size={35} color="rgba(161,161,161,1)" style={{margin:35}}/>
            </View>
           
        </View>
        <View style={{marginLeft:20,marginTop:10,flexDirection: 'row'}}>
              <ConditionalDisplay condition={this.state.value>0}>
                <TouchableOpacity onPress={()=>{
                      this.props.setVolume(0);
                      this.setState({initValue:0,value:0})
                    }}>
                  <SmartIcon 
                    defaultIcons={"MaterialIcons"} 
                    name={"MdVolumeDown"} 
                    size={35} 
                    color={materialTheme.COLORS.PRIMARY} 
                    style={{margin:35}}/>
                </TouchableOpacity>
              </ConditionalDisplay>

              <ConditionalDisplay condition={this.state.value==0}>
                <TouchableOpacity onPress={()=>{
                      this.props.setVolume(0.5);
                      this.setState({initValue:0.5,value:0.5})
                    }}>
                  <SmartIcon 
                    defaultIcons={"MaterialIcons"} 
                    name={"MdVolumeMute"} 
                    size={35} 
                    color={materialTheme.COLORS.PRIMARY} 
                    style={{margin:35}}/>
                </TouchableOpacity>
              </ConditionalDisplay>
             
              <Slider
                    style={{ flex: 1, alignSelf: 'stretch',marginLeft:5,marginRight:30 }}
                    value={this.state.initValue}
                    onValueChange={value =>{
                      this.setState({
                        value:value
                      })
                      this.props.setVolume(value);
                    }}
                    minimumTrackTintColor={
                      Platform.OS == 'ios' ? 'rgba(239,62,255,1)' : '#bbb'
                    }
                />
            
              
            </View>
           
      </Block>
    );
  }
}