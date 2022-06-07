/*
  Created by Dimov Daniel
  Mobidonia
  daniel@mobidonia.com
*/
import React, { Component } from "react";
import {  View, FlatList, TouchableOpacity, Image, ActivityIndicator, ImageBackground, Dimensions, StyleSheet } from "react-native";
import Navbar from '@components/Navbar'
import Tabbar from '@components/Tabbar'
import firebase from '@datapoint/Firebase'
import css from '@styles/global'
import Smartrow from '@smartrow'
import Config from '../../config'
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'expo-ads-admob';
import T from '@functions/translation'
import SearchBar from "@components/SearchBar/SearchBar"
import Cart from '@functions/cart';
import AppEventEmitter from "@functions/emitter"
import { LinearGradient } from 'expo-linear-gradient'
import fun from '@functions/common';
import Carousel,{ ParallaxImage, Pagination } from 'react-native-snap-carousel';
import Empty from '@components/Empty'

const { width, height, scale } = Dimensions.get("screen")
import { Toast, Block, Text, theme, Button} from 'galio-framework';
import { materialTheme } from './../../constants';
import { HeaderHeight } from "./../../constants/utils";
const sliderItemWidth=width-theme.SIZES.BASE*2;
const screenWidth=width;


const ConditionalWrap = ({ condition, wrap, children }) => condition ? wrap(children) : children;
const ConditionalDisplay = ({ condition, children }) => condition ? children : <View></View>;
const SLIDER_1_FIRST_ITEM = 1;

export default class Master extends Component {
  //Key extractor for the Flat list
  _keyExtractor = (item) => item.id;

  //The constructor
  constructor(props) {
    super(props);

    //Our props can be ditectly in the props.data or props.navigation.state.params
    //First time, data goes in properties,
    //Later it is passed in navigation state
    //Let's find out where they are
    var isDataInProps = props.navigation.state.params == null


    this.state = {
      title: props.data.name,
      pr: isDataInProps ? props.data : props.navigation.state.params,
      items: [],
      itemsStore: [],
      newestItems: [],
      animating: true,
      showSearch: false,
      categoryItems: [],
      selected: "all",
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      lessThen4Items: true
    }

    //Bind Functions
    this.openCategories = this.openCategories.bind(this);
    this.getData = this.getData.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this._renderItem2 = this._renderItem2.bind(this);
    this.showHideSearch = this.showHideSearch.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.ifIndicatorIsLoading = this.ifIndicatorIsLoading.bind(this);
    this.tabSelector = this.tabSelector.bind(this);
  }

  //Component Mount function
  componentDidMount() {

    if (this.state.pr.sectionType && (this.state.pr.sectionType == "wish-list" || this.state.pr.sectionType == "collected-list")) {
      //This is wish list, get data from properties
      AppEventEmitter.addListener('favorites.refresh', this.getFavoritesList.bind(this));
      AppEventEmitter.emit('favorites.refresh');
    } else {
      //Get the Firestore data, based on the data_point, regular
      this.getData(this.state.pr.listingSetup ? this.state.pr.listingSetup.data_point : this.state.pr.data_point);
    }
  }



  /**
  * STEP 1 - getData - gets data from Firestore
  * @param {String} pathRoot - Firestore path
  */
  getData(pathRoot) {

    //Get the meta data
    var path = pathRoot;



    //Get reference to this
    var _this = this;

    //Get references to firestore
    var db = firebase.firestore();
    var ref = db.collection(path);

    //Will putt data here
    var data = [];

    //If we have id, add where conditions to on the query
    if (this.state.pr.id) {
      //Filter by collections
      //In version 3.2.0, we have the key collection_key to let us know on what collection to query on
      var passedCollectionKey = this.state.pr.listingSetup ? this.state.pr.listingSetup.collection_key : this.state.pr.collection_key;
      var collection_key = passedCollectionKey != null && passedCollectionKey.length > 1 ? passedCollectionKey : "collection";
      ref = ref.where(collection_key, '==', db.doc(path + '_collection/' + this.state.pr.id))
    }
    //Now get the data
    ref.get()
      .then(snapshot => {

        if (snapshot == null) {

          data = [];
          _this.setState({
            items: data,
            itemsStore: data,
            animating: false
          })
        }
        else {
          snapshot
            .docs
            .forEach(doc => {

              var objToAdd = doc.data();
              //Add the id, on each object, easier for referencing
              //alert(doc.id)
              objToAdd.id = doc.id;
              var asString = "";
              Object.keys(objToAdd).map((key) => {
                //console.log(key);
                //console.log(objToAdd[key].path)
                if (typeof objToAdd[key] !== 'object') {
                  asString += objToAdd[key];
                }else{
                  //This is a object 
                  if(objToAdd[key].path!=undefined){
                    //Reference
                    asString += objToAdd[key].path;
                  }
                }
              })
              asString = asString.replace(new RegExp('"', 'g'), '');
              asString = asString.replace(new RegExp('{', 'g'), '');
              asString = asString.replace(new RegExp('}', 'g'), '');
              objToAdd.fullTextSearch = asString.toLowerCase();
              console.log(objToAdd.fullTextSearch)
              data.push(objToAdd);

            });

          //After data is stored in data, update the state
          //This will re-render the screen
          data.sort(fun.FunctionDirectory.dynamicSort("eventStart"))
          _this.setState({
            items: this.state.pr.listingSetup && this.state.pr.listingSetup.hasFeatures && data.length > 4 ? data.slice(4, data.length - 1) : data,
            lessThen4Items: data.length > 4 ? true : false,
            newestItems: data.slice(0, 4),
            itemsStore: data,
            animating: false
          })


          //Now get the categories
          this.getCategories(this.state.pr.categorySetup ? this.state.pr.categorySetup.data_point : "unknown");
        }


      });
  }

  //Get the data of the category
  getCategories(path) {
    //Get the meta data

    //Get reference to this
    var _this = this;

    //Get reference to Firestore
    var db = firebase.firestore();

    //Place to store the categories
    var categories = [{ title: "All", id: "all" }];

    if (this.state.pr.listingSetup.hide_all_category_filter) {
      categories = [];
    }


    //Start getting the categories
    db.collection(path).onSnapshot(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var objToAdd = doc.data();
        
        //Add the id, on each object, easier for referencing
        objToAdd.id = doc.id;
        categories.push(objToAdd);

      });


      //After data is stored in data, update the state
      //This will re-render the screen

      categories.sort(fun.FunctionDirectory.dynamicSort("order"));
      var upState = {
        categoryItems: categories,
        animating: false
      }
      console.log(_this.state.pr.listingSetup.hide_all_category_filter + "<----")
      if (_this.state.pr.listingSetup.hide_all_category_filter && categories.length > 0) {
        upState.selected = categories[0].id
      }

      _this.setState(upState)
    });
  }

  /**
  * openCategories - click on the categories button
  */
  openCategories() {
    var item = this.state.pr;

    this.props.navigation.navigate('MasterSUB', { name: item.name, isRoot: false, data: item, subMenus: [] })
  }

  /**
  * openDetails - opens the details screen
  * @param {Object} item item to open
  */
  openDetails(item) {

    this.props.navigation.navigate('Details', { data: item })
  }

  /**
  * renderItem - render a row
  * @param {Object} data
  */
  renderItem(data) {
    //We have our real data in data.item since FlatList wraps the data
    var item = data.item;

    return (
      <TouchableOpacity onPress={() => { this.openDetails(item) }}>
        <Smartrow isListing={true} item={item} display={this.state.pr} haveThumbnails={this.state.pr.listingSetup.haveThumbnails} showRating={this.state.pr.listingSetup.showRating} thumbPrefix={this.state.pr.listingSetup.thubnails_prefix} isSpecial={item.isSpecial}>
        </Smartrow>
      </TouchableOpacity>
    )
  }

  /**
  * renderIf - render a text label if there is no items
  * @param {Object} numItems
  */
  renderIf(numItems) {

    if ((numItems == 0 && this.state.animating == false)) {
      return (
        <Empty text={T.no_items} />
      )
    }
    else {
      return (
        <View />
      )
    }
  }

  ifIndicatorIsLoading() {
    if (this.state.animating == true) {
      return (
        <View style={css.layout.activityIndicatorView}>
          <View style={css.layout.activitiIndicatorContainer}>
            <ActivityIndicator
              animating={this.state.animating}
              style={css.layout.activityIndicator}
              //color={css.dynamic.general.buttonColor}
              size="large"
              hidesWhenStopped={true} />
          </View>
        </View>
      )
    } else {
      return (<View />)
    }
  }

  /**
   * showBanner - if showBannerAds is true
  */
  showBanner() {
    if (Config.showBannerAds == true) {
      return (
        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID={Config.bannerID}
          didFailToReceiveAdWithError={this.bannerError}
        />
      )
    }
  }

  _renderItem2({ item, index },parallaxProps) {

      return (
        <TouchableOpacity activeOpacity={1} onPress={() => { this.openDetails(item) }}>
          <Block style={styles.item}>
                <ParallaxImage
                    source={{ uri: item.image  }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.2}
                    {...parallaxProps}
                />
                <Block style={styles.textInImage}>
                  <Text p color={"white"} numberOfLines={2}>
                      { item.title }
                  </Text> 
                </Block>
                
            </Block>
        </TouchableOpacity>
          
      );


  }
  

  _renderItem2_OLD({ item, index }) {

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={css.layout.slideInnerContainer}
        onPress={() => { this.openDetails(item) }}
      >
        <View style={css.layout.shadow} />
        <View style={css.layout.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={css.layout.image}
          />
          <View style={css.layout.radiusMask} />
        </View>
        <View style={css.layout.textContainer}>

          <Text
            style={css.layout.subtitle}
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    )


  }

  /**
  * Showing and hiding the searh bar
  */
  showHideSearch() {
    if (this.state.showSearch) {
      //Now when hidding, clear the text
      this.search.clearText();
      this.search.blur();
    }
    this.setState({ showSearch: !this.state.showSearch });
  }

  fullTextSearch(item) {

    var queryStrings = (this.toLowerCase()).split(" ");
    queryStrings = queryStrings.filter(String).filter(e => { return e.length > 2 });

    var match = queryStrings.some(function (v) { return item.fullTextSearch.indexOf(v) >= 0; })
    return match;
  }

  /**
  * searchChange - on search
  * @param {String} e, the entered string
  */
  searchChange(e) {

    if (e.length == 0) {
      //User has removed all the string, or it has

      this.setState({ items: this.state.itemsStore, selected: "all" })
      //But don't forget category filter
    } else if (e.length > 2) {
      //Do filter

      var filtered = this.state.itemsStore.filter(this.fullTextSearch, e);
      this.setState({ items: filtered, selected: "all" })
      //this.tabSelector(this.state.selected);


    }
  }

  /**
  * getFavoritesList - gets list of favorites
  */
  getFavoritesList() {
    var _this = this;
    Cart.getFavoritesContent(this.state.pr.collectedListName || "favorites", function (data, error) {
      if (error == false) {
       
        _this.setState({
          items: data,
          itemsStore: data,
          animating: false
        })
      }
    })
  }

  tabSelector(selected) {
    if (selected == "all") {
      this.setState({ items: this.state.itemsStore, selected: "all" })
    } else {
      console.log("====================")
      console.log(selected)
      var filtered = this.state.itemsStore.filter(this.fullTextSearch, selected);
      filtered.sort(fun.FunctionDirectory.dynamicSort("order"))
      this.setState({ items: filtered, selected: selected })

    }
  }

  get pagination () {
    const { newestItems, slider1ActiveSlide } = this.state;
    return (
        <Pagination
          dotsLength={newestItems.length}
          activeDotIndex={slider1ActiveSlide}
          containerStyle={{marginTop:-16,backgroundColor: 'rgba(0, 0, 0, 0.0)' }}
          dotStyle={{
              width: 6,
              height: 6,
              borderRadius: 3,
              marginHorizontal: 1,
              backgroundColor: materialTheme.COLORS.PRIMARY
          }}
          inactiveDotStyle={{
              // Define styles for inactive dots here
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
    );
}

  render() {
    var shouldWeShowImageBg = css.dynamic.general.backgroundImage;
    if (shouldWeShowImageBg) {
      var bgGradient = ['rgba(0,0,0,0)', 'rgba(0,0,0,0)'];
    } else {
      var bgGradient = [css.dynamic.general.backgroundColor, css.dynamic.general.backgroundColor];
      if (css.dynamic.general.backgroundGradient) {
        bgGradient = [];
        css.dynamic.general.backgroundGradient.map((item, index) => {
          bgGradient.push(item.color);
        })
      }
    }
    return (
      <ConditionalWrap
        condition={shouldWeShowImageBg}
        wrap={children => <ImageBackground
          source={require('@images/bg.jpg')}
          style={[css.layout.imageBackground, { flex: 1 }]}
        >{children}</ImageBackground>}
      >
        <LinearGradient colors={bgGradient} style={[css.layout.containerBackground, { flex: 1 }]}>
          <Navbar
            transparent={shouldWeShowImageBg}
            white={shouldWeShowImageBg}
            navigation={this.props.navigation}
            title={this.state.pr.name}
            hasSearch={true}
            showSearch={false}
            seachPlaceholder={T.what_are_you_looking_for}
            searchCallback={this.searchChange}
            back={!this.state.pr.isRoot}
          />
          <ConditionalDisplay condition={this.state.pr.listingSetup && this.state.pr.listingSetup.showCategoryFilter && this.state.categoryItems.length > 0} >
            <Tabbar
              animating={this.state.animating}
              navigation={this.props.navigation}
              isRoot={this.state.pr.isRoot ? true : false}
              //accentColor={"#000000"}
              lineColor={"#333333"}
              default={this.state.selected}
              tabRarStyle={"tabBar2"}
              options={this.state.categoryItems}
              selector={this.tabSelector}
            />
          </ConditionalDisplay>

          {this.showBanner()}
          {this.ifIndicatorIsLoading()}
          {this.renderIf(this.state.items.length)}
          <ConditionalDisplay condition={this.state.pr && this.state.pr.listingSetup && this.state.pr.listingSetup.hasFeatures && this.state.lessThen4Items}>
            <Block style={styles.crouselHolder}>
              <Carousel
                ref={(c) => { this._carousel = c; }}
                data={this.state.newestItems}
                renderItem={this._renderItem2}
                hasParallaxImages={true}
                sliderWidth={css.sliderWidth}
                itemWidth={sliderItemWidth}
                //layout={'default'}
              // containerCustomStyle={{ overflow: 'visible', flex: this.state.items.length < 4 ? 1 : 0 }}
                //contentContainerCustomStyle={{ paddingVertical: 10 }}
                loop={true}
                loopClonesPerSide={2}
                autoplay={true}
                autoplayDelay={6000}
                autoplayInterval={6000}
                enableMomentum={true}
                lockScrollWhileSnapping={false}
                onSnapToItem={(index) => {
                
                  this.setState({ slider1ActiveSlide: index })
                }}
                //onScroll={() => this._carousel.stopAutoplay()}
              />
              { this.pagination }
            </Block>
            
          </ConditionalDisplay>



          <FlatList
            style={{ padding:15,marginTop: this.state.pr && this.state.pr.listingSetup && this.state.pr.listingSetup.hasFeatures ? (this.state.items.length < 4 ? -10 : 35) : 0 }}
            data={this.state.items}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderItem}
          />
        </LinearGradient>
      </ConditionalWrap>
    );
  }
}

const styles = StyleSheet.create({
  separator:{
    height:theme.SIZES.BASE
  },
  container: {
    flex: 1,
  },
  crouselHolder:{
    marginTop:theme.SIZES.BASE,
    marginBottom:-50
  },
  item: {
    width: screenWidth - theme.SIZES.BASE*2,
    height: screenWidth * 0.6,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: theme.SIZES.BASE/2,
    backgroundColor:"#dddddd",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  textInImage:{
    position:"absolute",
    padding:theme.SIZES.BASE/2,
    bottom:0
  }
});
