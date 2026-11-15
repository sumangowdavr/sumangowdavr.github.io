(function(){
  'use strict';
  var section=document.getElementById('work');
  if(!section)return;
  var cards=Array.from(section.querySelectorAll('.work-card'));
  var videos=Array.from(section.querySelectorAll('video[data-preview]'));
  var toggle=section.querySelector('.preview-toggle');
  var filters=Array.from(section.querySelectorAll('.project-filter'));
  var status=section.querySelector('.project-status');
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  var paused=reduced.matches||!!(navigator.connection&&navigator.connection.saveData);
  var visible=new Set();
  var failed=new Set();
  function updateButton(){
    toggle.textContent=paused?'Play video previews':'Pause video previews';
    toggle.setAttribute('aria-pressed',String(!paused));
  }
  function sync(video){
    if(!paused&&!document.hidden&&visible.has(video)&&!video.closest('.work-card').hidden&&!failed.has(video)){
      if(!video.getAttribute('src'))video.src=video.dataset.src;
      var playing=video.play();
      if(playing&&playing.catch)playing.catch(function(){
        if(!paused&&!document.hidden&&visible.has(video)&&!video.closest('.work-card').hidden){
          paused=true;videos.forEach(function(v){v.pause();});updateButton();
        }
      });
    }else{video.pause();}
  }
  videos.forEach(function(v){v.muted=true;v.addEventListener('error',function(){failed.add(v);v.removeAttribute('src');v.load();});});
  if('IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){visible.add(e.target);}else{visible.delete(e.target);}sync(e.target);});},{threshold:.12});
    videos.forEach(function(v){observer.observe(v);});
  }else{videos.forEach(function(v){visible.add(v);});}
  toggle.addEventListener('click',function(){paused=!paused;updateButton();videos.forEach(sync);});
  document.addEventListener('visibilitychange',function(){videos.forEach(sync);});
  function motionChange(){paused=reduced.matches;updateButton();videos.forEach(sync);}
  if(reduced.addEventListener)reduced.addEventListener('change',motionChange);
  filters.forEach(function(button){
    var filter=button.dataset.filter;
    var count=cards.filter(function(card){return filter==='all'||card.dataset.category===filter;}).length;
    button.querySelector('span').textContent=count;
    button.addEventListener('click',function(){
      filters.forEach(function(b){b.setAttribute('aria-pressed',String(b===button));});
      cards.forEach(function(card){card.hidden=filter!=='all'&&card.dataset.category!==filter;});
      status.textContent='Showing '+count+' '+(count===1?'project':'projects');
      videos.forEach(sync);
    });
  });
  status.textContent='Showing '+cards.length+' projects';
  updateButton();
})();
