import axios from "axios";
import config from "../../setting";

axios.defaults.timeout = config.API_TIME;
axios.defaults.headers.post["Content-Type"] = "application/json"; // 'application/x-www-form-urlencoded;charset=UTF-8';

/* axios.interceptors.request.use(
  config=>{
    return config
  },
  e =>{
    return Promise.error(e)
  }
)
axios.interceptors.response.use(
  response=>{
    return Promise.resolve(response);
  },
  e =>{
    return Promise.error(e.response)
  }
) */

export function get(url, params = {}) {
  // console.log(params,'params')
  return new Promise((resolve, reject) => {
    axios
      .get(config.API_ROOT + url, { params })
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e.data);
      });
  });
}

export function post(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios
      .post(config.API_ROOT + url, { params })
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e.data);
      });
  });
}
