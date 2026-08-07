const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const spiritRealms = ['開光','融合','金丹','元嬰','分神','合體','洞虛','大乘','遊仙','真仙','玄仙','天仙','太乙玉仙','大羅金仙','元神','空玄','萬劫','混元','準聖','聖人','不朽','靈尊','天道'];
const bodyRealms = ['凡身','凝氣','易筋','煆骨','洗髓','金身','神力','神勇','千山','萬水','森羅','萬象'];
const spiritRootRanks = ['廢品','凡品','下品','中品','良品','超品','上品','極品','完美','先天','凡仙','仙品','歸元','天心','三清','六禦','玄門','全真','淨明','天道'];
const originProfiles = {
  '家族子弟':{trueQi:5,rootBone:5,physique:5,agility:5,spiritualPower:5,comprehension:5,fortune:5},
  '流浪孤兒':{trueQi:3,rootBone:4,physique:4,agility:4,spiritualPower:7,comprehension:3,fortune:10},
  '亡命草寇':{trueQi:3,rootBone:8,physique:8,agility:6,spiritualPower:3,comprehension:0,fortune:5},
  '深山獵戶':{trueQi:1,rootBone:6,physique:7,agility:7,spiritualPower:4,comprehension:2,fortune:8},
  '寒窗學子':{trueQi:6,rootBone:4,physique:2,agility:4,spiritualPower:10,comprehension:6,fortune:3}
};
const originDescriptions = {
  '家族子弟':'出身修真世家，自幼耳濡目染，各方面根基較為均衡。',
  '流浪孤兒':'自幼漂泊無依，於困境中磨練心志，往往更容易遇見意外機緣。',
  '亡命草寇':'久經凶險與搏殺，筋骨體魄格外強韌，卻不擅長靜心參悟。',
  '深山獵戶':'生長於群山荒野，身手矯健、感知敏銳，擅長把握稍縱即逝的機會。',
  '寒窗學子':'多年寒窗養成通透心性，悟性與靈力出眾，但肉身根基較為薄弱。'
};
const defaults = { name:'', gender:'女', hair:1, outfit:1, origin:'家族子弟', muted:false, free:0, spiritLevel:0, bodyLevel:0, pills:1, totalEarned:0, rootBone:5, trueQi:5, physique:5, agility:5, spiritualPower:5, comprehension:5, fortune:5, metalArt:0, woodArt:0, waterArt:0, fireArt:0, earthArt:0, metalRoot:0, woodRoot:0, waterRoot:0, fireRoot:0, earthRoot:0, aura:0, spiritPoolLevel:1, spiritStone:0, spiritJade:0, food:200, wood:40, meteorIron:20, daoChildTotal:1, daoChildBought:0, workerSpiritStone:0, workerFood:0, workerWood:0, workerMeteorIron:0, spiritStoneAreaLevel:1, foodAreaLevel:1, woodAreaLevel:1, meteorIronAreaLevel:1, bornAt:null, lastSave:Date.now() };
let state = { ...defaults }, tickStart = Date.now();
const saveKey = 'wendao-idle-v2';
let createGender='女', createOutfit=1, createOrigin='家族子弟', audioContext=null, currentFeature=null, currentRootView='root', currentCaveView='dwelling', suppressSave=false;
let bgmTheme=null;

function req(level) { return Math.floor(100*Math.pow(1.22,level)); }
function bodyReq(level) { return req(level)*3; }
function hasSpiritualSense() { return state.spiritLevel>=40; }
function experiencedYears() { return state.bornAt ? Math.max(0,Math.floor((Date.now()-state.bornAt)/900000)) : 0; }
function realmName(level, arr) {
  return `${arr[Math.min(Math.floor(level/10),arr.length-1)]}・${['一','二','三','四','五','六','七','八','九','十'][level%10]}層`;
}
function cultivationEfficiency() { return state.comprehension*.5; }
function auraEfficiency() { return state.fortune*.5; }
function rate() { return Math.floor(10 * (1 + state.spiritLevel*.12 + state.bodyLevel*.08) + cultivationEfficiency()); }
function auraRate() { return Math.max(1,Math.floor(5*Math.pow(1.18,state.spiritPoolLevel-1)+auraEfficiency())); }
function auraCapacity() { return Math.floor(500*Math.pow(1.6,state.spiritPoolLevel-1)); }
function spiritRootReq(level) { return Math.floor(50*Math.pow(1.25,level)); }
function poolWoodCost() { return Math.floor(20*Math.pow(1.45,state.spiritPoolLevel-1)); }
function poolIronCost() { return Math.floor(10*Math.pow(1.5,state.spiritPoolLevel-1)); }
function rootRank(level) { return `${spiritRootRanks[Math.min(Math.floor(level/10),spiritRootRanks.length-1)]}・${level%10+1}階`; }
function chanceFromRating(rating,cap) { return Math.min(cap,rating/(rating+1000)*100); }
function save() { state.lastSave=Date.now(); localStorage.setItem(saveKey,JSON.stringify(state)); }
function load() {
  try {
    const current=JSON.parse(localStorage.getItem(saveKey));
    if(current) { state={...defaults,...current}; state.bornAt ||= Date.now(); return state; }
    const old=JSON.parse(localStorage.getItem('wendao-idle-v1'));
    if(old) { state={...defaults,...old,free:(old.free||0)+(old.spiritQi||0)+(old.bodyQi||0)}; state.bornAt ||= Date.now(); }
  } catch {}
}
function show(id) { $$('.screen').forEach(x=>x.classList.remove('active')); $(id).classList.add('active'); }
function toast(text) { const x=$('#toast'); x.textContent=text; x.classList.add('show'); setTimeout(()=>x.classList.remove('show'),1800); }
function addCultivation(amount,silent=false) {
  state.free += amount; state.totalEarned += amount;
  if(!silent) { toast(`修為+${amount}`); playTone(); }
  render(); save();
}
function addAura(amount) { state.aura=Math.min(auraCapacity(),state.aura+amount); }
function playTone() {
  if(state.muted) return;
  try { audioContext ||= new (window.AudioContext||window.webkitAudioContext)(); const o=audioContext.createOscillator(),g=audioContext.createGain();o.frequency.value=520;g.gain.setValueAtTime(.035,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.35);o.connect(g).connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+.35); } catch {}
}
function updateBgmVolume() {
  ['#titleBgm','#mainBgm'].forEach(id=>{const track=$(id);track.muted=state.muted;track.volume=.42});
}
function startBgm(theme) {
  const tracks={title:$('#titleBgm'),main:$('#mainBgm')}, next=tracks[theme];
  Object.entries(tracks).forEach(([name,track])=>{if(name!==theme){track.pause();track.currentTime=0}});
  bgmTheme=theme; updateBgmVolume();
  next.play().catch(()=>{});
}
function render() {
  const spiritCost=req(state.spiritLevel), bodyCost=bodyReq(state.bodyLevel), free=Math.floor(state.free);
  $('#playerName').textContent=state.name; $('#totalQi').textContent=free.toLocaleString();
  $('#spiritStoneAmount').textContent=Math.floor(state.spiritStone).toLocaleString();
  $('#spiritJadeAmount').textContent=Math.floor(state.spiritJade).toLocaleString();
  $('#headerSpiritRealm').textContent=realmName(state.spiritLevel,spiritRealms);
  $('#headerSect').textContent=state.sect||'無門無派';
  $('#yearsElapsed').textContent=`${experiencedYears().toLocaleString()} 年`;
  $('#rateText').textContent=rate().toLocaleString()+' / 5秒';
  $('#spiritRealm').textContent=realmName(state.spiritLevel,spiritRealms);
  $('#bodyRealm').textContent=realmName(state.bodyLevel,bodyRealms);
  $('#spiritCost').textContent=`提升需 ${spiritCost.toLocaleString()}`;
  $('#bodyCost').textContent=`提升需 ${bodyCost.toLocaleString()}`;
  $('#spiritUp').classList.toggle('ready',free>=spiritCost);
  $('#bodyUp').classList.toggle('ready',free>=bodyCost);
  $('#pillCount').textContent='護脈丹：'+state.pills; $('#usePill').disabled=state.pills<1;
  $('#muteBtn').textContent=state.muted?'♫ 開啟音效':'♪ 靜音';
}
function upgrade(type) {
  const spirit=type==='spirit', cost=spirit?req(state.spiritLevel):bodyReq(state.bodyLevel);
  if(state.free<cost) return toast(`尚缺 ${(cost-state.free).toFixed(0)} 修為`);
  if(spirit && (state.spiritLevel+1)%10===0) return openTrib();
  state.free-=cost;
  if(spirit) { state.spiritLevel++; toast('靈息流轉，境界提升'); }
  else {
    const oldRealm=Math.floor(state.bodyLevel/10); state.bodyLevel++;
    const newRealm=Math.floor(state.bodyLevel/10);
    toast(newRealm>oldRealm?`肉身突破，踏入${bodyRealms[newRealm]||'武道極境'}`:'筋骨齊鳴，肉身精進');
  }
  render(); save();
}
function openTrib() {
  const next=Math.floor((state.spiritLevel+1)/10), base=Math.max(20,80-next*7);
  $('#tribTitle').textContent=(spiritRealms[next]||'飛升')+'雷劫'; $('#tribChance').textContent=base+'%';
  $('#usePill').checked=false; $('#tribulationModal').classList.remove('hidden');
}
function tribulate() {
  const next=Math.floor((state.spiritLevel+1)/10), base=Math.max(20,80-next*7);
  const pill=$('#usePill').checked&&state.pills>0, chance=Math.min(95,base+(pill?15:0));
  if(pill) state.pills--; $('#tribulationModal').classList.add('hidden');
  const game=$('#gameScreen'), cost=req(state.spiritLevel); game.classList.add('struck');
  setTimeout(()=>{
    game.classList.remove('struck');
    if(Math.random()*100<chance) {
      state.free-=cost; state.spiritLevel++; game.classList.add('success');
      toast(state.spiritLevel===40?'踏入分神一層，已習得神識入體！':'雷劫散去，道基已成！');
      setTimeout(()=>game.classList.remove('success'),1700);
    } else {
      state.free=Math.max(0,state.free-Math.ceil(cost*.5)); game.classList.add('failure'); toast('渡劫失敗，焦黑倒地…');
      setTimeout(()=>game.classList.remove('failure'),2100);
    }
    render(); save();
  },1350);
}
function startGame() {
  show('#gameScreen');
  startBgm('main');
  currentFeature=null;
  $('#featurePanel').classList.add('hidden');
  $('#gameScreen').classList.remove('feature-open');
  $$('.feature-tab').forEach(x=>x.classList.remove('active'));
  const g=state.gender==='男'?'male':'female';
  $('#heroCharacter').src=`assets/${g}-character-outfit-${state.outfit||1}-v12.png`;
  const away=Math.max(0,Math.floor((Date.now()-state.lastSave)/5000));
  if(away>0) { const gain=away*rate(); addAura(away*auraRate()); runSettlementTick(away); addCultivation(gain,true); setTimeout(()=>toast(`閉關 ${away*5} 秒，獲得 ${gain.toLocaleString()} 修為`),350); }
  tickStart=Date.now(); render();
}
function updateCreator() {
  const g=createGender==='男'?'male':'female';
  $('#createCharacter').src=`assets/${g}-character-outfit-${createOutfit}-v12.png`;
  $$('.outfit-choice').forEach((b,i)=>b.querySelector('img').src=`assets/${g}-character-outfit-${i+1}-v12.png`);
  const names=createGender==='男'?['青雲袍','玄劍袍','山嶽袍']:['雲水袍','月華袍','丹霞袍'];
  $$('.outfit-choice').forEach((b,i)=>b.querySelector('small').textContent=names[i]);
}

function toggleFeature(button) {
  const page=button.dataset.page;
  if(currentFeature===page) {
    currentFeature=null;
    $('#featurePanel').classList.add('hidden');
    $('#gameScreen').classList.remove('feature-open');
    $$('.feature-tab').forEach(x=>x.classList.remove('active'));
    return;
  }
  currentFeature=page;
  $$('.feature-tab').forEach(x=>x.classList.toggle('active',x===button));
  const descriptions={sect:'門派加入、任務與貢獻功能將於後續版本開放。',arts:'功法蒐集、參悟與裝配功能將於後續版本開放。',experience:'外出歷練、事件與戰鬥功能將於後續版本開放。'};
  if(page==='root') {
    $('#featurePanel').classList.remove('feature-locked'); renderSpiritRootPanel('root');
  } else if(page==='cave') {
    const unlocked=state.spiritLevel>=10;
    $('#featurePanel').classList.toggle('feature-locked',!unlocked);
    if(unlocked)renderCavePanel('dwelling');else $('#featureDescription').innerHTML=`<div class="realm-lock"><b>融合期開啟</b><small>當前境界：${realmName(state.spiritLevel,spiritRealms)}</small></div>`;
  } else if(page==='bag') {
    $('#featurePanel').classList.remove('feature-locked'); renderBagPanel('bag');
  } else {
    $('#featurePanel').classList.remove('feature-locked');
    $('#featureDescription').textContent=descriptions[page];
  }
  $('#featurePanel').classList.remove('hidden');
  $('#gameScreen').classList.add('feature-open');
}

const caveAreas = {
  spiritStone:{label:'靈石',value:'spiritStone',worker:'workerSpiritStone',level:'spiritStoneAreaLevel',icon:'assets/resource-spirit-stone-v1.png',baseCap:100,foodCost:10,upgradeBase:60},
  food:{label:'食物',value:'food',worker:'workerFood',level:'foodAreaLevel',icon:'assets/resource-food-v1.png',baseCap:1000,foodCost:0,upgradeBase:40},
  wood:{label:'木材',value:'wood',worker:'workerWood',level:'woodAreaLevel',icon:'assets/resource-wood-v1.png',baseCap:800,foodCost:2,upgradeBase:50},
  meteorIron:{label:'隕鐵',value:'meteorIron',worker:'workerMeteorIron',level:'meteorIronAreaLevel',icon:'assets/resource-meteor-iron-v1.png',baseCap:300,foodCost:4,upgradeBase:70}
};
function areaCapacity(area){const growth=area.value==='spiritStone'?1.75:1.35;return Math.floor(area.baseCap*Math.pow(growth,state[area.level]-1))}
function areaWorkerMax(area){return state[area.level]*2}
function areaUpgradeCost(area){return Math.floor(area.upgradeBase*Math.pow(1.65,state[area.level]-1))}
function assignedChildren(){return Object.values(caveAreas).reduce((sum,a)=>sum+state[a.worker],0)}
function availableChildren(){return Math.max(0,state.daoChildTotal-assignedChildren())}
function daoChildCost(){return Math.floor(50*Math.pow(1.5,state.daoChildBought))}
function renderCavePanel(view='dwelling'){
  currentCaveView=view;
  const tabs=[['dwelling','洞府'],['study','書房'],['alchemy','丹房'],['forge','器室'],['brew','仙釀'],['partner','道侶']];
  $('#featureDescription').innerHTML=`<div class="cave-tabs">${tabs.map(([key,label])=>`<button data-cave-view="${key}" class="${key===view?'active':''}">${label}</button>`).join('')}</div><div id="caveInner"></div>`;
  $$('.cave-tabs button').forEach(b=>b.onclick=()=>renderCavePanel(b.dataset.caveView));
  renderCaveView(view);
}
function renderCaveView(view){
  currentCaveView=view;
  $$('.cave-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.caveView===view));
  const inner=$('#caveInner');if(!inner)return;
  if(view!=='dwelling'){
    const names={study:'書房',alchemy:'丹房',forge:'器室',brew:'仙釀',partner:'道侶'};
    inner.innerHTML=`<div class="cave-placeholder"><b>${names[view]}</b><small>相關內容將於後續版本開放</small></div>`;return;
  }
  const cards=Object.entries(caveAreas).map(([key,a])=>{const cap=areaCapacity(a),max=areaWorkerMax(a),upgrade=areaUpgradeCost(a);return `<article class="resource-area"><img src="${a.icon}" alt="${a.label}"><div class="resource-copy"><b>${a.label}・${state[a.level]}級</b><strong>${Math.floor(state[a.value]).toLocaleString()} / ${cap.toLocaleString()}</strong><small>1道童 = 1 ${a.label}／5秒${a.foodCost?`・消耗${a.foodCost}食物`:''}</small></div><div class="worker-stepper"><button data-worker="${key}" data-change="-1">−</button><span>${state[a.worker]} / ${max}</span><button data-worker="${key}" data-change="1">＋</button></div><button class="area-upgrade" data-upgrade-area="${key}" ${state.wood>=upgrade?'':'disabled'}>升級・木材 ${upgrade}</button></article>`}).join('');
  const cost=daoChildCost();
  inner.innerHTML=`<section class="dao-child-yard"><img src="assets/resource-dao-child-v1.png" alt="道童"><div><small>可用道童</small><b>${availableChildren()} / ${state.daoChildTotal}</b><em>未安排的道童會在此等候</em></div><button id="buyDaoChild" ${state.food>=cost?'':'disabled'}>招募<br>食物 ${cost}</button></section><div class="resource-area-grid">${cards}</div>`;
  $$('.worker-stepper button').forEach(b=>b.onclick=()=>assignWorker(b.dataset.worker,+b.dataset.change));
  $$('.area-upgrade').forEach(b=>b.onclick=()=>upgradeCaveArea(b.dataset.upgradeArea));
  $('#buyDaoChild').onclick=buyDaoChild;
}
function assignWorker(key,change){const a=caveAreas[key];if(change>0){if(availableChildren()<1)return toast('目前沒有閒置道童');if(state[a.worker]>=areaWorkerMax(a))return toast('此區域已達道童上限')}else if(state[a.worker]<=0)return;state[a.worker]+=change;renderCaveView('dwelling');save()}
function buyDaoChild(){const cost=daoChildCost();if(state.food<cost)return toast('食物不足');state.food-=cost;state.daoChildTotal++;state.daoChildBought++;toast('新道童前來投效');renderCaveView('dwelling');render();save()}
function upgradeCaveArea(key){const a=caveAreas[key],cost=areaUpgradeCost(a);if(state.wood<cost)return toast('木材不足');state.wood-=cost;state[a.level]++;toast(`${a.label}區域提升至${state[a.level]}級`);renderCaveView('dwelling');save()}
function runSettlementTick(ticks=1){
  for(let i=0;i<ticks;i++){
    const foodArea=caveAreas.food;state.food=Math.min(areaCapacity(foodArea),state.food+state.workerFood);
    for(const key of ['spiritStone','wood','meteorIron']){
      const a=caveAreas[key],room=Math.max(0,areaCapacity(a)-state[a.value]);
      const possible=Math.min(state[a.worker],room,a.foodCost?Math.floor(state.food/a.foodCost):state[a.worker]);
      if(possible>0){state.food-=possible*a.foodCost;state[a.value]+=possible}
    }
  }
}

const elementData = {
  metal:{label:'金',root:'metalRoot',art:'metalArt',icon:'assets/element-metal-v2.png'},
  wood:{label:'木',root:'woodRoot',art:'woodArt',icon:'assets/element-wood-v2.png'},
  water:{label:'水',root:'waterRoot',art:'waterArt',icon:'assets/element-water-v2.png'},
  fire:{label:'火',root:'fireRoot',art:'fireArt',icon:'assets/element-fire-v2.png'},
  earth:{label:'土',root:'earthRoot',art:'earthArt',icon:'assets/element-earth-v2.png'}
};
function renderSpiritRootPanel(view='root') {
  $('#featureDescription').innerHTML='<div class="root-tabs"><button data-root-view="root">靈根</button><button data-root-view="pool">靈池</button></div><div id="rootInner"></div>';
  $$('.root-tabs button').forEach(b=>b.onclick=()=>renderSpiritRootView(b.dataset.rootView));
  renderSpiritRootView(view);
}
function renderSpiritRootView(view) {
  currentRootView=view;
  $$('.root-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.rootView===view));
  const inner=$('#rootInner'); if(!inner)return;
  if(view==='pool') {
    const woodCost=poolWoodCost(),ironCost=poolIronCost(),can=state.wood>=woodCost&&state.meteorIron>=ironCost;
    inner.innerHTML=`<div class="pool-page"><div class="pool-level">${state.spiritPoolLevel}階靈池</div><div class="pool-art small"><span></span><img src="assets/spirit-pool-v3.png" alt="靈池"></div><div class="pool-stats"><div><small>靈氣產量</small><b>${auraRate().toLocaleString()} / 5秒</b></div><div><small>儲存靈氣</small><b>${Math.floor(state.aura).toLocaleString()} / ${auraCapacity().toLocaleString()}</b></div></div><div class="pool-materials">持有：木材 ${state.wood.toLocaleString()}・隕鐵 ${state.meteorIron.toLocaleString()}<br>升階需要：木材 ${woodCost.toLocaleString()}・隕鐵 ${ironCost.toLocaleString()}</div><button id="upgradePoolBtn" class="jade-button" ${can?'':'disabled'}>靈池升階</button></div>`;
    $('#upgradePoolBtn').onclick=upgradeSpiritPool;
    return;
  }
  const elements=Object.entries(elementData).map(([key,e],index)=>{const level=state[e.root],cost=spiritRootReq(level);return `<button class="element-node element-${key}" data-element="${key}" style="--i:${index}"><img src="${e.icon}" alt="${e.label}系"><b>${e.label}</b><small>${rootRank(level)}</small><em>${e.label}系功法 +${state[e.art]}</em><span>需 ${cost.toLocaleString()} 靈氣</span></button>`}).join('');
  inner.innerHTML=`<div class="spirit-root-stage"><div class="element-orbit">${elements}<div class="pool-art"><span></span><img src="assets/spirit-pool-v3.png" alt="靈池"><strong>靈氣<br>${Math.floor(state.aura).toLocaleString()} / ${auraCapacity().toLocaleString()}</strong></div></div><small class="root-hint">點擊五系圖騰，以靈氣淬鍊對應靈根</small></div>`;
  $$('.element-node').forEach(b=>b.onclick=()=>upgradeSpiritRoot(b.dataset.element));
}
function upgradeSpiritRoot(key) {
  const e=elementData[key],level=state[e.root],cost=spiritRootReq(level);
  if(state.aura<cost)return toast(`尚缺 ${Math.ceil(cost-state.aura).toLocaleString()} 靈氣`);
  state.aura-=cost;state[e.root]++;state[e.art]+=2;toast(`${e.label}系靈根提升至${rootRank(state[e.root])}`);renderSpiritRootView('root');save();
}
function upgradeSpiritPool() {
  const woodCost=poolWoodCost(),ironCost=poolIronCost();
  if(state.wood<woodCost||state.meteorIron<ironCost)return toast('升階材料不足');
  state.wood-=woodCost;state.meteorIron-=ironCost;state.spiritPoolLevel++;toast(`靈池提升至${state.spiritPoolLevel}階`);renderSpiritRootView('pool');save();
}

function renderBagPanel(view='bag') {
  $('#featureDescription').innerHTML='<div class="bag-tabs"><button data-bag-view="bag">儲物袋</button><button data-bag-view="character">人物</button></div><div id="bagInner"></div>';
  $$('.bag-tabs button').forEach(b=>b.onclick=()=>renderBagView(b.dataset.bagView));
  renderBagView(view);
}
function renderBagView(view) {
  $$('.bag-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.bagView===view));
  const inner=$('#bagInner'); if(!inner)return;
  if(view==='bag') {
    inner.innerHTML='<div class="inventory-grid">'+Array.from({length:20},()=>'<span></span>').join('')+'</div><small class="empty-note">目前儲物袋空空如也</small>';
    return;
  }
  const g=state.gender==='男'?'male':'female', src=`assets/${g}-character-outfit-${state.outfit||1}-v12.png`;
  const slots=Array.from({length:4},()=>'<span class="equip-slot"></span>').join('');
  inner.innerHTML=`<div class="equipment-layout"><div class="equipment-side">${slots}</div><div class="equipment-character"><img src="${src}" alt="人物"><button id="characterAttributesBtn" ${hasSpiritualSense()?'':'disabled'}>${hasSpiritualSense()?'人物屬性':'需習得神識入體'}</button></div><div class="equipment-side">${slots}</div></div>`;
  if(hasSpiritualSense()) $('#characterAttributesBtn').onclick=showCharacterAttributes;
}
function showCharacterAttributes() {
  const inner=$('#bagInner');
  const health=state.rootBone*5,attack=state.trueQi*5,defense=state.physique*20,evasion=state.agility*3,critical=state.spiritualPower*3;
  inner.innerHTML=`<section class="character-sheet"><div class="sheet-header"><div><small>姓名</small><b>${state.name}</b></div><div><small>修煉歲月</small><b>${experiencedYears().toLocaleString()}年</b></div><div><small>練氣境界</small><b>${realmName(state.spiritLevel,spiritRealms)}</b></div><div><small>煉體境界</small><b>${realmName(state.bodyLevel,bodyRealms)}</b></div><div><small>出生</small><b>${state.origin}</b></div><div><small>門派</small><b>${state.sect||'無門無派'}</b></div></div><div class="sheet-title">屬性</div><div class="sheet-attributes"><div><span>根骨：${state.rootBone}</span><strong>氣血：${health}</strong></div><div><span>真氣：${state.trueQi}</span><strong>攻擊：${attack}</strong></div><div><span>體魄：${state.physique}</span><strong>防禦：${defense}</strong></div><div><span>身法：${state.agility}</span><strong>閃避：${evasion}</strong></div><div><span>靈力：${state.spiritualPower}</span><strong>暴擊：${critical}</strong></div><div><span>悟性：${state.comprehension}</span><strong>修練效率：+${cultivationEfficiency()}</strong></div><div><span>機緣：${state.fortune}</span><strong>靈氣獲取：+${auraEfficiency()}</strong></div></div><div class="five-arts"><b>五系功法屬性</b><span>金 +${state.metalArt}</span><span>木 +${state.woodArt}</span><span>水 +${state.waterArt}</span><span>火 +${state.fireArt}</span><span>土 +${state.earthArt}</span></div></section><button id="attributeBackBtn" class="text-button">返回人物</button>`;
  $('#attributeBackBtn').onclick=()=>renderBagView('character');
}

function enterFromTitle() { if(state.name) startGame(); else { startBgm('title'); show('#createScreen'); } }
function showSettingsSection(section) {
  ['#settingsMain','#deleteStepOne','#deleteStepTwo'].forEach(id=>$(id).classList.add('hidden'));
  $(section).classList.remove('hidden');
}
function openSettings() {
  $('#gameMenu').classList.add('hidden');
  $('#settingsModal').classList.remove('hidden');
  $('#deleteConfirmInput').value=''; $('#deleteError').textContent='';
  $('#deletePhraseHint').textContent=`${state.name}/刪除`;
  showSettingsSection('#settingsMain');
}

load(); $('#titleHint').textContent=state.name?'點擊螢幕繼續修煉':'點擊螢幕進入遊戲';
$('#titleScreen').onclick=enterFromTitle;
$('#titleScreen').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enterFromTitle()}};
$('#backTitleBtn').onclick=()=>{startBgm('title');show('#titleScreen')};
$$('.gender').forEach(b=>b.onclick=()=>{$$('.gender').forEach(x=>x.classList.remove('active'));b.classList.add('active');createGender=b.dataset.gender;updateCreator()});
$$('.outfit-choice').forEach(b=>b.onclick=()=>{$$('.outfit-choice').forEach(x=>x.classList.remove('active'));b.classList.add('active');createOutfit=+b.dataset.style;updateCreator()});
function updateOriginPreview(){$('#originStats').textContent=originDescriptions[createOrigin]}
$$('.origin-choice').forEach(b=>b.onclick=()=>{$$('.origin-choice').forEach(x=>x.classList.remove('active'));b.classList.add('active');createOrigin=b.dataset.origin;updateOriginPreview()});
$('#createBtn').onclick=()=>{const n=$('#nameInput').value.trim();if(!n){$('#nameError').textContent='請留下你的道號';return}state={...defaults,...originProfiles[createOrigin],name:n,gender:createGender,hair:1,outfit:createOutfit,origin:createOrigin,bornAt:Date.now(),lastSave:Date.now()};startGame();save()};
$('#spiritUp').onclick=()=>upgrade('spirit'); $('#bodyUp').onclick=()=>upgrade('body');
$('#tribConfirm').onclick=tribulate; $('#tribCancel').onclick=()=>$('#tribulationModal').classList.add('hidden');
$$('.feature-tab').forEach(b=>b.onclick=()=>toggleFeature(b));
$('#menuBtn').onclick=()=>$('#gameMenu').classList.toggle('hidden');
$('#settingsBtn').onclick=openSettings;
$('#settingsCloseBtn').onclick=()=>$('#settingsModal').classList.add('hidden');
$('#deleteStartBtn').onclick=()=>showSettingsSection('#deleteStepOne');
$('#deleteCancelBtn').onclick=()=>showSettingsSection('#settingsMain');
$('#deleteVerifyBtn').onclick=()=>{
  if($('#deleteConfirmInput').value.trim()!==`${state.name}/刪除`){$('#deleteError').textContent='輸入內容不正確';return}
  $('#deleteError').textContent=''; showSettingsSection('#deleteStepTwo');
};
$('#deleteBackBtn').onclick=()=>showSettingsSection('#deleteStepOne');
$('#deleteFinalBtn').onclick=()=>{suppressSave=true;localStorage.removeItem(saveKey);localStorage.removeItem('wendao-idle-v1');location.reload()};
$('#backToTitle').onclick=()=>{save();$('#gameMenu').classList.add('hidden');$('#settingsModal').classList.add('hidden');$('#titleHint').textContent='點擊螢幕繼續修煉';show('#titleScreen');startBgm('title')};
$('#muteBtn').onclick=()=>{state.muted=!state.muted;updateBgmVolume();render();save()};
setInterval(()=>{if($('#gameScreen').classList.contains('active')){addAura(auraRate());runSettlementTick();addCultivation(rate());if(currentFeature==='root')renderSpiritRootView(currentRootView);if(currentFeature==='cave'&&state.spiritLevel>=10)renderCavePanel(currentCaveView);tickStart=Date.now()}},5000);
setInterval(()=>{if($('#gameScreen').classList.contains('active'))$('#tickBar').style.width=Math.min(100,(Date.now()-tickStart)/50)+'%'},50);
setInterval(()=>{if($('#gameScreen').classList.contains('active'))$('#yearsElapsed').textContent=`${experiencedYears().toLocaleString()} 年`},1000);
window.addEventListener('beforeunload',()=>{if(!suppressSave)save()}); updateCreator(); updateOriginPreview(); render();
