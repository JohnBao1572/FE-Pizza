import axios from "axios";
import { error } from "console";
import { config } from "process";
import queryString from "query-string";
import { appInfo } from "../constants/appInfos";

const axiosClient = axios.create({
    baseURL: appInfo.baseUrl,
    // paramsSerializer: (params) => queryString.stringify(params),
    paramsSerializer: (params) => queryString.stringify(params),
});

const getAccesstoken = () => {
	const res = localStorage.getItem('authData');

	return res ? JSON.parse(res).accesstoken : '';
};

axiosClient.interceptors.request.use(async (config: any) => {
    const accesstoken = getAccesstoken(); 

    // FIxing
    // console.log("Request URL:", config.url); // Log URL để kiểm tra
    // console.log("Request Data:", config.data); // Log Data để kiểm tra

    config.headers = {
        Authorization: accesstoken ? `Bearer ${accesstoken}` : '',
        Accept: 'application/json',
        ...config.headers,
    }

    return {...config, data:config.data ?? undefined};
});

axios.interceptors.response.use(
    (res) => {
        if (res.data && res.status >= 200 && res.status < 300) {
            return res.data.data;
        } else {
            return Promise.reject(res.data)
        }
    },
    (error) => {
        const { response } = error;

        console.error("Response error:", response); // Log error response để kiểm tra

        return Promise.reject(response.data);
    }
)

export default axiosClient;