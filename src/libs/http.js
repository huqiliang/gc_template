import Vue from "vue";
import axios from "axios";
import { Message } from "iview";
import _ from "lodash";
import lcStore from "store";

Vue.prototype.$http = axios;

Message.config({
  duration: 3
});

axios.defaults.timeout = 60000;

axios.interceptors.request.use(
  config => {
    //这边可根据自己的需求设置headers，我司采用basic基本认证
    const authToken = lcStore.get("token");
    if (!_.isEmpty(authToken)) {
      config.headers["Authorization"] = authToken;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  err => {
    Message.error({
      content: "请求超时!"
    });
    return Promise.resolve(err);
  }
);
axios.interceptors.response.use(
  data => {
    if (data.status && (data.status != 200 || data.data.result != 0)) {
      Message.error({ content: data.data.msg || "未知错误" });
    }
    return data;
  },
  err => {
    if (err.response) {
      if (err.response.status == 504 || err.response.status == 404) {
        Message.error({ content: "服务器被吃了⊙﹏⊙∥" });
      } else if (err.response.status == 403) {
        Message.error({ content: "权限不足,请联系管理员!" });
      } else
        Message.error({
          content: `${err.response.status}：${err.response.statusText ||
            err.response.error}`
        });
    } else if (
      err.code === "ECONNABORTED" &&
      err.message.indexOf("timeout") !== -1
    ) {
      Message.error({
        content: "请求超时!"
      });
    } else {
      Message.error({ content: err.message || "未知错误!" });
    }
    return Promise.resolve(err);
  }
);
