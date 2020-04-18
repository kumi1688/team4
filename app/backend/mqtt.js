var mqtt = require('mqtt');
var options = {
    host: '210.107.205.27',
    port: 1883,
    protocol: 'mqtt'
}
const client = mqtt.connect(options);

module.exports = client;