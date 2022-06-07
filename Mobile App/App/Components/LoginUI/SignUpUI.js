import React from 'react';
import {TouchableWithoutFeedback, StyleSheet, Dimensions} from 'react-native';
import { Block,Text, Input, theme, Button } from 'galio-framework';
import Navbar from '@components/Navbar';
import { LinearGradient } from 'expo-linear-gradient'

const { width, height } = Dimensions.get("screen");
import { materialTheme } from './../../../constants';

class SignUpScreen extends React.Component {
  
  constructor(props){
    super(props);
        this.state = {
          email: "",
          password: '',
          name:""
        };
    }

  render() {
    return (
      <Block flex>
        
          <Navbar
            navigation={this.props.navigation}
            title="Sign Up"
            transparent
            back />
          <Block style={styles.loginbox}>
            <Input  onChangeText={text=>{this.setState({name:text})}}  placeholderTextColor={materialTheme.COLORS.MUTED} placeholder="Name" style={styles.inputStyle} />
            <Input  onChangeText={text=>{this.setState({email:text})}}  placeholderTextColor={materialTheme.COLORS.MUTED} placeholder="Email" style={styles.inputStyle} />
            <Input  onChangeText={text=>{this.setState({password:text})}}  placeholderTextColor={materialTheme.COLORS.MUTED}  style={styles.inputStyle} password viewPass placeholder="Password"/>

            <Block center style={styles.actions}>
              <Button shadowless style={[styles.button, styles.shadow,{backgroundColor:materialTheme.COLORS.BUTTON_COLOR}]} onPress={() => this.props.onSignUpPress(this.state.email, this.state.password,this.state.name)}>
                  SIGN UP
              </Button>
              <Block center>
                <TouchableWithoutFeedback onPress={this.props.onLogInPress}>
                  <Text style={styles.secondaryLinks}>Already have an account? Sign in</Text>
                </TouchableWithoutFeedback>
              </Block>
            </Block>
          </Block>
      </Block>
    )
  }
}

export default SignUpScreen;

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

