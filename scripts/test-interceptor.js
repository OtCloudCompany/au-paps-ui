const axios = require('axios');

console.log('Testing http.request patch via axios...');
axios.get('https://sandbox.dspace.org/server/api')
    .then(res => {
        console.log('Axios success:', res.status);
    })
    .catch(err => {
        console.error('Axios error:', err.message);
    });

console.log('Testing global.fetch patch...');
fetch('https://sandbox.dspace.org/server/api')
    .then(res => {
        console.log('Fetch success:', res.status);
    })
    .catch(err => {
        console.error('Fetch error:', err.message);
    });
