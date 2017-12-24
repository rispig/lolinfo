
<template>
  <div>
    <search @summoner-found="onSearchComplete" />
    <summoner-info v-if="summoner" :summoner="summoner" />
  </div>
</template>

<script>
  import Search from '@/components/Search';
  import SummonerInfo from '@/components/SummonerInfo';

  export default {
    name: 'SearchPage',
    components: {
      search: Search,
      'summoner-info': SummonerInfo,
    },
    data() {
      return {
        summoner: null,
      };
    },
    methods: {
      onSearchComplete(err, data) {
        if (err) {
          console.log(err);
        } else {
          this.summoner = data;
        }
      },
    },
  };
</script>
