/*eslint no-unused-vars: "off"*/
/* eslint-disable */
import React, {Component} from 'react'
import NavBar from './../../ui/template/NavBar'
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app
import Config from   '../../config/app';
import Wizzard from "./../../ui/template/Wizzard";
import firebase from '../../config/database'
import T from './../../translations/translate'
import Image from './../../components/fields/Image'
var QRCode = require('qrcode.react');
var request = require('superagent');

class Preview extends Component {
  constructor(props){
    super(props);

    this.state={
      name: "",
      linkToApp: "",
      uniqueID:"",
      previewAppSettings: {}
    }

    this.getUniiQueID = this.getUniiQueID.bind(this);
    this.getPreviewContentDevice = this.getPreviewContentDevice.bind(this);
  }

  componentDidMount(){
    var _this=this;
    var wholeApp = firebase.app.database().ref(Config.appEditPath);
    wholeApp.on('value', function(snapshot) {
      _this.setState({
        name:snapshot.val().name
      })
    });

    if(Config.appEditPath){
      this.getUniiQueID();
    }
    

    if(Config.isSaaS){
      _this.getAppLink();
    }else{
      _this.setState({
        linkToApp: "http://bit.ly/uniexporeact"
      })
    } 
  }

  getUniiQueID(){
    var url='https://install.reactappbuilder.com/appids/index.php';
    var query = { action: 'getID', string: Config.firebaseConfig.apiKey+";"+Config.firebaseConfig.projectId+";"+Config.appEditPath };
    var _this=this;
		request.get(url).query(query).end((err, res) => {
      // Do something
      console.log(res);
      _this.setState({
        uniqueID:parseInt(res.text)
      })
    });
  }

  saveScreenshotIphone(){
    console.log("Get dScreenshot")
    var iframeAndroid = document.getElementById('theAndroidFrameAppetize');
    iframeAndroid.contentWindow.postMessage('saveScreenshot', '*');
  }

  saveScreenshotIphone(){
    console.log("Get dScreenshot")
    var iframeIphone = document.getElementById('theiPhoneFrameAppetize');
    iframeIphone.contentWindow.postMessage('saveScreenshot', '*');
  }

  saveScreenshotIpad(){
    console.log("Get iPad dScreenshot")
    var iframeIpad = document.getElementById('theiPadFrameAppetize');
    iframeIpad.contentWindow.postMessage('saveScreenshot', '*');
  }

  getAppLink(){
    var _this = this;
    var linkInfo = firebase.app.database().ref('/rab_saas_site');
    linkInfo.on('value', function(snapshot) {
      _this.setState({
        linkToApp: snapshot.val().linkToPreviewApp,
        previewAppSettings: snapshot.val().preview_app ? snapshot.val().preview_app : {}
      })
    });
  }


  getPreviewContentWeb(){
    return (
      <div className="card-content">
        <ul className="nav nav-pills nav-pills-rose">
         
          <li className="active">
            <a href="#pill1" data-toggle="tab">iPhone</a>
          </li>
          <li>
            <a href="#pill2" data-toggle="tab">iPad</a>
          </li>
          <li >
            <a href="#pill3" data-toggle="tab">Android</a>
          </li>
        </ul>
        <div className="tab-content">
          
          <div className="tab-pane active" id="pill1">
            <div className="col-md-12" style={{'marginBottom':'20px'}}>
              <a onClick={()=>{this.saveScreenshotIphone()}} className="btn">Take Screenshot</a>
            </div>
            <p><h3>{T.ts("Unique ID")+":"+this.state.uniqueID}</h3></p>
            <br />
            <iframe id="theiPhoneFrameAppetize"
              src="https://appetize.io/embed/8bnmakzrptf1hv9dq7v7bnteem?autoplay=false&debug=false&device=iphonex&deviceColor=black&embed=true&orientation=portrait&screenOnly=false&xDocMsg=true&xdocMsg=true&params=%7B%22EXKernelLaunchUrlDefaultsKey%22:%22exp:%2F%2Fexp.host%2F@dimovdaniel%2Funiexpopreviewnd%22,%22EXKernelDisableNuxDefaultsKey%22:true%7D&osVersion=11.4" 
              width="313px" height="800px" frameBorder="0" scrolling="no"></iframe>
            <div>
            </div>
            <br /><br /><br />
          </div>
          <div className="tab-pane" id="pill2">
            <div className="col-md-12" style={{'marginBottom':'20px'}}>
              <a onClick={()=>{this.saveScreenshotIpad()}} className="btn">Take Screenshot</a>
            </div>
            <p><h3>{T.ts("Unique ID")+":"+this.state.uniqueID}</h3></p>
            <br />
            <iframe id="theiPadFrameAppetize"
              src="https://appetize.io/embed/8bnmakzrptf1hv9dq7v7bnteem?autoplay=false&debug=false&device=ipad&deviceColor=black&embed=true&orientation=portrait&screenOnly=false&xDocMsg=true&xdocMsg=true&params=%7B%22EXKernelLaunchUrlDefaultsKey%22:%22exp:%2F%2Fexp.host%2F@dimovdaniel%2Funiexpopreviewnd%22,%22EXKernelDisableNuxDefaultsKey%22:true%7D&osVersion=11.4" 
              width="450px" height="700px" frameBorder="0" scrolling="no"></iframe>
            <div>
            </div>
            <br /><br /><br />
          </div>
          <div className="tab-pane" id="pill3">
            <div className="col-md-12" style={{'marginBottom':'20px'}}>
              <a onClick={()=>{this.saveScreenshotAndroid()}} className="btn">Take Screenshot</a>
            </div>
            <p><h3>{T.ts("Unique ID")+":"+this.state.uniqueID}</h3></p>
            <br />
            <iframe id="theAndroidFrameAppetize"
              src="https://appetize.io/embed/xc1w6f1krd589zhp22a0mgftyw?autoplay=false&debug=false&device=nexus5&deviceColor=black&embed=true&launchUrl=exp://exp.host/@dimovdaniel/uniexpopreviewnd&orientation=portrait&screenOnly=false&xDocMsg=true&xdocMsg=true&params=%7B%22EXKernelLaunchUrlDefaultsKey%22:%22exp:%2F%2Fexp.host%2F@dimovdaniel%2Funiexpopreviewnd%22,%22EXKernelDisableNuxDefaultsKey%22:true%7D" 
              width="313px" height="800px" frameBorder="0" scrolling="no"></iframe>
            <div>
            </div>
            <br /><br /><br />
          </div>
        </div>
      </div>
    
    )
  }

  getPreviewContentWebOld(){
    return(
      <div className="card-content">
        <div className="row">
          <div className="col-md-4">
            <ul className="nav nav-pills nav-pills-rose nav-stacked">
              <li className="active">
                <a href="#tab1" data-toggle="tab">iPhone</a>
              </li>
              <li>
                <a href="#tab2" data-toggle="tab">iPad</a>
              </li>
            </ul>
          </div>
          <div className="col-md-8">
            <div className="tab-content">
              <div className="tab-pane active" id="tab1">
                <div className="col-md-12" style={{'marginBottom':'20px'}}>
                  <a onClick={()=>{this.saveScreenshotIphone()}} className={"btn "+Config.designSettings.submitButtonClass}>Take Screenshot</a>
                </div>
                <p><h3>{T.ts("Unique ID")+":"+this.state.uniqueID}</h3></p>
                <br />
                <iframe id="theiPhoneFrameAppetize"
                  src="https://appetize.io/embed/8bnmakzrptf1hv9dq7v7bnteem?autoplay=false&debug=false&device=iphonex&deviceColor=black&embed=true&orientation=portrait&screenOnly=false&xDocMsg=true&xdocMsg=true&params=%7B%22EXKernelLaunchUrlDefaultsKey%22:%22exp:%2F%2Fexp.host%2F@dimovdaniel%2Fappbuilderonline%22,%22EXKernelDisableNuxDefaultsKey%22:true%7D&osVersion=11.4" 
                  width="313px" height="800px" frameBorder="0" scrolling="no"></iframe>
                <div>
                </div>
                <br /><br /><br />
              </div>
              <div className="tab-pane" id="tab2">
                <div className="col-md-12" style={{'marginBottom':'20px'}}>
                  <a onClick={()=>{this.saveScreenshotIpad()}} className={"btn "+Config.designSettings.submitButtonClass}>Take Screenshot</a>
                </div>
                <p><h3>{T.ts("Unique ID")+":"+this.state.uniqueID}</h3></p>
                <br />
                <iframe id="theiPadFrameAppetize"
                  src="https://appetize.io/embed/8bnmakzrptf1hv9dq7v7bnteem?autoplay=false&debug=false&device=ipad&deviceColor=black&embed=true&orientation=portrait&screenOnly=false&xDocMsg=true&xdocMsg=true&params=%7B%22EXKernelLaunchUrlDefaultsKey%22:%22exp:%2F%2Fexp.host%2F@dimovdaniel%2Fappbuilderonline%22,%22EXKernelDisableNuxDefaultsKey%22:true%7D&osVersion=11.4" 
                  width="450px" height="700px" frameBorder="0" scrolling="no"></iframe>
                <div>
                </div>
                <br /><br /><br />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  generateLinks(){
    return (
      <div>
        <p><strong>Here are some additional tools for taking screenshots</strong></p>
        <ul style={{'list-style-type':'none'}}>
          <a href="https://placeit.net/app-store-screenshot-generator" target="_blank"><li>App Store Screenshot Generator</li></a>
          <a href="https://appure.io" target="_blank"><li>Appure</li></a>
          <a href="https://theapplaunchpad.com/" target="_blank"><li>AppLaunchpad</li></a>
        </ul>
      </div>
    )
  }

  getPreviewContentDevice(){
    return (
      <div>
        <br />{
          (this.state.previewAppSettings.playStore && this.state.previewAppSettings.playStore.length > 5) 
            && (this.state.previewAppSettings.appStore && this.state.previewAppSettings.appStore.length > 5)?
            <div className="col-md-12 col-md-offset-3">
              <div className="row">
                <div className="col-md-3">
                  <a href={this.state.previewAppSettings.playStore} target="_blank"><img alt="..." className="img-preview" src="./../../assets/img/google-en.png" /></a>
                </div>
                <div className="col-md-3">
                  <a href={this.state.previewAppSettings.appStore} target="_blank"><img alt="..." className="img-preview" src="./../../assets/img/apple-en.png" /></a>
                </div>
              </div>
              <br /><br />
            </div>
            :
            this.state.previewAppSettings.playStore && this.state.previewAppSettings.playStore.length > 5 ?
            <div className="col-md-4 col-md-offset-4">  
              <a href={this.state.previewAppSettings.playStore} target="_blank"><img alt="..." className="img-preview" src="./../../assets/img/google-en.png" /></a>
              <br /><br />
            </div> 
            :
            <div className="col-md-4 col-md-offset-4">  
              <a href={this.state.previewAppSettings.appStore} target="_blank"><img alt="..." className="img-preview" src="./../../assets/img/google-en.png" /></a>
              <br /><br />
            </div>    
        }
      </div>
    )
  }

  render() {
    return (
      <div className="main-panel" style={{'paddingRight':'15px'}}>
        <NavBar  currentLangData={this.props.route.currentLangData}></NavBar>{
          /*(this.state.previewAppSettings.playStore && this.state.previewAppSettings.playStore.length > 5) 
            || (this.state.previewAppSettings.appStore && this.state.previewAppSettings.appStore.length > 5)?*/
            this.state.previewAppSettings && this.state.previewAppSettings.length > 0?
          <Wizzard 
          title={this.state.name?T.td("App Preview")+ ": " +this.state.name:T.td("App Preview")}
          steps={[{
            name:"preview",
            icon:"computer",
            title:T.td("Preview your app"),
            active:"active",
            label1:T.ts("Just click on the device and enter your unique ID"),
            label2:this.generateLinks(),
            content:this.getPreviewContentWeb()
          },
          {
            name:"preview_device",
            icon:"smartphone",
            title:"Test app on device",
            active:"active",
            label1:"Download our tester app",
            label2:"Login with your username and password",
            content:this.getPreviewContentDevice()
          }
        ]}
        />
        :
        <Wizzard 
          title={this.state.name?T.td("App Preview")+ ": " +this.state.name:T.td("App Preview")}
          steps={[{
            name:"preview",
            icon:"computer",
            title:T.td("Preview your app"),
            active:"active",
            label1:T.ts("Just click on the device and enter your unique ID"),
            label2:this.generateLinks(),
            content:this.getPreviewContentWeb()
          }]}
        />
      }
      </div>
    )
  }
}
export default Preview;