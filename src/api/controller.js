import axios from "axios";

export default {
  LIST_URL: "context/AutoTable_1",
  CREATE(data) {
    return axios.post("context/AutoTableCreate", data);
  },
  UPDATE(data) {
    return axios.post("context/AutoTableUpdate", data);
  },
  DELETE(data) {
    return axios.post("context//AutoTabelDelete", data);
  }
};
