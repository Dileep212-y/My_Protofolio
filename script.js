gsap.registerPlugin(ScrollTrigger);
window.addEventListener("load",()=>{const l=document.querySelector(".loader");setTimeout(()=>{l.style.opacity="0";setTimeout(()=>l.remove(),800)},900)});

gsap.from(".hero-copy .kicker",{y:30,opacity:0,duration:1,ease:"power3.out",delay:.5});
gsap.from(".hero h1 span",{y:100,opacity:0,stagger:.12,duration:1.2,ease:"power4.out",delay:.45});
gsap.from(".hero-sub,.hero-cta",{y:25,opacity:0,duration:1,ease:"power3.out",delay:1});
gsap.from(".hero-photo",{scale:.7,opacity:0,rotation:-12,duration:1.5,ease:"expo.out",delay:.4});

gsap.to(".hero-copy",{y:-180,opacity:.15,scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});
gsap.to(".hero-photo",{y:230,rotation:18,scale:.72,scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});
gsap.to(".grid",{yPercent:20,scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub:1}});

gsap.from(".statement-inner",{y:120,opacity:0,scrollTrigger:{trigger:".statement",start:"top 70%",end:"center center",scrub:1}});
gsap.to(".w1",{x:-180,rotation:-12,scrollTrigger:{trigger:".statement",start:"top bottom",end:"bottom top",scrub:1}});
gsap.to(".w2",{x:200,rotation:8,scrollTrigger:{trigger:".statement",start:"top bottom",end:"bottom top",scrub:1}});
gsap.to(".w3",{x:-100,scrollTrigger:{trigger:".statement",start:"top bottom",end:"bottom top",scrub:1}});

const projects=gsap.utils.toArray(".project");
projects.forEach((p,i)=>{
 const copy=p.querySelector(".project-copy"),screen=p.querySelector(".screen"),shots=p.querySelectorAll(".shot");
 gsap.from(copy,{x:-120,opacity:0,scrollTrigger:{trigger:p,start:"top 75%",end:"top 30%",scrub:1}});
 gsap.from(screen,{x:260,rotationY:-24,rotationZ:i%2?2:-3,scale:.72,opacity:0,scrollTrigger:{trigger:p,start:"top 85%",end:"center center",scrub:1}});
 gsap.to(screen,{y:-70,rotationY:i%2?8:-2,scale:1.04,scrollTrigger:{trigger:p,start:"center center",end:"bottom top",scrub:1}});
 gsap.to(copy,{y:-80,scrollTrigger:{trigger:p,start:"center center",end:"bottom top",scrub:1}});
 if(shots.length){
   const tl=gsap.timeline({scrollTrigger:{trigger:p,start:"top top",end:"bottom bottom",scrub:1}});
   shots.forEach((shot,j)=>{
     const enter=j===0?0:j*0.23;
     tl.to(shot,{opacity:1,x:0,y:0,scale:1,duration:.18,ease:"power2.out"},enter)
       .to(shot,{opacity:j===shots.length-1?1:0,x:j%2? -55:55,y:j%2?25:-25,scale:.94,duration:.16,ease:"power2.in"},enter+.16);
   });
 }
});
gsap.from(".about-wrap",{y:100,opacity:0,scrollTrigger:{trigger:".about",start:"top 65%",end:"center center",scrub:1}});
gsap.from(".stack-cloud span",{y:80,opacity:0,stagger:.04,scrollTrigger:{trigger:".stack",start:"top 70%",end:"center center",scrub:1}});
gsap.from(".contact h2",{y:100,opacity:0,scrollTrigger:{trigger:".contact",start:"top 70%",end:"center center",scrub:1}});

document.querySelector(".menu")?.addEventListener("click",()=>document.body.classList.toggle("menu-open"));