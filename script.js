const menuToggle=document.getElementById("menuToggle");
const navLinks=document.getElementById("navLinks");
const themeToggle=document.getElementById("themeToggle");
const header=document.querySelector(".site-header");
const cursorGlow=document.querySelector(".cursor-glow");

menuToggle?.addEventListener("click",()=>{
  const open=navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded",String(open));
  menuToggle.innerHTML=open?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>';
});

document.querySelectorAll(".nav-links a").forEach(link=>{
  link.addEventListener("click",()=>{
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded","false");
    if(menuToggle) menuToggle.innerHTML='<i class="fa-solid fa-bars"></i>';
  });
});

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.1});
document.querySelectorAll(".reveal").forEach((el,index)=>{
  el.style.transitionDelay=Math.min(index*45,260)+"ms";
  revealObserver.observe(el);
});

const sections=document.querySelectorAll("main section[id]");
const navItems=document.querySelectorAll(".nav-links a");
const activeObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    navItems.forEach(item=>item.classList.remove("active"));
    document.querySelector(`.nav-links a[href="#${entry.target.id}"]`)?.classList.add("active");
  });
},{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(section=>activeObserver.observe(section));

const savedTheme=localStorage.getItem("dileep-theme");
if(savedTheme==="light")document.body.classList.add("light");

function updateThemeIcon(){
  if(!themeToggle)return;
  themeToggle.innerHTML=document.body.classList.contains("light")
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
  themeToggle.setAttribute("aria-label",document.body.classList.contains("light")?"Switch to dark mode":"Switch to light mode");
}
updateThemeIcon();

themeToggle?.addEventListener("click",()=>{
  document.body.classList.toggle("light");
  localStorage.setItem("dileep-theme",document.body.classList.contains("light")?"light":"dark");
  updateThemeIcon();
});

function updateHeader(){
  header?.classList.toggle("scrolled",window.scrollY>18);
}
updateHeader();
window.addEventListener("scroll",updateHeader,{passive:true});

window.addEventListener("mousemove",event=>{
  if(!cursorGlow||window.innerWidth<900)return;
  cursorGlow.style.left=event.clientX+"px";
  cursorGlow.style.top=event.clientY+"px";
});

window.addEventListener("keydown",event=>{
  if(event.key==="Escape"){
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded","false");
    if(menuToggle)menuToggle.innerHTML='<i class="fa-solid fa-bars"></i>';
  }
});
