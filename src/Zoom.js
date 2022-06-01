import React, { Component } from 'react';
import { ZoomMtg } from '@zoomus/websdk';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
const crypto = require('crypto-browserify');

function getMeetingConfig ({ meetingNumber, userName, passWord, role, userEmail }) {
  return {
    meetingNumber,
    userName,
    passWord,
    role,
    userEmail,
    signature: '',
  };
}

function serialize (obj) {
  // eslint-disable-next-line no-shadow
  const keyOrderArr = ['name', 'mn', 'email', 'pwd', 'role', 'lang', 'signature', 'china'];

  Array.intersect = function () {
    const result = new Array();
    const obj = {};
    for (let i = 0; i < arguments.length; i++) {
      for (let j = 0; j < arguments[i].length; j++) {
        const str = arguments[i][j];
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
    Object.defineProperty(Array.prototype, 'includes', {
      enumerable: false,
      value (obj) {
        const newArr = this.filter((el) => {
          return el === obj;
        });
        return newArr.length > 0;
      },
    });
  }

  const tmpInterArr = Array.intersect(keyOrderArr, Object.keys(obj));
  const sortedObj = [];
  keyOrderArr.forEach((key) => {
    if (tmpInterArr.includes(key)) {
      sortedObj.push([key, obj[key]]);
    }
  });
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      if (!tmpInterArr.includes(key)) {
        sortedObj.push([key, obj[key]]);
      }
    });
  const tmpSortResult = (function (sortedObj) {
    const str = [];
    for (const p in sortedObj) {
      if (typeof sortedObj[p][1] !== 'undefined') {
        str.push(
          `${encodeURIComponent(sortedObj[p][0])
          }=${encodeURIComponent(sortedObj[p][1])}`
        );
      }
    }
    return str.join('&');
  }(sortedObj));
  return tmpSortResult;
}

function generateSignature ({ apiKey, apiSecret, meetingNumber, role }) {
  // const timestamp = new Date().getTime() - 30000;
  // const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64');
  // const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64');
  // const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');
  // return signature;
}

// const sdkKey = 'VpkbpmeYvQfXOuhiL5z9gqfLBRd36CgekeGv';
// const sdkSecret = 'wrHWv5oJNYr7efPwbeouDh19tsVkl9dWogyx';
const apiKey = '3zB4UVKuTnO3pahE0s5-pA';
const apiSecret = 'wmachhwHZKVyBTqCfcpBXqUneU9kprcegAzB';
const meetingNumber = 87938006405;
const role = 0;
const leaveUrl = 'http://localhost:3000/dashboard';
const userName = 'webSDK';
const userEmail = 'korgov.vova@icloud.com';
const passWord = '6mHWjF';

export default class Zoom extends Component {
  // ../../../../node_modules/@zoomus/websdk/dist/lib
  async componentDidMount () {
    this.showZoom();
    // ZoomMtg.setZoomJSLib('https://source.zoom.us/2.4.0/lib', '/av');
    // ZoomMtg.preLoadWasm();
    // ZoomMtg.prepareJssdk();
    // ZoomMtg.i18n.load('en-US');
    // ZoomMtg.i18n.reload('en-US');
    this.initMeeting();
  }

  async initMeeting () {
    const meetingConfig = {
      apiKey,
      meetingNumber,
      userName,
      passWord,
      leaveUrl,
      role,
      userEmail,
      lang: tmpArgs.lang,
      signature: tmpArgs.signature || "",
      china: tmpArgs.china === "1",
      webEndpoint: "zoom.us"
    };
    console.log(meetingConfig);
    // const signature = generateSignature({
    //   meetingNumber: meetingConfig.meetingNumber,
    //   apiKey,
    //   apiSecret,
    //   role: meetingConfig.role,
    // });
    // const joinUrl = `?${serialize(meetingConfig)}`;
    // window.open(joinUrl, '_blank');

    const zmClient = ZoomMtgEmbedded.createClient();
    const rootElement = document.getElementById('ZoomEmbeddedApp');

    const tmpPort = window.location.port === "" ? "" : ":" + window.location.port;
    const avLibUrl =
      window.location.protocol +
      "//" +
      window.location.hostname +
      tmpPort +
      "/lib";

    zmClient
    .init({
      debug: true,
      zoomAppRoot: rootElement,
      assetPath: avLibUrl,
      language: meetingConfig.lang
    })
    .then((e) => {
      console.log("init success", e);
    })
    .catch((e) => {
      console.log("init error", e);
    });

  // WebSDK Embedded join
  zmClient
    .join({
      apiKey: meetingConfig.apiKey,
      signature: meetingConfig.signature,
      meetingNumber: meetingConfig.meetingNumber,
      userName: meetingConfig.userName,
      password: meetingConfig.password,
      userEmail: meetingConfig.userEmail
    })
    .then((e) => {
      console.log("join success", e);
    })
    .catch((e) => {
      console.log("join error", e);
    });
  }

  showZoom () {
    document.getElementById('zmmtg-root').style.display = 'block';
  }

  render () {
    return (
      <div id="ZoomEmbeddedApp">Zoom</div>
    );
  }
}
