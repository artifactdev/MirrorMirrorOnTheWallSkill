var awsIot = require('aws-iot-device-sdk');

var app = {}

app.TOPIC_MODULE = "MagicMirror:change-module"

app.setup = function() {
  app.device = awsIot.device({
    keyPath: __dirname + "/certs/MagicMirror.private.key",
    certPath: __dirname + "/certs/MagicMirror.cert.pem",
    caPath: __dirname + "/certs/root-CA.crt",
    clientId: "MirrorMirror" + (new Date().getTime()),
    region: "us-east-1",
  });

  app.device.on('connect', function() {
    console.log('connect');
  });

  app.device.on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
  });
}

// Method that will accept a Magic Mirror Module name and publish to AWS IoT
app.changeModule = function(moduleName, turnOn, callback) {
  var update = {
    "moduleName": moduleName,
    "turnOn": turnOn,
  };

  app.device.publish(app.TOPIC_MODULE, JSON.stringify(update), function() {
    console.log("Published: \nTopic => " + app.TOPIC_MODULE + "Data => " + JSON.stringify(update));
    callback()
  });
}

module.exports = app
