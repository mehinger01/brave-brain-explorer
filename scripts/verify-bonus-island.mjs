// Run with node scripts/verify-bonus-island.mjs. No dependencies required.
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
class Element {
 constructor(){this.children=[];this.textContent='';this.disabled=false;this.style={};this.classList={add(){},remove(){}};this.attributes={};}
 set innerHTML(v){this.children=[];for(const match of v.matchAll(/id="([^"]+)"/g))elements.set(match[1],new Element())}
 setAttribute(k,v){this.attributes[k]=v}
 append(v){this.children.push(v)}
 replaceChildren(){this.children=[]}
}
const elements=new Map(),storage=new Map();
const html=readFileSync(new URL('../modules/bonus-island.html',import.meta.url),'utf8');
for(const match of html.matchAll(/id="([^"]+)"/g))elements.set(match[1],new Element());
const context=vm.createContext({console,Math,Set,Map,document:{getElementById:id=>elements.get(id),createElement:()=>new Element(),querySelectorAll:()=>[]},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)}});
vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],context);
const run=code=>vm.runInContext(code,context);
for(let l=1;l<=6;l++)for(let trial=0;trial<100;trial++){
 context.testLevel=l;
 run(`{
  const p=makeRoute(testLevel);
  if(p.solution[0]!==0||p.solution.at(-1)!==p.goal)throw Error('route endpoints');
  if(p.supplies.length!==testLevel+1||new Set(p.supplies).size!==p.supplies.length)throw Error('supplies');
  for(let i=1;i<p.solution.length;i++){
   const a=p.solution[i-1],b=p.solution[i];
   if(Math.abs(Math.floor(a/p.n)-Math.floor(b/p.n))+Math.abs(a%p.n-b%p.n)!==1||p.rocks.has(b))throw Error('unsolvable route');
  }
  if(p.supplies.some(x=>!p.solution.includes(x)))throw Error('unreachable supply');
  const t=makeTracks(testLevel);
  const matches=t.candidates.filter(a=>a.every((v,j)=>t.negative&&j===t.dims-1?v!==t.negativeValue:v===t.target[j]));
  if(matches.length!==1||matches[0]!==t.candidates[t.correct])throw Error('ambiguous evidence');
  const s=makeSignal(testLevel);if(s.target.length!==s.n*s.n||s.target.some(x=>!s.palette[x]))throw Error('invalid signal');
 }`);
}
// Exercise handlers, not just puzzle generation, at every level.
for(let l=1;l<=6;l++){
 context.testLevel=l;
 run(`{openGame('route');level=testLevel;newPuzzle();
  moveRoute(puzzle.n*puzzle.n+2); // invalid move must be harmless
  $('hint').onclick();
  puzzle.solution.slice(1).forEach(moveRoute);
  if(!solved)throw Error('route completion');
  const earned=progress.route;moveRoute(0);if(progress.route!==earned)throw Error('duplicate win');
  retry();if(solved||puzzle.path.length!==1||puzzle.collected.size)throw Error('retry route');
  moveRoute(puzzle.solution[1]);$('undo').onclick();if(puzzle.pos!==0)throw Error('undo');
  openGame('tracks');level=testLevel;newPuzzle();$('check').onclick();
  selected=(puzzle.correct+1)%puzzle.candidates.length;$('check').onclick();if(solved)throw Error('wrong evidence accepted');
  selected=puzzle.correct;$('check').onclick();if(!solved)throw Error('evidence completion');
  openGame('signal');level=testLevel;newPuzzle();if(!$('checkSignal').disabled)throw Error('visible signal check');
  $('hideSignal').onclick();$('checkSignal').onclick();if(solved)throw Error('blank signal accepted');
  puzzle.answer=[...puzzle.target];$('checkSignal').onclick();if(!solved)throw Error('signal completion');
  retry();if(puzzle.answer.some(v=>v!==-1)||!shown)throw Error('signal retry');
  $('back').onclick();}
 `);
}
assert.equal(run('Object.values(progress).every(v=>v===6)'),true);
assert.ok(storage.has('bonus_island_v1'));
run(`localStorage.getItem=()=>'{bad';if(Object.values(load()).some(Boolean))throw Error('corrupt save');localStorage.getItem=()=>{throw Error('blocked')};if(Object.values(load()).some(Boolean))throw Error('blocked storage');localStorage.setItem=()=>{throw Error('blocked')};openGame('tracks');selected=puzzle.correct;$('check').onclick();if(!solved)throw Error('blocked storage win');`);
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.match(index,/href='modules\/bonus-island.html'/);
const workflow=readFileSync(new URL('../.github/workflows/deploy.yml',import.meta.url),'utf8');assert.match(workflow,/for dir in assets public images css js modules/);
console.log('PASS: 600 generated puzzle sets; all three completion/retry flows at six levels; hints, undo, invalid choices, saves, corrupt/blocked storage, launcher and deployment packaging.');
