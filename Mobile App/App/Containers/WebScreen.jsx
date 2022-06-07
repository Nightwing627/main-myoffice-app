/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, {Component} from "react";
import {View} from "react-native";
import WebView from "react-native-webview";
import Config from '../../config'
import {
  AdMobBanner,
  PublisherBanner,
  AdMobRewarded
} from 'expo-ads-admob';
import { Block } from "galio-framework";
import Navbar from '@components/Navbar'



export default class WebScreen extends Component {


  //The constructor
  constructor(props) {

    //Our props can be ditectly in the props.data or props.navigation.state.params
    //First time, data goes in properties,
    //Later it is passed in navigation state
    //Let's find out where they are
    var isDataInProps=props.navigation.state.params==null;

    super(props);
    var theProps=isDataInProps?props:props.navigation.state.params;
    
   
    this.state = {
      pr:theProps,
    }
    this.showBanner = this.showBanner.bind(this);
  }

  /**
   * showBanner - if  showBannerAds is true
   */
  showBanner()
  {
    if(Config.showBannerAds == true)
    {
      return (
        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID={Config.bannerID}
          didFailToReceiveAdWithError={this.bannerError}
        />
      )
    }
  }

  

  render() {
    

      var bulmaHTML='\
      <!DOCTYPE html>\
      <html>\
        <head>\
          <meta charset="utf-8">\
          <meta name="viewport" content="width=device-width, initial-scale=1">\
          <title>Hello Bulma!</title>\
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">\
          <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>\
        </head>\
        <body>\
        <section class="section">\
          <div class="container">\
            <h2 class="title">\
            '+(this.state.pr&&this.state.pr.fromNotification?this.state.pr.data.title:(this.state.pr.data&&this.state.pr.data.name?this.state.pr.data.name:""))+'\
            </h2><br />\
            <p class="subtitle">\
            '+(this.state.pr&&this.state.pr.fromNotification?this.state.pr.data.longMessage:this.state.pr.data.html)+'\
            </p>\
          </div>\
        </section>\
        </body>\
      </html>\
      ';

      
    return (
      <Block flex> 
          <Block>
            <Navbar 
              back={!this.state.pr.isRoot}
              navigation={this.props.navigation} 
              detailsView={true} 
              isRoot={false} 
              title={this.state.pr.data&&this.state.pr.data.title?this.state.pr.data.title:(this.state.pr.data&&this.state.pr.data.name?this.state.pr.data.name:"")}
            />
          </Block>
          {this.showBanner()}
          <Block style={{flex:1}}>
            <WebView
                scalesPageToFit={false}
                javaScriptEnabled={true}
                source={this.state.pr.data.webSource != null?(this.state.pr.data.webSource == 'html'?{html:bulmaHTML}:{uri:this.state.pr.data.url}):{html:bulmaHTML}}
            />
          </Block>
      </Block>



     
    );
  }
}
