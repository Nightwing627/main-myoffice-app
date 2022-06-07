var firebaseConfig = {
    "apiKey": process.env.REACT_APP_apiKey||"AIzaSyDsPufr5Dhusqal0bB8VDD9N6yv9u0Lo1E",
    "authDomain": process.env.REACT_APP_projectId?process.env.REACT_APP_projectId+".firebaseapp.com":"tester-8e38d.firebaseapp.com",
    "databaseURL": process.env.REACT_APP_projectId?"https://"+process.env.REACT_APP_projectId+(process.env.REACT_APP_databasePrefix?process.env.REACT_APP_databasePrefix:"")+".firebaseio.com":"https://tester-8e38d.firebaseio.com",
    "projectId": process.env.REACT_APP_projectId?process.env.REACT_APP_projectId:"tester-8e38d",
    "storageBucket": process.env.REACT_APP_projectId?process.env.REACT_APP_projectId+".appspot.com":"tester-8e38d.appspot.com",
    "messagingSenderId": "490493205074",
    "appId": process.env.REACT_APP_appId||"1:490493205074:web:273a77dc5505447a"
}; 
exports.config = firebaseConfig;