const {client, requestData} = require('./mqtt');

const clovaSubscribeList = [
    'clova/req/hue/property',
    'clova/req/hue/status/+'
];

clovaSubscribeList.forEach(function(topic){
    client.subscribe(topic)
})

client.on('message', async (topic, message) => {
    const clovaTopic = topic.split('/');
    if(clovaTopic[0] === 'clova'){
        const result = await requestData(clovaTopic.slice(1).join('/'));
        const pubTopic = ['clova', 'res', clovaTopic.slice(2)].join('/');
        client.publish(pubTopic, JSON.stringify(result));
    }
})