const menuToggle=document.getElementById("menuToggle");
const navLinks=document.getElementById("navLinks");
const themeToggle=document.getElementById("themeToggle");
const header=document.querySelector(".header");
const progress=document.getElementById("pageProgress");

menuToggle?.addEventListener("click",()=>{
 const open=navLinks.classList.toggle("open");
 menuToggle.setAttribute("aria-expanded",String(open));
 menuToggle.innerHTML=open?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>';
});
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>{
 navLinks.classList.remove("open");
 menuToggle?.setAttribute("aria-expanded","false");
 if(menuToggle)menuToggle.innerHTML='<i class="fa-solid fa-bars"></i>';
}));

const revealObserver=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target);}
 });
},{threshold:.08});
document.querySelectorAll(".reveal").forEach((el,i)=>{
 el.style.transitionDelay=Math.min(i*35,240)+"ms";
 revealObserver.observe(el);
});

const sections=document.querySelectorAll("main section[id]");
const navItems=document.querySelectorAll(".nav-links a");
const activeObserver=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  navItems.forEach(a=>a.classList.remove("active"));
  document.querySelector(`.nav-links a[href="#${entry.target.id}"]`)?.classList.add("active");
 });
},{rootMargin:"-38% 0px -50% 0px"});
sections.forEach(section=>activeObserver.observe(section));

const savedTheme=localStorage.getItem("dileep-theme");
if(savedTheme==="dark")document.body.classList.add("dark");
function updateTheme(){
 if(!themeToggle)return;
 const dark=document.body.classList.contains("dark");
 themeToggle.innerHTML=dark?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>';
 themeToggle.setAttribute("aria-label",dark?"Switch to light theme":"Switch to dark theme");
}
updateTheme();
themeToggle?.addEventListener("click",()=>{
 document.body.classList.toggle("dark");
 localStorage.setItem("dileep-theme",document.body.classList.contains("dark")?"dark":"light");
 updateTheme();
});

function updateScroll(){
 const y=window.scrollY;
 header?.classList.toggle("scrolled",y>20);
 const max=document.documentElement.scrollHeight-window.innerHeight;
 if(progress)progress.style.width=(max>0?(y/max)*100:0)+"%";
}
updateScroll();
window.addEventListener("scroll",updateScroll,{passive:true});

window.addEventListener("keydown",e=>{
 if(e.key==="Escape"){
  navLinks?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded","false");
  if(menuToggle)menuToggle.innerHTML='<i class="fa-solid fa-bars"></i>';
 }
});