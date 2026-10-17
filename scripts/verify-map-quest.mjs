import {readFileSync} from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
class Element{constructor(){this.children=[];this.dataset={};this.style={setProperty(){}};this.disabled=false;this.value='54';this.classes=new Set();this.classList={add:k=>this.classes.add(k),remove:k=>this.classes.delete(k),contains:k=>this.classes.has(k)};this.scrollLeft=this.scrollTop=0;this.clientWidth=600;this.clientHeight=500;}set textContent(v){this.text=v;this.children=[]}get textContent(){return this.text}set innerHTML(v){this.html=v;this.children=[]}setAttribute(k,v){this[k]=v}append(v){this.children.push(v)}replaceChildren(){this.children=[]}}
const elements=new Map(),saved=new Map(),listeners=new Map();const html=readFileSync(new URL('../modules/map-quest.html',import.meta.url),'utf8');for(const m of html.matchAll(/id="([^"]+)"/g))elements.set(m[1],new Element());
const ctx=vm.createContext({console,Math,Set,Map,window:{innerWidth:1200,innerHeight:900,addEventListener(){}},document:{getElementById:id=>elements.get(id),createElement:()=>new Element(),addEventListener:(k,f)=>listeners.set(k,f)},localStorage:{getItem:k=>saved.get(k)??null,setItem:(k,v)=>saved.set(k,v)}});const run=s=>vm.runInContext(s,ctx);run(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
// Independently traverse cell boundaries instead of trusting generator paths().
run(`function independentReach(q,start,blocked){const queue=[start],prev=new Map([[start,null]]);for(let p=0;p<queue.length;p++){const v=queue[p],r=Math.floor(v/q.n),c=v%q.n;for(const [d,dr,dc] of [[0,-1,0],[1,0,1],[2,1,0],[3,0,-1]]){const nr=r+dr,nc=c+dc,to=nr*q.n+nc;if(nr<0||nr>=q.n||nc<0||nc>=q.n||q.walls[v][d]||blocked.has(to)||prev.has(to))continue;prev.set(to,v);queue.push(to)}}return {queue,prev}}`);
for(let l=1;l<=10;l++)for(let trial=0;trial<50;trial++){ctx.testLevel=l;run(`{
const q=makeQuest(testLevel),cfg=LEVELS[testLevel-1];if(q.n!==cfg.n||q.keys.length!==cfg.k||q.friends.length!==cfg.f)throw Error('configuration');
let edges=0;for(let v=0;v<q.n*q.n;v++){for(const x of adjacent(v,q.n)){if(q.walls[v][x.d]!==q.walls[x.to][(x.d+2)%4])throw Error('asymmetric wall');if(!q.walls[v][x.d])edges++}}
if(edges/2!==q.n*q.n-1)throw Error('not a tree');if(independentReach(q,q.start,new Set()).queue.length!==q.n*q.n)throw Error('disconnected');
const objects=[q.start,q.goal,...q.keys,...q.gates,...q.friends];if(new Set(objects).size!==objects.length)throw Error('overlapping objectives');
for(let k=0;k<q.keys.length;k++){const blocked=new Set(q.gates.slice(k)),r=independentReach(q,q.start,blocked);if(!r.prev.has(q.keys[k]))throw Error('key trapped behind own gate');if(r.prev.has(q.goal))throw Error('gate not guarding camp');if(k>0&&independentReach(q,q.start,new Set(q.gates.slice(k-1))).prev.has(q.keys[k]))throw Error('later key before previous gate')}
}`)}
// Play complete expeditions using independent paths, including all gates and rescues.
for(let l=1;l<=10;l++){ctx.testLevel=l;run(`{
start(testLevel);tap(quest.n*quest.n+10);if(moves)throw Error('nonneighbor tap');
for(const x of adjacent(pos,quest.n)){const marked=$('maze').children[x.to].className.includes(' opening');if(marked!==(!quest.walls[pos][x.d]&&!blockedGates().has(x.to)))throw Error('opening marker disagrees with movement')}
const closed=adjacent(pos,quest.n).find(x=>quest.walls[pos][x.d]);if(closed){move(closed.d);if(moves)throw Error('wall crossing')}
hint();if(hintCell<0||!adjacent(pos,quest.n).some(x=>x.to===hintCell&&!quest.walls[pos][x.d]&&!blockedGates().has(x.to)))throw Error('invalid hint');
function walkTo(target){const search=independentReach(quest,pos,blockedGates());if(!search.prev.has(target))throw Error('unreachable objective');const route=[];for(let v=target;v!==pos;v=search.prev.get(v))route.unshift(v);for(const v of route)tap(v)}
for(let k=0;k<quest.keys.length;k++){walkTo(quest.keys[k]);if(!(keyMask&(1<<k)))throw Error('key pickup');const earned=keyMask;undo();if(keyMask&(1<<k))throw Error('undo key');tap(quest.keys[k]);if(keyMask!==earned)throw Error('redo key')}
for(let k=0;k<quest.friends.length;k++){walkTo(quest.friends[k]);if(!(friendMask&(1<<k)))throw Error('rescue')}
walkTo(quest.goal);if(!won||!progress.has(testLevel))throw Error('completion');const count=moves;move(0);if(moves!==count)throw Error('movement after win');
const original=quest;restart();if(quest!==original||moves||keyMask||friendMask||won||pos!==quest.start)throw Error('restart');
}`)}
// Explicit gate collision, same-cell undo for rescues, and early camp behavior.
run(`{
start(5);const gate=quest.gates[0],parent=independentReach(quest,quest.start,new Set()).prev.get(gate);pos=parent;const dir=adjacent(pos,quest.n).find(x=>x.to===gate).d;move(dir);if(pos!==parent||moves)throw Error('locked gate entered');keyMask=1;move(dir);if(pos!==gate)throw Error('unlocked gate blocked');
start(2);const goalParent=independentReach(quest,quest.start,new Set()).prev.get(quest.goal);pos=goalParent;tap(quest.goal);if(won)throw Error('camp before rescue');
const friend=quest.friends[0],parentFriend=independentReach(quest,quest.start,new Set()).prev.get(friend);pos=parentFriend;tap(friend);if(friendMask!==1)throw Error('rescue collection');undo();if(friendMask)throw Error('undo rescue');
$('trailBtn').onclick();if(showTrail)throw Error('trail toggle');$('zoom').value=26;$('zoom').onchange();if(cellSize!==26)throw Error('zoom');$('zoom').value='fit';$('zoom').onchange();if(cellSize*quest.n>$('viewport').clientWidth-30||cellSize*quest.n>window.innerHeight*.58-32)throw Error('maze does not fit');
localStorage.getItem=()=>'{bad';if(load().size)throw Error('corrupt save');localStorage.getItem=()=>{throw Error('blocked')};if(load().size)throw Error('blocked save');localStorage.setItem=()=>{throw Error('blocked')};start(1);const search=independentReach(quest,pos,new Set()),path=[];for(let v=quest.goal;v!==pos;v=search.prev.get(v))path.unshift(v);path.forEach(tap);if(!won)throw Error('blocked storage completion');menu();
}`);
assert.match(readFileSync(new URL('../index.html',import.meta.url),'utf8'),/href='modules\/map-quest.html'/);assert.ok(saved.has('map_quest_v1'));
console.log('PASS: 500 generated mazes across 10 levels; independent connectivity, wall symmetry, key/gate ordering, objective placement; complete gameplay at every level; blocked gates, pickups, rescues, undo, restart, hints, zoom, early camp, whole-maze fit, legal-move markers, saved/blocked storage, launcher.');
