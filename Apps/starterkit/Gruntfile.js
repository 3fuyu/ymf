module.exports = function(grunt) {
  var fs = require('fs');
  var path = require('path');

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');




  var main = ["../../js/main"]
  var dir = "../../components";
  var yycomponents = fs.readdirSync(dir);
  for(var i=0,j=yycomponents.length;i<j;i++){
    var name = yycomponents[i].split(".js")[0];
    yycomponents[i] = dir+"/"+ name;
  }
  main = main.concat(yycomponents);


try{
  var customerDir = "./components";
  var customerComponents = fs.readdirSync(customerDir);
  for(var i=0,j=customerComponents.length;i<j;i++){
    var name = customerComponents[i].split(".js")[0];
    customerComponents[i] = customerDir+"/"+ name;
  }
  main = main.concat(customerComponents);




}catch(e){
  console.log(e);
}


dir = "./pages";
var pages = fs.readdirSync(dir);
for(var i=0,j=pages.length;i<j;i++){
  var name = pages[i].split(".js")[0];
  console.log(name);

  pages[i] = dir+"/"+  name;
}
main = main.concat(pages);


var libdir = "./libs";
var libs = fs.readdirSync(libdir);
for(var i=0,j=libs.length;i<j;i++){
  var name = libs[i].split(".js")[0];
  libs[i] = libdir+"/"+ name;
}
main = main.concat(libs);



  main.push("$");

  console.log(__dirname);
  console.log(main);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ["./pages/**.js","./logic/**.js","../../js/**.js"]
    },
    requirejs:{
      compile: {
                "options": {
                    "baseUrl": "./",
                    "paths": {
                        "$":"../../libs/zepto",
                        "pm":"../../js/pageViewManager",
                        "base":"../../components/base",
                        "pageview":"../../components/pageview",
                        "utils":"../../js/utils",
                        "calendar":"../../components/calendar",
                        "swiper":"../../components/swiper",
                        "tip":"../../components/tip"
                    },
                    "include": main,
                    "out": "./dist/js/main.min.js"
                }
              },
            },
            cssmin: {
              compress: {
                files: {
                  'dist/css/common.min.css': [
                  "../../css/**.css",
                  "./css/**.css"
                ]
                }
              }
            },
            copy: {
                main: {
                  files: [
                        {src: ['../../fonts/**'],dest: './dist/fonts/*/'},
                        {src: ['./fonts/**'],dest: './dist/'},
                       {src: ['../../libs/**'],dest: './dist/libs/*/'},
                       {src: ['./imgs/**'],dest: './dist/'},
                  ],
                },
              }
});

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // 默认被执行的任务列表。
  grunt.registerTask('build', ["jshint",'requirejs','cssmin','copy']);

};
