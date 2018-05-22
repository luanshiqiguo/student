/**
 * Created by crazycooler on 2016/11/27.
 */
var fs = require('fs');
var jsPath = fs.readdirSync('./build/static/js');
var jsSet = {};

var distStr = '<?php\nnamespace App\\Common;\nclass ResourceFiles\n{\nuse ResourceFilesTrait;\npublic $js = [\n';

jsPath.map(function(value){
  let matchValue = value.match(/^(.+)\.(.+)\.js$/);
  if(matchValue){
    jsSet[matchValue[1]] = value;
    distStr += '"' + matchValue[1] + '" => "' + value + '",\n';
  }
});

distStr += '];\npublic $css = [\n';



var cssPath = fs.readdirSync('./build/static/css');
var cssSet = {};

cssPath.map(function(value){
  let matchValue = value.match(/^(.+)\.(.+)\.css$/);
  if(matchValue){
    cssSet[matchValue[1]] = value;
    distStr += '"' + matchValue[1] + '" => "' + value + '",\n';
  }
});

distStr += '];\n}';

fs.writeFileSync('../webserver/app/Common/ResourceFiles.php',distStr);




