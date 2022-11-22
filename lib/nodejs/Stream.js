/*
| ------------------------------------------------------------------------------
| Stream
| ------------------------------------------------------------------------------
| const stream = require('./stream');
| stream.audio();
| stream.video();
| ------------------------------------------------------------------------------
*/
function stream(media) {
    const dir     = '/path/to/directory/from/media';
    const request = require('request');
    const http    = require('http');
    const fs      = require('fs');
    const server  = http.createServer(function (req, res) {
        if (media === 'audio') {
            req.pipe(request('https://iamradio.radioca.st/stream')).pipe(res);
        } else if (media === 'video') {
            res.writeHead(200, {'Content-Type' : 'video/mp4'});
            fs.createReadStream(dir + '/video.mp4').pipe(res);
            //req.pipe(request('https://domain.ext')).pipe(res);
        }
    });
    server.listen();
}
module.exports = {
  audio: function () {
    stream('audio');
  },
  video: function () {
    stream('video');
  }
};
