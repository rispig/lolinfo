<template>
  <div class="container">
    <div class="profile-container">{{ summonerInfo }}</div>
  </div>
</template>

<script>
export default {
  name: 'LolInfo',
  data() {
    return {
      summonerInfo: null,
    };
  },
  created() {
    this.getSummonerInfo();
  },
  methods: {
    async getSummonerInfo() {
      this.summonerInfo = await (await fetch('/summonerInfo')).json();
    },
  },
};
</script>

<style scoped>

</style>
