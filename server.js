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

let lastKeyUsed = 0;
const getAPIKey = function () {
  lastKeyUsed = ~lastKeyUsed + 2
  console.log('using key', apiKeys[lastKeyUsed]);

  return apiKeys[lastKeyUsed];
}

app.use(middleware);
app.use(webpackHotMiddleware(compiler));
app.use(express.static(__dirname));

let cache = {};
app.get('/summonerInfo', async (req, res, next) => {
  const {server, summoner} = req.query;
  const cacheKey = `${server}${summoner}`;
  if (!cache[cacheKey]) {

    try {
      // Get basic summoner inf
      const summonerInfoResponse = await axios.get(`https://${server}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summoner}?api_key=${getAPIKey()}`);

      // Find summoner's soloQ rank
      const summonerRankInfo = await axios.get(`https://${server}.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerInfoResponse.data.id}?api_key=${getAPIKey()}
      `);

      // Get static resources CDN
      const realmsResponse = await axios.get(`https://${server}.api.riotgames.com/lol/static-data/v3/realms?api_key=${getAPIKey()}
      `)

      // Get profile icons list
      const profileImagesResponse = await axios.get(`https://${server}.api.riotgames.com/lol/static-data/v3/profile-icons?locale=en_US&api_key=${getAPIKey()}`)
    } catch (ex) {
      res.sendStatus(500);
    }

    const soloQ = summonerRankInfo.data.filter(q => q.queueType === 'RANKED_SOLO_5x5')[0];
    const rank = `${soloQ.tier} ${soloQ.rank}`;

    const {x, y, w, h} = profileImagesResponse.data.data[summonerInfoResponse.data.profileIconId].image;

    const summonerJSON = {
      name: summonerInfoResponse.data.name,
      level: summonerInfoResponse.data.summonerLevel,
      rank: rank,
      profileIcon: {
        url: `${realmsResponse.data.cdn}/${realmsResponse.data.n.profileicon}/img/sprite/${profileImagesResponse.data.data[summonerInfoResponse.data.profileIconId].image.sprite}`,
        x: x,
        y: y,
        w: w,
        h: h
      }
    }

    // Cache the response
    cache[cacheKey] = summonerJSON;
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(cache[cacheKey]);
});


app.listen(port, '0.0.0.0', async function onStart(err) {
  if (err) {
    console.log(err);
  }

  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

