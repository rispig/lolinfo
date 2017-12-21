import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import LolInfo from '@/components/LolInfo';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/helloWorld',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/',
      name: 'LolInfo',
      component: LolInfo,
    },
  ],
});
