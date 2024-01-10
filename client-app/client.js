const hostToLive = 'http://127.0.0.1:5000';
const socketServerUrl = 'https://besame-x2-mucho.onrender.com';

const socketClient = require('socket.io-client');
const client = socketClient(socketServerUrl);
const axios = require('axios');

client.on('connect', () => {
    console.log('connected');
});

client.on('disconnect', () => {
    console.log('connection lost');
});

client.on('forward-request', (req) => {
    axios({
        url: hostToLive + req.path,
        method: req.method.toLowerCase(),
        baseURL: req.path,
        headers: req.headers,
        params: req.args,
        data: req.body,
    })
        .then(function (response) {
            client.emit('forward-response', {data: response.data, statusCode: response.status, _id: req._id});
        })
        .catch((error) => {
            client.emit('forward-response', {data: error.response.data, statusCode: error.response.status, _id: req._id});
        })
})