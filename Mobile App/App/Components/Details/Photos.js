import React, {Component} from "react";
import { View, TouchableOpacity,ScrollView, UIManager,FlatList,StyleSheet,Image} from "react-native";
import style from "./style";
import css from '@styles/global';
import { Block, Text, theme, Button} from 'galio-framework';

export default class Photos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display,
      rtl:css.dynamic.general.isRTL,
      
    }
    this.showPhotos=this.showPhotos.bind(this);
    this.renderItem=this.renderItem.bind(this);
  }

  

  componentWillMount() {
    if (UIManager.setLayoutAnimationEnabledExperimental)
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  renderItem({ item, index }) {
    return (
    <TouchableOpacity  key={index} onPress={()=>{this.props.onPress(index)}} >
      <Image source={{uri:item.photo}} style={[style.singleImage,{"overflow":"hidden",borderRadius:css.dynamic.general.rounded+""=="true"?4:0}]} />
    </TouchableOpacity>)
    }

  showPhotos(){
    if(!this.props.isVertical)
    {
      return(
      <ScrollView directionalLockEnabled={true} horizontal={true}>

                <Block row center>
                  {this.props.photos.map((item,index)=>{
                    return (
                    <TouchableOpacity  key={item.photo} onPress={()=>{this.props.onPress(index)}} >
                      <Image source={{uri:item.photo}} style={[style.singleImage,{"overflow":"hidden",borderRadius:css.dynamic.general.rounded+""=="true"?4:0}]}></Image>
                    </TouchableOpacity>)
                  })}
                </Block>
            </ScrollView>
  )
  }
    else{
      return(
        <FlatList
          contentContainerStyle={{flexDirection: 'row',flexWrap: 'wrap'}}
          data={this.props.photos}
          renderItem={this.renderItem}
    />
      )
    }
  }

  render() {
    const rtlText = this.state.rtl && { textAlign: 'right', writingDirection: 'rtl' };
    const rtlView = this.state.rtl && { flexDirection: 'row-reverse' };
    return (

      <Block >
        <Text h5>{this.props.title}</Text>
          {this.showPhotos()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  separator:{
    height:theme.SIZES.BASE
  }
});