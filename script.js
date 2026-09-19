document.addEventListener("DOMContentLoaded",()=>{
  const loader=document.querySelector("#loader");
  const bar=document.querySelector(".loader-bar i");
  requestAnimationFrame(()=>{if(bar)bar.style.width="100%"});
  setTimeout(()=>loader?.remove(),900);

  const ring=document.querySelector(".cursor-ring");
  const dot=document.querySelector(".cursor-dot");
  document.addEventListener("mousemove",e=>{
    if(dot){dot.style.left=e.clientX+"px";dot.style.top=e.clientY+"px"}
    if(ring){ring.style.left=e.clientX+"px";ring.style.top=e.clientY+"px"}
  });
  document.querySelectorAll("a,.project-card,.lab-card,.skill-cloud span").forEach(el=>{
    el.addEventListener("mouseenter",()=>ring?.classList.add("active"));
    el.addEventListener("mouseleave",()=>ring?.classList.remove("active"));
  });

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add("show")});
  },{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

  const cards=document.querySelectorAll(".project-card,.lab-card");
  cards.forEach(card=>{
    card.addEventListener("mousemove",e=>{
      if(window.innerWidth<901)return;
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.setProperty("--mx",(x*100)+"%");
      card.style.setProperty("--my",(y*100)+"%");
    });
    card.addEventListener("mouseleave",()=>{
      card.style.removeProperty("--mx");card.style.removeProperty("--my");
    });
  });

  document.querySelectorAll("[data-count]").forEach(el=>{
    const target=parseFloat(el.dataset.count);
    const decimals=String(target).includes(".")?1:0;
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        const duration=1100,t0=performance.now();
        const tick=now=>{
          const p=Math.min((now-t0)/duration,1);
          const eased=1-Math.pow(1-p,3);
          el.textContent=(target*eased).toFixed(decimals);
          if(p<1)requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);obs.unobserve(el);
      });
    },{threshold:.6});
    obs.observe(el);
  });

  const navLinks=[...document.querySelectorAll(".topbar nav a")];
  const sections=[...document.querySelectorAll("main section[id]")];
  const navObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+entry.target.id));
      }
    });
  },{rootMargin:"-40% 0px -50% 0px",threshold:0});
  sections.forEach(s=>navObserver.observe(s));

  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!reduce){
    document.addEventListener("scroll",()=>{
      document.documentElement.style.setProperty("--scroll-y",window.scrollY+"px");
    },{passive:true});
  }
});