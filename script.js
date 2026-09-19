
document.addEventListener("DOMContentLoaded",()=>{
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target);}
    });
  },{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

  const links=[...document.querySelectorAll(".nav__links a")];
  const sections=[...document.querySelectorAll("main section[id]")];
  const navObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) links.forEach(link=>link.classList.toggle("is-active",link.getAttribute("href")==="#"+entry.target.id));
    });
  },{rootMargin:"-45% 0px -45% 0px",threshold:0});
  sections.forEach(section=>navObserver.observe(section));

  const menu=document.querySelector(".menu");
  const nav=document.querySelector(".nav__links");
  menu?.addEventListener("click",()=>{
    nav?.classList.toggle("open");
    menu.classList.toggle("is-open");
  });
  nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

  if(!reduce){
    document.querySelectorAll(".project__visual,.system-card").forEach(card=>{
      card.addEventListener("mousemove",event=>{
        if(innerWidth<981)return;
        const r=card.getBoundingClientRect(),x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5;
        card.style.transform="perspective(1200px) rotateX("+(-y*1.7)+"deg) rotateY("+(x*1.7)+"deg) translateZ(4px)";
      });
      card.addEventListener("mouseleave",()=>card.style.transform="");
    });
  }

  // React Bits-style hero effects: particle field, orbit rings, magnetic portrait.
  const visual=document.querySelector(".hero__visual");
  const photo=document.querySelector(".hero__photo");
  if(visual){
    const canvas=document.createElement("canvas");
    canvas.className="portrait-fx";
    visual.appendChild(canvas);
    const ctx=canvas.getContext("2d",{alpha:true});
    const dpr=Math.min(devicePixelRatio||1,2);
    let w=0,h=0,particles=[],mx=.5,my=.5;
    const resize=()=>{
      const r=visual.getBoundingClientRect();w=r.width;h=r.height;
      canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+"px";canvas.style.height=h+"px";ctx.setTransform(dpr,0,0,dpr,0,0);
      particles=Array.from({length:Math.min(150,Math.max(80,Math.floor(w*h/7000)))},(_,i)=>({
        x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,
        r:Math.random()*1.5+.35,a:Math.random()*.6+.15,p:Math.random()*Math.PI*2,orbit:i%3
      }));
    };
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      const t=performance.now()*.001;
      const px=w*mx,py=h*my;
      for(const p of particles){
        const dx=px-p.x,dy=py-p.y,d=Math.hypot(dx,dy)||1;
        if(d<150){p.vx+=dx/d*.004;p.vy+=dy/d*.004}
        p.vx*=.992;p.vy*=.992;p.x+=p.vx+Math.cos(t*.4+p.p)*.045;p.y+=p.vy+Math.sin(t*.35+p.p)*.045;
        if(p.x<-10)p.x=w+10;if(p.x>w+10)p.x=-10;if(p.y<-10)p.y=h+10;if(p.y>h+10)p.y=-10;
        const glow=p.orbit===0?"169,112,255":p.orbit===1?"103,217,255":"111,255,233";
        ctx.beginPath();ctx.fillStyle="rgba("+glow+","+p.a+")";ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
      }
      // Fine orbital arcs around the portrait.
      ctx.save();ctx.translate(w*.58,h*.51);ctx.rotate(t*.045);
      [180,245,310].forEach((rad,i)=>{
        ctx.beginPath();ctx.ellipse(0,0,rad,rad*(i===1?.38:.26),i*.45,0,Math.PI*2);
        ctx.strokeStyle=i===1?"rgba(103,217,255,.15)":"rgba(169,112,255,.14)";ctx.lineWidth=1;ctx.stroke();
      });
      ctx.restore();
      requestAnimationFrame(draw);
    };
    visual.addEventListener("pointermove",e=>{const r=visual.getBoundingClientRect();mx=(e.clientX-r.left)/r.width;my=(e.clientY-r.top)/r.height;});
    visual.addEventListener("pointerleave",()=>{mx=.5;my=.5});
    addEventListener("resize",resize);resize();draw();
    if(photo&&!reduce){
      visual.addEventListener("pointermove",e=>{
        const r=visual.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        photo.style.transform="perspective(1300px) rotateX("+(-y*4)+"deg) rotateY("+(x*5)+"deg) translateZ(10px)";
      });
      visual.addEventListener("pointerleave",()=>photo.style.transform="");
    }
    const badge=document.createElement("div");badge.className="motion-badge";badge.innerHTML="<i></i>LIVE NEURAL FIELD";visual.appendChild(badge);
  }

  // High-quality animated project visuals.
  const DPR=Math.min(devicePixelRatio||1,2);
  const setupCanvas=(el,renderer)=>{
    const c=document.createElement("canvas");c.className="project-motion";el.appendChild(c);el.classList.add("motion-ready");
    const x=c.getContext("2d");let W=0,H=0,raf=0;
    const resize=()=>{const r=c.getBoundingClientRect();W=r.width;H=r.height;c.width=W*DPR;c.height=H*DPR;x.setTransform(DPR,0,0,DPR,0,0);};
    addEventListener("resize",resize);resize();
    const loop=now=>{renderer(x,W,H,now*.001);raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(raf);
  };
  const rounded=(x,y,w,h,r)=>{x.beginPath();x.roundRect(y[0],y[1],w,h,r);};

  const eco=document.querySelector(".project__visual.eco");
  if(eco)setupCanvas(eco,(x,w,h,t)=>{
    x.clearRect(0,0,w,h);
    const cx=w*.36,cy=h*.51;
    // flowing data streams
    for(let k=0;k<7;k++){
      x.beginPath();
      for(let i=0;i<=90;i++){const u=i/90,xx=w*.05+u*w*.88,yy=h*(.16+k*.1)+Math.sin(u*9+t*(.8+k*.08)+k)*10+Math.sin(u*20-t)*4;x.lineTo(xx,yy);}
      x.strokeStyle="rgba(155,100,255,"+(.08+k*.012)+")";x.lineWidth=1;x.stroke();
    }
    // orbital vehicle intelligence
    [115,78,45].forEach((r,i)=>{x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.strokeStyle="rgba("+(i===1?"103,217,255":"169,112,255")+","+(i===1?".28":".17")+")";x.setLineDash([5,9]);x.lineDashOffset=-t*(18+i*8);x.stroke();x.setLineDash([]);});
    x.save();x.translate(cx,cy);x.rotate(Math.sin(t*.7)*.04);
    x.beginPath();x.roundRect(-62,-25,124,50,18);x.fillStyle="rgba(16,12,25,.92)";x.fill();x.strokeStyle="rgba(178,122,255,.8)";x.lineWidth=1.5;x.stroke();
    x.beginPath();x.moveTo(-31,-25);x.lineTo(-16,-43);x.lineTo(26,-43);x.lineTo(43,-25);x.strokeStyle="rgba(178,122,255,.7)";x.stroke();
    [-38,38].forEach(wx=>{x.beginPath();x.arc(wx,25,11,0,Math.PI*2);x.fillStyle="#08070b";x.fill();x.strokeStyle="rgba(103,217,255,.7)";x.stroke()});
    x.beginPath();x.moveTo(-25,-4);x.lineTo(35,-4);x.strokeStyle="#6fffe9";x.shadowBlur=12;x.shadowColor="#6fffe9";x.stroke();x.shadowBlur=0;x.restore();
    const labels=[["VEHICLE",.12,.18],["DRIVING",.74,.22],["FUEL",.77,.72],["ROUTE",.16,.78],["CARBON",.48,.86]];
    labels.forEach((a,i)=>{const px=w*a[1],py=h*a[2],pulse=5+Math.sin(t*2+i)*2;x.beginPath();x.arc(px,py,pulse,0,Math.PI*2);x.fillStyle=i%2?"#67d9ff":"#a970ff";x.shadowBlur=18;x.shadowColor=x.fillStyle;x.fill();x.shadowBlur=0;x.font="700 8px Manrope";x.fillStyle="rgba(210,205,220,.65)";x.fillText(a[0],px+10,py+3);});
  });

  const aqi=document.querySelector(".project__visual.aqi");
  if(aqi)setupCanvas(aqi,(x,w,h,t)=>{
    x.clearRect(0,0,w,h);
    const cx=w*.23,cy=h*.42,r=Math.min(92,h*.27);
    x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.strokeStyle="rgba(255,255,255,.06)";x.lineWidth=12;x.stroke();
    x.beginPath();x.arc(cx,cy,r,-Math.PI*.75,-Math.PI*.75+Math.PI*1.48);x.strokeStyle="#a970ff";x.lineWidth=12;x.lineCap="round";x.shadowBlur=22;x.shadowColor="#a970ff";x.stroke();x.shadowBlur=0;
    x.font="700 9px Manrope";x.fillStyle="#77707f";x.textAlign="center";x.fillText("AQI",cx,cy-8);
    x.font="800 48px Manrope";x.fillStyle="#f6f3fa";x.fillText("187",cx,cy+38);
    x.textAlign="left";
    // Live signal graph
    const gx=w*.43,gy=h*.14,gw=w*.51,gh=h*.62;
    x.strokeStyle="rgba(255,255,255,.045)";x.lineWidth=1;
    for(let i=0;i<7;i++){x.beginPath();x.moveTo(gx,gy+i*gh/6);x.lineTo(gx+gw,gy+i*gh/6);x.stroke();}
    for(let i=0;i<9;i++){x.beginPath();x.moveTo(gx+i*gw/8,gy);x.lineTo(gx+i*gw/8,gy+gh);x.stroke();}
    const series=(offset,amp,color,dash)=>{
      x.beginPath();
      for(let i=0;i<=100;i++){const u=i/100,xx=gx+u*gw,yy=gy+gh*.52+Math.sin(u*9+t*1.1+offset)*amp+Math.sin(u*24-t*.7)*amp*.32;x.lineTo(xx,yy);}
      x.strokeStyle=color;x.lineWidth=2;x.setLineDash(dash||[]);x.stroke();x.setLineDash([]);
    };
    series(0,gh*.22,"rgba(169,112,255,.9)");
    series(1.7,gh*.16,"rgba(103,217,255,.8)",[5,5]);
    // pollutant pulses
    const names=["PM2.5","PM10","NO₂","O₃","CO"],vals=[78,68,44,30,22];
    names.forEach((n,i)=>{const yy=gy+gh*.78+i*19;x.font="700 7px Manrope";x.fillStyle="#716b79";x.fillText(n,gx,yy);x.fillStyle="rgba(169,112,255,.8)";x.fillRect(gx+42,yy-6,(gw-55)*vals[i]/100,3);x.fillStyle="rgba(255,255,255,.16)";x.fillRect(gx+42+(gw-55)*vals[i]/100,yy-6,(gw-55)*(1-vals[i]/100),3);});
    x.textAlign="left";
  });

  const vision=document.querySelector(".project__visual.vision");
  if(vision)setupCanvas(vision,(x,w,h,t)=>{
    x.clearRect(0,0,w,h);
    const ix=w*.28,iy=h*.38,iw=w*.40,ih=h*.43;
    const grd=x.createLinearGradient(ix,iy,ix+iw,iy+ih);grd.addColorStop(0,"#30204b");grd.addColorStop(.5,"#6e4f7f");grd.addColorStop(1,"#10131b");
    x.fillStyle=grd;x.beginPath();x.roundRect(ix,iy,iw,ih,16);x.fill();
    // animated scene reconstruction
    x.fillStyle="rgba(255,207,135,.9)";x.beginPath();x.arc(ix+iw*.72,iy+ih*.25,20+Math.sin(t)*2,0,Math.PI*2);x.fill();
    x.fillStyle="#211b35";x.beginPath();x.moveTo(ix,iy+ih);x.lineTo(ix+iw*.43,iy+ih*.2);x.lineTo(ix+iw*.68,iy+ih*.66);x.lineTo(ix+iw,iy+ih*.34);x.lineTo(ix+iw,iy+ih);x.fill();
    x.fillStyle="#09090d";x.beginPath();x.arc(ix+iw*.5,iy+ih*.63,6,0,Math.PI*2);x.fill();x.fillRect(ix+iw*.485,iy+ih*.66,6,35);
    // neural feature points
    for(let i=0;i<24;i++){const px=ix+((i*37)%100)/100*iw,py=iy+((i*61)%100)/100*ih;x.beginPath();x.arc(px,py,1.5+Math.sin(t*2+i)*.7,0,Math.PI*2);x.fillStyle="rgba(111,255,233,.65)";x.fill();}
    const pipeY=h*.77, xs=[w*.15,w*.48,w*.8],titles=["VGG16","LSTM","CAPTION"];
    xs.forEach((px,i)=>{x.beginPath();x.roundRect(px-48,pipeY-25,96,50,10);x.fillStyle="rgba(15,12,21,.9)";x.fill();x.strokeStyle="rgba(169,112,255,.35)";x.stroke();x.font="800 10px Manrope";x.fillStyle="#b98aff";x.textAlign="center";x.fillText(titles[i],px,pipeY+4);if(i<2){x.beginPath();x.moveTo(px+55,pipeY);x.lineTo(xs[i+1]-55,pipeY);x.strokeStyle="rgba(103,217,255,.65)";x.setLineDash([5,6]);x.lineDashOffset=-t*15;x.stroke();x.setLineDash([]);}});
    x.textAlign="left";x.font="700 8px Manrope";x.fillStyle="rgba(205,198,216,.65)";x.fillText("IMAGE → FEATURES → SEQUENCE → LANGUAGE",w*.07,h*.12);
    x.font="600 13px Manrope";x.fillStyle="#eee9f4";x.fillText("A person standing near a scenic mountain landscape.",w*.07,h*.92);
  });

  // Systems lab: animated neural graph, signal field and metric constellation.
  const systems=document.querySelectorAll(".system-card");
  systems.forEach((card,index)=>{
    const c=document.createElement("canvas");c.className="system-motion";card.appendChild(c);card.classList.add("motion-ready");
    const label=document.createElement("div");label.className="motion-label";
    label.textContent=index===0?"LIVE AGENT GRAPH":index===1?"REAL-TIME MODEL SIGNAL":"MODEL CONSTELLATION";card.appendChild(label);
    const ctx=c.getContext("2d");let W=0,H=0,nodes=[];
    const resize=()=>{const r=c.getBoundingClientRect();W=r.width;H=r.height;c.width=W*DPR;c.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);
      nodes=Array.from({length:index===0?18:24},(_,i)=>({x:W*.08+Math.random()*W*.84,y:H*.18+Math.random()*H*.65,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:2+Math.random()*2}));};
    addEventListener("resize",resize);resize();
    const tick=now=>{
      const t=now*.001;ctx.clearRect(0,0,W,H);
      if(index===0){
        const core={x:W*.5,y:H*.52};
        nodes.forEach((p,i)=>{p.x+=p.vx+Math.sin(t*.5+i)*.04;p.y+=p.vy+Math.cos(t*.4+i)*.04;if(p.x<20||p.x>W-20)p.vx*=-1;if(p.y<70||p.y>H-25)p.vy*=-1;
          const d=Math.hypot(p.x-core.x,p.y-core.y);if(d<180){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(core.x,core.y);ctx.strokeStyle="rgba(169,112,255,"+(.28*(1-d/180))+")";ctx.lineWidth=1;ctx.setLineDash([3,7]);ctx.lineDashOffset=-t*18;ctx.stroke();ctx.setLineDash([]);}
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=i%3===0?"#67d9ff":"#a970ff";ctx.shadowBlur=12;ctx.shadowColor=ctx.fillStyle;ctx.fill();ctx.shadowBlur=0;
        });
        ctx.beginPath();ctx.arc(core.x,core.y,55+Math.sin(t*2)*4,0,Math.PI*2);ctx.fillStyle="rgba(169,112,255,.08)";ctx.fill();ctx.strokeStyle="rgba(169,112,255,.65)";ctx.stroke();
        ctx.font="800 24px Manrope";ctx.fillStyle="#f6f3fa";ctx.textAlign="center";ctx.fillText("AI",core.x,core.y+8);ctx.textAlign="left";
      }else if(index===1){
        const left=30,top=75,gw=W-60,gh=H-120;
        for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(left,top+i*gh/5);ctx.lineTo(left+gw,top+i*gh/5);ctx.strokeStyle="rgba(255,255,255,.04)";ctx.stroke();}
        ctx.beginPath();for(let i=0;i<=120;i++){const u=i/120,xx=left+u*gw,yy=top+gh*.5+Math.sin(u*12+t*1.3)*gh*.2+Math.sin(u*29-t)*gh*.08;ctx.lineTo(xx,yy);}ctx.strokeStyle="rgba(103,217,255,.85)";ctx.lineWidth=2;ctx.stroke();
        ctx.beginPath();for(let i=0;i<=120;i++){const u=i/120,xx=left+u*gw,yy=top+gh*.54+Math.sin(u*8+t*.8+1)*gh*.15;ctx.lineTo(xx,yy);}ctx.strokeStyle="rgba(169,112,255,.75)";ctx.lineWidth=1.5;ctx.stroke();
        for(let i=0;i<8;i++){const bx=left+i*gw/8+8,bh=gh*(.25+.2*(Math.sin(t*1.4+i)+1)/2);ctx.fillStyle="rgba(169,112,255,.15)";ctx.fillRect(bx,top+gh-bh,gw/13,bh);}
      }else{
        const cx=W*.5,cy=H*.52;
        nodes.forEach((p,i)=>{const a=i/nodes.length*Math.PI*2+t*.12,r=Math.min(W,H)*(.24+.05*Math.sin(t+i));p.x=cx+Math.cos(a)*r;p.y=cy+Math.sin(a)*r*.6;});
        nodes.forEach((p,i)=>{nodes.slice(i+1).forEach(q=>{const d=Math.hypot(p.x-q.x,p.y-q.y);if(d<70){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle="rgba(169,112,255,"+(1-d/70)*.3+")";ctx.stroke();}});ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fillStyle=i%4===0?"#6fffe9":"#a970ff";ctx.fill();});
        ctx.font="800 32px Manrope";ctx.fillStyle="#f6f3fa";ctx.textAlign="center";ctx.fillText("MODEL",cx,cy+5);ctx.font="700 7px Manrope";ctx.fillStyle="#766f80";ctx.fillText("SIGNAL CORE",cx,cy+20);ctx.textAlign="left";
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
});
