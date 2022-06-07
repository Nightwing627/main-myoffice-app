/*eslint array-callback-return: "off"*/
/* eslint-disable */
import React, { Component } from 'react'
import firebase from '../../config/database'
import Config from   './../../config/app'
import Card from './../../ui/template/Card'
import Image from './../../components/fields/Image'
import Input from './../../components/fields/Input'
import T from './../../translations/translate'

var md5 = require('md5');
const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

export default class User extends Component {
  
  constructor(props){
    super(props);

    this.state = {
      password: "",
      confirmPass: ""
    }
  }

  render() {
    return (
      <div className="container-fluid">
          <div className="row">
            <div className="col-md-10">
            <div className="row">
              <Card 
                class="col-md-3 col-md-offset-2"
                name={"userDataRight"}
                title={T.td("User Info")}
                showAction={false}
                >
                <div className="row">
                  <br /><br />
                  <div className="col-md-12">
                    <div className="col-md-10 col-md-offset-1">
                      <Image 
                        class="img-circle img-responsive center-block"
                        wrapperClass=" "
                        theKey="image"
                        value={this.props.userPhoto}
                        updateAction={(imageName,linkToImage)=>{this.props.setUpUserImage(linkToImage)}}
                        >
                      </Image>
                    </div>
                    {/*<div className="clearfix"></div>*/}
                    <div className="col-md-8 col-md-offset-2">
                      <h4 className="text-center">{this.props.user.displayName}</h4>
                      <p className="text-center"><b>{this.props.user.email}</b></p>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="col-md-7">
                <div className="row">
                <Card 
                  class="col-md-12"
                  name={"userDataRight"}
                  title={T.td("My Profile")}
                  showAction={false}
                  >
                  <div className="row">
                    <div className="form-group-md col-md-10 col-md-offset-1">
                      <div className="row">
                        <label for="firstName" className="col-md-3 col-form-label labelUserProfile">{T.td("Full Name")}</label>
                        <div className="col-md-7">
                          <ConditionalDisplay condition={this.props.user.email}>
                            <Input 
                              class="col-md-7"
                              theKey="name"
                              value={this.props.user.displayName}
                              updateAction={(nameKey,displayName)=>{this.props.setUpName(displayName)}}
                              >
                              </Input>
                            </ConditionalDisplay>
                          </div>
                        </div>
                        <br /><br />
                      </div>
                    </div>
                  </Card>
                  <ConditionalDisplay condition={!Config.isDemo}>
                  <Card 
                  class="col-md-12"
                  name={"userPassword"}
                  title={T.td("Reset Password")}
                  showAction={false}
                  >
                  <div className="row">
                    <div className="form-group-md col-md-10 col-md-offset-1">
                      <div className="row">
                        <label for="password" className="col-md-3 col-form-label labelUserProfile">{T.ts("New Password")}</label>
                          <div className="col-md-7">
                            <Input 
                              class="col-md-7"
                              theKey="password"
                              value={this.state.password}
                              type={"password"}
                              updateAction={(nameKey,newpassword)=>{
                                this.setState({
                                  password: newpassword
                                })
                              }}
                              >
                              </Input>
                          </div>
                        </div>
                      </div>
                      <div className="form-group-md col-md-10 col-md-offset-1">
                        <div className="row">
                          <label for="passwordConfirmation" className="col-md-3 col-form-label labelUserProfile">{T.ts("New Password Confirmation")}</label>
                          <div className="col-md-7">
                            <Input 
                              class="col-md-7"
                              theKey="passwordConfirm"
                              value={this.state.confirmPass}
                              type={"password"}
                              updateAction={(nameKey,newpassword)=>{
                                this.setState({
                                  confirmPass: newpassword
                                  })
                              }}
                              >
                              </Input>
                            </div>
                        </div>
                        <br /><br />
                        <a type="submit" onClick={()=>{this.props.resetPassword(this.state.password, this.state.confirmPass)}} className={"btn "+Config.designSettings.submitButtonClass} disabled={Config.isDemo?true:false}>Change password</a>
                        </div>
                    </div>
                  </Card>
                  </ConditionalDisplay>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div> 
    )
  }
}
