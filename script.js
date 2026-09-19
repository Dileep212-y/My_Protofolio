document.addEventListener("DOMContentLoaded",()=>{
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
const nav=[...document.querySelectorAll(".header nav a")];
const sections=[...document.querySelectorAll("section[id]")];
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const lerp=(a,b,t)=>a+(b-a)*t;
const focusLabels=["AGENTIC SYSTEMS","PREDICTIVE MODELS","VISION + LANGUAGE"];

function update(){
 const vh=innerHeight;
 const scroll=scrollY;
 document.documentElement.style.setProperty("--scroll",scroll);
 sections.forEach(s=>{
   const rect=s.getBoundingClientRect();
   const progress=clamp((vh-rect.top)/(rect.height-vh));
   s.style.setProperty("--progress",progress);
 });
 const hero=document.querySelector(".hero");
 if(hero){
   const p=clamp((vh-hero.getBoundingClientRect().top)/(hero.offsetHeight-vh));
   hero.querySelector(".hero__copy").style.transform=`translateY(${lerp(-47,-72,p)}%) scale(${lerp(1,.88,p)})`;
   hero.querySelector(".hero__portrait").style.transform=`translate3d(${lerp(0,-7,p)}%,${lerp(0,5,p)}%,0) scale(${lerp(1,1.08,p)})`;
   hero.querySelector(".hero__backlight").style.transform=`translate(-50%,${lerp(-50,-35,p)}%) scale(${lerp(1,1.3,p)})`;
   hero.querySelector(".hero__grid").style.transform=`translateY(${p*80}px)`;
 }
 const projects=document.querySelector(".projects");
 if(projects){
   const p=clamp((vh-projects.getBoundingClientRect().top)/(projects.offsetHeight-vh));
   const cards=projects.querySelectorAll(".p-card");
   cards.forEach((card,i)=>{
     const targets=[
       {x:lerp(-4,0,p),y:lerp(10,-7,p),r:lerp(-5,2,p),z:0,s:lerp(.94,1,p)},
       {x:lerp(0,-25,p),y:lerp(-5,9,p),r:lerp(3,-5,p),z:-180,s:lerp(.92,1.02,p)},
       {x:lerp(0,-48,p),y:lerp(10,25,p),r:lerp(7,-3,p),z:-360,s:lerp(.84,1,p)}
     ][i];
     card.style.transform=`translate3d(${targets.x}vw,${targets.y}vh,${targets.z}px) rotate(${targets.r}deg) scale(${targets.s})`;
     card.style.opacity=clamp((p-(i*.12))/.45);
   });
   projects.querySelector(".project-progress i").style.width=(25+p*70)+"px";
   projects.querySelector(".project-progress span:first-of-type").textContent=p<.33?"01":p<.66?"02":"03";
   const focus=projects.querySelector(".project-focus strong");
   if(focus) focus.textContent=focusLabels[Math.min(2,Math.floor(p*3))];
 }
 const about=document.querySelector(".about");
 if(about){
   const p=clamp((vh-about.getBoundingClientRect().top)/(about.offsetHeight-vh));
   about.querySelector(".about__copy").style.transform=`translate3d(${lerp(-7,3,p)}vw,0,0)`;
   about.querySelector(".about__orb").style.transform=`scale(${lerp(.8,1.3,p)}) rotate(${p*30}deg)`;
   about.querySelector(".about__stats").style.transform=`translateY(${lerp(60,0,p)}px)`;
 }
 const lab=document.querySelector(".lab");
 if(lab){
   const p=clamp((vh-lab.getBoundingClientRect().top)/(lab.offsetHeight-vh));
   lab.querySelector(".lab__network").style.transform=`scale(${lerp(.75,1.05,p)}) rotate(${lerp(-4,2,p)}deg)`;
   lab.querySelector(".lab-core").style.boxShadow=`0 0 ${60+p*90}px rgba(155,92,255,.18)`;
 }
 const finale=document.querySelector(".finale");
 if(finale){
   const p=clamp((vh-finale.getBoundingClientRect().top)/(finale.offsetHeight-vh));
   finale.querySelector(".finale__portrait").style.transform=`translateX(${lerp(-50,-44,p)}%) translateY(${lerp(12,0,p)}%) scale(${lerp(.9,1.06,p)})`;
   finale.querySelector(".finale__copy").style.transform=`translateY(${lerp(70,0,p)}px)`;
   finale.querySelector(".finale__words").style.transform=`translateX(${lerp(80,0,p)}px)`;
 }
}
let ticking=false;
function raf(){if(!ticking){requestAnimationFrame(()=>{update();ticking=false}) ;ticking=true}}
addEventListener("scroll",raf,{passive:true});addEventListener("resize",raf);update();

const io=new IntersectionObserver(es=>es.forEach(e=>{
 if(e.isIntersecting){nav.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id))}
}),{rootMargin:"-45% 0px -45% 0px"});
sections.forEach(s=>io.observe(s));

const burger=document.querySelector(".burger");
burger?.addEventListener("click",()=>document.body.classList.toggle("menu-open"));
document.querySelectorAll(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>document.body.classList.remove("menu-open")));
const glow=document.querySelector(".cursor-glow");
if(glow && !reduce && matchMedia("(pointer:fine)").matches){
 addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";glow.style.opacity="1"},{passive:true});
 document.addEventListener("mouseleave",()=>glow.style.opacity="0");
}
document.querySelectorAll(".magnetic").forEach(el=>{
 el.addEventListener("pointermove",e=>{if(reduce)return;const r=el.getBoundingClientRect();const x=(e.clientX-(r.left+r.width/2))*.12;const y=(e.clientY-(r.top+r.height/2))*.12;el.style.transform=`translate(${x}px,${y}px)`});
 el.addEventListener("pointerleave",()=>el.style.transform="");
});

if(!reduce){
 document.querySelectorAll(".p-card").forEach(card=>{
   card.addEventListener("pointermove",e=>{
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.setProperty("--mx",x);card.style.setProperty("--my",y);
   });
 });
}
});