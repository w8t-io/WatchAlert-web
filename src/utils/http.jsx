/**
 * 网络请求配置
 */
import axios from 'axios';
const curUrl = window.location.hostname
const port = window.location.port;
const backendIP = curUrl + ":" + 80
const type = process.env.REACT_APP_TYPE
axios.defaults.timeout = 100000;
if (type === "local"){
    axios.defaults.baseURL = 'http://' + curUrl+":"+port;
} else {
    axios.defaults.baseURL = 'http://' + backendIP;
}
// axios.defaults.baseURL = 'http://127.0.0.1:9001/;

/**
 * http request 拦截器
 */
axios.interceptors.request.use(
    (config) => {
        //@ts-ignore
        config.headers = {
            'Content-Type': 'application/json',
            'TenantID': localStorage.getItem('TenantID'),
        };
        if (localStorage.getItem('Authorization')) {
            config.headers.Authorization = `Bearer ${localStorage.getItem('Authorization')}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * http response 拦截器
 */
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error?.response?.status === 401) {
            window.localStorage.removeItem('Authorization');
            window.history.replaceState(null, '', '/login');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params,
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then(
            (response) => {
                //关闭进度条
                resolve(response.data);
            },
            (err) => {
                reject(err);
            }
        );
    });
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.patch(url, data).then(
            (response) => {
                resolve(response.data);
            },
            (err) => {
                msag(err);
                reject(err);
            }
        );
    });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data).then(
            (response) => {
                resolve(response.data);
            },
            (err) => {
                msag(err);
                reject(err);
            }
        );
    });
}

//统一接口处理，返回数据
// eslint-disable-next-line import/no-anonymous-default-export
export default function (method, url, param) {
    return new Promise((resolve, reject) => {
        switch (method) {
            case 'get':
                get(url, param)
                    .then(function (response) {
                        resolve(response);
                    })
                    .catch(function (error) {
                        reject(error);
                    });
                break;
            case 'post':
                post(url, param)
                    .then(function (response) {
                        resolve(response);
                    })
                    .catch(function (error) {
                        console.error('get request POST failed.', error);
                        reject(error);
                    });
                break;
            default:
                break;
        }
    });
}

//失败提示
function msag(err) {
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                alert(err.response.data.error.details);
                break;
            case 401:
                alert('未授权，请登录');
                break;

            case 403:
                alert('拒绝访问');
                break;

            case 404:
                alert('请求地址出错');
                break;

            case 408:
                alert('请求超时');
                break;

            case 500:
                alert('服务器内部错误');
                break;

            case 501:
                alert('服务未实现');
                break;

            case 502:
                alert('网关错误');
                break;

            case 503:
                alert('服务不可用');
                break;

            case 504:
                alert('网关超时');
                break;

            case 505:
                alert('HTTP版本不受支持');
                break;
            default:
        }
    }
}