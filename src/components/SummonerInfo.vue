<template>
  <div class="container">
    <div class="h-container summoner-info-container" v-if="summonerInfo">
      <div class="profile-icon" v-if="profileIconStyle" :style="profileIconStyle" :data-level="summonerInfo.level"></div>
      <div class="v-container name-rank-container">
        <div>{{ summonerInfo.name }}</div>
        <div>{{ summonerInfo.tier }} {{ summonerInfo.rank }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SummonerInfo',
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
      const { summoner, region } = this.$route.query;
      try {
        this.summonerInfoResponse =
          await fetch(`/getSummoner?summoner=${summoner}&region=${region}`).then((res) => {
            if (!res.ok) {
              throw new Error(res.statusText || 'An unkown error has occurred\nPlease try again later');
            }
            return res;
          });
      } catch (ex) {
        alert(ex);
        return false;
      }

      this.summonerInfo = await this.summonerInfoResponse.json();

      let borderColor = null;
      switch (this.summonerInfo.tier) {
        case 'BRONZE':
          borderColor = '#cd7f32';
          break;
        case 'SILVER':
          borderColor = '#C0C0C0';
          break;
        case 'GOLD':
          borderColor = '#FFD700';
          break;
        case 'PLATINUM':
          borderColor = '#39c99b';
          break;
        case 'DIAMOND':
          borderColor = '#b9f2ff';
          break;
        default:
          borderColor = '#000';
      }

      this.profileIconStyle = {
        '--borderColor': borderColor,
        'background-image': `url(${this.summonerInfo.profileIcon.url})`,
      };

      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
  .h-container, .v-container {
    display: flex;
  }

  .v-container {
    flex-direction: column;
  }

  .summoner-info-container {
    background-color: #eee;
    padding: 20px;

    > .profile-icon{
      --borderColor: #cd7f32;

      height: 100px;
      width: 100px;
      border-radius: 50%;
      box-shadow: 0px 0px 10px 5px var(--borderColor);
      position: relative;
      background-size: 100%;

      &::before {
        content: attr(data-level);
        height: 20px;
        width: 20px;
        border-radius: 50%;
        position: absolute;
        top: -10px;
        left: calc(50% - 10px);
        background-color: black;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      }
    }
  }

  .name-rank-container {
    flex: 1;
    margin-left: 20px;

    >  div {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-start;
    }
  }
</style>
