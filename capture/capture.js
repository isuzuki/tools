phantom.casperPath = './casperjs';
phantom.injectJs(phantom.casperPath +'/bin/bootstrap.js');

var casper = require('casper').create();

if (casper.cli.args[0]) {
  var device = casper.cli.args[0];
  phantom.injectJs('user_agent.js');

  if (void 0 === user_agent[device]) {
    casper.echo('対象外のdeviceです');
    casper.exit(1);
  }

  // UA偽装
  casper.userAgent(user_agent[device]);
}

// 外部ファイルから対象page定義を読み込み
phantom.injectJs('pages.js');

// casper.start内で対象URLを接続させてキャプチャーを取りたいので、初回の接続先はダミーURLを指定
// 初回をダミーURL用いない書き方がわからない、、、
casper.start('http://www.google.co.jp', function() {
  this.each(pages, function(self, url) {
    self.thenOpen(url, function() {
      casper.capture('images/'+ getSafeName(url) +'.png');
    });
  });

}).run();

/**
 * urlを画像名にしているため、保存するのに安全な文字列に置換する
 */
function getSafeName(url) {
  var safeName = url.replace(/[\/\?&=]/gi, '-');
  return safeName.replace(/[^-_\d\w\.]/gi, '');
}
