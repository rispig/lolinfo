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

app.use(middleware);
app.use(webpackHotMiddleware(compiler));
app.use(express.static(__dirname));

app.get('/summonerInfo', async (req, res, next) => {
  const summonerInfoResponse = await axios.get('https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/N00B?api_key=RGAPI-d340ff04-c8a2-4765-a35b-933eff23b951');

  res.setHeader('Content-Type', 'application/json');
  res.send(summonerInfoResponse.data);
});

app.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});

