const appConfig = require('../../appConfig.json');
let stdPorts = [80, 443];

let apiUrl = appConfig['apiPath'];
let axiosConfig = {};
if (!(appConfig['apiPort'] in stdPorts)) {
  apiUrl += ':' + (process.env.PORT || appConfig['apiPort']);
  axiosConfig = { baseURL: apiUrl };
}

const axios = require('axios').default;
const api = axios.create(axiosConfig);

function getLogs() {
  return api.get('/ical').then(response => response.data);
}

function sendNewMessage(item) {
  return api.post('ical', item).then(response => response.data);
}

function clearAllLogs() {
  return api.delete('/ical').then(response => response.data);
}

module.exports = {
  getLogs,
  sendNewMessage,
  clearAllLogs
};
