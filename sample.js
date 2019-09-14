var fs = require('fs');
var jwt = require('jsonwebtoken');
var request = require('request');
var jsforce = require('jsforce');

var TOKEN_ENDPOINT_URL = 'https://login.salesforce.com/services/oauth2/token';
var ISSUER = '<clinet_id>'; // 接続アプリのコンシューマ鍵（client_id)
var AUDIENCE = 'https://login.salesforce.com'; // 固定

var cert = fs.readFileSync('./myapp.pem'); // 秘密鍵の読み込み

// JWTに記載されるメッセージの内容
var claim = {
  iss: ISSUER,
  aud: AUDIENCE,
  sub: '<user_name>', // 接続するSalesforceのユーザアカウント名
  exp: Math.floor(Date.now() / 1000) + 3 * 60 //現在時刻から3分間のみ有効
};

// JWTの生成と署名
var token = jwt.sign(claim, cert, { algorithm: 'RS256'});

// JWT Bearer Token フローによるアクセストークンのリクエスト
request({
  method: 'POST',
  url: TOKEN_ENDPOINT_URL,
  form: {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: token
  }
}, function(err, response, body) {
  if (err) {
    return console.error(err);
  }
  var ret = JSON.parse(body);
  console.log(ret);
  var conn = new jsforce.Connection({
    accessToken: ret.access_token,
    instanceUrl: ret.instance_url
  });
  conn.query('SELECT Id, Name FROM Account LIMIT 5').then(function(qr) {
    console.log('Done:', qr.done);
    console.log('Fetched Records:', qr.records);
  });
});
