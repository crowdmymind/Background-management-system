import axios from 'axios';

//开始axios的配置 ,替代XMLHttpRequest

var server = axios.create({
      
       baseURL:"/",
       timeout:60000, //6秒
       headers:{ //所有的请求都会携带这个请求头
           'classes':1923
       }

})


export default server