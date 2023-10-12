
import {
    getAction,
    postAction,
    postForm
  } from '../manage';
  
    const path = process.env.VUE_APP_BASE_API_DATA;

    const apiModelPage = params => getAction(`${path}/center/apiModel/page`, params); 
    
  
  
  
  
    export {
        apiModelPage
  };
  
  