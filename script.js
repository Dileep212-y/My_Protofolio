const loader=document.getElementById("loader"),progress=document.querySelector(".progress span"),orbital=document.querySelector(".orbital"),projectRail=document.querySelector(".project-rail"),storyWords=[...document.querySelectorAll(".story-word")],storyCopy=document.getElementById("storyCopy"),storyTitle=document.getElementById("storyTitle"),menuBtn=document.getElementById("menuBtn");
window.addEventListener("load",()=>setTimeout(()=>{loader.style.opacity="0";loader.style.visibility="hidden";},1100));

const isTouch=matchMedia("(pointer:coarse)").matches;
const cursor=document.querySelector(".cursor"),ring=document.querySelector(".cursor-ring");
if(!isTouch){
document.body.insertAdjacentHTML("beforeend",'<style>.cursor{position:fixed;z-index:150;width:7px;height:7px;border-radius:50%;background:#57f4cf;pointer-events:none;mix-blend-mode:screen;transition:transform .08s}.cursor-ring{position:fixed;z-index:149;width:32px;height:32px;border:1px solid rgba(87,244,207,.5);border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);transition:width .25s,height .25s,border-color .25s}</style>');
let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;if(cursor){cursor.style.left=mx+"px";cursor.style.top=my+"px"}});
(function follow(){rx+=(mx-rx)*.14;ry+=(my-ry)*.14;if(ring){ring.style.left=rx+"px";ring.style.top=ry+"px"}requestAnimationFrame(follow)})();
document.querySelectorAll("a,button,.skill-node,.project-card").forEach(el=>{el.addEventListener("mouseenter",()=>{ring.style.width="55px";ring.style.height="55px";ring.style.borderColor="#57f4cf"});el.addEventListener("mouseleave",()=>{ring.style.width="32px";ring.style.height="32px";ring.style.borderColor="rgba(87,244,207,.5)"})});
}
menuBtn?.addEventListener("click",()=>{document.querySelector(".topbar nav").classList.toggle("mobile-open")});

const storyText=[
["Not just models.<br><em>Useful systems.</em>","I start with a problem, explore the data, build the intelligence and connect it to something people can use."],
["Data becomes<br><em>direction.</em>","Clean inputs and meaningful features turn raw information into something a model can reason about."],
["Agents become<br><em>action.</em>","Specialized agents can analyze different parts of a problem and bring their results together."],
["Ideas become<br><em>products.</em>","The final step is software people can interact with — not a notebook left behind."]
];

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function update(){
 const y=scrollY,max=document.documentElement.scrollHeight-innerHeight,p=max?y/max:0;
 progress.style.width=(p*100)+"%";
 if(orbital){
  const heroEnd=innerHeight*.8;
  const hp=clamp(y/heroEnd,0,1);
  orbital.style.transform="translate3d("+(-hp*50)+"px,"+(hp*80)+"px,0) scale("+(1-hp*.22)+") rotate("+hp*18+"deg)";
 }
 const story=document.getElementById("story"),sr=story.getBoundingClientRect();
 if(sr.top<0&&sr.bottom>innerHeight){
  const sp=clamp(-sr.top/(sr.height-innerHeight),0,1);
  const idx=Math.min(3,Math.floor(sp*4));
  storyWords.forEach((w,i)=>w.classList.toggle("active",i===idx));
  const data=storyText[idx];storyTitle.innerHTML=data[0];storyCopy.textContent=data[1];
  document.querySelector(".story-progress span").style.height=(18+sp*64)+"%";
 }
 const work=document.getElementById("work"),wr=work.getBoundingClientRect();
 if(wr.top<0&&wr.bottom>innerHeight){
  const wp=clamp(-wr.top/(wr.height-innerHeight),0,1);
  const maxShift=Math.max(0,projectRail.scrollWidth-innerWidth*.91);
  projectRail.style.transform="translate3d("+(-wp*maxShift)+"px,0,0)";
 }
}
addEventListener("scroll",update,{passive:true});update();

document.querySelectorAll(".magnetic").forEach(el=>{if(isTouch)return;el.addEventListener("mousemove",e=>{const r=el.getBoundingClientRect();el.style.transform="translate("+((e.clientX-r.left-r.width/2)*.12)+"px,"+((e.clientY-r.top-r.height/2)*.18)+"px)"});el.addEventListener("mouseleave",()=>el.style.transform="")});
document.querySelectorAll(".project-card").forEach(card=>card.addEventListener("mousemove",e=>{if(isTouch)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform="perspective(1000px) rotateY("+x*4+"deg) rotateX("+(-y*4)+"deg)"}));
document.querySelectorAll(".project-card").forEach(card=>card.addEventListener("mouseleave",()=>card.style.transform=""));

const navStyle=document.createElement("style");navStyle.textContent="@media(max-width:850px){.topbar nav.mobile-open{display:flex;position:absolute;top:70px;left:15px;right:15px;flex-direction:column;gap:0;padding:14px;background:rgba(8,10,14,.94);border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(18px);border-radius:12px}.topbar nav.mobile-open a{padding:13px;border-bottom:1px solid rgba(255,255,255,.06)}}";document.head.appendChild(navStyle);