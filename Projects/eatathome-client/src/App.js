import React from "react";

import Router from "./routes/router";

const App = () => {
  // React.useEffect(() => loadYoutubeApi());
  // const loadYoutubeApi = () => {
  //   // const script = document.createElement("script");
  //   // script.src = "https://apis.google.com/js/client.js";

  //   // script.onload = () => {
  //   //   gapi.load("client", () => {
  //   //     gapi.client.setApiKey(API_KEY);
  //   //     gapi.client.load("youtube", "v3", () => {
  //   //       this.setState({ gapiReady: true });
  //   //     });
  //   //   });
  //   // };

  //   // document.body.appendChild(script);
  //   // window.gapi.load("auth2", function() {
  //   //   window.gapi.auth2.init();
  //   // });
  // };
  return (
    <div>
      <Router />
    </div>
  );
};

export default App;
