const env = require('node-env-file');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('./build/webpack.dev.conf');
const config = require('./config');
const axios = require('axios');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = config[isDeveloping ? 'dev' : 'build'].port;

const app = express();

const compiler = webpack(webpackConfig);
const middleware = webpackMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
});

env(__dirname + '/.env');

const apiKeys = [process.env.API_KEY, process.env.ALT_API_KEY];
const lastKeyUsed = 0;
const getAPIKey = function () {
  return apiKeys[~lastKeyUsed + 2];
}

app.use(middleware);
app.use(webpackHotMiddleware(compiler));
app.use(express.static(__dirname));

app.get('/summonerInfo', async (req, res, next) => {
  const {server, summoner} = req.query;

  const summonerInfoResponse = await axios.get(`https://${server}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summoner}?api_key=${getAPIKey()}`);

  const summonerRankInfo = await axios.get(`https://${server}.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerInfoResponse.data.id}?api_key=${getAPIKey()}
  `);

  const soloQ = summonerRankInfo.data.filter(q => q.queueType === 'RANKED_SOLO_5x5')[0];
  const rank = `${soloQ.tier} ${soloQ.rank}`;

  const realmsResponse = await axios.get(`https://${server}.api.riotgames.com/lol/static-data/v3/realms?api_key=${getAPIKey()}
  `)

  const profileImagesResponse = await axios.get(`https://${server}.api.riotgames.com/lol/static-data/v3/profile-icons?locale=en_US&api_key=${getAPIKey()}`)

  const summonerJSON = {
    name: summonerInfoResponse.data.name,
    level: summonerInfoResponse.data.summonerLevel,
    rank: rank,
    profileIcon: {
      url: `${realmsResponse.data.cdn}/${realmsResponse.data.n.profileicon}/img/sprite/${profileImagesResponse.data.data[summonerInfoResponse.data.profileIconId].image.sprite}`,
      x: profileImagesResponse.data.data[summonerInfoResponse.data.profileIconId].image.x,
      y: profileImagesResponse.data.data[summonerInfoResponse.data.profileIconId].image.y,
      w: profileImagesResponse.data.data[summonerInfoResponse.data.profileIconId].image.w,
      h: profileImagesResponse.data.data[summonerInfoResponse.data.profileIconId].image.h
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(summonerJSON);
});


app.listen(port, '0.0.0.0', async function onStart(err) {
  if (err) {
    console.log(err);
  }

  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

