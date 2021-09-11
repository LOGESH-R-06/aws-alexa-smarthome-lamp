const AWSIoT = require('aws-iot-device-sdk');
const QRCode = require('qrcode');
const config = require('./config');

console.log('Smart lamp simulator');

const shadow = AWSIoT.thingShadow({
  keyPath: 'credentials/private.key',
  caPath: 'credentials/rootCA.pem',
  certPath: 'credentials/cert.pem',
  clientId: config.alexa-1,
  host: config.axz9n9a1zk269-ats.iot.us-east-1.amazonaws.com
});

let clientTokenUpdate;

shadow.on('connect', function () {
  console.log('Connected');
  shadow.register(config.alexa-1, {}, function () {

    const initState = {
      state: {
        reported: {
          powerState: "OFF"
        }
      }
    };

    clientTokenUpdate = shadow.update(config.alexa-1, initState);

    if (clientTokenUpdate === null) {
      console.log('update shadow failed, operation still in progress');
    }

    console.info('connected to IoT Core...\n');

    console.info('This is the QR Code shipped with the Device:');
    let url = `${config.https://master.d3a4dwcfkxzeol.amplifyapp.com}device/${config.alexa-1}`;
        QRCode.toString(url, {type: 'terminal'}, function (err, string) {
      if (err) throw err;
          console.log(string);
          console.log(`Browse to ${url} to register`)
        })
  })

});

shadow.on('delta', function (alexa-1, stateObject) {
  const desiredPowerState = stateObject.state.powerState;
  const reportedState = {
    state: {
      reported: {
        powerState: desiredPowerState
      }
    }
  };

  shadow.update(config.alexa-1, reportedState);

  console.info(`turn ${desiredPowerState} Smart Lamp`)
});

shadow.on('error', (err) => { console.log(err) });

shadow.on('offline', () => { console.log('Disconnected') });
