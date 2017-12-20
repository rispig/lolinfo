<template>
  <div class="container">
    <div class="h-container" v-if="summonerInfo">
      <div v-if="profileIconStyle" :style="profileIconStyle"></div>
      <div class="v-container name-rank-container">
        <div>{{ summonerInfo.name }}</div>
        <div>{{ summonerInfo.rank }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LolInfo',
  data() {
    return {
      summonerInfo: null,
      profileIconStyle: null,
    };
  },
  created() {
    this.getSummonerInfo();
  },
  methods: {
    async getSummonerInfo() {
      this.summonerInfo = await (await fetch('/summonerInfo?summoner=N00B&server=euw1')).json();

      this.profileIconStyle = {
        background: `url(${this.summonerInfo.profileIcon.url}) ${this.summonerInfo.profileIcon.x}px ${this.summonerInfo.profileIcon.y}px`,
        height: `${this.summonerInfo.profileIcon.h}px`,
        width: `${this.summonerInfo.profileIcon.w}px`,
      };
    },
  },
};
</script>

<style scoped>
  .h-container, .v-container {
    display: flex;
  }

  .v-container {
    flex-direction: column;
  }

  .name-rank-container > div {
    flex: 1;
  }
</style>
