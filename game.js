const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const spiritRealms = ['開光','融合','金丹','元嬰','分神','合體','洞虛','大乘','遊仙','真仙','玄仙','天仙','太乙玉仙','大羅金仙','元神','空玄','萬劫','混元','準聖','聖人','不朽','靈尊','天道'];
const bodyRealms = ['凡身','凝氣','易筋','煆骨','洗髓','金身','神力','神勇','千山','萬水','森羅','萬象'];
const maxSpiritLevel=spiritRealms.length*10-1,maxBodyLevel=bodyRealms.length*10-1;
const realmGrowthMultipliers=[1.20,1.80,2.50,3.30,4.20,5.20,6.30,7.50,8.80,10.20,11.70,13.30,15.00,16.80,18.70,20.70,22.80,25.00,27.30,29.70,32.20,34.80,37.50];
const realmEfficiencyMultipliers=(()=>{const values=[3,4.5,6.9,10.5,15.6,22.5,33,48,69,99];while(values.length<spiritRealms.length)values.push(Math.round(values.at(-1)*2.3));return values})();
const spiritRootRanks = ['廢品','凡品','下品','中品','良品','超品','上品','極品','完美','先天','凡仙','仙品','歸元','天心','三清','六禦','玄門','全真','淨明','天道'];
const sectRanks = ['外門弟子','內門弟子','親傳弟子','供奉','護法'];
const sectPromotionCosts = [500,1000,2000,5000];
const sectSalary = [200,500,1000,1800,3000];
const sectCatalog = [
  {star:1,need:0,realm:'開光',good:['青竹門','清溪派','松風堂','白石觀'],evil:['黑風寨','赤蛇幫','斷刃堂']},
  {star:2,need:20,realm:'金丹',good:['靈泉宗','丹楓谷','御風門','碧水宮','玄木派'],evil:['血衣樓','噬魂堂','鬼藤谷','幽燈教']},
  {star:3,need:40,realm:'分神',good:['青鸞劍宗','百草仙門','紫陽宮','天河書院','鎮岳宗'],evil:['九煞宗','玄屍門','萬毒谷','奪魄宮','赤煉魔宗']},
  {star:4,need:60,realm:'洞虛',good:['太虛劍派','五雷天宗','蓬萊仙宮','星辰道門','乾元宗'],evil:['黃泉殿','萬妖天府','焚心魔教']},
  {star:5,need:80,realm:'遊仙',good:['神霄天宮','滄海龍門','玄天劍庭','終南紫府'],evil:['冥獄魔都','合歡天宗','幽冥血海']},
  {star:6,need:100,realm:'玄仙',good:['萬壽仙山','梵天聖宗','六道玄宮','歸墟仙門'],evil:['太古魔殿','吞天妖庭','絕情天宮']},
  {star:7,need:110,realm:'天仙',good:['無上劍閣','蒼穹道統','玉虛仙府'],evil:['昆吾魔山','十方邪樓','彼岸花宮']},
  {star:8,need:120,realm:'太乙玉仙',good:['昊天聖宮','須彌神山','太初龍院'],evil:['玄陰帝谷','葬月魔宗','燭龍神庭']},
  {star:9,need:130,realm:'大羅金仙',good:['太上白玉京','諸天星羅神宗','九霄凌天仙宮'],evil:['永劫輪迴殿','無極天魔聖宗','太古神夢天宮']}
];
const sectTasks = [
  {id:'sweep',name:'灑掃庭院',need:0,gain:5,stone:20,prestige:1,desc:'每日灑掃殿前石階，維持門庭清淨。'},
  {id:'cook',name:'膳房幫廚',need:10,gain:6,stone:30,prestige:1,desc:'協助膳房備膳，照料同門起居。'},
  {id:'herb',name:'採藥巡山',need:20,gain:8,stone:50,prestige:2,desc:'巡查外山並採集門中所需靈藥。'},
  {id:'escort',name:'護送門人',need:30,gain:10,stone:75,prestige:3,desc:'護送低階弟子往返坊市，保全物資。'},
  {id:'gate',name:'鎮守山門',need:40,gain:12,stone:110,prestige:4,desc:'駐守護山大陣，盤查來往修士。'},
  {id:'vein',name:'調和地脈',need:50,gain:15,stone:160,prestige:5,desc:'梳理山中靈脈，穩固宗門根基。'},
  {id:'demon',name:'清剿妖患',need:60,gain:18,stone:230,prestige:7,desc:'率隊清除宗門疆域內的妖邪禍患。'},
  {id:'array',name:'維護大陣',need:70,gain:21,stone:320,prestige:9,desc:'巡視護宗陣眼，補全破損禁制。'},
  {id:'realm',name:'駐守秘境',need:80,gain:24,stone:450,prestige:12,desc:'長期鎮守宗門秘境與珍稀資源。'},
  {id:'diplomacy',name:'出使仙盟',need:90,gain:27,stone:620,prestige:16,desc:'代表門派拜訪各方勢力，維繫盟約。'},
  {id:'rift',name:'鎮壓虛空裂隙',need:100,gain:30,stone:850,prestige:20,desc:'以玄仙之力封鎮裂隙，護佑門中萬年基業。'}
];
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
const itemCatalog = {
  sectToken:{name:'門派令牌',image:'assets/sect-token-v1.png',description:'門派授予弟子的信物，令牌內留有宗門印記。使用後可增加 100 點門派貢獻。',count:'sectTokens',usable:true}
};
const artKinds={secret:{tab:'秘籍',attribute:'trueQi',label:'真氣'},formula:{tab:'真訣',attribute:'rootBone',label:'根骨'},sutra:{tab:'心經',attribute:'physique',label:'體魄'},escape:{tab:'遁術',attribute:'agility',label:'身法'},ultimate:{tab:'絕學',attribute:'comprehension',label:'悟性'},fragment:{tab:'殘頁',attribute:'fortune',label:'機緣'}};
const artTabs=[['sect','門派技能'],['secret','秘籍'],['formula','真訣'],['sutra','心經'],['escape','遁術'],['ultimate','絕學'],['fragment','殘頁'],['moves','招式']];
const artElements=[['metal','金','metalRoot'],['wood','木','woodRoot'],['water','水','waterRoot'],['fire','火','fireRoot'],['earth','土','earthRoot']];
const artTierMax=[120,260,520,900,1400,2050,2933,3352,4800];
const defaults = { name:'', gender:'女', hair:1, outfit:1, origin:'家族子弟', muted:false, free:0, spiritLevel:0, bodyLevel:0, pills:1, totalEarned:0, rootBone:5, trueQi:5, physique:5, agility:5, spiritualPower:5, comprehension:5, fortune:5, attributeGrowthVersion:1, learnedArts:[],artsCapacity:8,metalArt:0, woodArt:0, waterArt:0, fireArt:0, earthArt:0, metalRoot:0, woodRoot:0, waterRoot:0, fireRoot:0, earthRoot:0, aura:0, spiritPoolLevel:1, spiritStone:0, spiritJade:0, food:200, wood:40, meteorIron:20, daoChildTotal:1, daoChildBought:0, workerSpiritStone:0, workerFood:0, workerWood:0, workerMeteorIron:0, spiritStoneAreaLevel:1, foodAreaLevel:1, woodAreaLevel:1, meteorIronAreaLevel:1, sect:'', sectFaction:'', sectStar:0, sectContribution:0, sectRank:0, sectTask:'', sectJoinedAt:null, sectYearsProcessed:0, righteousness:0, evilQi:0, prestige:200, actingLeader:false, npcAffinity:{}, npcDaily:{}, sectTokens:0, sectTokenDaily:{date:'',exchanged:0}, practiceBuff:{active:false,until:0,remaining:0,total:0}, transmissionBuff:{active:false,until:0,remaining:0,total:0}, lastGreetingDay:'', lastSalaryDay:'', lastPracticeDay:'', bornAt:null, lastTrustedTime:0, lastSave:Date.now() };
let state = { ...defaults }, tickStart = Date.now();
const saveKey = 'wendao-idle-v2';
let createGender='女', createOutfit=1, createOrigin='家族子弟', audioContext=null, currentFeature=null, currentRootView='root', currentCaveView='dwelling', currentSectView='home', currentArtsView='sect', suppressSave=false;
let bgmTheme=null,battle=null,battleTimer=null,pauseStartedAt=null,sessionOnline=false,confirmResolver=null;
let clockEpoch=Date.now(),clockPerf=performance.now(),trustedClockReady=location.protocol==='file:',clockSyncPromise=null;

function setClockAnchor(epoch,trusted=false){clockEpoch=epoch;clockPerf=performance.now();trustedClockReady=trusted||location.protocol==='file:'}
function gameNow(){return Math.floor(clockEpoch+(performance.now()-clockPerf))}
async function syncTrustedTime(){
  if(location.protocol==='file:'){setClockAnchor(Date.now(),true);return true}
  if(clockSyncPromise)return clockSyncPromise;
  clockSyncPromise=(async()=>{
    try{
      const started=performance.now(),url=`${location.origin}${location.pathname}?clock=${Math.random().toString(36).slice(2)}`;
      const response=await fetch(url,{method:'HEAD',cache:'no-store'}),received=performance.now(),header=response.headers.get('date'),serverTime=Date.parse(header||'');
      if(!response.ok||!Number.isFinite(serverTime))throw new Error('server time unavailable');
      const estimated=serverTime+Math.min(1000,Math.max(0,(received-started)/2)),previous=state.lastTrustedTime||0;
      if(previous&&estimated+120000<previous)throw new Error('server time moved backwards');
      const trusted=Math.max(estimated,previous);setClockAnchor(trusted,true);state.lastTrustedTime=trusted;return true;
    }catch{return false}finally{clockSyncPromise=null}
  })();
  return clockSyncPromise;
}
function requireTrustedTime(){if(trustedClockReady)return true;toast('尚未取得可信時間，請確認網路後重新進入遊戲');return false}

function req(level) { const realm=Math.min(Math.floor(level/10),realmGrowthMultipliers.length-1);return Math.round(1000*Math.pow(1.10,level)*realmGrowthMultipliers[realm]); }
function bodyReq(level) { return req(level)*5; }
function formatLargeNumber(value){if(!Number.isFinite(value))return '∞';if(Math.abs(value)<1e15)return Math.round(value).toLocaleString();const exponent=Math.floor(Math.log10(Math.abs(value))),mantissa=value/Math.pow(10,exponent);return `${mantissa.toFixed(2)}e${exponent}`}
function spiritAttributeGain(newLevel) {
  const curve=1+Math.floor((Math.max(1,newLevel)-1)/20);
  return {trueQi:2+curve,rootBone:1+Math.ceil(curve/2),agility:newLevel%3===0?1+Math.floor(curve/6):0,physique:newLevel%5===0?1+Math.floor(curve/7):0,comprehension:newLevel%10===0?1+Math.floor(newLevel/50):0};
}
function bodyAttributeGain(newLevel) {
  const curve=1+Math.floor((Math.max(1,newLevel)-1)/20);
  return {rootBone:2+curve,physique:2+curve,trueQi:newLevel%4===0?1+Math.floor(curve/5):0,agility:newLevel%5===0?1+Math.floor(curve/6):0};
}
function applyAttributeGain(gain){Object.entries(gain).forEach(([key,value])=>state[key]=(state[key]||0)+value)}
function cumulativeGrowth(spiritLevel,bodyLevel=0){const total={rootBone:0,trueQi:0,physique:0,agility:0,comprehension:0};for(let i=1;i<=spiritLevel;i++)Object.entries(spiritAttributeGain(i)).forEach(([k,v])=>total[k]=(total[k]||0)+v);for(let i=1;i<=bodyLevel;i++)Object.entries(bodyAttributeGain(i)).forEach(([k,v])=>total[k]=(total[k]||0)+v);return total}
function hasSpiritualSense() { return state.spiritLevel>=40; }
function experiencedYears() { return state.bornAt ? Math.max(0,Math.floor((gameNow()-state.bornAt)/900000)) : 0; }
function realmName(level, arr) {
  return `${arr[Math.min(Math.floor(level/10),arr.length-1)]}・${['一','二','三','四','五','六','七','八','九','十'][level%10]}層`;
}
function artBaseEffect(art){return Math.round(artTierMax[art.tier-1]*(art.level/10))}
function artRootEffect(art){return Math.round((state[`${art.element}Art`]||0)*art.tier*art.level)}
function artTotalEffect(art){return artBaseEffect(art)+artRootEffect(art)}
function artBonusFor(attribute){return (state.learnedArts||[]).filter(art=>artKinds[art.kind]?.attribute===attribute).reduce((sum,art)=>sum+artTotalEffect(art),0)}
function effectiveCore(attribute){return (state[attribute]||0)+artBonusFor(attribute)}
function cultivationEfficiency() { return effectiveCore('comprehension')*.5; }
function auraEfficiency() { return Math.floor(1.25*Math.sqrt(Math.max(0,effectiveCore('fortune')))); }
function pathEfficiency(level){const realm=Math.min(Math.floor(level/10),realmEfficiencyMultipliers.length-1),layer=level%10;return realmEfficiencyMultipliers[realm]*(1+layer*.035)}
function realmEfficiency(){return Math.max(1,pathEfficiency(state.spiritLevel)+pathEfficiency(state.bodyLevel)-realmEfficiencyMultipliers[0])}
function baseRate() { return Math.max(1,Math.floor((10+cultivationEfficiency())*realmEfficiency())); }
function buffRemaining(key,now=gameNow()){const buff=state[key]||defaults[key];return buff.active?Math.max(0,(buff.until||0)-now):Math.max(0,buff.remaining||0)}
function buffActive(key,now=gameNow()){return !!state[key]?.active&&buffRemaining(key,now)>0}
function cultivationMultiplier(now=gameNow()){return 1+(buffActive('practiceBuff',now)?4:0)+(buffActive('transmissionBuff',now)?7:0)}
function rate() { return Math.max(1,Math.floor(baseRate()*cultivationMultiplier())); }
function buffYears(key){return buffRemaining(key)/900000}
function addCultivationBuff(key,years){const remaining=buffRemaining(key),duration=years*900000,total=remaining+duration;state[key]={active:true,until:gameNow()+total,remaining:0,total}}
function buffClock(key){const seconds=Math.max(0,Math.ceil(buffRemaining(key)/1000)),hours=Math.floor(seconds/3600),minutes=Math.floor(seconds%3600/60),secs=seconds%60;return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(secs).padStart(2,'0')}`}
function buffPercent(key){const buff=state[key],total=Math.max(1,buff?.total||buffRemaining(key));return Math.max(0,Math.min(100,buffRemaining(key)/total*100))}
function offlineCultivationGain(from,to){const base=baseRate(),ticks=Math.max(0,(to-from)/5000);let gain=base*ticks;for(const [key,bonus] of [['practiceBuff',4],['transmissionBuff',7]]){const buff=state[key];if(buff?.active)gain+=base*bonus*Math.max(0,Math.min(to,buff.until||0)-from)/5000}return Math.floor(gain)}
function auraRate() { return Math.max(1,Math.floor(5+(state.spiritPoolLevel-1)*2+auraEfficiency())); }
function poolStorageHours() { return Math.min(18,2+(state.spiritPoolLevel-1)*.75); }
function auraCapacity() { return Math.floor(auraRate()*720*poolStorageHours()); }
function spiritRootReq(level) { return Math.floor(500*Math.pow(1.38,level)); }
function poolWoodCost() { return Math.floor(20*Math.pow(1.45,state.spiritPoolLevel-1)); }
function poolIronCost() { return Math.floor(10*Math.pow(1.5,state.spiritPoolLevel-1)); }
function rootRank(level) { return `${spiritRootRanks[Math.min(Math.floor(level/10),spiritRootRanks.length-1)]}・${level%10+1}階`; }
function chanceFromRating(rating,cap) { return Math.min(cap,rating/(rating+1000)*100); }
function save() { if(suppressSave)return;const now=gameNow();state.lastSave=now;if(trustedClockReady)state.lastTrustedTime=Math.max(state.lastTrustedTime||0,now);localStorage.setItem(saveKey,JSON.stringify(state)); }
function load() {
  try {
    const current=JSON.parse(localStorage.getItem(saveKey));
    if(current) { const migrateGrowth=current.attributeGrowthVersion!==1;state={...defaults,...current};state.learnedArts=Array.isArray(current.learnedArts)?current.learnedArts:[];state.sectTokenDaily={...defaults.sectTokenDaily,...current.sectTokenDaily};state.practiceBuff={...defaults.practiceBuff,...current.practiceBuff};state.transmissionBuff={...defaults.transmissionBuff,...current.transmissionBuff};if(migrateGrowth){applyAttributeGain(cumulativeGrowth(state.spiritLevel,state.bodyLevel));state.attributeGrowthVersion=1}state.bornAt ||= Date.now(); state.npcAffinity||={};state.npcDaily||={};normalizeLearnedArts();migrateSectName(); return state; }
    const old=JSON.parse(localStorage.getItem('wendao-idle-v1'));
    if(old) { state={...defaults,...old,free:(old.free||0)+(old.spiritQi||0)+(old.bodyQi||0)}; state.bornAt ||= Date.now(); }
  } catch {}
}
function migrateSectName(){
  if(!state.sect)return;const all=sectCatalog.flatMap(g=>[...g.good,...g.evil]);if(all.includes(state.sect))return;
  const group=sectCatalog.find(g=>g.star===state.sectStar)||sectCatalog[0],pool=state.sectFaction==='邪'?group.evil:group.good;
  const seed=[...state.sect].reduce((n,c)=>n+c.charCodeAt(0),0);state.sect=pool[seed%pool.length];
}
function show(id) { $$('.screen').forEach(x=>x.classList.remove('active')); $(id).classList.add('active'); }
function isPureCultivationView() {
  return $('#gameScreen').classList.contains('active')
    && currentFeature===null
    && $('#featurePanel').classList.contains('hidden')
    && $('#gameMenu').classList.contains('hidden')
    && !document.querySelector('.modal:not(.hidden)');
}
function hideCultivationToast() {
  const x=$('#toast');
  if(x.dataset.kind==='cultivation'&&x.classList.contains('show'))x.classList.remove('show');
}
function toast(text,kind='general') { const x=$('#toast'); x.textContent=text;x.dataset.kind=kind;x.classList.add('show'); setTimeout(()=>x.classList.remove('show'),1800); }
new MutationObserver(()=>{if(!isPureCultivationView())hideCultivationToast()})
  .observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});
function closeGameConfirm(result=false){
  $('#confirmModal').classList.add('hidden');
  const resolve=confirmResolver;confirmResolver=null;if(resolve)resolve(result);
}
function gameConfirm(message,{title='確認操作',confirmText='確認',danger=false}={}){
  if(confirmResolver)closeGameConfirm(false);
  $('#confirmModalTitle').textContent=title;$('#confirmModalMessage').textContent=message;
  const accept=$('#confirmModalAccept');accept.textContent=confirmText;accept.className=danger?'danger-button':'jade-button';
  $('#confirmModal').classList.remove('hidden');
  return new Promise(resolve=>{confirmResolver=resolve});
}
function addCultivation(amount,silent=false) {
  state.free += amount; state.totalEarned += amount;
  if(!silent) { if(isPureCultivationView())toast(`修為+${amount}`,'cultivation'); playTone(); }
  render(); save();
}
function addAura(amount) { const cap=auraCapacity();if(state.aura<cap)state.aura=Math.min(cap,state.aura+amount); }
function playTone() {
  if(state.muted) return;
  try { audioContext ||= new (window.AudioContext||window.webkitAudioContext)(); const o=audioContext.createOscillator(),g=audioContext.createGain();o.frequency.value=520;g.gain.setValueAtTime(.035,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.35);o.connect(g).connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+.35); } catch {}
}
function updateBgmVolume() {
  ['#titleBgm','#mainBgm','#battleBgm'].forEach(id=>{const track=$(id);track.muted=state.muted;track.volume=id==='#battleBgm'?.48:.42});
}
function startBgm(theme) {
  const tracks={title:$('#titleBgm'),main:$('#mainBgm'),battle:$('#battleBgm')}, next=tracks[theme];
  Object.entries(tracks).forEach(([name,track])=>{if(name!==theme){track.pause();track.currentTime=0}});
  bgmTheme=theme; updateBgmVolume();
  next.play().catch(()=>{});
}
function stopAllBgm() {
  ['#titleBgm','#mainBgm','#battleBgm'].forEach(id=>{const track=$(id);track.pause();track.currentTime=0});
  bgmTheme=null;
}
function render() {
  const spiritMax=state.spiritLevel>=maxSpiritLevel,bodyMax=state.bodyLevel>=maxBodyLevel,spiritCost=spiritMax?Infinity:req(state.spiritLevel),bodyCost=bodyMax?Infinity:bodyReq(state.bodyLevel),free=Math.floor(state.free);
  $('#playerName').textContent=state.name; $('#totalQi').textContent=free.toLocaleString();
  $('#spiritStoneAmount').textContent=Math.floor(state.spiritStone).toLocaleString();
  $('#spiritJadeAmount').textContent=Math.floor(state.spiritJade).toLocaleString();
  $('#headerSpiritRealm').textContent=realmName(state.spiritLevel,spiritRealms);
  $('#headerSect').textContent=state.sect||'無門無派';
  $('#yearsElapsed').textContent=`${experiencedYears().toLocaleString()} 年`;
  $('#rateText').textContent=rate().toLocaleString()+' / 5秒';
  $('#spiritRealm').textContent=realmName(state.spiritLevel,spiritRealms);
  $('#bodyRealm').textContent=realmName(state.bodyLevel,bodyRealms);
  $('#spiritCost').textContent=spiritMax?'已達最高境界':`提升需 ${formatLargeNumber(spiritCost)}`;
  $('#bodyCost').textContent=bodyMax?'已達最高境界':`提升需 ${formatLargeNumber(bodyCost)}`;
  $('#spiritUp').classList.toggle('ready',!spiritMax&&free>=spiritCost);
  $('#bodyUp').classList.toggle('ready',!bodyMax&&free>=bodyCost);
  $('#pillCount').textContent='護脈丹：'+state.pills; $('#usePill').disabled=state.pills<1;
  $('#muteBtn').textContent=state.muted?'♫ 開啟音效':'♪ 靜音';
}
function upgrade(type) {
  const spirit=type==='spirit', cost=spirit?req(state.spiritLevel):bodyReq(state.bodyLevel);
  if((spirit&&state.spiritLevel>=maxSpiritLevel)||(!spirit&&state.bodyLevel>=maxBodyLevel))return toast('已達此道最高境界');
  if(state.free<cost) return toast(`尚缺 ${(cost-state.free).toFixed(0)} 修為`);
  if(spirit && (state.spiritLevel+1)%10===0) return openTrib();
  state.free-=cost;
  if(spirit) { const gain=spiritAttributeGain(state.spiritLevel+1);state.spiritLevel++;applyAttributeGain(gain);toast(`已提升至${realmName(state.spiritLevel,spiritRealms)}`); }
  else {
    const gain=bodyAttributeGain(state.bodyLevel+1); state.bodyLevel++;applyAttributeGain(gain);
    toast(`已提升至${realmName(state.bodyLevel,bodyRealms)}`);
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
    if(!sessionOnline)return;
    game.classList.remove('struck');
    if(Math.random()*100<chance) {
      const gain=spiritAttributeGain(state.spiritLevel+1);state.free-=cost; state.spiritLevel++;applyAttributeGain(gain);game.classList.add('success');
      toast(`已提升至${realmName(state.spiritLevel,spiritRealms)}${state.spiritLevel===40?'・習得神識入體':''}`);
      setTimeout(()=>game.classList.remove('success'),1700);
    } else {
      state.free=Math.max(0,state.free-Math.ceil(cost*.5)); game.classList.add('failure'); toast('渡劫失敗，焦黑倒地…');
      setTimeout(()=>game.classList.remove('failure'),2100);
    }
    render(); save();
  },1350);
}
function rewardSnapshot(){return {free:state.free,aura:state.aura,spiritStone:state.spiritStone,food:state.food,wood:state.wood,meteorIron:state.meteorIron,sectContribution:state.sectContribution,prestige:state.prestige}}
function showOfflineRewards(before,seconds){
  const labels={free:'修為',aura:'靈氣',spiritStone:'靈石',food:'食物',wood:'木材',meteorIron:'隕鐵',sectContribution:'門派貢獻',prestige:'威望'},after=rewardSnapshot(),rows=Object.entries(labels).map(([key,label])=>[label,Math.max(0,Math.floor(after[key]-before[key]))]).filter(([,amount])=>amount>0);
  const hours=Math.floor(seconds/3600),minutes=Math.floor(seconds%3600/60),secs=seconds%60;$('#offlineDuration').textContent=`離線時間 ${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  $('#offlineRewardList').innerHTML=rows.length?rows.map(([label,amount])=>`<div><span>${label}</span><b>+${amount.toLocaleString()}</b></div>`).join(''):'<p>本次離線時間不足，尚未產生收益。</p>';$('#offlineModal').classList.remove('hidden');
}
async function startGame() {
  finishPause();sessionOnline=true;
  const savedLast=state.lastSave||0,savedTrusted=state.lastTrustedTime||0;
  trustedClockReady=location.protocol==='file:';
  const clockOkay=await syncTrustedTime(),now=gameNow(),clockRollback=(savedTrusted&&now+120000<savedTrusted)||(savedLast&&savedLast>now+120000);
  if(clockRollback){if(state.bornAt>now)state.bornAt=now;if(state.sectJoinedAt>now)state.sectJoinedAt=now}
  ['practiceBuff','transmissionBuff'].forEach(key=>{const buff=state[key];if(!buff.active&&buff.remaining>0)state[key]={active:true,until:now+buff.remaining,remaining:0,total:buff.total||buff.remaining}});
  show('#gameScreen');
  startBgm('main');
  const offlineBefore=rewardSnapshot();
  processSectYears();
  currentFeature=null;
  $('#featurePanel').classList.add('hidden');
  $('#gameScreen').classList.remove('feature-open');
  $$('.feature-tab').forEach(x=>x.classList.remove('active'));
  const g=state.gender==='男'?'male':'female';
  $('#heroCharacter').src=`assets/${g}-character-outfit-${state.outfit||1}-v12.png`;
  const away=clockOkay&&!clockRollback?Math.max(0,Math.floor((now-savedLast)/5000)):0;
  if(away>0) { const gain=offlineCultivationGain(savedLast,now);addAura(away*auraRate());runSettlementTick(away);addCultivation(gain,true);setTimeout(()=>{if(sessionOnline)showOfflineRewards(offlineBefore,away*5)},180); }
  else if(clockRollback)setTimeout(()=>toast('偵測到時間異常，本次不結算離線收益'),250);
  else if(!clockOkay&&location.protocol!=='file:')setTimeout(()=>toast('無法取得可信時間，已暫停離線與每日結算'),250);
  tickStart=gameNow();render();save();
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
  const descriptions={arts:'功法蒐集、參悟與裝配功能將於後續版本開放。',experience:'外出歷練、事件與戰鬥功能將於後續版本開放。'};
  if(page==='root') {
    $('#featurePanel').classList.remove('feature-locked'); renderSpiritRootPanel('root');
  } else if(page==='cave') {
    const unlocked=state.spiritLevel>=10;
    $('#featurePanel').classList.toggle('feature-locked',!unlocked);
    if(unlocked)renderCavePanel('dwelling');else $('#featureDescription').innerHTML=`<div class="realm-lock"><b>融合期開啟</b><small>當前境界：${realmName(state.spiritLevel,spiritRealms)}</small></div>`;
  } else if(page==='bag') {
    $('#featurePanel').classList.remove('feature-locked'); renderBagPanel('bag');
  } else if(page==='sect') {
    $('#featurePanel').classList.remove('feature-locked'); renderSectPanel('home');
  } else if(page==='arts') {
    $('#featurePanel').classList.remove('feature-locked');renderArtsPanel('sect');
  } else {
    $('#featurePanel').classList.remove('feature-locked');
    $('#featureDescription').textContent=descriptions[page];
  }
  $('#featurePanel').classList.remove('hidden');
  $('#gameScreen').classList.add('feature-open');
}

function textSeed(text){return [...text].reduce((sum,char,index)=>sum+char.charCodeAt(0)*(index+3),0)}
function sectTechniqueSet(sect=state.sect,star=state.sectStar){
  if(!sect)return[];const seed=textSeed(sect),regularKinds=['secret','formula','sutra','escape'],first=regularKinds[(seed+star)%regularKinds.length],second=regularKinds[(seed+star+1+(seed%2))%regularKinds.length],used=[first,second],remainingRegular=regularKinds.filter(kind=>!used.includes(kind)),rareRoll=(seed+star)%4,third=rareRoll===0?'ultimate':rareRoll===1?'fragment':remainingRegular[rareRoll%remainingRegular.length],picked=[first,second,third];
  const suffix={secret:'秘籍',formula:'真訣',sutra:'心經',escape:'遁術',ultimate:'絕學',fragment:'殘頁'},clean=sect.replace(/(仙宮|神宗|聖宗|天宗|劍宗|魔宗|宗|派|門|宮|谷|堂|殿|樓|府|院|山|庭|教|寨|幫|觀|閣|都|海)$/,'');
  return picked.map((kind,index)=>{const element=artElements[(seed+index*star+index)%artElements.length][0],name=`${clean}${suffix[kind]}`;return{id:`${sect}-${index}`,sourceSect:sect,name,kind,element,tier:star,level:1,slot:index}})
}
function normalizeLearnedArts(){state.learnedArts=(state.learnedArts||[]).map(art=>{if(!art.sourceSect)return art;const group=sectCatalog.find(entry=>[...entry.good,...entry.evil].includes(art.sourceSect)),expected=group?sectTechniqueSet(art.sourceSect,group.star).find(item=>item.id===art.id):null;return expected?{...expected,level:Math.max(1,Math.min(10,art.level||1))}:art})}
function sectLearnLimit(){return state.sectRank>=3?3:state.sectRank>=2?2:1}
function artUpgradeCost(art){return Math.round(500*art.tier*art.tier*Math.pow(1.5,art.level-1))}
function artsExpandCost(){return Math.round(1000*Math.pow(1.28,Math.max(0,state.artsCapacity-8)))}
function artCard(art){
  const kind=artKinds[art.kind],element=artElements.find(([key])=>key===art.element),cost=art.level<10?artUpgradeCost(art):0,tier=['一','二','三','四','五','六','七','八','九'][art.tier-1];
  return `<article class="art-card element-${art.element}"><span class="art-element">${element[1]}</span><div><b>${tier}階・${art.name}（${art.level}級）</b><p>${kind.label}+${artBaseEffect(art)}（${element[1]}系靈根效果+${artRootEffect(art)}）</p></div><div class="art-actions"><button data-art-upgrade="${art.id}" data-art-cost="${cost}" ${art.level>=10||state.aura<cost?'disabled':''}>${art.level>=10?'已滿級':`升級<br><small>${cost.toLocaleString()} 靈氣</small>`}</button><button class="forget-art" data-art-forget="${art.id}">遺忘</button></div></article>`
}
function renderArtsPanel(view='sect'){
  currentArtsView=view;
  const learned=state.learnedArts||[],cap=state.artsCapacity||8,expand=artsExpandCost();
  $('#featureDescription').innerHTML=`<div class="arts-tabs">${artTabs.map(([key,label])=>`<button data-art-view="${key}" class="${key===view?'active':''}">${label}</button>`).join('')}</div><div class="arts-wallet"><span id="artsAuraAmount">靈氣 ${Math.floor(state.aura).toLocaleString()}</span><span>門派技能 ${learned.length} / ${cap}</span>${cap<40?`<button id="expandArtsBtn" ${state.spiritStone>=expand?'':'disabled'}>擴充一格・${expand.toLocaleString()}靈石</button>`:'<b>已達40格上限</b>'}</div><div id="artsInner"></div>`;
  $$('.arts-tabs button').forEach(button=>button.onclick=()=>renderArtsPanel(button.dataset.artView));if(cap<40)$('#expandArtsBtn').onclick=expandArtsCapacity;
  const inner=$('#artsInner');if(view==='moves'){inner.innerHTML='<div class="arts-empty"><b>招式尚未開放</b><small>未來將於戰鬥中裝配與施展。</small></div>';return}
  const list=view==='sect'?learned:[];inner.innerHTML=list.length?`<div class="art-list">${list.map(artCard).join('')}</div><div class="arts-total">門派技能總計：${Object.values(artKinds).map(kind=>`${kind.label}+${artBonusFor(kind.attribute).toLocaleString()}`).join('・')}</div>`:`<div class="arts-empty"><b>${artTabs.find(([key])=>key===view)[1]}尚無功法</b><small>${view==='sect'?'可向目前門派的大長老學習功法。':'此分類將於後續探索、秘籍與奇遇系統取得。'}</small></div>`;
  $$('[data-art-upgrade]').forEach(button=>button.onclick=()=>upgradeArt(button.dataset.artUpgrade,view));$$('[data-art-forget]').forEach(button=>button.onclick=()=>forgetArt(button.dataset.artForget,view));
}
function upgradeArt(id,view){const art=state.learnedArts.find(item=>item.id===id);if(!art||art.level>=10)return;const cost=artUpgradeCost(art);if(state.aura<cost)return toast('靈氣不足');state.aura-=cost;art.level++;toast(`${art.name}提升至${art.level}級`);renderArtsPanel(view);render();save()}
async function forgetArt(id,view='sect'){const index=state.learnedArts.findIndex(item=>item.id===id);if(index<0)return;const art=state.learnedArts[index],kind=artKinds[art.kind],lost=artTotalEffect(art);if(!await gameConfirm(`確定遺忘「${art.name}」？\n將失去 ${kind.label}+${lost.toLocaleString()}，已投入的靈氣不會返還。`,{title:'遺忘功法',confirmText:'確認遺忘',danger:true}))return;state.learnedArts.splice(index,1);toast(`已遺忘${art.name}・${kind.label}-${lost}`);renderArtsPanel(view);render();save()}
function updateArtsLive(){if(currentFeature!=='arts')return;const amount=$('#artsAuraAmount');if(amount)amount.textContent=`靈氣 ${Math.floor(state.aura).toLocaleString()}`;$$('[data-art-upgrade]').forEach(button=>{const art=state.learnedArts.find(item=>item.id===button.dataset.artUpgrade);button.disabled=!art||art.level>=10||state.aura<+button.dataset.artCost})}
function expandArtsCapacity(){if(state.artsCapacity>=40)return;const cost=artsExpandCost();if(state.spiritStone<cost)return toast('靈石不足');state.spiritStone-=cost;state.artsCapacity++;toast(`門派技能上限擴充至${state.artsCapacity}格`);renderArtsPanel('sect');render();save()}
function renderSectLearning(){
  if(!state.sect)return toast('目前無門無派');const techniques=sectTechniqueSet(),limit=sectLearnLimit(),learned=state.learnedArts||[];
  $('#sectInner').innerHTML=`<section class="sect-learning"><button id="learningBackBtn" class="text-button">返回門人</button><h2>${state.sect}・傳功閣</h2><div class="learning-list">${techniques.map((art,index)=>{const known=learned.some(item=>item.id===art.id),rankReady=index<limit,full=learned.length>=state.artsCapacity,tier=['一','二','三','四','五','六','七','八','九'][art.tier-1];return `<article><b>${tier}階・${art.name}</b><span>${artElements.find(([key])=>key===art.element)[1]}系・${artKinds[art.kind].tab}・${artKinds[art.kind].label}+${artBaseEffect(art)}</span><button data-learn-art="${art.id}" ${known||!rankReady||full?'disabled':''}>${known?'已習得':!rankReady?`需${index===1?'親傳弟子':'供奉'}`:full?'技能欄已滿':'學習'}</button></article>`}).join('')}</div></section>`;
  $('#learningBackBtn').onclick=()=>renderSectPanel('npcs');$$('[data-learn-art]').forEach(button=>button.onclick=()=>learnSectArt(button.dataset.learnArt));
}
function learnSectArt(id){const art=sectTechniqueSet().find(item=>item.id===id);if(!art||state.learnedArts.some(item=>item.id===id))return;if(art.slot>=sectLearnLimit())return toast('目前職位不足');if(state.learnedArts.length>=state.artsCapacity)return toast('門派技能欄已滿');state.learnedArts.push(art);toast(`習得${art.name}`);renderSectLearning();render();save()}

function dateKey(){
  if(!trustedClockReady&&location.protocol!=='file:')return null;
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(gameNow())),values=Object.fromEntries(parts.map(part=>[part.type,part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
function sectInfo(){return sectCatalog.find(x=>x.star===state.sectStar)}
function selectedSectTask(){return sectTasks.find(x=>x.id===state.sectTask)}
function processSectYears(){
  if(!state.sect||!state.sectJoinedAt)return;
  const total=Math.floor((gameNow()-state.sectJoinedAt)/900000),delta=Math.max(0,total-state.sectYearsProcessed);
  if(!delta)return;
  state.sectYearsProcessed=total;
  if(state.sectFaction==='正')state.righteousness+=delta;else state.evilQi+=delta;
  const task=selectedSectTask();if(task){state.sectContribution+=task.gain*delta;state.spiritStone+=task.stone*delta;state.prestige+=task.prestige*delta}
}
function sectDescription(){
  const index=npcSeed(),places=['青峰疊翠的雲海深處','千瀑交織的靈谷之中','終年星輝垂落的高原','古木遮天的幽靜山脈','浩蕩天河環繞的浮島','地火與寒泉交會的秘境','萬丈孤峰之巔','遠離塵世的上古洞天','雷雲不散的天外山門','潮汐靈脈匯聚的海崖','日月同輝的仙家福地'];
  const practices=['擅長以劍意磨礪道心','精研丹道與靈藥培育','傳承符籙、陣法與禁制之術','重視肉身與真氣並行淬鍊','以觀星推演尋求大道軌跡','修習御風踏雲與遁法神通','守護古老典籍與失傳秘術','講究在生死歷練中突破桎梏','以五行流轉淬鍊門人根基','世代鎮守一處危險的天地裂隙','崇尚萬法歸一、道心澄明'];
  const path=state.sectFaction==='正'?'門人奉行正道、護持蒼生，行事以仁義為先，以清正自守。':'門人不受正統戒律束縛，被世人視為旁門左道；行事只問本心與實力，恩怨必報。';
  return `${state.sect}立於${places[index%places.length]}，${practices[(index*3+Math.floor(index/places.length))%practices.length]}。${path}`;
}
function allEligibleSects(){return sectCatalog.filter(g=>state.spiritLevel>=g.need).flatMap(g=>[...g.good.map(name=>({name,faction:'正',star:g.star})),...g.evil.map(name=>({name,faction:'邪',star:g.star}))])}
function joinRandomSect(){
  const pool=allEligibleSects(),pick=pool[Math.floor(Math.random()*pool.length)];if(!pick)return;
  state.sect=pick.name;state.sectFaction=pick.faction;state.sectStar=pick.star;state.sectContribution=0;state.sectRank=0;state.sectTask='';state.sectJoinedAt=gameNow();state.sectYearsProcessed=0;state.actingLeader=false;state.npcAffinity={};
  toast(`拜入${['一','二','三','四','五','六','七','八','九'][pick.star-1]}星門派・${pick.name}`);render();renderSectPanel('home');save();
}
async function leaveSect(){
  if(state.prestige<200)return toast('叛教需要200威望');
  if(!await gameConfirm(`確定叛離${state.sect}？\n將扣除200威望，剩餘 ${Math.floor(state.sectContribution)} 門派貢獻亦會全部清空。`,{title:'叛離門派',confirmText:'確認叛教',danger:true}))return;
  state.prestige-=200;
  state.sect='';state.sectFaction='';state.sectStar=0;state.sectContribution=0;state.sectRank=0;state.sectTask='';state.sectJoinedAt=null;state.sectYearsProcessed=0;state.actingLeader=false;state.npcAffinity={};toast('已脫離門派');render();renderSectPanel('home');save();
}
function npcSeed(){const names=sectCatalog.flatMap(g=>[...g.good,...g.evil]);return Math.max(0,names.indexOf(state.sect))}
function sectNpcLevels(seed,minimum,star){
  const roll=(slot,range)=>textSeed(`${state.sect}・境界・${seed}・${slot}`)%range;
  const junior=minimum+roll(0,7);
  const senior=junior+3+roll(1,5);
  const offering=senior+4+roll(2,5);
  const elder=offering+4+roll(3,6);
  const master=Math.max(elder+5+roll(4,7),star===1?20:minimum+20);
  return [master,elder,offering,senior,junior].map(level=>Math.min(229,level));
}
function sectNpcs(){
  const surnames=['趙','錢','孫','李','周','吳','鄭','王','馮','陳','褚','衛','蔣','沈','韓','楊','朱','秦','尤','許','何','呂','施','張','孔','曹','嚴','華','金','魏','陶','姜','戚','謝','鄒','喻','柏','水','竇','章','雲','蘇','潘','葛','奚','范','彭','郎','魯','韋','昌','馬','苗','鳳','花','方','俞','任','袁','柳','唐','羅','薛','歐陽','上官','司馬','諸葛','夏侯','東方','皇甫','尉遲','公孫','慕容','長孫','宇文','司徒','南宮','令狐','軒轅'];
  const maleGiven=['玄策','清衡','道一','長淵','若塵','星河','無涯','景行','明淵','懷瑾','扶光','晏清','承淵','照夜','守一','修遠','子墨','凌霄','朔','衡','澈','玄','川','長生遠','觀滄海','問天行','凌九霄','守山河','雲歸處','硯無聲'];
  const femaleGiven=['雲舒','清漪','知微','映雪','秋水','昭寧','疏影','望舒','青梧','霽月','含章','雲岫','驚鴻','凝霜','聽瀾','若水','靈犀','月華','瑤','霜','寧','蘭','月','月如霜','雲知意','柳含煙','星照晚','雪無痕','花解語','夢長安'];
  const seed=npcSeed(),mode=seed%12,roles=['掌門','大長老','供奉','師兄','師弟'],group=sectInfo()||sectCatalog[0],levels=sectNpcLevels(seed,group.need,group.star);
  return roles.map((role,i)=>{const id=seed*5+i,gender=mode===0?'男':mode===1?'女':textSeed(`${state.sect}・${role}・${i}`)%2===0?'男':'女',given=gender==='男'?maleGiven:femaleGiven,name=surnames[(id*37)%surnames.length]+given[id%given.length],title=i===3?(gender==='男'?'師兄':'師姐'):i===4?(gender==='男'?'師弟':'師妹'):role,portrait=i+(gender==='女'?5:0),statSeed=textSeed(`${state.sect}・${name}・戰鬥`);return {title,name,gender,level:levels[i],portrait,id,role:i,statBias:{vitality:.92+statSeed%17/100,offense:.92+Math.floor(statSeed/7)%19/100,guard:.92+Math.floor(statSeed/13)%17/100,speed:.92+Math.floor(statSeed/19)%15/100,spirit:.92+Math.floor(statSeed/29)%17/100}}});
}
function renderSectPanel(view='home'){
  currentSectView=view;processSectYears();
  if(!state.sect){
    const unlocked=sectCatalog.filter(g=>state.spiritLevel>=g.need);const max=unlocked.at(-1);
    $('#featureDescription').innerHTML=`<section class="sectless"><div class="sect-seal">無</div><h2>無門無派</h2><p>你尚未拜入任何門派，可外出尋訪仙門、求取入道機緣。</p><div class="sect-unlocks">目前最高可加入：${['一','二','三','四','五','六','七','八','九'][max.star-1]}星門派・需求${max.realm}</div><button id="joinSectBtn" class="jade-button">尋訪仙門</button></section>`;
    $('#joinSectBtn').onclick=joinRandomSect;return;
  }
  const tabs=[['home','門派'],['npcs','門人'],['practice','練功房'],['tasks','任務'],['salary','俸祿'],['challenge','挑戰']];
  $('#featureDescription').innerHTML=`<div class="sect-tabs">${tabs.map(([k,n])=>`<button data-sect-view="${k}" class="${k===view?'active':''}">${n}</button>`).join('')}</div><div id="sectInner"></div>`;
  $$('.sect-tabs button').forEach(b=>b.onclick=()=>renderSectPanel(b.dataset.sectView));renderSectView(view);save();
}
function renderSectView(view){
  currentSectView=view;const inner=$('#sectInner');if(!inner)return;
  $$('.sect-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.sectView===view));
  if(view==='home'){
    const next=sectPromotionCosts[state.sectRank];
    inner.innerHTML=`<section class="sect-home ${state.sectFaction==='邪'?'evil':''}"><div class="sect-heading"><span>${['一','二','三','四','五','六','七','八','九'][state.sectStar-1]}星門派</span><h2>${state.sect}</h2></div><p>${sectDescription()}</p><div class="sect-status"><b>${sectRanks[state.sectRank]}${state.actingLeader?'・代理掌門':''}</b><span>門派貢獻 ${Math.floor(state.sectContribution).toLocaleString()}</span><span>威望 ${Math.floor(state.prestige).toLocaleString()}</span></div>${next?`<button id="promoteSectBtn" class="jade-button" ${state.sectContribution>=next?'':'disabled'}>晉升${sectRanks[state.sectRank+1]}・需 ${next} 貢獻</button>`:'<strong class="rank-max">已達最高職位・護法</strong>'}<button id="leaveSectBtn" class="text-button danger-text" ${state.prestige>=200?'':'disabled'}>叛教・消耗200威望</button></section>`;
    if(next)$('#promoteSectBtn').onclick=promoteSect;$('#leaveSectBtn').onclick=leaveSect;return;
  }
  if(view==='npcs'){inner.innerHTML=`<div class="npc-grid">${sectNpcs().map((n,index)=>`<button class="npc-card" data-npc="${index}"><span class="npc-portrait p${n.portrait}" style="--portrait-hue:${n.id%37-18}deg;--portrait-bright:${.92+(n.id%9)*.02}"></span><b>${n.title}</b><strong>${n.name}</strong><small>${realmName(n.level,spiritRealms)}</small></button>`).join('')}</div><div id="npcDetail" class="npc-detail">點選一位門人進行互動</div>`;$$('.npc-card').forEach(b=>b.onclick=()=>renderNpcDetail(+b.dataset.npc));return}
  if(view==='shop'){renderSectShop();return}
  if(view==='tasks'){inner.innerHTML=`<div class="task-list">${sectTasks.map(t=>`<button data-task="${t.id}" class="task-card ${state.sectTask===t.id?'active':''}" ${state.spiritLevel<t.need?'disabled':''}><b>${t.name}</b><span>每年：貢獻+${t.gain}・靈石+${t.stone}・威望+${t.prestige}</span><small>${t.desc}</small><em>${state.spiritLevel>=t.need?'可接取':`需 ${realmName(t.need,spiritRealms)}`}</em></button>`).join('')}</div><p class="sect-note">任務會持續執行；境界提高後不會自動更換。叛教時任務立即終止。</p>`;$$('.task-card:not(:disabled)').forEach(b=>b.onclick=()=>{state.sectTask=b.dataset.task;toast(`開始持續任務：${selectedSectTask().name}`);renderSectView('tasks');save()});return}
  if(view==='practice'){
    const can=state.sectRank>=1,done=state.lastPracticeDay===dateKey(),practiceOn=buffActive('practiceBuff'),transmissionOn=buffActive('transmissionBuff');
    const practiceReason=!can?'需晉升內門弟子':done?'今日已完成':state.spiritStone<1000?`尚缺 ${Math.ceil(1000-state.spiritStone)} 靈石`:'開始練功';
    inner.innerHTML=`<div class="practice-grid"><article class="buff-card ${practiceOn?'running':''}"><b>練功</b><p>消耗1000靈石，獲得5倍修為修練${state.actingLeader?20:10}年。每日一次，開啟後持續至時間結束。</p><div class="buff-timer ${practiceOn?'active':''}"><i id="practiceTimerBar" style="width:${buffPercent('practiceBuff')}%"></i><span id="practiceTimerText">${practiceOn?buffClock('practiceBuff'):'未開啟'}</span></div><button id="dailyPractice" ${can&&!done&&state.spiritStone>=1000?'':'disabled'}>${practiceReason}</button></article><article class="buff-card ${transmissionOn?'running':''}"><b>掌門傳功</b><p>每次獲得8倍修為修練10年，可與練功同時進行，開啟後無法暫停。</p><div class="buff-timer ${transmissionOn?'active':''}"><i id="transmissionTimerBar" style="width:${buffPercent('transmissionBuff')}%"></i><span id="transmissionTimerText">${transmissionOn?buffClock('transmissionBuff'):'未開啟'}</span></div><div class="transmit-buttons"><button data-transmit="1" data-cost="5">1次・5靈玉</button><button data-transmit="30" data-cost="120">30次・120靈玉</button><button data-transmit="100" data-cost="300">100次・300靈玉</button></div></article></div>${can?'':'<p class="sect-note">練功房需達內門弟子以上；目前靈石足夠，但職位尚未符合。</p>'}<p class="sect-note">目前總修練倍率：${cultivationMultiplier()}倍・主介面修練效率 ${rate().toLocaleString()} / 5秒</p>`;
    $('#dailyPractice').onclick=dailyPractice;$$('[data-transmit]').forEach(b=>{b.disabled=!can||state.spiritJade<+b.dataset.cost;b.onclick=()=>masterTransmission(+b.dataset.transmit,+b.dataset.cost)});return
  }
  if(view==='salary'){const amount=sectSalary[state.sectRank],done=state.lastSalaryDay===dateKey();inner.innerHTML=`<div class="salary-card"><b>${sectRanks[state.sectRank]}俸祿</b><strong>${amount.toLocaleString()} 靈石／每日</strong><p>依目前門派職位發放，每日僅可領取一次。</p><button id="claimSalary" class="jade-button" ${done?'disabled':''}>${done?'今日已領取':'領取俸祿'}</button></div>`;$('#claimSalary').onclick=claimSalary;return}
  if(view==='challenge'){inner.innerHTML=`<div class="challenge-card"><b>挑戰掌門</b><p>消耗200威望與掌門一戰。獲勝可成為代理掌門，但原門派職位不變。</p><strong>目前威望：${Math.floor(state.prestige)}</strong><button id="challengeMaster" class="jade-button" ${state.prestige>=200&&!state.actingLeader?'':'disabled'}>${state.actingLeader?'已是代理掌門':'消耗200威望挑戰'}</button></div>`;$('#challengeMaster').onclick=challengeMaster}
}
function sectTokenDailyState(){
  const today=dateKey();if(!today)return state.sectTokenDaily||{date:'',exchanged:3};
  if(!state.sectTokenDaily||state.sectTokenDaily.date!==today)state.sectTokenDaily={date:today,exchanged:0};
  return state.sectTokenDaily;
}
function renderSectShop(){
  const inner=$('#sectInner'),daily=sectTokenDailyState(),remaining=Math.max(0,3-daily.exchanged),canExchange=remaining>0&&state.sectContribution>=200;
  inner.innerHTML=`<section class="sect-shop"><button id="shopBackBtn" class="text-button">返回門人</button><div class="shop-heading"><small>供奉・物資兌換</small><h2>門派寶庫</h2><span>門派貢獻 ${Math.floor(state.sectContribution).toLocaleString()}</span></div><article class="shop-item"><img src="assets/sect-token-v1.png" alt="門派令牌"><div class="shop-item-copy"><b>門派令牌</b><p>使用後增加 100 門派貢獻。</p><strong>兌換需要 200 門派貢獻</strong><small>今日剩餘 ${remaining} / 3 次・持有 ${state.sectTokens||0}</small></div><div class="shop-actions"><button id="exchangeSectToken" class="jade-button" ${canExchange?'':'disabled'}>兌換</button></div></article></section>`;
  $('#shopBackBtn').onclick=()=>renderSectPanel('npcs');$('#exchangeSectToken').onclick=exchangeSectToken;
}
function exchangeSectToken(){
  if(!requireTrustedTime())return;
  const daily=sectTokenDailyState();if(daily.exchanged>=3)return toast('今日兌換次數已用完');if(state.sectContribution<200)return toast('門派貢獻不足');
  state.sectContribution-=200;state.sectTokens=(state.sectTokens||0)+1;daily.exchanged++;toast('兌換門派令牌 ×1');renderSectShop();save();
}
function useSectToken(){
  if(!state.sect){toast('目前無門無派，無法使用門派令牌');return false}if((state.sectTokens||0)<1){toast('沒有可使用的門派令牌');return false}
  state.sectTokens--;state.sectContribution+=100;toast('使用門派令牌・門派貢獻+100');
  if(currentFeature==='sect'&&currentSectView==='shop')renderSectShop();else if(currentFeature==='bag')renderBagView('bag');render();save();return true
}
function openItemModal(key){
  const item=itemCatalog[key];if(!item)return;const count=state[item.count]||0;
  $('#itemModalImage').src=item.image;$('#itemModalImage').alt=item.name;$('#itemModalName').textContent=item.name;$('#itemModalDescription').textContent=item.description;$('#itemModalCount').textContent=`持有數量：${count}`;
  const use=$('#itemModalUse');use.classList.toggle('hidden',!item.usable);use.disabled=!item.usable||count<1;use.onclick=item.usable?()=>useItem(key):null;
  $('#itemModalActions').classList.toggle('exit-only',!item.usable);$('#itemModal').classList.remove('hidden');
}
function closeItemModal(){$('#itemModal').classList.add('hidden')}
function useItem(key){if(key==='sectToken'&&useSectToken())closeItemModal()}
function promoteSect(){const cost=sectPromotionCosts[state.sectRank];if(state.sectContribution<cost)return;state.sectContribution-=cost;state.sectRank++;toast(`晉升為${sectRanks[state.sectRank]}`);renderSectView('home');save()}
function npcDailyState(index){const key=String(sectNpcs()[index].id),record=state.npcDaily[key],today=dateKey();if(!today)return record||{date:'',chat:3,gift:3};if(!record||record.date!==today)state.npcDaily[key]={date:today,chat:0,gift:0};return state.npcDaily[key]}
function renderNpcDetail(index){const n=sectNpcs()[index],aff=state.npcAffinity[n.id]||0,daily=npcDailyState(index),master=index===0,elder=index===1,offering=index===2;$('#npcDetail').innerHTML=`<b>${n.title}・${n.name}</b><span>${realmName(n.level,spiritRealms)}・好感 ${aff} / 100</span><div><button data-npc-action="chat" ${daily.chat>=3||aff>=100?'disabled':''}>聊天 ${daily.chat}/3</button><button data-npc-action="gift" ${daily.gift>=3||aff>=100?'disabled':''}>送禮 ${daily.gift}/3</button><button data-npc-action="spar">切磋</button>${master?'<button data-npc-action="greet">請安</button>':''}${elder?'<button data-npc-action="arts">學習功法</button>':''}${offering?'<button data-npc-action="shop">物資兌換</button>':''}</div>`;$$('[data-npc-action]').forEach(b=>b.onclick=()=>npcAction(index,b.dataset.npcAction))}
function npcAction(index,action){const n=sectNpcs()[index],daily=npcDailyState(index),aff=state.npcAffinity[n.id]||0;if(['chat','gift','greet'].includes(action)&&!requireTrustedTime())return;if(action==='chat'){if(daily.chat>=3||aff>=100)return;daily.chat++;state.npcAffinity[n.id]=Math.min(100,aff+1);toast('交談甚歡・好感+1')}else if(action==='gift'){if(daily.gift>=3||aff>=100)return;daily.gift++;state.npcAffinity[n.id]=Math.min(100,aff+5);toast('對方欣然收禮・好感+5')}else if(action==='spar'){startNpcBattle(n);return}else if(action==='greet'){if(state.lastGreetingDay===dateKey())return toast('今日已向掌門請安');state.lastGreetingDay=dateKey();state.sectContribution+=100;toast('掌門頷首嘉許・門派貢獻+100')}else if(action==='arts'){renderSectLearning();return}else if(action==='shop'){renderSectPanel('shop');return}renderNpcDetail(index);save()}

function battlePlayerStats(){
  const rootBone=effectiveCore('rootBone'),trueQi=effectiveCore('trueQi'),physique=effectiveCore('physique'),agility=effectiveCore('agility'),dodgeRating=agility*3,critRating=state.spiritualPower*3;
  return {
    maxHp:Math.max(240,rootBone*5),attack:Math.max(12,trueQi*5),defense:Math.max(0,physique*20),
    dodge:Math.min(.35,dodgeRating/(dodgeRating+1000)),crit:Math.min(.45,critRating/(critRating+1000))
  };
}
function battleEnemyStats(n){
  const star=state.sectStar||1,npcIndex=sectNpcs().findIndex(x=>x.id===n.id),role=n.role??(npcIndex>=0?npcIndex:2);
  const rolePower=[1.18,1.1,1.03,.94,.86][role]||1;
  const bias=n.statBias||{vitality:1,offense:1,guard:1,speed:1,spirit:1};
  const bodyLevel=Math.floor(n.level*(.25+star*.025));
  const growth=cumulativeGrowth(n.level,bodyLevel);
  const artPower=artTierMax[star-1]*(.12+star*.02)*rolePower;
  const rootBone=Math.round(((5+growth.rootBone+star*2)*rolePower+artPower*.42)*bias.vitality);
  const trueQi=Math.round(((5+growth.trueQi+star*2)*rolePower+artPower*.46)*bias.offense);
  const physique=Math.round(((5+growth.physique+star)*rolePower+artPower*.34)*bias.guard);
  const agility=Math.round(((5+growth.agility+star)*rolePower+artPower*.16)*bias.speed);
  const spiritualPower=Math.round(((5+Math.floor(n.level/8)+star)*rolePower+artPower*.08)*bias.spirit);
  const dodgeRating=agility*3,critRating=spiritualPower*3;
  return {maxHp:Math.max(240,rootBone*5),attack:Math.max(12,trueQi*5),defense:physique*20,dodge:Math.min(.32,dodgeRating/(dodgeRating+1100)),crit:Math.min(.38,critRating/(critRating+1100))};
}
function startNpcBattle(n,mode='spar'){
  clearTimeout(battleTimer);
  startBgm('battle');
  const player=battlePlayerStats(),enemy=battleEnemyStats(n);
  if(mode==='master'){enemy.maxHp=Math.round(enemy.maxHp*1.3);enemy.attack=Math.round(enemy.attack*1.16);enemy.defense=Math.round(enemy.defense*1.12)}
  battle={active:true,resolved:false,mode,round:1,completedRounds:0,player:{...player,hp:player.maxHp},enemy:{...enemy,hp:enemy.maxHp,name:n.name,npc:n,race:'human'},logs:[]};
  $('#battleModal').classList.remove('hidden');$('#battleStage').classList.remove('hidden');$('#battleResult').classList.add('hidden');
  $('#playerSilhouette').className=`battle-silhouette ${state.gender==='女'?'silhouette-player-female':'silhouette-player-male'}`;
  $('#enemySilhouette').className='battle-silhouette silhouette-human';
  $('#battlePlayerName').textContent=state.name;$('#battleEnemyName').textContent=n.name;
  $('#battleLog').innerHTML=`<p><b>${state.name}</b>與<b>${n.name}</b>抱拳行禮，${mode==='master'?'掌門之位挑戰':'切磋'}開始。</p>`;
  updateBattleUi();battleTimer=setTimeout(playerBattleTurn,700);
}
function damageRoll(attacker,defender,multiplier=1){
  if(Math.random()<defender.dodge)return {damage:0,dodged:true,crit:false};
  const crit=Math.random()<attacker.crit,raw=attacker.attack*multiplier*(crit?1.5:1),mitigation=800/(800+defender.defense);
  return {damage:Math.max(1,Math.round(raw*mitigation)),dodged:false,crit};
}
function animateBattleStrike(attacker,target,damage){
  const attackEl=$(attacker),targetEl=$(target),damageEl=$(target==='#enemySilhouette'?'#enemyDamage':'#playerDamage');
  attackEl.classList.remove('attacking');targetEl.classList.remove('hit');damageEl.classList.remove('show');void attackEl.offsetWidth;
  attackEl.classList.add('attacking');targetEl.classList.add('hit');damageEl.textContent=damage.dodged?'閃避':`-${damage.damage}${damage.crit?' 暴擊':''}`;damageEl.classList.add('show');
  setTimeout(()=>{attackEl.classList.remove('attacking');targetEl.classList.remove('hit');damageEl.classList.remove('show')},620);
}
function appendBattleLog(text,side='player'){
  battle.logs.push(text);if(battle.logs.length>6)battle.logs.shift();
  $('#battleLog').innerHTML=battle.logs.map((x,i)=>`<p class="${i===battle.logs.length-1?side:''}">${x}</p>`).join('');$('#battleLog').scrollTop=$('#battleLog').scrollHeight;
}
function playerBattleTurn(){
  if(!battle?.active)return;const mult=.8+Math.random()*.2,hit=damageRoll(battle.player,battle.enemy,mult);
  battle.enemy.hp=Math.max(0,battle.enemy.hp-hit.damage);animateBattleStrike('#playerSilhouette','#enemySilhouette',hit);
  appendBattleLog(hit.dodged?`${battle.enemy.name}看破氣機，避開了${state.name}的以意禦氣。`:`${state.name}凝神定意，以意禦氣，對${battle.enemy.name}造成了${hit.damage}傷害。`,'player');updateBattleUi();
  if(battle.enemy.hp<=0)return setTimeout(()=>finishBattle(true,'對手氣息已散，無力再戰。'),650);
  battleTimer=setTimeout(enemyBattleTurn,850);
}
function enemyBattleTurn(){
  if(!battle?.active)return;const hit=damageRoll(battle.enemy,battle.player,.78+Math.random()*.2);
  battle.player.hp=Math.max(0,battle.player.hp-hit.damage);animateBattleStrike('#enemySilhouette','#playerSilhouette',hit);
  appendBattleLog(hit.dodged?`${state.name}踏罡移步，避開了${battle.enemy.name}的反擊。`:`${battle.enemy.name}運轉真氣反擊，對${state.name}造成了${hit.damage}傷害。`,'enemy');
  battle.completedRounds++;updateBattleUi();
  if(battle.player.hp<=0)return setTimeout(()=>finishBattle(false,'你氣力不支，本次切磋落敗。'),650);
  battle.round++;updateBattleUi();battleTimer=setTimeout(playerBattleTurn,900);
}
function updateBattleUi(){
  if(!battle)return;$('#battleTurn').textContent=`第${['一','二','三','四','五','六','七','八','九','十'][Math.min(9,battle.round-1)]||battle.round}回合`;
  $('#playerHealthBar').style.width=`${Math.max(0,battle.player.hp/battle.player.maxHp*100)}%`;$('#enemyHealthBar').style.width=`${Math.max(0,battle.enemy.hp/battle.enemy.maxHp*100)}%`;
  const exit=$('#battleExitBtn'),ready=battle.completedRounds>=3;exit.disabled=!ready;exit.textContent='退出';
}
function forceEndBattle(){
  if(!battle?.active||battle.completedRounds<3)return;const playerRate=battle.player.hp/battle.player.maxHp,enemyRate=battle.enemy.hp/battle.enemy.maxHp;
  finishBattle(playerRate>=enemyRate,`三回合後終止切磋，以剩餘氣血比例判定${playerRate>=enemyRate?'勝出':'落敗'}。`);
}
function finishBattle(won,reason){
  if(!battle||battle.resolved)return;clearTimeout(battleTimer);battle.active=false;battle.resolved=true;battle.won=won;
  let reward='';
  if(won&&battle.mode==='master'){state.actingLeader=true;reward=' 已取得代理掌門身分。'}
  else if(won){state.prestige+=5;reward=' 威望+5。'}
  save();render();
  $('#battleStage').classList.add('hidden');$('#battleResult').classList.remove('hidden');$('#battleResultSeal').textContent=won?'勝':'敗';$('#battleResultSeal').classList.toggle('defeat',!won);
  $('#battleResultTitle').textContent=won?'戰鬥勝利':'戰鬥失敗';$('#battleResultText').textContent=`${reason}${reward}`;
}
function closeBattle(){const mode=battle?.mode;clearTimeout(battleTimer);battle=null;$('#battleModal').classList.add('hidden');startBgm('main');if(mode==='master'&&currentFeature==='sect')renderSectPanel('challenge')}
function updatePracticeTimers(){
  if(currentFeature!=='sect'||currentSectView!=='practice')return;
  for(const [key,prefix] of [['practiceBuff','practice'],['transmissionBuff','transmission']]){const bar=$(`#${prefix}TimerBar`),text=$(`#${prefix}TimerText`);if(!bar||!text)continue;const active=buffActive(key);bar.style.width=`${buffPercent(key)}%`;text.textContent=active?buffClock(key):'未開啟';if(!active&&text.closest('.buff-timer')?.classList.contains('active')){renderSectView('practice');render();break}}
}
function dailyPractice(){if(!requireTrustedTime())return;if(state.sectRank<1)return toast('需晉升內門弟子才能使用練功房');if(state.lastPracticeDay===dateKey())return toast('今日已完成練功');if(state.spiritStone<1000)return toast(`尚缺 ${Math.ceil(1000-state.spiritStone)} 靈石`);state.spiritStone-=1000;state.lastPracticeDay=dateKey();const years=state.actingLeader?20:10;addCultivationBuff('practiceBuff',years);toast(`練功已開啟・5倍修為持續${years}年`);renderSectView('practice');render();save()}
function masterTransmission(times,cost){if(state.sectRank<1)return toast('需晉升內門弟子才能接受掌門傳功');if(state.spiritJade<cost)return toast('靈玉不足');state.spiritJade-=cost;addCultivationBuff('transmissionBuff',10*times);toast(`掌門傳功已開啟・8倍修為增加 ${10*times} 年`);renderSectView('practice');render();save()}
function claimSalary(){if(!requireTrustedTime())return;if(state.lastSalaryDay===dateKey())return;const amount=sectSalary[state.sectRank];state.spiritStone+=amount;state.lastSalaryDay=dateKey();toast(`俸祿・靈石+${amount}`);renderSectView('salary');render();save()}
function challengeMaster(){if(state.prestige<200||state.actingLeader)return;state.prestige-=200;save();render();startNpcBattle(sectNpcs()[0],'master')}

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
    const tokenCount=state.sectTokens||0,tokenItem=tokenCount?`<button class="inventory-item" id="bagSectToken"><img src="assets/sect-token-v1.png" alt="門派令牌"><b>${tokenCount}</b><small>門派令牌</small></button>`:'',emptySlots=Array.from({length:20-(tokenCount?1:0)},()=>'<span></span>').join('');
    inner.innerHTML=`<div class="inventory-grid">${tokenItem}${emptySlots}</div><small class="empty-note">${tokenCount?'點擊門派令牌即可使用':'目前儲物袋空空如也'}</small>`;
    if(tokenCount)$('#bagSectToken').onclick=()=>openItemModal('sectToken');
    return;
  }
  const g=state.gender==='男'?'male':'female', src=`assets/${g}-character-outfit-${state.outfit||1}-v12.png`;
  const slots=Array.from({length:4},()=>'<span class="equip-slot"></span>').join('');
  inner.innerHTML=`<div class="equipment-layout"><div class="equipment-side">${slots}</div><div class="equipment-character"><img src="${src}" alt="人物"><button id="characterAttributesBtn" ${hasSpiritualSense()?'':'disabled'}>${hasSpiritualSense()?'人物屬性':'需習得神識入體'}</button></div><div class="equipment-side">${slots}</div></div>`;
  if(hasSpiritualSense()) $('#characterAttributesBtn').onclick=showCharacterAttributes;
}
function showCharacterAttributes() {
  const inner=$('#bagInner');
  const rootBone=effectiveCore('rootBone'),trueQi=effectiveCore('trueQi'),physique=effectiveCore('physique'),agility=effectiveCore('agility'),comprehension=effectiveCore('comprehension'),fortune=effectiveCore('fortune'),health=rootBone*5,attack=trueQi*5,defense=physique*20,evasion=agility*3,critical=state.spiritualPower*3;
  inner.innerHTML=`<section class="character-sheet"><div class="sheet-header"><div><small>姓名</small><b>${state.name}</b></div><div><small>修煉歲月</small><b>${experiencedYears().toLocaleString()}年</b></div><div><small>練氣境界</small><b>${realmName(state.spiritLevel,spiritRealms)}</b></div><div><small>煉體境界</small><b>${realmName(state.bodyLevel,bodyRealms)}</b></div><div><small>出生</small><b>${state.origin}</b></div><div><small>門派</small><b>${state.sect||'無門無派'}${state.actingLeader?'・代理掌門':''}</b></div></div><div class="sheet-title">屬性</div><div class="sheet-attributes"><div><span>根骨：${rootBone}</span><strong>氣血：${health}</strong></div><div><span>真氣：${trueQi}</span><strong>攻擊：${attack}</strong></div><div><span>體魄：${physique}</span><strong>防禦：${defense}</strong></div><div><span>身法：${agility}</span><strong>閃避：${evasion}</strong></div><div><span>靈力：${state.spiritualPower}</span><strong>暴擊：${critical}</strong></div><div><span>悟性：${comprehension}</span><strong>修練效率：+${cultivationEfficiency()}</strong></div><div><span>機緣：${fortune}</span><strong>靈氣獲取：+${auraEfficiency()}</strong></div><div><span>正氣：${Math.floor(state.righteousness)}</span><strong>邪氣：${Math.floor(state.evilQi)}</strong></div></div><div class="five-arts"><b>五系功法屬性</b><span>金 +${state.metalArt}</span><span>木 +${state.woodArt}</span><span>水 +${state.waterArt}</span><span>火 +${state.fireArt}</span><span>土 +${state.earthArt}</span></div></section><button id="attributeBackBtn" class="text-button">返回人物</button>`;
  $('#attributeBackBtn').onclick=()=>renderBagView('character');
}

function finishPause(){
  pauseStartedAt=null;
}
function forceOffline(){
  if(suppressSave||!state.name||pauseStartedAt!==null)return;pauseStartedAt=gameNow();sessionOnline=false;clearTimeout(battleTimer);battle=null;
  $('#battleModal').classList.add('hidden');$('#tribulationModal').classList.add('hidden');$('#itemModal').classList.add('hidden');$('#offlineModal').classList.add('hidden');$('#gameMenu').classList.add('hidden');$('#settingsModal').classList.add('hidden');stopAllBgm();show('#titleScreen');$('#titleHint').textContent='已離線・點擊螢幕重新進入';save();
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

load();setClockAnchor(state.lastTrustedTime||Math.min(state.lastSave||Date.now(),Date.now()),location.protocol==='file:');$('#titleHint').textContent=state.name?'點擊螢幕繼續修煉':'點擊螢幕進入遊戲';
$('#titleScreen').onclick=enterFromTitle;
$('#titleScreen').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enterFromTitle()}};
$('#backTitleBtn').onclick=()=>{startBgm('title');show('#titleScreen')};
$$('.gender').forEach(b=>b.onclick=()=>{$$('.gender').forEach(x=>x.classList.remove('active'));b.classList.add('active');createGender=b.dataset.gender;updateCreator()});
$$('.outfit-choice').forEach(b=>b.onclick=()=>{$$('.outfit-choice').forEach(x=>x.classList.remove('active'));b.classList.add('active');createOutfit=+b.dataset.style;updateCreator()});
function updateOriginPreview(){$('#originStats').textContent=originDescriptions[createOrigin]}
$$('.origin-choice').forEach(b=>b.onclick=()=>{$$('.origin-choice').forEach(x=>x.classList.remove('active'));b.classList.add('active');createOrigin=b.dataset.origin;updateOriginPreview()});
$('#createBtn').onclick=()=>{const n=$('#nameInput').value.trim();if(!n){$('#nameError').textContent='請輸入暱稱';return}const now=gameNow();state={...defaults,...originProfiles[createOrigin],name:n,gender:createGender,hair:1,outfit:createOutfit,origin:createOrigin,bornAt:now,lastSave:now};startGame();save()};
$('#spiritUp').onclick=()=>upgrade('spirit'); $('#bodyUp').onclick=()=>upgrade('body');
$('#tribConfirm').onclick=tribulate; $('#tribCancel').onclick=()=>$('#tribulationModal').classList.add('hidden');
$$('.feature-tab').forEach(b=>b.onclick=()=>toggleFeature(b));
$('#menuBtn').onclick=()=>$('#gameMenu').classList.toggle('hidden');
$('#settingsBtn').onclick=openSettings;
$('#settingsCloseBtn').onclick=()=>$('#settingsModal').classList.add('hidden');
$('#itemModalClose').onclick=closeItemModal;
$('#offlineModalClose').onclick=()=>$('#offlineModal').classList.add('hidden');
$('#confirmModalCancel').onclick=()=>closeGameConfirm(false);
$('#confirmModalAccept').onclick=()=>closeGameConfirm(true);
$('#deleteStartBtn').onclick=()=>showSettingsSection('#deleteStepOne');
$('#deleteCancelBtn').onclick=()=>showSettingsSection('#settingsMain');
$('#deleteVerifyBtn').onclick=()=>{
  if($('#deleteConfirmInput').value.trim()!==`${state.name}/刪除`){$('#deleteError').textContent='輸入內容不正確';return}
  $('#deleteError').textContent=''; showSettingsSection('#deleteStepTwo');
};
$('#deleteBackBtn').onclick=()=>showSettingsSection('#deleteStepOne');
$('#deleteFinalBtn').onclick=()=>{suppressSave=true;sessionOnline=false;clearTimeout(battleTimer);battle=null;stopAllBgm();localStorage.removeItem(saveKey);localStorage.removeItem('wendao-idle-v1');state={...defaults,name:'',bornAt:null,lastSave:gameNow()};location.reload()};
$('#backToTitle').onclick=()=>{save();$('#gameMenu').classList.add('hidden');$('#settingsModal').classList.add('hidden');$('#titleHint').textContent='點擊螢幕繼續修煉';show('#titleScreen');startBgm('title')};
$('#muteBtn').onclick=()=>{state.muted=!state.muted;updateBgmVolume();render();save()};
$('#battleExitBtn').onclick=forceEndBattle;
$('#battleResultClose').onclick=closeBattle;
setInterval(()=>{if($('#gameScreen').classList.contains('active')){addAura(auraRate());runSettlementTick();processSectYears();addCultivation(rate());if(currentFeature==='root')renderSpiritRootView(currentRootView);if(currentFeature==='cave'&&state.spiritLevel>=10)renderCavePanel(currentCaveView);if(currentFeature==='sect'&&currentSectView!=='npcs')renderSectPanel(currentSectView);if(currentFeature==='arts')updateArtsLive();tickStart=gameNow()}},5000);
setInterval(()=>{if($('#gameScreen').classList.contains('active'))$('#tickBar').style.width=Math.min(100,(gameNow()-tickStart)/50)+'%'},50);
setInterval(()=>{if($('#gameScreen').classList.contains('active'))$('#yearsElapsed').textContent=`${experiencedYears().toLocaleString()} 年`},1000);
setInterval(updatePracticeTimers,1000);
setInterval(()=>{if(sessionOnline&&!document.hidden)syncTrustedTime()},600000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)forceOffline();else finishPause()});
window.addEventListener('blur',forceOffline);window.addEventListener('focus',finishPause);window.addEventListener('pagehide',forceOffline);
window.addEventListener('beforeunload',()=>{if(!suppressSave)save()}); updateCreator(); updateOriginPreview(); render();
