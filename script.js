(() => {
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
window.addEventListener('load',()=>setTimeout(()=>$('#loader')?.classList.add('done'),700));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cursor=$('#cursor');
if(cursor&&!reduce){let tx=innerWidth/2,ty=innerHeight/2,x=tx,y=ty;addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY});(function loop(){x+=(tx-x)*.16;y+=(ty-y)*.16;cursor.style.left=x+'px';cursor.style.top=y+'px';requestAnimationFrame(loop)})();$$('a,.project-card,.node,.btn').forEach(el=>{el.addEventListener('mouseenter',()=>{cursor.style.width='54px';cursor.style.height='54px';cursor.style.background='rgba(169,75,62,.08)'});el.addEventListener('mouseleave',()=>{cursor.style.width='34px';cursor.style.height='34px';cursor.style.background='transparent'})})}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach(e=>io.observe(e));
const links=$$('.topbar nav a'), sections=$$('main section[id]');
const navio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -45% 0px'});sections.forEach(s=>navio.observe(s));
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;$('.progress i').style.transform='scaleX('+(max?scrollY/max:0)+')'},{passive:true});
const world=$('.hero-world'), char=$('.character');if(world&&!reduce){world.addEventListener('pointermove',e=>{if(innerWidth<901)return;const r=world.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;char.style.transform='translate3d('+(x*14)+'px,'+(y*8)+'px,30px) rotateY('+(x*5)+'deg) rotateX('+(-y*3)+'deg)'});world.addEventListener('pointerleave',()=>char.style.transform='')}
if(window.gsap&&!reduce){gsap.from('.hero-copy h1',{y:70,opacity:0,duration:1.3,ease:'power4.out',delay:1.0,stagger:.05});gsap.from('.door-frame',{scale:.82,opacity:0,duration:1.4,ease:'power3.out',delay:.7});gsap.to('.hero-world',{y:-18,scrollTrigger:null});}
const plane=$('.paper-plane');if(plane&&!reduce)plane.addEventListener('click',()=>document.querySelector('#contact').scrollIntoView({behavior:'smooth'}));
})();