/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, { Component } from "react";
import {ScrollView, View, Image,Share,FlatList,TouchableOpacity} from "react-native";
import Navbar from '@components/Navbar'
import css from '@styles/global'
import T from '@functions/translation'
import { Block, Button, Text} from "galio-framework";
import Smartrow from '@smartrow'
import { materialTheme } from './../../../constants';




export default class OrderDetail extends Component {

  _keyExtractor = (item, index) => item.id+index;

  //The constructor
  constructor(props) {

    //Our props can be ditectly in the props.data or props.navigation.state.params
    //First time, data goes in properties,
    //Later it is passed in navigation state
    //Let's find out where they are
    var isDataInProps = props.navigation.state.params == null;

    super(props);
    var theProps = isDataInProps ? props : props.navigation.state.params;

    this.state = {
      pr: theProps,
      items:this.props.navigation.state.params.data.item.order
    }
      
  }

  showShareLink() {
    
        return (
          <Block>
            
              <Button
              shadowless
                style={{backgroundColor:materialTheme.COLORS.BUTTON_COLOR}}
                onPress={() => {
                  Share.share({
                    title: this.props.navigation.state.params.data.item.id,
                    url: "his.props.navigation.state.params.data.item.id",
                  })
                }}
              >Share</Button>
            </Block>
         
        )
      }
   

      /**
  * renderItem - render single order in the FlatList
  * @param {Object} data data to display
  */
  renderItem(data){
   
    var item=data.item;//.order[0]
    
    var listingSetup={
      "fields": {
        "title": "name",
        "image": "image",
        "subtitle": "price",
        "subtitleFunctions": "roundOn,toCurrency~USD",
        "description": "quantity",
        "descriptionFunctions": "prepend~x"
      },
      "listing_style": "list"
    };

    return (
      <TouchableOpacity  onPress={()=>{this.openDetail(data)}}>  
        <Smartrow
          min={0}
          isListing={true}
          isCart={false}
          item={item}
          id={item.id}
          key={item.id}
          display={{listingSetup:listingSetup}} />
      </TouchableOpacity >
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View>
          <Navbar back navigation={this.props.navigation} isRoot={false} title={this.props.navigation.state.params.data.item.order[0].id} />
        </View>

        <ScrollView>
          
          <Block style={css.layout.orderDetailView}>
            <Text center h6 bold >{this.props.navigation.state.params.data.item.time}</Text>
            <Block style={{height:16}} />
            <Block center>
              <Text muted center h6 bold>{T.user}{"\n"}{this.props.navigation.state.params.data.item.delivery.email.toLowerCase()}</Text>
              <Block style={{height:16}} />

              <Text center>{"Order total value"}{"\n$"}{this.props.navigation.state.params.data.item.total}</Text>
              <Block style={{height:16}} />

              <Text center>{T.orderStatus}{"\n"}{this.props.navigation.state.params.data.item.status}</Text>
              <Image style={css.layout.qrImage} source={{ uri: 'http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=' + this.props.navigation.state.params.data.item.id+ '&chld=H|0' }}/>

              <Block style={css.layout.orderID}>
                <Block style={{height:16}} />
                <Text center> {T.orderID}{"\n"}#{this.props.navigation.state.params.data.item.order[0].id}
                </Text>
              </Block>
            </Block>
          </Block>

          <Block style={{padding:16}}>
            <Block style={{height:16}} />
            <Text h6 bold>Order items:</Text>
            <Block style={{height:16}} />
            <FlatList
              data={this.state.items}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}
            />
          </Block>
            
          <Block center style={{marginTop:16}}>
            {this.showShareLink()}
          </Block>
          <Block style={{height:32}} />
        </ScrollView>
        
        
      </View>
    );
  }
}