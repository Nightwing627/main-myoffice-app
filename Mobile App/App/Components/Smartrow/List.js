'use strict';

import React, {Component} from "react";
import { View, Image, UIManager, LayoutAnimation,StyleSheet,Dimensions} from "react-native";
import css from '@styles/global'
import fun from '@functions/common'
import Counter from '@components/Counter';
import { Block,Card,theme , Text, Button} from "galio-framework";
const ConditionalDisplay = ({condition, children}) => condition ? children : <View></View>;
const { width } = Dimensions.get('screen');
import Select from "@components/Select"

import { materialTheme } from './../../../constants';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setup:this.props.display,
      title:this.props.title,
      description:this.props.description,
      subtitle:this.props.subtitle,
      subtitleFunctions:this.props.subtitleFunctions,
      rtl:css.dynamic.general.isRTL


    }
    this.applyChanges=this.applyChanges.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.startTime !== this.state.startTime) {
      this.setState({ startTime: nextProps.startTime });
    }else{
      this.setState({subtitleFunctions:nextProps.subtitleFunctions})
      var _this=this;
      setTimeout(function(){ _this.applyChanges(); }, 500);

    }
  }


  componentWillMount() {
    
    if (UIManager.setLayoutAnimationEnabledExperimental)
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }


  applyChanges(){
     //Title
    if(this.props.titleFunctions!=null){
      this.setState({
        title:fun.callFunction(this.props.title,this.props.titleFunctions)
      })
    }

    //Description
    if(this.props.descriptionFunctions!=null){
      this.setState({
        description:fun.callFunction(this.props.description,this.props.descriptionFunctions)
      })
    }


    //Subtitle
    if(this.state.subtitleFunctions!=null){
      this.setState({
        subtitle:fun.callFunction(this.props.subtitle,this.state.subtitleFunctions)
      })
    }
  }

  componentDidMount(){
    //Check function
    this.applyChanges();

  }


  showCartOptions(){
    if(this.props.isCart){
      return (<Block row space={"evenly"} style={{marginVertical:8}}>
        <Select
                  defaultIndex={this.props.qty-1} 
                  options={[1,2,3,4,5,6,7,8,9,10]}
                 onSelect={(selectedIndex)=>{this.props.callback(parseInt(selectedIndex)+1,this.props.id)}}
                 >
                </Select>
                
                

                <TouchableWithoutFeedback onPress={()=>{this.props.callback(0,this.props.id)}}>
                <Block style={[styles.actionButtons]}>
                  <Block flex row middle>
                    <Text size={12}>{"DELETE"}</Text>  
                  </Block>
                </Block>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={()=>{this.props.callback(0,this.props.id)}}>
                <Block style={[styles.actionButtons]}>
                  <Block flex row middle>
                    <Text size={12}>{"SAVE FOR LATER"}</Text>  
                  </Block>
                </Block>
                </TouchableWithoutFeedback>
               




    
        </Block>)
    }else{
      return null;
    }
  }


  render() {
    
    const {style, priceColor, imageStyle } = this.props;
    const imageStyles = [styles.image, this.props.isCart?styles.horizontalImageInCart:styles.horizontalImage, imageStyle];

    return (
      <Block card flex  style={[styles.product, styles.shadow, style]}>
        <Block row >
          {/** THE IMAGE */}
          <ConditionalDisplay condition={this.props.image != ""}>
            <Block>
              <Block flex style={[styles.imageContainer, styles.shadow]}>
                <Image source={{uri: this.props.image}} style={imageStyles} />
              </Block>
            </Block>
          </ConditionalDisplay>

          {/** THE TEXT */}
          
          <Block flex>
            <Block  flex space="between" style={[styles.productDescription]}>
              <Block flex style={{minHeight:70}}>
                <Text size={14} numberOfLines={2} style={[styles.productTitle]}>{this.state.title}</Text>
                <Text size={12} style={{marginTop:8}} p muted numberOfLines={2}>{this.state.description}</Text>
              </Block>
              
              <Text size={12} numberOfLines={1} muted={!priceColor} color={priceColor}>{this.state.subtitle}</Text>
            </Block>
          </Block>
        </Block>
        <Block>
          {this.showCartOptions()}
        </Block>
      </Block>
         
    )
  }
}

const styles = StyleSheet.create({
  actionButtons:{

    //width: 100,
    backgroundColor: '#DCDCDC',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom:9.5,
    borderRadius: 3,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
  
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width/4,
  },
  product: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
  },
  productTitle: {
    //flex: 1,
    //flexWrap: 'wrap',
   // paddingBottom: 6,
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: -16,
  },
  horizontalImage: {
    height: 122,
    width: 122,
  },
  horizontalImageInCart: {
    height: 90,
    width: 100,
  },
  fullImage: {
    height: 215,
    width: width - theme.SIZES.BASE * 3,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
});
