'use strict';
/* ---------- Menu ---------- */
const body=document.body, menuBtn=document.getElementById('menuBtn'), menuLabel=document.getElementById('menuLabel');
const overlay=document.getElementById('overlay');
function setMenu(open){
  body.classList.toggle('menu-open',open);
  menuLabel.textContent=open?'Close':'Menu';
  menuBtn.setAttribute('aria-expanded',String(open));
  overlay.setAttribute('aria-hidden',String(!open));
  overlay.inert=!open;
  body.style.overflow=open?'hidden':'';
  if(open) setTimeout(()=>overlay.querySelector('a').focus({preventScroll:true}),350);
}
overlay.inert=true;
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&body.classList.contains('menu-open')){ setMenu(false); menuBtn.focus(); } });
menuBtn.addEventListener('click',()=>setMenu(!body.classList.contains('menu-open')));
document.querySelectorAll('#overlay a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

/* ---------- Header on scroll ---------- */
const header=document.getElementById('header'), wa=document.querySelector('.wa'); let lastY=0;
addEventListener('scroll',()=>{
  const y=scrollY;
  header.classList.toggle('solid',y>40);
  wa.classList.toggle('show',y>innerHeight*.7);
  header.classList.toggle('hide',y>lastY&&y>500&&!body.classList.contains('menu-open'));
  lastY=y;
},{passive:true});

/* ---------- Statement word fill ---------- */
const ft=document.getElementById('fillText');
ft.innerHTML=ft.textContent.trim().split(/\s+/).map(w=>{const hl=w.includes('*');const clean=w.replace(/\*/g,'');return `<span class="w${hl?' hl':''}">${clean}</span>`}).join(' ');
const words=[...ft.querySelectorAll('.w')];
function fill(){const r=ft.getBoundingClientRect();const vh=innerHeight;const p=Math.min(1,Math.max(0,(vh*0.85-r.top)/(r.height+vh*0.35)));const n=Math.round(p*words.length);words.forEach((w,i)=>w.classList.toggle('on',i<n))}
addEventListener('scroll',fill,{passive:true});fill();

/* ---------- Reveal ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* ---------- Accordion ---------- */
const items=[...document.querySelectorAll('.acc-item')];
function syncAria(){items.forEach(x=>x.querySelector('.acc-head').setAttribute('aria-expanded',String(x.classList.contains('open'))))}
items.forEach((it,i)=>{
  const head=it.querySelector('.acc-head'), panel=it.querySelector('.acc-body');
  panel.id='svc-panel-'+(i+1); head.setAttribute('aria-controls',panel.id);
  head.addEventListener('click',()=>{
    const wasOpen=it.classList.contains('open');
    items.forEach(x=>x.classList.remove('open'));
    if(!wasOpen)it.classList.add('open');
    syncAria();
  });
});
syncAria();

/* ---------- Clients ---------- */
const clients=["ACCA Malawi Ltd","GIZ Malawi","Episcopal Conference of Malawi","Joyce Banda Foundation International","Big Five Motors Ltd","Life Pharmacies Ltd","Ufulu 92.5 FM Ltd","Winlaw & Ndau Law Firm","Crossroads Dental Ltd"];
document.getElementById('clientList').innerHTML=clients.map((c,i)=>`<li><small>${String(i+1).padStart(2,'0')}</small>${c.replace('&','&amp;')}</li>`).join('');

/* ---------- Count up ---------- */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,to=+el.dataset.to,sup=el.querySelector('sup');const supH=sup?sup.outerHTML:'';const t0=performance.now();
  (function tick(t){const p=Math.min(1,(t-t0)/1400);const v=Math.round(to*(1-Math.pow(1-p,3)));el.innerHTML=v+supH;if(p<1)requestAnimationFrame(tick)})(t0);cio.unobserve(el)}),{threshold:.5});
document.querySelectorAll('[data-to]').forEach(el=>cio.observe(el));

/* ---------- Form ---------- */
/* Builds the mailto link. Every value is trimmed, length-capped and URL-encoded,
   so user input can never add extra headers (cc, bcc, subject) or markup. */
const clean=(v,max)=>String(v||'').replace(/[\r\n]+/g,' ').trim().slice(0,max);
function buildMailto(form){
  const f=new FormData(form);
  const name=clean(f.get('name'),80), service=clean(f.get('service'),60);
  const subject=`Website enquiry: ${service} | ${name}`;
  const message=String(f.get('message')||'').trim().slice(0,1500);
  const bodyTxt=`Name: ${name}\nBusiness: ${clean(f.get('company'),100)||'-'}\nEmail: ${clean(f.get('email'),120)}\nPhone: ${clean(f.get('phone'),30)||'-'}\nInterested in: ${service}\n\n${message}`;
  return `mailto:fcsltdmalawi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTxt)}`;
}
window.FCS={buildMailto};
document.getElementById('form').addEventListener('submit',e=>{e.preventDefault();location.href=buildMailto(e.target);});

document.getElementById('yr').textContent=new Date().getFullYear();
