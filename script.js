document.addEventListener("DOMContentLoaded",()=>{
const loader=document.querySelector("#loader"),bar=document.querySelector(".loader-bar i");
if(window.gsap){gsap.to(bar,{width:"100%",duration:.9,ease:"power2.inOut"});gsap.to(loader,{autoAlpha:0,duration:.55,delay:.95,onComplete:()=>loader.remove()});
gsap.registerPlugin(ScrollTrigger);
gsap.from(".hero-left>*",{y:30,opacity:0,stagger:.07,duration:.8,delay:1.05,ease:"power3.out"});
gsap.from(".hero-portrait img",{y:60,opacity:0,scale:.92,duration:1.2,delay:1.1,ease:"power3.out"});
gsap.utils.toArray(".section").forEach(section=>{gsap.from(section.querySelectorAll(".section-head,.project-heading,.about-title,.about-copy,.skills-wrap,.resume-box,.contact-main"),{scrollTrigger:{trigger:section,start:"top 78%"},y:35,opacity:0,stagger:.08,duration:.75,ease:"power3.out"});});
gsap.utils.toArray(".project-card").forEach((card,i)=>{gsap.from(card.querySelector(".project-copy"),{scrollTrigger:{trigger:card,start:"top 75%"},x:-50,opacity:0,duration:.8,ease:"power3.out"});gsap.from(card.querySelector(".project-visual"),{scrollTrigger:{trigger:card,start:"top 75%"},x:70,opacity:0,scale:.94,duration:1,ease:"power3.out"});});
gsap.to(".hero-portrait img",{y:45,scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});
gsap.to(".page-glow",{rotation:25,scale:1.15,scrollTrigger:{trigger:"body",start:"top top",end:"bottom bottom",scrub:2}});
}
const frame=document.querySelector(".aqi-frame"),tabs=[...document.querySelectorAll(".aqi-tabs button")];
const positions=["left top","right top","left bottom","right bottom"];
function setShot(i){if(!frame)return;frame.style.backgroundPosition=positions[i];tabs.forEach((b,n)=>b.classList.toggle("active",n===i))}
tabs.forEach((b,i)=>b.addEventListener("click",()=>setShot(i)));setShot(1);
document.querySelector(".theme")?.addEventListener("click",()=>document.body.classList.toggle("soft"));
});
