const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));
document.querySelector('#year').textContent=new Date().getFullYear();

const contactForm=document.querySelector('#contact-form');
const formStatus=document.querySelector('#form-status');
const submitButton=contactForm.querySelector('button[type="submit"]');
contactForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!contactForm.reportValidity()) return;
  const originalText=submitButton.innerHTML;
  submitButton.disabled=true;
  submitButton.innerHTML='Sending…';
  formStatus.textContent='Sending your message securely…';
  formStatus.removeAttribute('data-state');
  const payload=Object.fromEntries(new FormData(contactForm).entries());
  try{
    const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const result=await response.json();
    if(!response.ok) throw new Error(result.error||'Unable to send your message.');
    formStatus.textContent=result.message||'Thanks! Your message has been sent.';
    formStatus.dataset.state='success';
    contactForm.reset();
  }catch(error){
    formStatus.textContent=error.message||'Unable to send your message. Please email gudla0098@gmail.com directly.';
    formStatus.dataset.state='error';
  }finally{
    submitButton.disabled=false;
    submitButton.innerHTML=originalText;
  }
});
