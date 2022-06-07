/* eslint-disable */
import React, { Component } from 'react'
import Config from './../../config/app'
import firebase from './../../config/database'
import { Link } from 'react-router'
import Card from './../../ui/template/Card'
var md5 = require('md5');

export default class UserApps extends Component {
    constructor(props){
      super(props);

      this.state = {
        user: {},
        apps: {}
      }
    }
    
    componentDidMount(){
      var userKey = this.props.location.pathname.split("/")[2];
      this.getUserData(userKey);
      this.getUserApps(userKey);
    }

    getUserData(userKey){
      var _this = this;
      firebase.app.database().ref('/users/'+userKey).on('value',function(snapshot) {
        if(snapshot.val()){
          _this.setState({user: snapshot.val()})
        }
      });
    }

    getUserApps(userKey){
      var _this = this;
      /*var pathToApps=Config.notSaaSAppsPath;
      if(Config.isSaaS){
          pathToApps=Config.saasAppsPath+firebase.app.auth().currentUser.uid;
      }*/
      var pathToApps=Config.saasAppsPath+userKey;
      var appsMade = firebase.app.database().ref(pathToApps);
      appsMade.on('value', function(snapshot) {
        if(snapshot.val()){
          _this.setState({
            apps:snapshot.val()
          })}
      });
    }

    checkIsSuperAdmin(){
      var isSuperAdmin = false;
      if(Config.adminConfig.adminUsers){
          Config.adminConfig.adminUsers.map((user)=>{
              if(firebase.app.auth().currentUser.email === user){
                  isSuperAdmin = true;
              }
          })
      }
      return isSuperAdmin;
  }

    render() {
        var apps = this.state.apps;
        if(this.checkIsSuperAdmin()){
          return (
              <div className="container-fluid">
                  <div className="row">
                  <div className="col-md-4">
                          <div className="card card-profile">
                            <div className="card-avatar">
                                <img className="img" src={this.state.user&&this.state.user.userImage?this.state.user.userImage:'http://www.gravatar.com/avatar/' + md5(this.state.user.email+"")+"?s=512"}/>
                            </div>
                            <div className="card-content">
                                <h6 className="category text-gray">{this.state.user.email?this.state.user.email:""}</h6>
                                <h4 className="card-title">{this.state.user.displayName?this.state.user.displayName:""}</h4>
                                {/*<p className="description"></p>
                                <a href="#pablo" className="btn btn-rose btn-round">Follow</a>*/}
                            </div>
                          </div>
                      </div>
                      <div className="col-md-8">
                          <div className="card">
                          <div className="card-header card-header-icon" data-background-color="rose">
                              <i className="material-icons">apps</i>
                          </div>
                          <div className="card-content">
                              <h4 className="card-title">{"List of Apps: "+Object.keys(this.state.apps?this.state.apps:{}).length}</h4>
                              
                              {/*<button type="submit" className="btn btn-rose pull-right">Update Profile</button>
                              <div className="clearfix" />*/}{
                              Object.keys(apps).length > 0?
                                <div className="table-responsive">
                                <table className="table table-shopping">
                                  <thead>
                                    <tr>
                                      <th>Logo</th>
                                      <th>Name</th>
                                      <th className="th-description">Package ID</th>
                                      <th className="th-description">App ID</th>
                                      <th />
                                    </tr>
                                  </thead>
                                  <tbody>{
                                    Object.keys(apps).map((key)=>{
                                      return (
                                      <tr>
                                        <td>
                                          <div className="img-container">
                                            <img src={apps[key].appLogo} alt="..." />
                                          </div>
                                        </td>
                                        <td className="td-name">{apps[key].name}</td>
                                        <td>{apps[key].id}</td>
                                        <td>{apps[key].rabid}</td>
                                      </tr>
                                      )
                                    })
                                  }
                                  </tbody>
                                </table>
                              </div>
                              :
                              <div></div>
                              }
                          </div>
                          </div>
                      </div>
                  </div>
                  <div className="centar">
                    <Link to={'/users'} className="button pull-right">Back To Users</Link>
                  </div>
              </div>
          )
        }else{
          return(
            <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                      <Card
                        name={"Users Admin Page"}
                        title={"Users List"}
                        showAction={false}
                      >
                      <div className="row">
                        <div className="col-md-12">
                          <h3>Admin error: Sorry, you are not allowed to access this page.</h3>
                          <br/>
                        </div>  
                      </div>     
                      </Card>
                    </div>
                  </div>
                </div>
          )
        }
    }
}
