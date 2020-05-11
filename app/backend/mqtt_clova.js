const {client, requestData} = require('./mqtt');

// client.on('message', (topic, message) => {
//     // const clovaTopic = topic.split('/');
//     console.log(topic)
//     // if(clovaTopic[0] === 'clova'){
//         // const result = await requestData(clovaTopic.slice(1).join('/'));
//         // const pubTopic = ['clova', 'res', clovaTopic.slice(2)].join('/');
//         // console.log(result);
//         // client.publish(pubTopic, JSON.stringify(result));
//     // }
// })

console.log('ㄴㄹㄴㅁㄹㄴ')
  
client.subscribe('clova/req/hue/changeStatus/+')
client.subscribe('clova/req/hue/status')

client.on('message', function(topic, message){
    console.log(topic)
})