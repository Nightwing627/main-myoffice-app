'use strict';

import React, {Component} from "react";
import { View,ImageBackground} from "react-native";
import style from "./style";
import css from '@styles/global'
import { LinearGradient } from 'expo-linear-gradient'
import {Text, Block} from 'galio-framework'

//TODO make it with LinerGardian with the new expo


export default class Tiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display
    }
  }


  render() {
    var styleOfGrid={};
    if(this.state.setup.grid_with_space){
      //with space
      if(this.state.setup.grid_rows==1){
        styleOfGrid=style.tileImage1withSpace;
      }else if(this.state.setup.grid_rows==2){
        styleOfGrid=style.tileImage2withSpace;
      }else if(this.state.setup.grid_rows==3){
        styleOfGrid=style.tileImage3withSpace;
      }else if(this.state.setup.grid_rows==4){
        styleOfGrid=style.tileImage4withSpace;
      }
    }else{
      //No space
      if(this.state.setup.grid_rows==1){
        styleOfGrid=style.tileImage1noSpace;
      }else if(this.state.setup.grid_rows==2){
        styleOfGrid=style.tileImage2noSpace;
      }else if(this.state.setup.grid_rows==3){
        styleOfGrid=style.tileImage3noSpace;
      }else if(this.state.setup.grid_rows==4){
        styleOfGrid=style.tileImage4noSpace;
      }
    }
    return (
      <Block shadow shadowColor={"#000000"}>
        <ImageBackground style={[styleOfGrid,{"overflow":"hidden",borderRadius:8}]} source={{uri:this.props.image}}>
        <Block flex>
          <LinearGradient
              colors={["rgba(0,0,0,0.2)","rgba(0,0,0,0.2)"]}
              style={style.imageRowShadow}
            >
            <View style={style.imageRowTitleArea} >
              <Text h5 bold color={"white"}>{this.props.title}</Text>
            </View>
            </LinearGradient>
        </Block>
        
        </ImageBackground>
      </Block>
      
    );
  }
}
