import React, { Component } from 'react'
import { Dimensions,StyleSheet,FlatList } from 'react-native'
import { Toast, Button, Block, Text, theme, Input } from 'galio-framework'
import NavBar from '@components/Navbar'
import { materialTheme } from './../../../constants';
import Smartrow from '@smartrow';
import AppEventEmitter from "@functions/emitter";
import CartFunction from '@functions/cart'
const { width, height } = Dimensions.get("screen");
import T from '@functions/translation'
import { ScrollView } from 'react-native-gesture-handler';
import Select from "@components/Select"

export default class Checkout extends Component {

    constructor(props){
        super(props)
        this.state = {
            cart:[],
            totalQty:0,
            totalValue:0,
            showOrdeUpdated: false,
          }
        this.updateCartContent=this.updateCartContent.bind(this);
        this.orderDone=this.orderDone.bind(this);
        this.saveUserInfo=this.saveUserInfo.bind(this);
        this.showProceedButton=this.showProceedButton.bind(this);
    }

    componentDidMount(){
        var _this=this;

         //Get the cart data
         CartFunction.getCartContent((data,e)=>{
            _this.updateCartContent(data,false)
    
            })

        CartFunction.getShipingInfo((data,e)=>{
            _this.setState(data)
        })
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
     * orderDone - when order is full cimpleted
     */
    orderDone(){
        AppEventEmitter.emit('product.added');
        var _this=this;
        this.setState({
            showOrdeUpdated:true
        })

        setTimeout(()=>{
            _this.setState({
              showOrdeUpdated:false
            });
            this.props.navigation.pop();
          },3000)

        //alert("Order has been created")
        CartFunction.cleanCart(function(){
           // _this.getTheCartContent();
            _//this.setState({currentPosition:3})
        },false)

    }

    /**
  * saveUserInfo - save the entered user data
  */
  saveUserInfo(){
    var _this=this;
    var shipingInfo={
            recipient_name: this.state.recipient_name,
            line1: this.state.line1,
            phone: this.state.phone,
            email: this.state.email,
            notes: this.state.notes,
            //state:Config.paypal.state,
            //country_code: Config.paypal.country_code,
            //postal_code: Config.paypal.postal_code,
            //city: Config.paypal.city,
          }
      CartFunction.addShipingInfo(shipingInfo,function(data,e){
        CartFunction.saveOrderInFirebase(_this.orderDone);
      })
  }

  showProceedButton(){
    if(this.state.totalQty>0){
        return (<Button style={{backgroundColor:materialTheme.COLORS.BUTTON_COLOR}} onPress={()=>{this.saveUserInfo()}} shadowless >CHECKOUT</Button>)
    }else{
        return null;
    }
}


    render() {
        return (
            <Block flex >
                <NavBar navigation={this.props.navigation} back isRoot={false} showRightButton={true} title={this.props.data.name}>
                    <Block center space={"evenly"} width={width} height={100} style={styles.cartCheckout} >
                        <Block >
                            <Block row	>
                                <Text>Cart subtotal ({this.state.totalQty} items):</Text><Text bold color={materialTheme.COLORS.PRICE_COLOR}>{this.state.totalValue}$</Text>
                            </Block>
                        </Block>
                        {this.showProceedButton()}
                    </Block>
                </NavBar>
                <Toast color={"success"} isShow={this.state.showOrdeUpdated} positionIndicator="bottom">Your order has been received. Thanks!</Toast>
                <Block flex style={styles.listStyle}>
                    <ScrollView>
                        <Text p>Deliver to:</Text>
                        <Input ref={name => this.name = name} placeholder={T.name}  value={this.state.recipient_name}  onChangeText={(text) => this.setState({recipient_name:text})} />
                        <Input value={this.state.email} ref={email => this.email = email} onChangeText={(text) => this.setState({email:text})} placeholder={T.email} />
                        <Input ref={address => this.address = address} placeholder={T.enter_address}  value={this.state.line1}  onChangeText={(text) => this.setState({line1:text})} />
                        <Input value={this.state.phone} ref={phone => this.phone = phone} onChangeText={(text) => this.setState({phone:text})} placeholder={T.contact} />
                        <Input value={this.state.notes} ref={notes => this.notes = notes} onChangeText={(text) => this.setState({notes:text})} placeholder={T.about_oreder} />

                        <Text p style={{marginVertical: 16}}>Payment:</Text>
                        <Select
                            defaultIndex={0}
                            options={["Cash On Deliver"]}
                            style={styles.shadow}
                           
                        />
                    </ScrollView>
                  
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
    },
    shadow: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.2,
        elevation: 2,
        width:200
      },
});
