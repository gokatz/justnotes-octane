import Service from '@ember/service';
import { getCookie } from '../utils';

export default class StoreService extends Service {

  async makeRequest(url, options = {}) {
    let rootUrl = 'http://localhost:80';
    rootUrl = 'https://api.crosa.app:8443';

    let { method = 'get', data = {}, params = {} } = options;
    url = rootUrl + url;

    let searchParam = new URLSearchParams(params);
    params = searchParam.toString();
    
    if (params) {
      url += `?${params}`
    }
  
    let accessToken = getCookie('justpass');
  
    // Axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  
    let fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (accessToken && accessToken !== 'undefined') {
      fetchOptions.headers.Authorization = `Bearer ${accessToken}`
    }

    if (method && method !== 'get') {
      fetchOptions.body = JSON.stringify(data)
    }

    try {
      let response = await window.fetch(url, fetchOptions);
      // let json = await response.json();
      // return {
      //   data: json
      // };
      let responseJson = {}

      try {
        responseJson = await response.json();
      } catch(e) {
        // no op
      }

      if (response.ok) {
        return { data: responseJson };
      } else {
        throw responseJson;
      }
    } catch (error) {
      // Log network errors
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    }
  }
}
