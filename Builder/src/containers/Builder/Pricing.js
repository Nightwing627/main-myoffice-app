/*eslint eqeqeq: "off"*/
/*eslint array-callback-return: "off"*/
/*eslint no-redeclare: "off"*/
/* eslint-disable */
import React, { Component } from 'react'
import firebase from './../../config/database'
import Image from './../../components/fields/Image'
import Config from './../../config/app'
import Card from './../../ui/template/Card'

const defaultPlan = {
    "allowdQty" : 1,
    "features" : ["Feature 1 here","Feature 2 here"],
    "id" : 11111,
    "image" : "https://i.postimg.cc/w1yx6scH/icon-paper2.png",
    "name" : "Plan name here",
    "price" : "10$ / m"
}

export default class ProjectConfig extends Component {
    constructor(props){
        super(props);
        this.state = {
            plans: [],
            vendorID: 11111
        }

        this.checkAppCreate = this.checkAppCreate.bind(this);
        this.addNewPlan = this.addNewPlan.bind(this);
        this.editPlan = this.editPlan.bind(this);
        this.editFeatures = this.editFeatures.bind(this);
        this.checkPricingPlans = this.checkPricingPlans.bind(this);
        this.addNewFeature = this.addNewFeature.bind(this);
        this.deleteFeature = this.deleteFeature.bind(this);
        this.deletePlan = this.deletePlan.bind(this);
    }

    componentDidMount(){
        this.getPricing();
    }

    getPricing(){
        var _this = this;
        firebase.app.database().ref('/rab_saas_site/pricing').on('value',function(snapshot) {
          if(snapshot.val()){
            _this.setState({
                vendorID: snapshot.val().vendorID?snapshot.val().vendorID:11111,
                plans: snapshot.val().plans?snapshot.val().plans:[]
            })
          }
        });
    }

    checkPricingPlans(plans){
        var isOkay = false;
        Object.keys(plans).map((key)=>{
            Object.keys(plans[key]).map((planKey)=>{
                if(plans[key][planKey] == "id" && plans[key][planKey].length == 5 || plans[key][planKey] != "11111"){
                    isOkay = true;
                }else if(plans[key][planKey].length != 0){
                    isOkay = true;
                }
            })
        })        
        return isOkay;
    }

    checkAppCreate(){
        if(this.state.appName<3 || !this.validateEmail(this.state.adminEmail) || !this.licenseCodeValidation(this.state.purchaseCode)){
            alert("Please enter the required fields for App Info!");
        }else if(this.state.projectId<3 || this.state.apiKey<3 || this.state.appId<3 || this.state.messagingSenderId<3){
            alert("Please enter the required fields for Firebase Config!");
        }else if(this.state.vendorID.length<5 || this.state.vendorID == "11111"){
            alert("Please enter the required fields for Pricing Plans!");
        }else if(this.state.smtp_username <3 || this.state.smtp_password <3 || this.state.smtp_port < 3){
            alert("Please enter the required fields for SMTP!");
        }else{this.generateProjectConfig()}
    }

    addNewPlan(e){
        e.preventDefault();
        var plans = this.state.plans;
        var newPlans = [];
        if(plans.length != 0){
            Object.keys(plans).map((key)=>{
                newPlans.push(plans[key])
            })
        }
        newPlans.push(defaultPlan)
        
        this.setState({plans: newPlans})
    }

    editPlan(e, planKey, fieldKey){
        e.preventDefault();
        var plans = this.state.plans;
        plans[planKey][fieldKey] = e.target.value;
        this.setState({plans: plans})
    }

    editFeatures(e, planKey, featureIndex){
        e.preventDefault();
        var plans = this.state.plans;   
        plans[planKey].features[featureIndex] = e.target.value;
        this.setState({plans: plans})
    }

    addNewFeature(e, planKey){
        e.preventDefault();
        var plans = this.state.plans;
        plans[planKey].features.push("New Feature");
        this.setState({plans: plans})
    }

    deleteFeature(e, planKey, featureIndex){
        e.preventDefault();
        var plans = this.state.plans;
        
        if(plans[planKey].features.length == 1){
            alert("You must have at least one feature!");
        }else{
            plans[planKey].features.splice(featureIndex, 1);
            this.setState({plans: plans})
        }
    }

    deletePlan(e, planIndex){
        e.preventDefault();
        var plans = this.state.plans;
        if(plans.length == 1){
            alert("You must have at least one pricing plan!");
        }else{
            plans.splice(planIndex, 1);
            this.setState({plans: plans})
        }
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
        var plans = this.state.plans;
        if(this.checkIsSuperAdmin()){
            return (
                <div className="col-md-8 col-md-offset-2">
                    {/*<h3 className="title text-center">Make project config</h3>*/}
                    <br />
                    <div className="nav-center">
                    <ul className="nav nav-pills nav-pills-rose nav-pills-icons" role="tablist">
                        <li className="active">
                        {/*<a href="#tasks-1" role="tab" data-toggle="tab">*/}
                        <a role="tab" data-toggle="tab">
                            <i className="material-icons">monetization_on</i> Pricing Plans
                        </a>
                        </li>
                    </ul>
                    </div>
                    <div className="tab-content">
                    <div className="tab-pane active" id="tasks-1">
                        <div className="card">
                        {/*<div className="card-header">
                            <h4 className="card-title">Legal info of the product</h4>
                            <p className="category">
                            More information here
                            </p>
                        </div>*/}
                        <div className="card-content">
                        <div className="col-md-12">
                            <form className="form-horizontal">
                                <div className="card-content">
                                    <div className="row">
                                        <label className="col-sm-2 label-on-left">Vendor ID</label>
                                        <div className="col-sm-10">
                                            <div className="form-group label-floating is-empty">
                                                <label className="control-label" />
                                                <input type="text" onChange={(e)=>{firebase.app.database().ref('/rab_saas_site/pricing/vendorID').set(parseInt(e.target.value))}} value={this.state.vendorID} className="form-control" placeholder="Vendor ID here" />
                                            </div>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h4 className="card-title">Pricing Plans</h4>
                                        </div>
                                        <div className="col-md-6">
                                            <button onClick={(e)=>{this.addNewPlan(e)}} style={{'float':'right'}} className="btn btn-rose btn-round btn-fab btn-fab-mini">
                                                <i className="material-icons">add</i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">{
                                        plans?Object.keys(plans).map((key, index)=>{
                                            return(
                                            <div className="panel panel-default">
                                                <div className="panel-heading" role="tab" id={"heading"+index}>
                                                    <a role="button" data-toggle="collapse" data-parent="#accordion" href={"#collapse"+index} aria-expanded="true" aria-controls={"collapse"+index}>
                                                        <h4 className="panel-title">{plans[key].name}
                                                            <i className="material-icons">keyboard_arrow_down</i>
                                                        </h4>
                                                    </a>
                                                </div>
                                                <div id={"collapse"+index} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"heading"+index}>
                                                    <div className="panel-body">
                                                        <div className="row">
                                                            <label className="col-sm-2 label-on-left">Allowed number of apps</label>
                                                            <div className="col-sm-10">
                                                                <div className="form-group label-floating is-empty">
                                                                <label className="control-label" />
                                                                <input type="text" onChange={(e)=>{this.editPlan(e, key, "allowdQty")}} value={plans[key].allowdQty} className="form-control" placeholder="Allowed number of apps here" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <label className="col-sm-2 label-on-left">Plan ID</label>
                                                            <div className="col-sm-10">
                                                                <div className="form-group label-floating is-empty">
                                                                <label className="control-label" />
                                                                <input type="text" onChange={(e)=>{this.editPlan(e, key, "id")}} value={plans[key].id} className="form-control" placeholder="Plan ID here" />
                                                                </div>
                                                            </div>
                                                        </div> <div className="row">
                                                            <label className="col-sm-2 label-on-left">Plan name</label>
                                                            <div className="col-sm-10">
                                                                <div className="form-group label-floating is-empty">
                                                                <label className="control-label" />
                                                                <input type="text" onChange={(e)=>{this.editPlan(e, key, "name")}} value={plans[key].name} className="form-control" placeholder="Plan name here" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <label className="col-sm-2 label-on-left">Plan price</label>
                                                            <div className="col-sm-10">
                                                                <div className="form-group label-floating is-empty">
                                                                <label className="control-label" />
                                                                <input type="text" onChange={(e)=>{this.editPlan(e, key, "price")}} value={plans[key].price} className="form-control" placeholder="Plan price here" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <label className="col-sm-2 label-on-left">Plan image</label>
                                                            <div className="col-sm-10">
                                                                {/*<div className="form-group label-floating is-empty">
                                                                <label className="control-label" />
                                                                <input type="text" onChange={(e)=>{this.editPlan(e, key, "image")}} value={plans[key].image} className="form-control" placeholder="Plan image here" />
                                                                </div>*/}
                                                                <Image 
                                                                    parentKey="image" 
                                                                    options={{}} 
                                                                    updateAction={(keyImage, value)=>{
                                                                        plans[key]['image'] = value;
                                                                        firebase.app.database().ref('/rab_saas_site/pricing/plans').set(plans)
                                                                    }} 
                                                                    class="" 
                                                                    theKey="image"  
                                                                    value={plans[key].image} 
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-11 col-md-offset-1">
                                                                <br/>
                                                                <button onClick={(e)=>{this.addNewFeature(e, key)}} style={{'float':'right'}} className="btn btn-rose btn-round btn-fab btn-fab-mini">
                                                                    <i className="material-icons">add</i>
                                                                </button>
                                                                <br/><br/>
                                                                <div className="panel-group" id="accordionFeatures" role="tablist" aria-multiselectable="true" style={{'paddingLeft':'20px'}}>
                                                                    <div className="panel panel-default">
                                                                        <div className="panel-heading" role="tab" id={"headingFeature"+key}>
                                                                        <a role="button" data-toggle="collapse" data-parent="#accordionFeatures" href={"#collapseFeature"+key} aria-expanded="true" aria-controls={"collapseFeature"+key}>
                                                                            <h4 className="panel-title">
                                                                            Features
                                                                            <i className="material-icons">keyboard_arrow_down</i>
                                                                            </h4>
                                                                        </a>
                                                                        </div>
                                                                        <div id={"collapseFeature"+key} className="panel-collapse collapse" role="tabpanel" aria-labelledby={"headingFeature"+key}>
                                                                            <div className="panel-body">
                                                                                <form className="form-horizontal">
                                                                                    {
                                                                                        plans[key].features.map((feature, featureIndex)=>{
                                                                                            return(
                                                                                                <div className="row">
                                                                                                    <label className="col-sm-1 label-on-left">{featureIndex+1+"."}</label>
                                                                                                    <div className="col-sm-10">
                                                                                                        <div className="form-group label-floating is-empty">
                                                                                                            <label className="control-label" />
                                                                                                            <input type="text" onChange={(e)=>{this.editFeatures(e, key, featureIndex)}} value={feature} className="form-control"/>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="col-sm-1">
                                                                                                        <i onClick={(e)=>{this.deleteFeature(e, key, featureIndex)}} className="material-icons text-rose" style={{'paddingTop':'30px', 'cursor':'pointer'}}>clear</i>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 text-center">
                                                            <button onClick={(e)=>{this.deletePlan(e, index)}} className="btn btn-rose btn-sm">{"Delete "+plans[key].name}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        }):<div></div>
                                    }
                                    </div>
                                </div>
                            </form>
                        </div>
                        </div>
                        </div>
                        <div className="col-md-12 text-center">
                            <button onClick={()=>{firebase.app.database().ref('/rab_saas_site/pricing/plans').set(this.state.plans), alert("Pricing plans saved!")}} className="btn btn-rose btn-round">Save</button>
                        </div>
                    </div>
                    </div>
                </div>
            )
        }else{
            return(
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-8 col-md-offset-2">
                      <Card
                        name={"Pricing"}
                        title={"Pricing"}
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
