import React, { Component } from 'react'
import { Dimensions,StyleSheet,FlatList } from 'react-native'
import { Button, Block, Text, theme } from 'galio-framework'
import NavBar from '@components/Navbar'
import { materialTheme } from './../../../constants';
import Smartrow from '@smartrow';
import AppEventEmitter from "@functions/emitter";
import CartFunction from '@functions/cart'
const { width, height } = Dimensions.get("screen");
import Empty from '@components/Empty';
import T from '@functions/translation';

export default class Cart extends Component {

    //Key extractor for the order flat list
  _keyExtractor = (item, index) => item.id+index;

    constructor(props){
        super(props)
        this.state = {
            cart:[],
            currentPosition: this.props.data.currentPosition||0,
            animating: true,
            isPaypalClicked: this.props.data.PayPalAvailable,
            isCODClicked: !this.props.data.PayPalAvailable&&this.props.data.CODAvailable,
            colorsLoaded:false,
            phone:"",
            totalQty:0,
            totalValue:0,
          }
        
          this.getTheCartContent=this.getTheCartContent.bind(this);
          this.renderItem=this.renderItem.bind(this);
          this.updateCartContent=this.updateCartContent.bind(this);
          this.qtyChanger=this.qtyChanger.bind(this);
          this.showProceedButton=this.showProceedButton.bind(this);
    }

    //Component mount function
    componentDidMount(){
        //Reference to this
        var _this=this;
        AppEventEmitter.addListener('product.added', this.getTheCartContent);
        this.getTheCartContent();
        //Get saved shipping info
        CartFunction.getShipingInfo((data,e)=>{
            _this.setState(data)
        })
    }

    getTheCartContent(){
        //Reference to this
        var _this=this;

        //Get the cart data
        CartFunction.getCartContent((data,e)=>{
        _this.updateCartContent(data,false)

        })

    }

     /**
     * updateCurrentPosition
     * @param {Number} page of the indicator
     */
    updateCurrentPosition = (page) => {
        this.setState({currentPosition: page.i});
    }

    /**
     * updateCartContent - update state
     * @param {Object} newCart  - the value of the new cart
     */
    updateCartContent(newCart,animating1){
        var totalQty=0;
        var totalValue=0;
        newCart.forEach(item => {
            totalQty+=item.qty;
            totalValue+=item.qty*item.price
        });
        this.setState({totalQty:totalQty,totalValue:totalValue, cart:newCart,animating:animating1})
    }

    /**
     * qtyChanger - changer callback for each roe
     * @param {Number} newQuantity
     * @param {String} id -id of the row
     */
    qtyChanger(newQuantity,id){
       // alert(newQuantity+" "+id);
        //Reference to this
        var the=this;
        //Update cart, and update state
        CartFunction.updateQty(id,newQuantity,(data,e)=>{
            //alert(JSON.stringify(data))
            the.updateCartContent(data);
        });
    }


    /**
  * renderItem - render item in the order list
  * @param {Object} data - row to be created
  */
  renderItem(data){
    //In flat list the data is wraped
    var item=data.item;
    //Create meta for this row
    var listingSetup={
      "fields": {
        "description": "title",
        "image": "image",
        "subtitle": "price",
        "subtitleFunctions": "multiply~"+item.qty+",roundOn,toCurrency~"+"$",
        "title": "name"
      },
      "listing_style": "list"
    };
  

    return (
      <Smartrow
        min={0}
        isListing={true}
        isCart={true}
        qty={item.qty}
        callback={this.qtyChanger}
        item={item}
        id={item.id}
        key={item.id}
        display={{listingSetup:listingSetup}} />
    )
  }

    showProceedButton(){
        if(this.state.totalQty>0){
            return (
                <Block center space={"evenly"} width={width} height={100} style={styles.cartCheckout} >
                        <Block >
                            <Block row	>
                                <Text>Cart subtotal ({this.state.totalQty} items):</Text><Text bold color={materialTheme.COLORS.PRICE_COLOR}>{this.state.totalValue}$</Text>
                            </Block>
                        </Block>
                        <Button style={{backgroundColor:materialTheme.COLORS.BUTTON_COLOR}} onPress={()=>{this.props.navigation.navigate('Checkout')}} shadowless >PROCEED TO CHECKOUT</Button>
                        </Block>
                        )
        }else{
            return null;
        }
    }

    showEmpty(){
        if(!this.state.totalQty>0){
            return (<Empty text={T.no_items}/>)
        }else{
            return null;
        }
    }

    render() {
        return (
            <Block flex >
                <NavBar navigation={this.props.navigation} isRoot={ true} showRightButton={true} title={this.props.data.name}>
                { this.showProceedButton()}
                </NavBar>
                <Block flex style={styles.listStyle}>
                    {this.showEmpty()}
                   <FlatList
                    data={this.state.cart}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderItem}
                  />
                </Block>
            </Block>
        )
    }
}

const styles = StyleSheet.create({
    cartCheckout: {
        backgroundColor:"white"
    },
    listStyle:{
        padding:theme.SIZES.BASE,
    }
});