import React, { Component } from 'react';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
export default class Zoom extends Component {
  async componentDidMount() {
    // this.showZoom();
    this.initMeeting();
  }

  parseQuery = () => {
    return (function () {
      var href = window.location.href;
      var queryString = href.substr(href.indexOf("?"));
      var query = {};
      var pairs = (queryString[0] === "?"
        ? queryString.substr(1)
        : queryString
      ).split("&");
      for (var i = 0; i < pairs.length; i += 1) {
        var pair = pairs[i].split("=");
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
      }
      return query;
    })();
  }

  async initMeeting() {
    // get meeting args from url
    var tmpArgs = this.parseQuery();
    var meetingConfig = {
      apiKey: tmpArgs.apiKey,
      meetingNumber: tmpArgs.mn,
      userName: tmpArgs.name,
      passWord: tmpArgs.pwd,
      leaveUrl: "/localhost:3001",
      role: tmpArgs.role,
      userEmail: tmpArgs.email,
      lang: tmpArgs.lang,
      signature: tmpArgs.signature || "",
      china: tmpArgs.china === "1",
    };

    // WebSDK Embedded init 
    var rootElement = document.getElementById('ZoomEmbeddedApp');
    var zmClient = ZoomMtgEmbedded.createClient();

    zmClient.init({
      debug: true,
      zoomAppRoot: rootElement,
      // assetPath: 'https://websdk.zoomdev.us/2.0.0/lib/av', //default
      webEndpoint: meetingConfig.webEndpoint,
      language: meetingConfig.lang,
    }).then((e) => {
      console.log('success', e);
    }).catch((e) => {
      console.log('error', e);
    });

    // WebSDK Embedded join 
    zmClient.join({
      apiKey: meetingConfig.apiKey,
      signature: meetingConfig.signature,
      meetingNumber: meetingConfig.meetingNumber,
      userName: meetingConfig.userName,
      password: meetingConfig.passWord,
      userEmail: meetingConfig.userEmail,
    }).then((e) => {
      console.log('success', e);
    }).catch((e) => {
      console.log('error', e);
    });
  }

  // showZoom() {
  //   document.getElementById('zmmtg-root').style.display = 'block';
  // }

  render() {
    return (
      <div id="ZoomEmbeddedApp">Zoom</div>
    );
  }
}
