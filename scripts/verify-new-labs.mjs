import {readFileSync} from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
class Element{constructor(){this.children=[];this.style={};this.value='2';this.disabled=false;this.dataset={};this.classes=new Set();this.classList={add:k=>this.classes.add(k),remove:k=>this.classes.delete(k),toggle:(k,v)=>v?this.classes.add(k):this.classes.delete(k)}}set textContent(v){this.text=v;this.children=[]}get textContent(){return this.text}set innerHTML(v){this.html=v;this.children=[]}setAttribute(k,v){this[k]=v}append(v){this.children.push(v)}replaceChildren(){this.children=[]}}
function setup(file){const html=readFileSync(new URL('../modules/'+file,import.meta.url),'utf8'),elements=new Map(),storage=new Map();for(const m of html.matchAll(/id="([^"]+)"/g))elements.set(m[1],new Element());const ctx=vm.createContext({console,Math,Set,Map,document:{getElementById:id=>elements.get(id),createElement:()=>new Element()},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)}});const run=s=>vm.runInContext(s,ctx);run(html.match(/<script>([\s\S]*?)<\/script>/)[1]);return {ctx,run,elements,storage}}
const science=setup('science-dock.html');
for(let l=1;l<=6;l++)for(let trial=0;trial<100;trial++){science.ctx.testLevel=l;science.run(`{
 const p=makePuzzle(testLevel);if(p.n!==testLevel+2||new Set(p.path).size!==p.path.length)throw Error('pipe path');
 for(let j=1;j<p.path.length;j++){const a=p.path[j-1],b=p.path[j],d=neighbors(a,p.n).find(x=>x.to===b)?.d;if(d===undefined||!p.solved[a].includes(d)||!p.solved[b].includes((d+2)%4))throw Error('disconnected solved pipe')}
 if(p.checkpoints.some(v=>!p.path.includes(v)||v===0||v===p.goal))throw Error('checkpoint');
 p.rotations.fill(0);const result=trace(p);if(!result.ok||result.route.join()!==p.path.join())throw Error('pipe solution');
 p.rotations=[...p.initial];if(trace(p).ok)throw Error('starts solved');
 }`)}
for(let l=1;l<=6;l++){science.ctx.testLevel=l;science.run(`{
 $('level').value=testLevel;start();const original=puzzle;const old=puzzle.rotations[1];turn(1);undo();if(puzzle.rotations[1]!==old||turns)throw Error('pipe undo');turn(0);turn(puzzle.goal);if(turns)throw Error('fixed tile rotates');test();if(won)throw Error('unsolved pipe wins');
 for(let i=0;i<puzzle.path.length;i++)hint();test();if(!won||!progress.has(testLevel))throw Error('pipe hint solve');const count=turns;turn(1);if(turns!==count)throw Error('pipe edit after win');reset();if(puzzle!==original||won||turns||history.length)throw Error('pipe retry');
 }`)}
science.run(`localStorage.getItem=()=>'{bad';if(load().size)throw Error('pipe corrupt storage');localStorage.setItem=()=>{throw Error('blocked')};puzzle.rotations.fill(0);test();if(!won)throw Error('pipe blocked storage');`);
const dino=setup('dino-dig.html');
for(let l=1;l<=6;l++)for(let trial=0;trial<60;trial++){dino.ctx.testLevel=l;dino.run(`{
 const p=makePuzzle(testLevel),cfg=CONFIG[testLevel-1];if(p.n!==cfg.n||p.pieces.length!==cfg.count)throw Error('fossil config');const all=p.pieces.flatMap(x=>x.solution);if(all.length!==p.n*p.n||new Set(all).size!==all.length)throw Error('fossil coverage');
 for(const piece of p.pieces){if(!connected(piece.solution,p.n))throw Error('disconnected fossil');for(let r=0;r<4;r++)for(const f of [false,true]){const transformed=shape(piece,r,f);if(transformed.length!==piece.cells.length||new Set(transformed.map(x=>x.join())).size!==transformed.length)throw Error('transform loses square');}}
 }`)}
for(let l=1;l<=6;l++){dino.ctx.testLevel=l;dino.run(`{
 $('level').value=testLevel;start();const original=puzzle;
 for(let i=0;i<puzzle.pieces.length;i++){select(i);rotate();hint();if(rotation||flipped||guide.join()!==puzzle.pieces[i].solution.join())throw Error('guide pose');tap(puzzle.pieces[i].solution[0]);if(!placements[i]||[...placements[i].cells].sort((a,b)=>a-b).join()!==puzzle.pieces[i].solution.join())throw Error('guide placement');}
 if(!won||!progress.has(testLevel))throw Error('fossil completion');undo();if(won||placements.every(Boolean))throw Error('undo fossil win');
 reset();if(puzzle!==original||history.length||placements.some(Boolean))throw Error('same fossil reset');
 select(0);hint();tap(puzzle.pieces[0].solution[0]);const cells=[...placements[0].cells];select(1);let overlap=-1;for(let v=0;v<puzzle.n*puzzle.n;v++){if(cells.includes(v))continue;const coords=boardCells(v);if(coords.every(c=>c.r>=0&&c.r<puzzle.n&&c.c>=0&&c.c<puzzle.n)&&coords.some(c=>cells.includes(c.r*puzzle.n+c.c))){overlap=v;break}}if(overlap>=0){const count=history.length;tap(overlap);if(placements.filter(Boolean).length!==1||history.length!==count)throw Error('overlap accepted')}tap(cells[0]);if(placements[0]||selected!==0)throw Error('pickup');undo();if(!placements[0])throw Error('undo pickup');
 reset();select(0);const before=shape(puzzle.pieces[0]);flip();if(testLevel<4&&flipped)throw Error('early flip');if(testLevel>=4&&!flipped)throw Error('flip unavailable');
 // Find a deliberately invalid anchor for an oriented piece; it must not change the board.
 let bad=-1;for(let v=0;v<puzzle.n*puzzle.n;v++)if(boardCells(v).some(c=>c.r<0||c.r>=puzzle.n||c.c<0||c.c>=puzzle.n)){bad=v;break}if(bad<0)throw Error('no invalid anchor');tap(bad);if(placements.some(Boolean))throw Error('out-of-bounds placement accepted');
 }`)}
dino.run(`localStorage.getItem=()=>'{bad';if(load().size)throw Error('fossil corrupt storage');localStorage.setItem=()=>{throw Error('blocked')};reset();for(let i=0;i<puzzle.pieces.length;i++){select(i);hint();tap(puzzle.pieces[i].solution[0])}if(!won)throw Error('fossil blocked storage');`);
const index=readFileSync(new URL('../index.html',import.meta.url),'utf8');for(const f of ['science-dock','dino-dig'])assert.ok(index.includes("modules/"+f+".html"));
console.log('PASS: 600 pipe puzzles and 360 fossil puzzles across six levels; independent pipe connectivity, complete fossil coverage, connected pieces, rotations/flips, hint solutions, fixed source/goal, undo, pickup, bounds, retry, storage fallback and launchers.');
