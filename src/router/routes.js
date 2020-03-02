let error404 = {
  path: "/*",
  name: "error404",
  meta: {
    title: "404-页面不存在"
  },
  component: () =>
    import(/* webpackChunkName: "error404" */ "@/views/Error/404.vue")
};

export default [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "@/views/Home.vue")
  },

  error404
];
