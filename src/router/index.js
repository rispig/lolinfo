import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
// import SummonerInfo from '@/components/SummonerInfo';
// import Search from '@/components/Search';
import SearchPage from '@/components/SearchPage';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/helloWorld',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    // {
    //   path: '/summonerInfo',
    //   name: 'SummonerInfo',
    //   component: SummonerInfo,
    // },
    // {
    //   path: '/',
    //   name: 'Search',
    //   component: Search,
    // },
    {
      path: '/',
      name: 'Search',
      component: SearchPage,
    },
  ],
});
