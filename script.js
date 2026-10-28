// 1. Pictures: click a dashed box to preview, or use data-src for a permanent file
document.querySelectorAll('.slot').forEach(function(slot){
  var input = slot.querySelector('input');
  function show(url){ slot.style.backgroundImage = 'url("' + url + '")'; slot.classList.add('filled'); }
  if (slot.dataset.src) show(slot.dataset.src);
  input.addEventListener('change', function(){
    if (input.files[0]) show(URL.createObjectURL(input.files[0]));
  });
});

// 2. Typing effect for your talent. Edit this list.
var talents = ['Beginner programmer', 'Cook', 'Musician','Artist'];
var el = document.getElementById('typed'), t = 0, c = 0, del = false;
(function type(){
  var word = talents[t];
  el.textContent = word.slice(0, c);
  if (!del && c === word.length){ del = true; return setTimeout(type, 1400); }
  if (del && c === 0){ del = false; t = (t + 1) % talents.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 45 : 90);
})();

// 3. Show / hide project details
document.querySelectorAll('.card button').forEach(function(b){
  b.addEventListener('click', function(){
    var card = b.closest('.card');
    var open = card.classList.toggle('open');
    b.textContent = open ? 'Hide details' : 'Show details';
  });
});

// 4. Depth gauge: you sink as you scroll
var dot = document.getElementById('dot'), depth = document.getElementById('depth');
var rays = document.getElementById('rays'), jelly = document.getElementById('jelly');
function onScroll(){
  var max = document.documentElement.scrollHeight - innerHeight;
  var p = max > 0 ? scrollY / max : 0;
  dot.style.top = (p * 100) + '%';
  depth.textContent = Math.round(p * 200) + ' m';
  rays.style.opacity = Math.max(0, 1 - p * 1.4);
  jelly.style.opacity = Math.min(.6, Math.max(0, (p - .25) * 1.3));
}
addEventListener('scroll', onScroll, {passive:true}); onScroll();

// 5. Highlight the current section in the nav
var links = document.querySelectorAll('nav a');
var io = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if (e.isIntersecting){
      links.forEach(function(a){ a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
    }
  });
}, {rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('header[id], section[id]').forEach(function(s){ io.observe(s); });

// 8. Floating specks in the water (drift upward, shift with scroll)
var cv = document.getElementById('snow'), cx = cv.getContext('2d'), W = 0, H = 0, ps = [], col = '#fff', n = 0;
var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
function size(){ W = cv.width = innerWidth; H = cv.height = innerHeight; }
size(); addEventListener('resize', size);
for (var i = 0; i < 80; i++) ps.push({x:Math.random(), y:Math.random(), r:.8 + Math.random()*2.4, s:.02 + Math.random()*.06, ph:Math.random()*6.28});
function draw(t){
  cx.clearRect(0, 0, W, H);
  if (n++ % 30 === 0) col = getComputedStyle(document.documentElement).getPropertyValue('--foam').trim() || '#fff';
  cx.fillStyle = col;
  ps.forEach(function(p){
    var y = (((p.y * H - t * p.s * .03 - scrollY * p.r * .15) % H) + H) % H;
    var x = p.x * W + Math.sin(t / 2000 + p.ph) * 14;
    cx.globalAlpha = .12 + p.r * .09;
    cx.beginPath(); cx.arc(x, y, p.r, 0, 6.283); cx.fill();
  });
  if (!still) requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// 6. Click effect: 3 to 6 bubbles of random size leave the click in different directions, then pop
addEventListener('click', function(e){
  if (still) return;
  var count = 3 + Math.floor(Math.random() * 4);
  for (var i = 0; i < count; i++){
    var b = document.createElement('div'), s = 8 + Math.random() * 26;
    var angle = (-160 + Math.random() * 140) * Math.PI / 180;   // fans out upward
    var dist = 70 + Math.random() * 110;
    var dx = Math.cos(angle) * dist, dy = Math.sin(angle) * dist;
    b.className = 'bubble';
    b.style.cssText = 'width:' + s + 'px;height:' + s + 'px;margin:-' + s/2 + 'px 0 0 -' + s/2 + 'px;left:' + e.clientX + 'px;top:' + e.clientY + 'px;--dx:' + dx + 'px;--dy:' + dy + 'px;--dur:' + (0.9 + Math.random() * 0.8) + 's';
    b.addEventListener('animationend', function(ev){
      var x = ev.currentTarget;
      if (x.classList.contains('pop')){ x.remove(); return; }
      x.style.translate = x.style.getPropertyValue('--dx') + ' ' + x.style.getPropertyValue('--dy');
      x.style.scale = '1';
      x.classList.add('pop');
    });
    document.body.appendChild(b);
  }
});

// 7. Color themes (remembered between visits)
var tbtn = document.querySelectorAll('.themes button');
function setTheme(n){
  document.documentElement.dataset.theme = n;
  tbtn.forEach(function(b){ b.classList.toggle('on', b.dataset.t === n); });
  try { localStorage.setItem('cv-theme', n); } catch(e){}
}
tbtn.forEach(function(b){ b.addEventListener('click', function(){ setTheme(b.dataset.t); }); });
var saved = 'ocean'; try { saved = localStorage.getItem('cv-theme') || 'ocean'; } catch(e){}
setTheme(saved);

document.getElementById('yr').textContent = new Date().getFullYear();
