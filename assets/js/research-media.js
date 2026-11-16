(function(){
  'use strict';
  var videos=Array.from(document.querySelectorAll('video[controls]:not([data-autoplay])'));
  videos.forEach(function(video){
    video.addEventListener('play',function(){videos.forEach(function(other){if(other!==video)other.pause();});});
  });
  document.addEventListener('visibilitychange',function(){if(document.hidden)videos.forEach(function(v){v.pause();});});

  var loops=Array.from(document.querySelectorAll('video[data-autoplay]'));
  var visible=new Set();
  var userPaused=new Set();
  function sync(video){
    if(visible.has(video)&&!document.hidden&&!userPaused.has(video)){
      var playing=video.play();
      if(playing&&playing.catch)playing.catch(function(){});
    }else{video.pause();}
  }
  loops.forEach(function(video){
    video.muted=true;
    video.addEventListener('pause',function(){
      if(visible.has(video)&&!document.hidden)userPaused.add(video);
    });
    video.addEventListener('play',function(){
      userPaused.delete(video);
      if(!visible.has(video)||document.hidden)video.pause();
    });
  });
  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting&&entry.intersectionRatio>=.15)visible.add(entry.target);
        else visible.delete(entry.target);
        sync(entry.target);
      });
    },{threshold:[0,.15]});
    loops.forEach(function(video){observer.observe(video);});
  }else{
    loops.forEach(function(video){visible.add(video);sync(video);});
  }
  document.addEventListener('visibilitychange',function(){loops.forEach(sync);});
})();
