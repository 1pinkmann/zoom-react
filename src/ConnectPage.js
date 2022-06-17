import React, { useState } from 'react';
var crypto = require('crypto-browserify');

const API_KEY = '3zB4UVKuTnO3pahE0s5-pA';
const API_SECRET = 'wmachhwHZKVyBTqCfcpBXqUneU9kprcegAzB';

function ConnectPage() {
  const [form, setForm] = useState({
    name: '',
    meetingNumber: '',
    password: '',
    email: ''
  });

  const serialize = (obj) => {
    // eslint-disable-next-line no-shadow
    var keyOrderArr = ["name", "mn", "email", "pwd", "role", "lang", "signature", "china"];

    Array.intersect = function () {
      var result = new Array();
      var obj = {};
      for (var i = 0; i < arguments.length; i++) {
        for (var j = 0; j < arguments[i].length; j++) {
          var str = arguments[i][j];
          if (!obj[str]) {
            obj[str] = 1;
          } else {
            obj[str]++;
            if (obj[str] == arguments.length) {
              result.push(str);
            }
          }
        }
      }
      return result;
    };

    if (!Array.prototype.includes) {
      Object.defineProperty(Array.prototype, "includes", {
        enumerable: false,
        value: function (obj) {
          var newArr = this.filter(function (el) {
            return el === obj;
          });
          return newArr.length > 0;
        },
      });
    }

    var tmpInterArr = Array.intersect(keyOrderArr, Object.keys(obj));
    var sortedObj = [];
    keyOrderArr.forEach(function (key) {
      if (tmpInterArr.includes(key)) {
        sortedObj.push([key, obj[key]]);
      }
    });
    Object.keys(obj)
      .sort()
      .forEach(function (key) {
        if (!tmpInterArr.includes(key)) {
          sortedObj.push([key, obj[key]]);
        }
      });
    var tmpSortResult = (function (sortedObj) {
      var str = [];
      for (var p in sortedObj) {
        if (typeof sortedObj[p][1] !== "undefined") {
          str.push(
            encodeURIComponent(sortedObj[p][0]) +
              "=" +
              encodeURIComponent(sortedObj[p][1])
          );
        }
      }
      return str.join("&");
    })(sortedObj);
    return tmpSortResult;
  }

  const generateSignature = (props) => {
    const apiKey = props.apiKey;
    const apiSecret = props.apiSecret;
    const meetingNumber = props.meetingNumber;
    const role = props.role;
    // Prevent time sync issue between client signature generation and zoom 
    const timestamp = new Date().getTime() - 30000
    const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
    const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
    const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')
    if ('success' in props && props.success) {
      props.success(signature);
    }

    return signature
  }

  const getMeetingConfig = () => {
    return {
      mn: parseInt(form.meetingNumber),
      name: form.name,
      pwd: form.password,
      role: 0,
      email: form.email,
      lang: 0,
      signature: "",
      china: 0,
    };
  }

  const onChange = ({ target }) => {
    const name = target.name;
    setForm({ ...form, [name]: target.value });
  }

  const onJoin = () => {
    var meetingConfig = getMeetingConfig();
    if (!meetingConfig.mn || !meetingConfig.name) {
      alert("Meeting number or username is empty");
      return false;
    }

    var signature = generateSignature({
      meetingNumber: meetingConfig.mn,
      apiKey: API_KEY,
      apiSecret: API_SECRET,
      role: meetingConfig.role,
      success: function (res) {
        console.log(res);
        meetingConfig.signature = res;
        meetingConfig.apiKey = API_KEY;
        var joinUrl = "/cdn?" + serialize(meetingConfig);
        console.log(joinUrl);
        window.open(joinUrl, "_blank");
      },
    });
  }

  return (
    <nav id="nav-tool" className="navbar navbar-inverse navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">Zoom WebSDK Embedded</a>
        </div>
        <div className="websdktest">
          <form className="navbar-form navbar-right">
            <div className="form-group">
              <input type="text" defaultValue="2.4.0#CDN" value={form.name} name="name" maxLength={100} onChange={onChange} placeholder="Name" className="form-control" required />
            </div>
            <div className="form-group">
              <input type="text" value={form.meetingNumber} name="meetingNumber" maxLength={200} onChange={onChange} style={{ width: 150 }} placeholder="Meeting Number" className="form-control" required />
            </div>
            <div className="form-group">
              <input type="text" value={form.password} name="password" style={{ width: 150 }} onChange={onChange} maxLength={32} placeholder="Meeting Password" className="form-control" />
            </div>
            <div className="form-group">
              <input type="text" value={form.email} name="email" style={{ width: 150 }} onChange={onChange} maxLength={32} placeholder="Email option" className="form-control" />
            </div>
            <button className="btn btn-primary" onClick={onJoin}>Join</button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default ConnectPage
