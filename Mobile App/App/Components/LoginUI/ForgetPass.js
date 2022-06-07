import React, { Component} from "react";
import {  TouchableWithoutFeedback, StyleSheet, Dimensions} from 'react-native';
import { Block,Text, Input, theme, Button } from 'galio-framework';
import Navbar from '@components/Navbar';
import { LinearGradient } from 'expo-linear-gradient'
const { width, height } = Dimensions.get("screen");
import { materialTheme } from './../../../constants';

export default class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail:""
        };
    }  

    render(){
        return (
          <Block flex>
              <Navbar
                back
                navigation={this.props.navigation}
                title="Reset Password"
                transparent
                />
              <Block style={styles.loginbox}>
                <Input  onChangeText={text=>{this.setState({userEmail:text})}} placeholderTextColor={materialTheme.COLORS.MUTED} placeholder="Email" style={styles.inputStyle} />
                <Block center style={styles.actions}>
                  <Button shadowless style={[styles.button, styles.shadow,{backgroundColor:materialTheme.COLORS.BUTTON_COLOR}]} onPress={() => this.props.callBackResetPass(this.state.userEmail)}>
                      Send Rest Password Email
                  </Button>
                  <Block center>
                    <TouchableWithoutFeedback onPress={this.props.callBackBack}>
                      <Text style={styles.secondaryLinks} color={"white"}>Back to login</Text>
                    </TouchableWithoutFeedback>
                  </Block>
                </Block>
              </Block>
          </Block>
        )
    }
}

const styles = StyleSheet.create({
  inputStyle:{
    backgroundColor:null
  },
  loginbox:{
    padding:16,
    marginTop:30
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - (theme.SIZES.BASE * 2),
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    width: width
  },
  actions:{
    marginTop:30
  },
  secondaryLinks:{
    opacity:0.7
  }
});
