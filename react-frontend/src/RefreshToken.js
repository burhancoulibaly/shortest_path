import UserContext from "../UserContext";

axios.interceptors.request.use(
    function(request) {
        request.headers["Content-Type"] = 'application/json; charset=utf-8';
        request.headers["Accept"] = 'application/json';
        request.headers["authorization"] = user ? `Bearer ${user.accessToken}` : "";
        request.withCredentials = true;
        return request;
    },
    function(error) {
        return Promise.reject(error);
    }
);

  function RefreshToken(){

  }

  export default RefreshToken;