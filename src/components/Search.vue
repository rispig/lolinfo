<template>
  <form @submit.prevent="onSubmit">
    <input
      name="summoner"
      type="text"
      value=""
      placeholder="Summoner Name"
      v-model="summoner"
    />
    <i class="fa fa-search"></i>
    <select
      name="region"
      v-model="region">
      <option disabled value="">Select region</option>
      <option v-for="region in regions"
        :key="region"
        :value="region">
          {{ region }}
      </option>
    </select>
    <button>Search</button>
  </form>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      regions: [
        'BR',
        'EUNE',
        'EUW',
        'JP',
        'KR',
        'LAN',
        'LAS',
        'NA',
        'OCE',
        'TR',
        'RU',
      ],
      summoner: '',
      region: '',
    };
  },
  methods: {
    onSubmit() {
      console.log(`Searching for ${this.summoner} in ${this.region}`);
      this.$router.push({
        path: '/SummonerInfo',
        query: {
          summoner: this.summoner,
          region: this.region,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  input[type="text"], .fa-search, select {
    position: relative;
  }

  input[type="text"] {
    padding-right: 20px;
  }

  .fa-search {
    left: -25px;
    font-size: 12px;
    color: #ccc;
  }

  select {
    left: -12px;
  }
</style>
