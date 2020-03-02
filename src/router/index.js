import Vue from "vue";
import Router from "vue-router";
import _ from "lodash";
import store from "store";
import routes from "./routes";
Vue.use(Router);

const router = new Router({
  routes
});

router.beforeEach(async (to, from, next) => {
  const { token } = to.query;
  if (!_.isEmpty(token)) {
    store.set("token", token);
  }
  next();
});

export default router;
