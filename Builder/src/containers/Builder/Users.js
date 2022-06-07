/*eslint-disable*/
/*eslint no-unused-vars: "off"*/
/*eslint eqeqeq: "off"*/
/*eslint array-callback-return: "off"*/
/*eslint-disable-next-line: "off"*/
import React, { Component } from 'react'
import firebase from './../../config/database'
import SkyLight from 'react-skylight';
import Config from './../../config/app'
import Card from './../../ui/template/Card'
import ReactTable from "react-table"
import Common from '../../common.js'
import matchSorter from 'match-sorter'
import { Link } from 'react-router'
var md5 = require('md5');

const ConditionalDisplay = ({condition, children}) => condition ? children : <div></div>;

export default class Users extends Component {
    constructor(props){
        super(props);

        this.state={
            users: {},
            userList: [],
            currentUser: {},
            plans: {},
            subscriptionType: "",
            userSubscription: {},
            planID: "",
            status: "deleted",
            columns: []
        }

        this.setupColumns = this.setupColumns.bind(this);
        this.renderPlanSelector=this.renderPlanSelector.bind(this);
    }

    componentDidMount(){
        this.getUsersList();
        this.getPlans();
        this.setupColumns();
    }

    getUsersList(){
        var _this = this;
        var usersArray = [];
        firebase.app.database().ref('/users').on('value',function(snapshot) {
            if(snapshot.val()){
                var users = snapshot.val();
                Object.keys(users).map((key, index)=>{
                    var newUserObjectToBeSaved = {
                        index: index+1,
                        uid: key,
                        userImage: users[key].userImage?users[key].userImage:"",
                        email: users[key].email,
                        displayName: users[key].displayName?users[key].displayName:"",
                        numOfApps: users[key].numOfApps?users[key].numOfApps:0
                    };

                    usersArray.push(newUserObjectToBeSaved)
                })

                _this.setState({ users: users, userList: usersArray })
            }
        });
    }

    getCurrentUserData(key){
        var _this = this;
        var users = _this.state.users;
        
        _this.setState({ 
            currentUser: users[key] 
        },()=>{_this.checkUserPayment(users[key])})
    }

    getPlans(){
        var _this = this;
            firebase.app.database().ref('/rab_saas_site/pricing').on('value',function(snapshot) {
                _this.setState({ plans: snapshot.val().plans })
        });
    }

    /**
     * Checking if the user has payment or not and some additional statements
     * @param {Object} user 
     */
    checkUserPayment(user){
        var _this = this;
        firebase.app.database().ref('/paddlePayments/'+md5(user.email)).on('value',function(snapshot) {
            if(snapshot.val()){
                _this.setState({
                    userSubscription: snapshot.val(),
                    planID: snapshot.val().subscription_plan_id,
                    status: snapshot.val().status,
                    subscriptionType: Object.keys(snapshot.val()).length>2?"Regular":"Manual"
                })
            }else{
                _this.setState({ subscriptionType: "Manual", status: "deleted" })
            }
        });

        _this.dialog.show()
    }

    saveSubscription(){
        var _this = this;
        var path = firebase.app.database().ref('/paddlePayments/'+md5(_this.state.currentUser.email));

        if(_this.state.status || _this.state.planID){
            path.set({
                status: _this.state.status,
                subscription_plan_id: _this.state.planID
            })

            if(_this.state.status === "deleted" || _this.state.planID==0){
                path = firebase.app.database().ref('/paddlePayments/'+md5(_this.state.currentUser.email)+'/subscription_plan_id');
                path.remove();
            }
            _this.setState({ status: "", planID: "" },()=>{_this.dialog.hide()})
        }else{
            alert("Please fill all the informations!")
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

    

    setupColumns(){
        var columns = [];
        var headers = ["index","userImage","email","displayName","numOfApps"];
        headers.map((header, colIndex)=>{
            columns.push({  
                Header: Common.capitalizeFirstLetter(header),
                accessor: header,
                //not filterable for photo and object, and for index header
                //filterable: Config.adminConfig.showSearchInTables?Config.adminConfig.fieldsTypes.photo.indexOf(header)>-1?false:(header.indexOf(".")>0?false:true):false,
                filterable: Config.adminConfig.showSearchInTables?Config.adminConfig.fieldsTypes.photo.indexOf(header)>-1||header==="index"?false:(header.indexOf(".")>0?false:true):false,
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: [header] }),
                  filterAll: true,
                Cell: row => (this.rowCreator(row, colIndex, row.index))
            })
        })
        columns.push({
            Header: "Actions",
            filterable: false,
            Cell: row => (
               <div className="text-right">
                    <a onClick={()=>{this.getCurrentUserData(row.original.uid)}} ><span className="btn btn-simple btn-info btn-icon edit"><i className="material-icons">edit</i></span></a>
               </div> 
            )
        });

        this.setState({
            columns: columns
        })
    }    

     //Create row depending of type 
     rowCreator(row, colIndex, rowIndex){
        var key=row.column.id;
        
        if(Config.adminConfig.fieldsTypes.photo.indexOf(key)>-1){
            //This is photo 
            //return (<div className="tableImageDiv"><img alt={row.original.name} src={row.value}  width="50" height="50"/></div>)
            return (<div><img height={34} alt={row.original.name} src={row.value}/></div>)
        }else{
            if(this.state.type === "String"){
                console.log("--HERE--String")
                //Normal value
                //But can be string
                return (<div className="text-center">{row.original}</div>)
            }else{
              return colIndex===4?(<div className="text-center"><Link to={"/users/"+row.original.uid}>{row.value}</Link></div>):(<div className="text-center">{row.value}</div>)
          }
        }
    }

    renderPlanSelector(){
        var thePlans=[{"id":0,name:"Choose Plan"}]
        if(this.state.plans){
            Object.keys(this.state.plans).map((key)=>{
                thePlans.push(this.state.plans[key]);
            })
        }
        return thePlans.map((element,index)=>{
            return (
                <option value={element.id}>{element.name}</option>
            )
        })
    }

    render() {
        var dialogStyle = {
            width: '40%',
            height: '500px',
            //marginTop: '-300px',
            marginLeft: '-20%',
          };
          
        var users = this.state.userList;
        if(this.checkIsSuperAdmin()){
                return(
                    <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                        <div className="card">
                            <div className="card-header card-header-icon" data-background-color="rose">
                            <i className="material-icons">assignment</i> Users List
                            </div>
                            <h4 className="card-title"><span className="text-rose">{Object.keys(users).length}</span> users</h4>
                                <div className="card-content">
                                    <ReactTable
                                        data={users}
                                        filterable
                                        defaultFilterMethod={(filter, row) =>
                                            String(row[filter.id]) === filter.value
                                        }
                                        columns={this.state.columns}
                                        className="-striped -highlight"  
                                        defaultPageSize={10}
                                        showPagination={true}
                                    />  
                                </div>
                            </div>
                        </div>
                    </div>
                    <SkyLight
                        hideOnOverlayClicked
                        ref={ref => (this.dialog = ref)}
                        title={this.state.currentUser?"User: "+this.state.currentUser.email:""}
                        dialogStyles={dialogStyle}
                        >
                        <hr/>
                        <div className="col-md-12">
                            <div className="form-group-md" style={{'marginTop':'20px'}}>
                                <div className="row">
                                    <label className="col-sm-3 label-on-left col-sm-offset-2">Status</label>
                                    <div className="col-sm-3">
                                        <div className="form-group label-floating is-empty" style={{'marginTop':'-10px'}}>
                                            <select value={this.state.status} className="form-control" id="sel1" onChange={(e)=>{this.setState({status: e.target.value, planID:e.target.value=="deleted"?0:this.state.planID}) }}>
                                                <option value="active">Active</option>
                                                <option value="deleted">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group-md" style={{'marginTop':'50px'}}>
                                <div className="row">
                                    <label className="col-sm-3 label-on-left col-sm-offset-2">Plan ID</label>
                                    <div className="col-sm-3">
                                        <div className="form-group label-floating is-empty" style={{'marginTop':'-10px'}}>
                                            <select value={this.state.planID?this.state.planID:0} className="form-control" id="sel1" onChange={(e)=>{this.setState({ planID: e.target.value, status: e.target.value==0?"deleted":"active"})}}>
                                                {this.renderPlanSelector()}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group-md" style={{'marginTop':'50px'}}>
                                <div className="row">
                                    <label className="col-sm-3 label-on-left col-sm-offset-2">Subscription Type</label>
                                    <div className="col-sm-3">
                                        <div className="form-group label-floating is-empty" style={{'marginTop':'-10px'}}>
                                            <label className="control-label" />
                                            <input type="text" className="form-control" value={this.state.subscriptionType} disabled/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ConditionalDisplay condition={this.state.subscriptionType==="Manual"}>
                                <div className="form-group-md" style={{'marginTop':'50px'}}>
                                    <div className="row">
                                        <div className="col-sm-3 col-sm-offset-2">
                                            <a type="button" onClick={()=>{this.saveSubscription()}}className={"btn "+Config.designSettings.submitButtonClass}>Save</a>
                                        </div>
                                    </div>
                                </div>
                            </ConditionalDisplay>
                        </div>
                        <hr/>
                </SkyLight>
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
