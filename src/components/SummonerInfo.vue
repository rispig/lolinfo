<template>
  <div class="container">
    <div class="h-container summoner-info-container" v-if="summoner">
      <div class="profile-icon" v-if="profileIconStyle" :style="profileIconStyle" :data-level="summoner.level"></div>
      <div class="v-container name-rank-container">
        <div>{{ summoner.name }}</div>
        <div>{{ summoner.tier }} {{ summoner.rank }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SummonerInfo',
  props: ['summoner'],
  data() {
    return {
      profileIconStyle: null,
    };
  },
  created() {
    this.getProfileIconStyle();
  },
  methods: {
    getProfileIconStyle() {
      let borderColor = null;

      switch (this.summoner.tier) {
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
        'background-image': `url(${this.summoner.profileIcon.url})`,
      };
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
