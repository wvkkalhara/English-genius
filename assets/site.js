// English Genius public website: menu, gentle scroll reveal, and the live contact number.
(function(){
  'use strict';
  const doc=document.documentElement; doc.classList.add('js');
  const me=document.currentScript, msg=(me&&me.dataset.msg)||'Hi! I would like to join English Genius.';

  // mobile menu
  const nav=document.querySelector('.nav'), btn=document.querySelector('.menuBtn');
  if(nav&&btn){
    btn.addEventListener('click',()=>{ const open=nav.classList.toggle('open'); btn.setAttribute('aria-expanded',String(open)); });
    nav.querySelectorAll('.navLinks a').forEach(a=>a.addEventListener('click',()=>{ nav.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }));
  }

  // cards float up as they scroll into view
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.gm,.ruler li,.ticks li,.steps li,.loop li,.split .shot,.rcCard,.chalkList li').forEach((el,i)=>{ el.classList.add('reveal'); el.style.transitionDelay=(i%4)*70+'ms'; io.observe(el); });
  }

  // the admin can change the phone number at any time (Admin → Site settings); the page shows the newest one
  const apply=c=>{
    if(!c||typeof c!=='object') return;
    const digits=String(c.whatsapp||'').replace(/\D/g,''), phone=String(c.phone||'').replace(/[^\d+ ()-]/g,'');
    if(!/^\d{8,15}$/.test(digits)||phone.length<7) return;   // never trust what we fetch blindly
    document.querySelectorAll('[data-phone]').forEach(el=>{ el.textContent=phone; });
    document.querySelectorAll('[data-tel]').forEach(a=>{ a.href='tel:+'+String(c.tel||digits).replace(/\D/g,''); });
    document.querySelectorAll('[data-wa]').forEach(a=>{ a.href='https://wa.me/'+digits+'?text='+encodeURIComponent(msg); });
  };
  const DB='https://english-genius-c5c1f-default-rtdb.firebaseio.com';
  try{
    const ctl=new AbortController(); setTimeout(()=>ctl.abort(),6000);
    fetch(DB+'/site/contact.json',{signal:ctl.signal,credentials:'omit',referrerPolicy:'no-referrer'}).then(r=>r.ok?r.json():null).then(apply).catch(()=>{});
  }catch(e){}
})();
