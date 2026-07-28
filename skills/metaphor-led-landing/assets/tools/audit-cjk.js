(function(){
const bad={negTrack:[],tightLh:[],fakeWeight:[],tinyText:[],longMeasure:[]};
const seen=new Set();
document.querySelectorAll('*').forEach(e=>{
  const t=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('');
  if(!/[一-鿿]/.test(t)) return;
  const s=getComputedStyle(e);
  const fs=parseFloat(s.fontSize);
  const ls=parseFloat(s.letterSpacing);
  const lh=s.lineHeight==='normal'?fs*1.4:parseFloat(s.lineHeight);
  const key=e.tagName+(e.className&&typeof e.className==='string'?'.'+e.className.split(' ')[0]:'');
  if(seen.has(key))return; seen.add(key);
  if(ls<0) bad.negTrack.push(`${key} ${s.letterSpacing}`);
  if(lh/fs<1.2) bad.tightLh.push(`${key} ${fs}px/${(lh/fs).toFixed(2)}`);
  if(![100,200,300,400,500,600,700,800,900].includes(+s.fontWeight)) bad.fakeWeight.push(`${key} ${s.fontWeight}`);
  if(fs<12) bad.tinyText.push(`${key} ${fs}px`);
  const chars=e.getBoundingClientRect().width/fs;
  if(t.replace(/\s/g,'').length>20 && chars>30) bad.longMeasure.push(`${key} ${Math.round(chars)}字/行`);
});
const faces=[...document.fonts].filter(f=>f.family==='Puhui').map(f=>f.weight+':'+f.status);
const total=Object.values(bad).reduce((a,b)=>a+b.length,0);
return JSON.stringify({vw:innerWidth,faces:faces.join(' '),overflowX:document.documentElement.scrollWidth>innerWidth,
 total,violations:{负字距:bad.negTrack,行高过紧:bad.tightLh,非法字重:bad.fakeWeight,字号过小:bad.tinyText,行长过宽:bad.longMeasure}},null,1);
})()
