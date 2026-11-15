(function(){
  'use strict';
  var videos=Array.from(document.querySelectorAll('video[controls]'));
  videos.forEach(function(video){
    video.addEventListener('play',function(){videos.forEach(function(other){if(other!==video)other.pause();});});
  });
  document.addEventListener('visibilitychange',function(){if(document.hidden)videos.forEach(function(v){v.pause();});});
})();
