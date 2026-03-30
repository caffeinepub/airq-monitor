import OutCall "http-outcalls/outcall";

import Text "mo:core/Text";
import Option "mo:core/Option";
import Runtime "mo:core/Runtime";

// Use separate migration module!

actor {
  var flaskUrl : Text = "";
  var latestReading : Text = "";

  type Error = {
    #urlNotSet : Text;
    #requestFailed : Text;
    #other : Text;
  };

  public shared ({ caller }) func setFlaskUrl(url : Text) : async () {
    if (not url.startsWith(#text "http://") and not url.startsWith(#text "https://")) {
      Runtime.trap("Invalid URL: must start with http:// or https://");
    };
    flaskUrl := url;
  };

  public query ({ caller }) func getFlaskUrl() : async Text {
    flaskUrl;
  };

  public shared ({ caller }) func fetchSensorData() : async Text {
    if (flaskUrl == "") { Runtime.trap("Flask URL is not set") };

    let url = flaskUrl.concat("/sensor-data");
    let response = await fetchAndTransform(url);
    latestReading := response;
    response;
  };

  public query ({ caller }) func getLatestReading() : async Text {
    if (latestReading == "") {
      Runtime.trap("No cached sensor data available");
    };
    latestReading;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func fetchAndTransform(url : Text) : async Text {
    await OutCall.httpGetRequest(url, [], transform);
  };
};
