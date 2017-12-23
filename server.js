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
app.use(express.static(__dirname + '/static'));

let cache = {};
app.get('/getSummoner', async (req, res, next) => {
  const {region, summoner} = req.query;
  const cacheKey = `${server}${summoner}`;
  var server = '';
  switch (region) {
    case 'EUNE':
      server = 'eun1.api.riotgames.com';
      break;
    case 'EUW':
      server = 'euw1.api.riotgames.com';
      break;
    case 'JP':
      server = 'jp1.api.riotgames.com';
      break;
    case 'KR':
      server = 'kr.api.riotgames.com';
      break;
    case 'LAN':
      server = 'la1.api.riotgames.com';
      break;
    case 'LAS':
      server = 'la2.api.riotgames.com';
      break;
    case 'NA':
      server = 'na1.api.riotgames.com';
      break;
    case 'OCE':
      server = 'oc1.api.riotgames.com';
      break;
    case 'TR':
      server = 'tr1.api.riotgames.com';
      break;
    case 'RU':
      server = 'ru.api.riotgames.com';
      break;
    default:
      server = '';
    }
  if (!cache[cacheKey] || (Date.now() - cache[cacheKey].lastUpdated >= 180000)) {
    console.log(!cache[cacheKey] ? 'New summoner' : 'Invalidating Cache');
    try {
      // Get basic summoner inf
      const summonerInfoResponse = await axios.get(`https://${server}/lol/summoner/v3/summoners/by-name/${summoner}?api_key=${getAPIKey()}`);

      // Find summoner's soloQ rank
      const summonerRankInfo = await axios.get(`https://${server}/lol/league/v3/positions/by-summoner/${summonerInfoResponse.data.id}?api_key=${getAPIKey()}
      `);

      // Get static resources CDN
      const realmsResponse = await axios.get(`https://${server}/lol/static-data/v3/realms?api_key=${getAPIKey()}
      `)

      // Get profile icons list
      const profileImagesResponse = await axios.get(`https://${server}/lol/static-data/v3/profile-icons?locale=en_US&api_key=${getAPIKey()}`)

      const soloQ = summonerRankInfo.data.filter(q => q.queueType === 'RANKED_SOLO_5x5')[0];
      const rank = `${soloQ.tier} ${soloQ.rank}`;

      const {x, y, w, h} = profileImagesResponse.data.data[summonerInfoResponse.data.profileIconId].image;

      const summonerJSON = {
        summonerId: summonerInfoResponse.data.id,
        accountId: summonerInfoResponse.data.accountId,
        name: summonerInfoResponse.data.name,
        level: summonerInfoResponse.data.summonerLevel,
        rank: soloQ.rank,
        tier: soloQ.tier,
        profileIcon: {
          url: `${realmsResponse.data.cdn}/${realmsResponse.data.n.profileicon}/img/${profileImagesResponse.data.type}/${profileImagesResponse.data.data[summonerInfoResponse.data.profileIconId].image.full}`,
        }
      }

      // Cache the response
      cache[cacheKey] = {
        data: summonerJSON,
        lastUpdated: Date.now(),
      }

    } catch (ex) {
      console.log(ex && ex.response ? ex.response.statusText || "" : "");
      res.status(ex && ex.response ? ex.response.status || 500 : 500);
      res.send(ex && ex.response ? ex.response.statusText || "" : "");
      return next();
    }
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(cache[cacheKey].data);
  return next();
});


app.listen(port, '0.0.0.0', async function onStart(err) {
  if (err) {
    console.log(err);
  }

  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

