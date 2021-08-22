import axios from 'axios';
import Links from '../routes/Links';

const AxiosClient = axios.create({
    baseURL: Links.base,
    withCredentials: false,
});

export default AxiosClient;