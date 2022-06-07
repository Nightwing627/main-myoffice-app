/*eslint eqeqeq: "off"*/
/*eslint array-callback-return: "off"*/
/*eslint no-redeclare: "off"*/
import React, { Component } from 'react'
import Config from   '../../config/app'
import Card from './../../ui/template/Card'
import firebase from './../../config/database'
import SkyLight from 'react-skylight';
import T from './../../translations/translate'

var md5 = require('md5');
const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

export default class Billing extends Component {
  constructor(props){
    super(props);

    this.state={
      features: [],
      planName: "",
      subscription: null,
      user: {},
      plans: {},
      vendorID: ""
    }
    
    this.setUpBillingInfo = this.setUpBillingInfo.bind(this);
    this.checkSubscriptionStatus = this.checkSubscriptionStatus.bind(this);
    this.setUpSubscriptionOptions = this.setUpSubscriptionOptions.bind(this);
    this.getPlans = this.getPlans.bind(this);
  }

  componentDidMount(){
    //Find user
    this.setState({
      user:firebase.app.auth().currentUser
    })
    //window.initPaddle(Config.paymentSettings.vendorID);
    
    //Check current subscription status
    this.checkSubscriptionStatus();
    this.authListener();

    //Get plans from firebase
    this.getPlans();
  }

  authListener(){
    const setUser=(user)=>{
    this.setState({user:user})
    }

    //Now do the listner
    firebase.app.auth().onAuthStateChanged(function(user) {
    if (user) {
        setUser(user);
        // User is signed in.
        console.log("User has Logged  in Master");
        console.log(user.email);
        
    } else {
        // No user is signed in.
        console.log("User has logged out Master");
    }
    });
  }

  //Connect to firebase to get current user subscription status and set it in state
  checkSubscriptionStatus(){
    var _this = this;
    firebase.app.database().ref('/paddlePayments/' + md5(firebase.app.auth().currentUser.email)).on('value',function(snapshot) {
      console.log(snapshot.val());
      _this.setState({
        subscription: snapshot.val()
      })
    });
  }

  //Check subscription status of user and set show options for subscription button
  buttonSubscriptionShow(plan, email, subscription){
    if(!subscription){
      return ( <a type="submit" onClick={()=>{
        window.openCheckout(plan.id, email, true);
        }} className={"btn "+Config.designSettings.submitButtonClass}>{T.td("Purchase now")}</a>
      )
    }else{
      if(subscription.status != "deleted" && plan.id+"" === subscription.subscription_plan_id+""){
        return (
          <a type="submit" className={"btn "+Config.designSettings.submitButtonClass} disabled><i className="material-icons">done</i> {T.td("Current plan")}</a>
        )
      }else{
        return ( <a type="submit" onClick={()=>{
          window.openCheckout(plan.id, email, true);
          }} className={"btn "+Config.designSettings.submitButtonClass}>{subscription.status == "deleted"?T.td("Purchase now"):T.td("Switch")}</a>
        )
      }
    }
  }

  //Setup subscription options for updating and canceling subscription
  setUpSubscriptionOptions(subscription){
      if(subscription&&subscription.update_url&&subscription.cancel_url&&subscription.status!="deleted"){
      return (
        <div className="col-md-12">
          <a href={subscription.update_url} target="_blank" className={"btn "+Config.designSettings.buttonInfoClass}>{T.ts("Update Billing Info")}</a>
          <a  href={subscription.cancel_url} target="_blank"   className={"btn "+Config.designSettings.submitButtonClass}>{T.ts("Cancel Subscription")}</a>
        </div>
      )}else{
        return (<div></div>)
      }
  }
  
  //Get plans from firebase 
  getPlans(){
    var _this = this;
    firebase.app.database().ref('/rab_saas_site/pricing').on('value',function(snapshot) {
      _this.setState({
        plans: snapshot.val().plans?snapshot.val().plans:{},
        vendorID: snapshot.val().vendorID?snapshot.val().vendorID:""
      },() => window.initPaddle(snapshot.val().vendorID)
      )
    });
  }

  //Setup view for billing 
  setUpBillingInfo(plan, subscription){
    return (
      <div className="row">
        <div className="col-md-3 colBilling">
          <h4 className="colBillingText">{plan.name}</h4>
        </div>
        <div className="col-md-3 colBilling">
          <a className="btn btn-secondary" onClick={() => {
              this.setState({
                  features: plan.features,
                  planName: plan.name
                },() => this.dialog.show()
              );
            }}>{T.ts("Features")}</a>
        </div>
        <div className="col-md-3 colBilling">
          <h4 className="colBillingText">{plan.price}</h4>
        </div>
        <div className="col-md-3 colBilling">
         {this.buttonSubscriptionShow(plan, this.state.user?this.state.user.email:null, subscription)}
        </div>
      </div>
    );
  }

  render() {
    var dialogStyle = {
      width: '40%',
      //height: '600px',
      //marginTop: '-300px',
      marginLeft: '-20%',
    };

    return (
        <div className="container-fluid">
          <div className="row">   
            <div className="col-md-8 col-md-offset-2">
              <Card
                name={"Billing"}
                title={T.ts("Subscription")}
                showAction={false}
              >
              <div className="row">
                <div className="col-md-12">
                    <br/><br />
                    <div className="col-md-10 col-md-offset-1" >{
                        this.state.plans.length > 0?this.state.plans.map((plan) => {
                          return this.setUpBillingInfo(plan, this.state.subscription);
                        }):<div><h2>Pricing plans will be added soon. Come back again!</h2></div>
                      }
                    </div>
                </div>
              </div>
              <br /><br /><br />
              </Card>
              <ConditionalDisplay condition={this.state.subscription&&this.state.subscription.update_url&&this.state.subscription.cancel_url&&this.state.subscription.status!="deleted"}>
                <Card
                  name={"Billing Option"}
                  title={T.ts("Subscription Options")}
                  showAction={false}
                >
                <br />
                <div className="row">
                  {this.setUpSubscriptionOptions(this.state.subscription)}
                </div>
                <br />
                </Card>
              </ConditionalDisplay>
            
              <SkyLight
                  hideOnOverlayClicked
                  ref={ref => (this.dialog = ref)}
                  title={this.state.planName+" "+T.ts("Plan Features")}
                  dialogStyles={dialogStyle}
                  >
                  <hr/>
                  {this.state.features.map(feature => (
                    <h3 key={feature}><i className="material-icons">done</i> {feature}</h3>
                  ))}
                  <hr/>
              </SkyLight>
              <div style={{"textAlign": "center"}} className="col-md-8 col-md-offset-7">
                  <br />
                  <br />
                  <a className="button" href="/">{T.ts("Go Back")}</a>
                  <br />
                  <br />
                </div>
            </div>
          </div>
          <footer className="footerfa" style={{'padding-top': '20%'}}></footer>
        </div>  
    )
  }
}