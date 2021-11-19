import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

axios.defaults.timeout = 5000;

export default axios.create({
  baseURL: BASE_URL,
});
