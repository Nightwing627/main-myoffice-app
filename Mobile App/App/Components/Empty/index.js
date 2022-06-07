import React, { Component } from 'react'
import { Image, Dimensions } from 'react-native'
import { Block, Text } from 'galio-framework';
var noData=require('@images/nodata.png');
var noChat=require('@images/nochat.png');
const { width } = Dimensions.get("screen");

const noDATA=<Image source={noData} style={{opacity:0.8,width:width/2, height:((width/2)/(820/781))}}></Image>;
const noCHAT=<Image source={noChat} style={{opacity:0.8,width:width/2, height:((width/2)/(885/657))}}></Image>;

export default class Empty extends Component {
    render() {
        if(!this.props.hide){
            return (
                <Block center style={{marginTop:80}}>
                    {this.props.isChatImage?noCHAT:noDATA}
                    <Text  h5 muted style={{marginTop:20}} backgroundColor={"whte"}>{this.props.text}</Text>
                </Block>
            )
        }else{
            return null
        }
        
    }
}
