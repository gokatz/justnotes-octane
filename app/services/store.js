import Service from '@ember/service';
import { getCookie } from '../utils';

export default class StoreService extends Service {

  async makeRequest(url, options = {}) {
    let rootUrl = 'http://varun-3902.csez.zohocorpin.com:8080';
    // rootUrl = 'http://varun-3902:8080';
    rootUrl = 'http://localhost:8080';
    let { method = 'get', data = {}, params = {} } = options;
    url = rootUrl + url;
  
    let accessToken = getCookie('justpass');
  
    // Axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  
    let fetchOptions = {
      method,
      params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    };

    if (method && method !== 'get') {
      fetchOptions.body = JSON.stringify(data)
    }

    try {
      let response = await window.fetch(url, fetchOptions);
      let json = await response.json();
      return {
        data: json
      };
    } catch (error) {
      // Log network errors
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  }
}
