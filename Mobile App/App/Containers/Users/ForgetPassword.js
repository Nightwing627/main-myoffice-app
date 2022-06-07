import React, { Component} from "react";
import * as firebase from 'firebase';
import ForgetPassComponent from '@components/LoginUI/ForgetPass';
  

export default class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.resetPasswordPressed=this.resetPasswordPressed.bind(this);
        this.backToLogin=this.backToLogin.bind(this);
    }  

/**
 * Reset password with email
 * @param {String} userEmail 
 */
resetPasswordPressed(userEmail){
    firebase.auth().sendPasswordResetEmail(userEmail).then(function() {
       //Email sent.
      alert("Reset email has been sent on "+userEmail);
      }).catch(function(error) {
       alert(error.message)
      });
      
}

/**
 * Back to login
 */
backToLogin()
{
    this.props.navigation.pop();
}
  
render(){
    return(
        <ForgetPassComponent callBackResetPass={this.resetPasswordPressed } callBackBack={this.backToLogin} ></ForgetPassComponent>
    );
  }
}
