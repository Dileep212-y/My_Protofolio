document.addEventListener("DOMContentLoaded",()=>{
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

  const links=[...document.querySelectorAll(".nav__links a")];
  const sections=[...document.querySelectorAll("main section[id]")];
  const navObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        links.forEach(link=>link.classList.toggle("is-active",link.getAttribute("href")==="#"+entry.target.id));
      }
    });
  },{rootMargin:"-45% 0px -45% 0px",threshold:0});
  sections.forEach(section=>navObserver.observe(section));

  const menu=document.querySelector(".menu");
  const nav=document.querySelector(".nav__links");
  menu?.addEventListener("click",()=>{
    nav?.classList.toggle("open");
  });
  nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

  if(!reduce){
    document.querySelectorAll(".project__visual,.system-card").forEach(card=>{
      card.addEventListener("mousemove",event=>{
        if(innerWidth<981)return;
        const r=card.getBoundingClientRect();
        const x=(event.clientX-r.left)/r.width-.5;
        const y=(event.clientY-r.top)/r.height-.5;
        card.style.transform="perspective(1100px) rotateX("+(-y*1.5)+"deg) rotateY("+(x*1.5)+"deg)";
      });
      card.addEventListener("mouseleave",()=>card.style.transform="");
    });
  }
});