import React,{Suspense,useEffect,useMemo,useRef,useState} from "react";
import {Canvas,useFrame,useThree} from "@react-three/fiber";
import {Float,Text,OrbitControls,Environment} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import {ArrowDown,ArrowUpRight,Volume2,VolumeX,Menu,X, Github, Mail, MapPin, Sparkles} from "lucide-react";

const projects=[
 {id:"01",title:"EcoDrive AI",type:"AGENTIC AI",desc:"An end-to-end vehicle carbon footprinter combining multi-agent reasoning, fuel prediction, driving analysis, route optimization and carbon impact.",stack:["Google ADK","FastAPI","React","ML"],link:"https://vehicle-carbon-agent.netlify.app"},
 {id:"02",title:"Air Quality Prediction",type:"MACHINE LEARNING",desc:"A pollution intelligence application using environmental features and machine learning to predict AQI and classify air-quality severity.",stack:["XGBoost","Random Forest","Python","PyQt5"],link:"https://github.com/Dileep212-y/AQI-Prediction-Application"},
 {id:"03",title:"Image Caption Generator",type:"DEEP LEARNING",desc:"A CNN + LSTM image-captioning system trained around visual features from the Flickr8k dataset.",stack:["VGG16","CNN","LSTM","Flickr8k"],link:"https://github.com/Dileep212-y/Image-Caption-Generator"},
 {id:"04",title:"Telugu AI Voice Companion",type:"GENERATIVE AI",desc:"A Telugu-first voice companion with conversational input, Gemini-powered responses, FastAPI and speech synthesis.",stack:["React","FastAPI","Google GenAI","edge-tts"],link:"https://github.com/Dileep212-y"}
];

function Paper({w=10,h=10,depth=.18,position=[0,0,0],rotation=[0,0,0],color="#efe7d7"}){return <mesh position={position} rotation={rotation} castShadow receiveShadow><boxGeometry args={[w,h,depth]}/><meshStandardMaterial color={color} roughness={.92}/></mesh>}
function PencilLines({z=0}){return <group position={[0,0,z]}><mesh position={[-5.6,2.7,0]} rotation={[0,0,-.06]}><boxGeometry args={[2.4,.025,.025]}/><meshBasicMaterial color="#26231f"/></mesh><mesh position={[5.4,-2.6,0]} rotation={[0,0,.08]}><boxGeometry args={[1.7,.018,.018]}/><meshBasicMaterial color="#26231f"/></mesh></group>}

function Corridor({section}){return <group>
 <Paper w={14} h={.22} position={[0,-4,0]} color="#cdbfa8"/><Paper w={14} h={.22} position={[0,4,0]} color="#e8dfcf"/>
 <Paper w={.22} h={8} position={[-7,0,0]} color="#d7c9b4"/><Paper w={.22} h={8} position={[7,0,0]} color="#d7c9b4"/>
 {[...Array(9)].map((_,i)=><group key={i} position={[0,0,-i*6]}>
   <mesh position={[-6.9,1.4,0]}><boxGeometry args={[.08,2.8,.08]}/><meshBasicMaterial color="#24211d"/></mesh>
   <mesh position={[6.9,1.4,0]}><boxGeometry args={[.08,2.8,.08]}/><meshBasicMaterial color="#24211d"/></mesh>
   <Text position={[-5.9,2.8,.2]} rotation={[0,0,0]} fontSize={.22} color="#3d3932" anchorX="left">SKETCH / {String(i+1).padStart(2,"0")}</Text>
 </group>)}
 <Text position={[0,2.2,-8]} fontSize={.85} color="#2a2723" anchorX="center">DILEEP BODDU</Text>
 <Text position={[0,1.35,-8]} fontSize={.27} color="#655e54" anchorX="center">AI / ML DEVELOPER · DATA SCIENCE · AGENTIC AI</Text>
 </group>}

function Character(){return <Float speed={1.2} rotationIntensity={.02} floatIntensity={.16}><group position={[0,-.9,-4.5]}>
 <mesh position={[0,0,.04]}><planeGeometry args={[4.2,6.8]}/><meshBasicMaterial transparent opacity={.0}/></mesh>
 <Text position={[0,-3.45,.1]} fontSize={.2} color="#4c463d">THE BUILDER</Text>
 </group></Float>}

function CameraRig({entered}){const {camera}=useThree();const target=useRef(new THREE.Vector3(0,0,entered?5:27));const mouse=useRef({x:0,y:0});
 useEffect(()=>{const f=e=>{mouse.current.x=(e.clientX/innerWidth-.5);mouse.current.y=(e.clientY/innerHeight-.5)};addEventListener("pointermove",f);return()=>removeEventListener("pointermove",f)},[]);
 useFrame((_,d)=>{target.current.z=entered?5:27;camera.position.z=THREE.MathUtils.damp(camera.position.z,target.current.z,.9,d);camera.position.x=THREE.MathUtils.damp(camera.position.x,mouse.current.x*1.3,.8,d);camera.position.y=THREE.MathUtils.damp(camera.position.y,mouse.current.y*-.65,.8,d);camera.lookAt(mouse.current.x*.25,mouse.current.y*-.1,entered?-6:0)});
 return null}

function Scene({entered}){return <><color attach="background" args={["#e8dfcf"]}/><fog attach="fog" args={["#e8dfcf",12,58]}/><ambientLight intensity={1.4}/><directionalLight position={[4,8,10]} intensity={2.2} castShadow/><Corridor/><PencilLines z={-.2}/><CameraRig entered={entered}/><Environment preset="studio"/></>}

function Preloader({ready,onDone}){const [p,setP]=useState(0);useEffect(()=>{let n=0;const id=setInterval(()=>{n+=4;setP(Math.min(n,100));if(n>=100){clearInterval(id);setTimeout(onDone,450)}},38);return()=>clearInterval(id)},[onDone]);return <div className={"preloader "+(ready?"hide":"")}><div className="loader-word">DILEEP BODDU</div><div className="loader-line"><span style={{width:p+"%"}}/></div><div className="loader-meta"><span>INITIALIZING EXPERIENCE</span><b>{p}%</b></div></div>}

export default function App(){
 const [loaded,setLoaded]=useState(false),[entered,setEntered]=useState(false),[section,setSection]=useState(0),[menu,setMenu]=useState(false),[sound,setSound]=useState(false);
 const [paper,setPaper]=useState(false); const scrollRef=useRef(null);
 const go=(n)=>{setPaper(true);setTimeout(()=>{setSection(n);setEntered(true);document.getElementById(["home","about","projects","skills","contact"][n])?.scrollIntoView({behavior:"smooth"});setTimeout(()=>setPaper(false),450)},180)};
 useEffect(()=>{const on=()=>{const ids=["home","about","projects","skills","contact"];let best=0,dist=1e9;ids.forEach((id,i)=>{const e=document.getElementById(id);if(e){const d=Math.abs(e.getBoundingClientRect().top-120);if(d<dist){dist=d;best=i}}});setSection(best)};addEventListener("scroll",on,{passive:true});return()=>removeEventListener("scroll",on)},[]);
 return <div className="app" ref={scrollRef}>
 <Preloader ready={loaded} onDone={()=>setLoaded(true)}/>
 <div className={"paper-transition "+(paper?"active":"")}></div>
 <header className="topbar"><button className="brand" onClick={()=>go(0)}>DB<span>✦</span></button><nav>{["HOME","ABOUT","WORK","SKILLS","CONTACT"].map((x,i)=><button key={x} className={section===i?"active":""} onClick={()=>go(i)}>{x}</button>)}</nav><button className="sound" onClick={()=>setSound(!sound)} aria-label="sound">{sound?<Volume2/>:<VolumeX/>}</button><button className="mobile-menu" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header>
 {menu&&<div className="mobile-nav">{["HOME","ABOUT","WORK","SKILLS","CONTACT"].map((x,i)=><button key={x} onClick={()=>{setMenu(false);go(i)}}>{x}</button>)}</div>}
 <section id="home" className="hero-room"><Canvas camera={{position:[0,0,28],fov:58,near:.1,far:100}} dpr={[1,2]} shadows gl={{antialias:true}}><Suspense fallback={null}><Scene entered={entered}/></Suspense></Canvas>
 <div className="hero-copy"><div className="scribble-label">✦ WELCOME TO MY SKETCHBOOK</div><h1>Ideas become<br/><em>intelligent</em><br/>systems.</h1><p>AI / ML Developer building practical machine learning, deep learning and Agentic AI experiences.</p><button className="enter-btn" onClick={()=>go(1)}>ENTER THE SKETCHBOOK <ArrowDown size={16}/></button></div>
 <div className="hero-side"><span>VISAKHAPATNAM / INDIA</span><span>SCROLL TO EXPLORE ↓</span></div></section>
 <main>
 <section id="about" className="room about-room"><div className="room-number">01</div><div className="room-title"><span>THE MAKER</span><h2>From data<br/>to <em>decisions.</em></h2></div><div className="character-card"><div className="character-placeholder"><img src="/character.png" alt="Dileep Boddu"/></div><div className="card-note">THIS IS ME<br/><b>DILEEP BODDU</b></div></div><div className="about-text"><p className="lead">I'm a BCA Data Science graduate focused on turning data and AI into usable products.</p><p>I work across Python, machine learning, deep learning, APIs, interfaces and agentic workflows. I enjoy building the complete path from a model idea to an interactive application.</p><div className="stats"><div><b>8.81</b><span>CGPA / 10</span></div><div><b>04</b><span>AI PROJECTS</span></div><div><b>AI→UI</b><span>END-TO-END</span></div></div></div></section>
 <section id="projects" className="room projects-room"><div className="room-number">02</div><div className="room-title"><span>THE WORKSHOP</span><h2>Selected<br/><em>work.</em></h2></div><div className="project-stack">{projects.map((p,i)=><article className="project-card" key={p.id} style={{"--i":i}}><div className="project-top"><span>{p.id} / {p.type}</span><a href={p.link} target="_blank" rel="noreferrer"><ArrowUpRight/></a></div><h3>{p.title}</h3><p>{p.desc}</p><div className="chips">{p.stack.map(s=><span key={s}>{s}</span>)}</div><div className="project-art"><div className="art-grid"></div><strong>{p.id}</strong><small>PROJECT SHEET</small></div></article>)}</div></section>
 <section id="skills" className="room skills-room"><div className="room-number">03</div><div className="room-title"><span>THE DESK</span><h2>Tools I<br/><em>build with.</em></h2></div><div className="skill-board">{["Python","Machine Learning","Deep Learning","Agentic AI","Google ADK","FastAPI","React","JavaScript","SQL","XGBoost","Random Forest","CNN + LSTM","Git / GitHub","Data Science","REST APIs","Computer Vision"].map((s,i)=><span key={s} style={{transform:"rotate("+((i%5)-2)*1.2+"deg)"}}>{s}</span>)}</div><div className="skill-note">BUILD<br/><b>·</b><br/>MEASURE<br/><b>·</b><br/>IMPROVE</div></section>
 <section id="contact" className="room contact-room"><div className="room-number">04</div><div className="room-title"><span>LAST PAGE</span><h2>Let's make<br/><em>something.</em></h2></div><div className="contact-sheet"><p>Have an AI / ML idea, opportunity or collaboration in mind?</p><a href="mailto:dileepboddu0685@gmail.com"><Mail/> dileepboddu0685@gmail.com</a><a href="https://github.com/Dileep212-y" target="_blank" rel="noreferrer"><Github/> github.com/Dileep212-y</a><div><MapPin/> Visakhapatnam, India</div><button onClick={()=>window.open("/resume.pdf","_blank")}>OPEN RESUME <ArrowUpRight size={16}/></button></div><div className="contact-footer">DILEEP BODDU <span>© 2026</span><span>DRAWN WITH CODE + CURIOSITY</span></div></section>
 </main>
 <div className="fixed-hint"><Sparkles size={13}/> DRAG / SCROLL / EXPLORE</div>
 </div>
}