import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
class Element{
 constructor(){this.children=[];this.textContent='';this.disabled=false;this.style={};this.dataset={};this.value='';this.classes=new Set();this.classList={add:k=>this.classes.add(k),remove:k=>this.classes.delete(k),toggle:(k,v)=>{if(v)this.classes.add(k);else this.classes.delete(k)}};}
 set innerHTML(v){this.html=v;this.children=[]}
 setAttribute(k,v){this[k]=v}
 append(v){this.children.push(v)}
 replaceChildren(){this.children=[]}
}
const elements=new Map(),storage=new Map(),listeners=new Map();let now=1000;
const html=readFileSync(new URL('../modules/speed-round.html',import.meta.url),'utf8');
for(const m of html.matchAll(/id="([^"]+)"/g))elements.set(m[1],new Element());
elements.get('level').value='3';elements.get('clock').value='0';
const descendants=e=>e.children.flatMap(x=>[x,...descendants(x)]);
const doc={hidden:false,getElementById:id=>elements.get(id),createElement:()=>new Element(),addEventListener:(k,f)=>listeners.set(k,f),querySelectorAll:selector=>selector==='[data-answer]'?descendants(elements.get('workspace')).filter(e=>e.dataset.answer!==undefined):[],querySelector:selector=>descendants(elements.get('workspace')).find(e=>Number(e.dataset.answer)===Number(selector.match(/"(\d+)"/)[1]))};
const ctx=vm.createContext({console,Math,Map,Set,Date:{now:()=>now},document:doc,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},setInterval:()=>0});
vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],ctx);
const run=s=>vm.runInContext(s,ctx);
for(let l=1;l<=6;l++)for(let trial=0;trial<100;trial++){
 ctx.testLevel=l;ctx.testIndex=trial%8+1;
 run(`{
 const r=makeRules(testLevel,testIndex);
 const check=a=>{const p=r.predicates.map(v=>a[v.type]===v.value),n=p.filter(Boolean).length;return r.kind==='one'?p[0]:r.kind==='and'?n===2:r.kind==='or'?n>=1:r.kind==='xor'?n===1:r.kind==='not'?p[0]&&!p[1]:n===2};
 const hits=r.choices.map(check);if(hits.filter(Boolean).length!==1||!hits[r.correct])throw Error('ambiguous rule');
 if(new Set(r.choices.map(a=>JSON.stringify(a))).size!==r.choices.length)throw Error('duplicate rule cards');
 if(makeRules(testLevel,testIndex,r.rule).rule===r.rule)throw Error('repeated rule');
 const p=makeRotation(testLevel),result=[];
 for(const v of p.cells){let y=Math.floor(v/p.n),x=v%p.n;if(p.mirror)x=p.n-1-x;for(let t=0;t<p.turns;t++){const oldX=x;x=p.n-1-y;y=oldX;}result.push(y*p.n+x)}
 if(key(result)!==key(p.choices[p.correct])||new Set(p.choices.map(key)).size!==p.choices.length)throw Error('rotation mismatch');
 if(p.choices.some(a=>a.length!==p.cells.length))throw Error('rotation count');
 const t=makeTrail(testLevel);let pos=t.start;
 for(const cmd of (t.backwards?[...t.commands].reverse():t.commands)){const d=dirs[(cmd.arrow+(cmd.reverse?2:0))%4];const row=Math.floor(pos/t.n)+d[0],col=pos%t.n+d[1];if(row<0||row>=t.n||col<0||col>=t.n)throw Error('trail off board');pos=row*t.n+col;}
 if(pos!==t.correct)throw Error('trail endpoint');
 }`);
}
for(const m of ['rules','rotate','trail'])for(let l=1;l<=6;l++){
 ctx.testMode=m;ctx.testLevel=l;
 run(`{$('level').value=testLevel;$('clock').value=0;start(testMode);
 const wrong=(puzzle.correct+1)%puzzle.choices.length;choose(wrong);if(answered||correct)throw Error('wrong accepted');
 $('hintBtn').onclick();if(hints!==1)throw Error('hint');
 const first=index;$('replaceBtn').onclick();if(index!==first||correct)throw Error('new puzzle scores');
 setPause(true);choose(puzzle.correct);if(correct)throw Error('answered during pause');setPause(false);
 for(let j=0;j<ROUND;j++){choose(puzzle.correct);const count=correct;choose(puzzle.correct);if(correct!==count)throw Error('double score');$('nextBtn').onclick()}
 if(running||correct!==ROUND||records[testMode]!==testLevel)throw Error('round completion');}
 `);
}
run(`$('clock').value=60;start('rules');`);now+=1000;run('tick();');assert.equal(run('remaining'),59);
run('setPause(true)');now+=5000;run('tick()');assert.equal(run('remaining'),59);
run('setPause(false);choose(puzzle.correct)');now+=5000;run('tick()');assert.equal(run('remaining'),59);
run("$('nextBtn').onclick()");now+=2000;run('tick()');assert.equal(run('remaining'),57);
doc.hidden=true;listeners.get('visibilitychange')();assert.equal(run('paused'),true);now+=10000;doc.hidden=false;listeners.get('visibilitychange')();run('tick()');assert.equal(run('remaining'),57);
run('setPause(false)');now+=58000;run('tick()');assert.equal(run('running'),false);assert.match(elements.get('summaryTitle').textContent,/reflect/);
run("$('clock').value=0;start('trail');$('skipBtn').onclick();if(index!==2||skipped!==1||correct)throw Error('skip');menu();if(running)throw Error('menu clock');localStorage.getItem=()=>'{bad';if(Object.values(readRecords()).some(Boolean))throw Error('corrupt save');localStorage.getItem=()=>{throw Error('blocked')};if(Object.values(readRecords()).some(Boolean))throw Error('blocked save');localStorage.setItem=()=>{throw Error('blocked')};start('rules');for(let j=0;j<ROUND;j++){choose(puzzle.correct);$('nextBtn').onclick()};if(running)throw Error('blocked storage completion');");
assert.match(readFileSync(new URL('../index.html',import.meta.url),'utf8'),/href='modules\/speed-round.html'/);
console.log('PASS: 1,800 generated puzzles; unique rules/rotation answers, independent trail simulation; all three modes at six levels; scoring, skips, hints, pause/resume, timer expiry, hidden tab, duplicate answers, storage fallback, launcher.');
