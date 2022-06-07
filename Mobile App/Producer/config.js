//Enter your email
exports.adminEmail="";

//Is is SaaS
exports.isSaaS=true;

//SMTP
//SMTP Settings - You can use your gmail accout
exports.SMTP={
    host: "smtp.sendgrid.net",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "apikey", // generated ethereal user
      pass: "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" // generated ethereal password
    }
  }

//Email from
exports.mailFrom="noreplay@appbuilder.online"

//Email Subjects
exports.subject="You app {appName} is ready";


//Email text
exports.mailText='<p>Hello {userName}!<br />. You can download your {appName} android app apk file on the following <a href="{androidAppLink}">link</a>.  Follow the provided instruction to make your iPhone app.</p>'

//Is testing
exports.isTesting=false;

//Is Cloud
exports.isCloud=false;

//Google Cloud Location
exports.cloudFunctionsArea='us-central1';