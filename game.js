const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const qStyleMode=true;

const spiritRealms = ['聽息','引霞','凝曜','靈胎','化念','歸流','照虛','踏霄','遊穹','蛻凡','玄闕','天衡','玉宸','羅穹','神庭','寂空','渡厄','渾天','近聖','證聖','長明','道尊','天序'];
const bodyRealms = ['塵軀','納勁','纏筋','玉骨','鳴髓','曜身','擎嶽','撼霄','鎮陸','渡星','寰甲','無量'];
const swordRealms = ['啟鋒','藏芒','養刃','聽劍','凝魄','御鋒','劍罡','心劍','劍域','裂空','星痕','月魄','日輪','萬刃','無鋒','歸一','斬界','太初','道鋒','劫劍','無極','劍尊','天劍'];
const maxSpiritLevel=spiritRealms.length*10-1,maxBodyLevel=bodyRealms.length*10-1,maxSwordLevel=swordRealms.length*10-1;
const realmGrowthMultipliers=[1.20,1.80,2.50,3.30,4.20,5.20,6.30,7.50,8.80,10.20,11.70,13.30,15.00,16.80,18.70,20.70,22.80,25.00,27.30,29.70,32.20,34.80,37.50];
const realmEfficiencyMultipliers=(()=>{const values=[3,4.5,6.9,10.5,15.6,22.5,33,48,69,99];while(values.length<spiritRealms.length)values.push(Math.round(values.at(-1)*2.3));return values})();
const spiritRootRanks = ['廢品','凡品','下品','中品','良品','超品','上品','極品','完美','先天','凡仙','仙品','歸元','天心','三清','六禦','玄門','全真','淨明','天道'];
const sectRanks = ['外門弟子','內門弟子','親傳弟子','供奉','護法'];
const sectPromotionCosts = [500,1000,2000,5000];
const sectSalary = [200,500,1000,1800,3000];
const sectCatalog = [
  {star:1,need:0,realm:'聽息',good:['青竹門','清溪派','松風堂','白石觀'],evil:['黑風寨','赤蛇幫','斷刃堂']},
  {star:2,need:20,realm:'凝曜',good:['靈泉宗','丹楓谷','御風門','碧水宮','玄木派'],evil:['血衣樓','噬魂堂','鬼藤谷','幽燈教']},
  {star:3,need:40,realm:'化念',good:['青鸞劍宗','百草仙門','紫陽宮','天河書院','鎮岳宗'],evil:['九煞宗','玄屍門','萬毒谷','奪魄宮','赤煉魔宗']},
  {star:4,need:60,realm:'照虛',good:['太虛劍派','五雷天宗','蓬萊仙宮','星辰道門','乾元宗'],evil:['黃泉殿','萬妖天府','焚心魔教']},
  {star:5,need:80,realm:'遊穹',good:['神霄天宮','滄海龍門','玄天劍庭','終南紫府'],evil:['冥獄魔都','合歡天宗','幽冥血海']},
  {star:6,need:100,realm:'玄闕',good:['萬壽仙山','梵天聖宗','六道玄宮','歸墟仙門'],evil:['太古魔殿','吞天妖庭','絕情天宮']},
  {star:7,need:110,realm:'天衡',good:['無上劍閣','蒼穹道統','玉虛仙府'],evil:['昆吾魔山','十方邪樓','彼岸花宮']},
  {star:8,need:120,realm:'玉宸',good:['昊天聖宮','須彌神山','太初龍院'],evil:['玄陰帝谷','葬月魔宗','燭龍神庭']},
  {star:9,need:130,realm:'羅穹',good:['太上白玉京','諸天星羅神宗','九霄凌天仙宮'],evil:['永劫輪迴殿','無極天魔聖宗','太古神夢天宮']}
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
  {id:'rift',name:'鎮壓虛空裂隙',need:100,gain:30,stone:850,prestige:20,desc:'以玄闕之力封鎮裂隙，護佑門中萬年基業。'}
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
  '流浪孤兒':'自幼漂泊無依，於困境中磨練心志，與天地締結的天契格外深厚。',
  '亡命草寇':'久經凶險與搏殺，命骨與玄軀格外強韌，卻不擅長靜心參悟。',
  '深山獵戶':'生長於群山荒野，身手矯健、感知敏銳，擅長把握稍縱即逝的機會。',
  '寒窗學子':'多年寒窗養成通透心性，道悟與銳識出眾，但肉身根基較為薄弱。'
};
const itemCatalog = {
  sectToken:{name:'門派令牌',image:'assets/qstyle-v2/sect-token-cutout.png',description:'門派授予弟子的信物，令牌內留有宗門印記。使用後可增加 100 點門派貢獻。',count:'sectTokens',usable:true,giftable:false},
  mendingSilk:{name:'補天絲',image:'assets/qstyle-v2/mending-silk-cutout.png',description:'傳說由天穹裂隙中凝成的仙絲，纖韌無比，是提升儲物袋品階的稀世材料。',count:'mendingSilk',usable:false,giftable:false},
  testCultivationPill:{name:'修為丹',image:'assets/qstyle-v2/tribulation-pills/pill-01.png',description:'測試用臨時道具。使用後立即獲得 10 億修為。',count:'testCultivationPillCount',usable:true,giftable:false,sellPrice:1,cultivationBundle:1000000000},
  testSpiritStoneTenMillion:{name:'一千萬靈石',image:'assets/qstyle-v2/spirit-stone.png',description:'測試用臨時道具。使用後立即獲得 1,000 萬靈石。',count:'testSpiritStoneTenMillionCount',usable:true,giftable:false,sellPrice:1,resourceBundle:{resource:'spiritStone',label:'靈石',amount:10000000}},
  spiritMedicine:{name:'靈藥',image:'assets/qstyle-v2/spirit-medicine-v1.png',description:'蘊含溫和藥力的靈藥。使用後恢復 100 體力，恢復量可超過體力上限並完整保留。',count:'spiritMedicineCount',usable:true,giftable:false,sellPrice:1,staminaRestore:100}
};
const sectInvitationItems=[];
sectCatalog.forEach(group=>[...group.good.map(name=>({name,faction:'正'})),...group.evil.map(name=>({name,faction:'邪'}))].forEach(entry=>{
  const index=sectInvitationItems.length+1,id=`sectInvitation${index}`,count=`sectInvitationCount${index}`,tier=['一','二','三','四','五','六','七','八','九'][group.star-1];
  const item={name:`${entry.name}信物`,image:'assets/qstyle-v2/sect-invitation-token.png',description:`${tier}星門派・${entry.name}所授信物。當你無門無派時使用，可消耗一枚信物直接拜入${tier}星門派・${entry.name}。`,count,usable:true,giftable:false,sellPrice:1,sectInvitation:{name:entry.name,faction:entry.faction,star:group.star}};
  itemCatalog[id]=item;sectInvitationItems.push({id,item,...item.sectInvitation});
}));
const reputationResourceItems=[];
[[100,1,2],[1000,3,4],[10000,5,5]].forEach(([amount,minFloor,maxFloor])=>[
  ['spiritStone','靈石','assets/qstyle-v2/spirit-stone.png'],['wood','木材','assets/qstyle-v2/wood-cutout.png'],['meteorIron','隕鐵','assets/qstyle-v2/meteor-iron-cutout.png']
].forEach(([resource,label,image])=>{
  const amountName={100:'一百',1000:'一千',10000:'一萬'}[amount],id=`reputation${resource}${amount}`,count=`${id}Count`,item={name:`${amountName}${label}`,image,description:`凝練封存的${label}物資。使用後立即獲得 ${formatLargeNumber(amount)} ${label}。`,count,usable:true,giftable:false,sellPrice:1,resourceBundle:{resource,label,amount}};
  itemCatalog[id]=item;reputationResourceItems.push({id,item,minFloor,maxFloor});
}));
const tribulationPillDefaults={};
spiritRealms.slice(1).forEach((realm,index)=>{
  const realmIndex=index+1,key=`tribPill${realmIndex}`;
  tribulationPillDefaults[key]=0;
  itemCatalog[key]={name:`${realm}丹`,image:`assets/qstyle-v2/tribulation-pills/pill-${String(realmIndex).padStart(2,'0')}.png`,description:`蘊含${realm}境道韻的渡劫丹藥。僅在突破${realm}境層次時使用，每顆可增加 5% 渡劫成功率。`,count:key,usable:false,giftable:false,sellPrice:1};
});
const artKinds={secret:{tab:'玄錄',attribute:'trueQi',label:'元息'},formula:{tab:'命篇',attribute:'rootBone',label:'命骨'},sutra:{tab:'體典',attribute:'physique',label:'玄軀'},escape:{tab:'行章',attribute:'agility',label:'游影'},ultimate:{tab:'悟卷',attribute:'comprehension',label:'道悟'},fragment:{tab:'天箋',attribute:'fortune',label:'天契'}};
const artTabs=[['sect','門派技能'],['secret','玄錄'],['formula','命篇'],['sutra','體典'],['escape','行章'],['ultimate','悟卷'],['fragment','天箋'],['moves','招式']];
const artElements=[['metal','金','metalRoot'],['wood','木','woodRoot'],['water','水','waterRoot'],['fire','火','fireRoot'],['earth','土','earthRoot']];
const artTierMax=[120,260,520,900,1400,2050,2933,3352,4800];
const techniqueBookKinds={secret:'xuanlu',formula:'mingpian',sutra:'tidian',escape:'xingzhang'};
const techniqueBookTierWords=[['清微','流雲'],['靈霄','玄真'],['星華','紫府'],['天罡','地脈'],['太玄','九曜'],['洞虛','萬象'],['無量','諸天'],['太初','鴻蒙'],['混元','天道']];
const techniqueBookElementWords={metal:['庚金','玄鋒'],wood:['青木','建木'],water:['滄溟','玄水'],fire:['離火','炎陽'],earth:['坤元','厚土']};
const techniqueBooks=[],techniqueBookDefaults={};
Object.entries(techniqueBookKinds).forEach(([kind,assetPrefix])=>{
  for(let tier=1;tier<=9;tier++)artElements.forEach(([element,elementName],elementIndex)=>{
    for(let variant=0;variant<2;variant++){
      const id=`artbook-${kind}-t${tier}-${element}-${variant+1}`,count=`artBook_${kind}_${tier}_${element}_${variant+1}`;
      const name=`${techniqueBookTierWords[tier-1][variant]}${techniqueBookElementWords[element][variant]}${artKinds[kind].tab}`;
      const book={id,count,name,kind,element,elementName,tier,level:1,source:'book'};
      techniqueBooks.push(book);techniqueBookDefaults[count]=0;
      itemCatalog[id]={name,image:`assets/qstyle-v2/art-books/${assetPrefix}-${String(tier).padStart(2,'0')}.png`,description:`${elementName}行・${['一','二','三','四','五','六','七','八','九'][tier-1]}階${artKinds[kind].tab}。使用後習得「${name}」，增加${artKinds[kind].label}；同名功法僅能習得一次。`,count,usable:true,giftable:false,sellPrice:1,techniqueBook:book};
    }
  });
});
const startingTechniques=[
  {id:'origin',name:'凝念馭元',kind:'origin',min:.8,max:1,description:'凝神引動體內元息，化為一道氣芒直擊對手。'},
  {id:'flow',name:'流光御鋒',kind:'sword',min:.8,max:1.5,description:'引元息淬成流光劍芒，破空而行，直取對手氣機。'}
];
const swordTechniqueCatalog=[...startingTechniques,
  {id:'mountain',name:'斷嶽沉鋒',kind:'mountain',min:1,max:1.65,description:'凝聚劍勢後重斬而下，傷害起伏較大，適合追求爆發。'},
  {id:'echo',name:'回風疊刃',kind:'echo',min:1.05,max:1.28,description:'劍勢首尾相接，輸出較為穩定，適合作為連續追擊。'}
];
const swordEmbryos={
  heavy:{name:'重鋒劍胚',short:'重鋒',description:'劍勢沉凝，養劍時主要增長命骨與玄軀。'},
  spirit:{name:'靈元劍胚',short:'靈元',description:'劍隨元轉，養劍時主要增長元息與銳識。'},
  shadow:{name:'流影劍胚',short:'流影',description:'劍走輕靈，養劍時主要增長游影與銳識。'}
};
const swordIntents={
  break:{name:'破軍劍意',description:'重攻破勢，主要增長元息與玄軀。'},
  light:{name:'流光劍意',description:'迅疾連斬，主要增長游影與銳識。'},
  origin:{name:'歸元劍意',description:'守中歸一，主要增長命骨與玄軀。'}
};
const bodyInjuries={
  scratch:{name:'擦傷',severity:1,duration:900000,description:'鍛體所得淬鍊度降低10%。'},
  internal:{name:'內傷',severity:2,duration:1800000,description:'戰鬥氣血上限降低15%。'},
  tendon:{name:'筋傷',severity:3,duration:2700000,description:'游影降低15%，且無法進行極限鍛體。'}
};
const wardrobeOutfits={
  女:[
    {id:1,name:'雲水袍',kind:'初始服裝'},{id:2,name:'月華袍',kind:'初始服裝'},{id:3,name:'丹霞袍',kind:'初始服裝'},
    {id:4,name:'星河鳳羽衣',kind:'華服'},{id:5,name:'九霄玄凰裳',kind:'華服'}
  ],
  男:[
    {id:1,name:'青雲袍',kind:'初始服裝'},{id:2,name:'玄劍袍',kind:'初始服裝'},{id:3,name:'山嶽袍',kind:'初始服裝'},
    {id:4,name:'太虛星辰袍',kind:'華服'},{id:5,name:'天衍劍尊衣',kind:'華服'}
  ]
};
const trueFormCatalog=[
  {id:'none',name:'返璞歸真',description:'收斂真身異象，以本來面目示人。'},
  {id:'taixu-sword',name:'太虛劍相',image:'assets/qstyle-v2/true-form-sword-v2.png',description:'八方虛靈古劍結成劍陣，隨吐納明滅共鳴。'},
  {id:'jiuxiao-wings',name:'九霄靈翼',image:'assets/qstyle-v2/true-form-wings.png',description:'以清靈元息凝成的光翼，非羽非骨，如雲霞舒展。'}
];
const defaults = { name:'', gender:'女', hair:1, outfit:1, trueForm:'none', origin:'家族子弟', muted:false, free:0, spiritLevel:0, bodyLevel:0, swordLevel:0, swordPathVersion:2,swordEmbryo:'',swordName:'',swordNurtureLevel:0,swordIntent:0,swordInsight:0,swordIntentType:'',swordMoves:['origin','flow'],swordTrialWins:0,bodyPathVersion:1,bodyStamina:100,bodyStaminaUpdatedAt:0,bodyTemper:0,bodyInjury:'',bodyInjuryUntil:0,testTemporaryItemsMailVersion:0,testResourceSupplyMailVersion:0,testFoodAuraSupplyMailVersion:0,testSpiritMedicineMailVersion:0,testCultivationPillCount:0,testSpiritStoneTenMillionCount:0,spiritMedicineCount:0, ...tribulationPillDefaults, ...techniqueBookDefaults, tribulationPillMigration:1, testTribulationPillGrantVersion:1, totalEarned:0, rootBone:5, trueQi:5, physique:5, agility:5, spiritualPower:5, comprehension:5, fortune:5, attributeGrowthVersion:2, learnedArts:[],learnedBookIds:[],mailbox:[],scripturePurchases:{date:'',ids:[]},marketPermanentPurchases:{},marketDailyPurchases:{date:'',counts:{}},artsCapacity:8,bagRank:1,mendingSilk:0,metalArt:0, woodArt:0, waterArt:0, fireArt:0, earthArt:0, metalRoot:0, woodRoot:0, waterRoot:0, fireRoot:0, earthRoot:0, aura:0, spiritPoolLevel:1, spiritStone:0, spiritJade:99999, testJadeGrantVersion:1, food:200, wood:40, meteorIron:20, daoChildTotal:1, daoChildBought:0, workerSpiritStone:0,workerFood:0, workerWood:0, workerMeteorIron:0, spiritStoneAreaLevel:1, foodAreaLevel:1, woodAreaLevel:1, meteorIronAreaLevel:1,caveCoreLevel:1,caveCultivationLevel:1,caveSwordLevel:1,caveBodyLevel:1,caveCultivationEnabled:true,caveSwordEnabled:false,caveBodyEnabled:false,caveSwordTicks:0,caveBodyTicks:0, sect:'', sectFaction:'', sectStar:0, sectContribution:0, sectRank:0, sectTask:'', sectJoinedAt:null, sectYearsProcessed:0, sectNpcSnapshot:null, righteousness:0, evilQi:0, prestige:0, actingLeader:false, npcAffinity:{},npcDaily:{},sectTokens:0,sectTokenDaily:{date:'',exchanged:0},practiceBuff:{active:false,until:0,remaining:0,total:0},transmissionBuff:{active:false,until:0,remaining:0,total:0},lastGreetingDay:'',lastSalaryDay:'',lastPracticeDay:'',bornAt:null,lastTrustedTime:0,lastSave:Date.now() };
defaults.cultivationAwakened=false;
let state = { ...defaults }, tickStart = Date.now(), manualCultivationStartedAt=0, manualCultivationTimer=null, breakthroughInProgress=false;
const saveKey = 'wendao-idle-v2';
let createGender='女', createAppearance=1, createOutfit=1, createOrigin='家族子弟', audioContext=null, currentFeature=null, currentRootView='root', currentCaveView='dwelling', currentSectView='home', currentArtsView='sect', currentExperienceView='sword', currentMarketTab='market', suppressSave=false;
const marketFloors={market:1,scripture:1,reputation:1};
const marketFloorStars=[1,3,5,7,9];
const chineseFloorNames=['一','二','三','四','五'];
let marketFloorNoticeTimer=null,lastScriptureDayKey='',marketPurchaseOffer=null,marketPurchaseQuantity=1,currentMailId=null;
let bgmTheme=null,battle=null,battleTimer=null,swordTrialAdvanceTimer=null,swordTrialCountdownTimer=null,pauseStartedAt=null,sessionOnline=false,confirmResolver=null,prologueTimer=null,tribulationPillUseCount=0,tribulationLocked=false,tribulationTimers=[];
let itemModalKey=null,itemModalQuantity=1,sellItemKey=null,sellItemQuantity=1;
let clockEpoch=Date.now(),clockPerf=performance.now(),trustedClockReady=location.protocol==='file:',clockSyncPromise=null;

function setClockAnchor(epoch,trusted=false){clockEpoch=epoch;clockPerf=performance.now();trustedClockReady=trusted||location.protocol==='file:'}
function gameNow(){return Math.floor(clockEpoch+(performance.now()-clockPerf))}
function appearanceAsset(gender,appearance,outfit){
  if(qStyleMode){
    const g=gender==='男'?'male':'female';
    const selectedOutfit=Math.max(1,Math.min(5,Number(outfit)||1));
    const selectedAppearance=Math.max(1,Math.min(3,Number(appearance)||1));
    const asset=selectedAppearance===1
      ? `assets/qstyle-v2/${g}-outfit-${selectedOutfit}.png`
      : `assets/qstyle-v2/${g}-appearance-${selectedAppearance}-outfit-${selectedOutfit}.png`;
    return `${asset}?v=20260810c`;
  }
  const g=gender==='男'?'male':'female';
  const version=appearance===2?'v2':'v1';
  return `assets/${g}-appearance-${appearance||1}-outfit-${outfit||1}-${version}.png`;
}
function characterAsset(){return appearanceAsset(state.gender,state.appearance||1,state.outfit||1)}
function applyCharacterVisual(){
  const hero=$('#heroCharacter');if(hero)hero.src=characterAsset();
  const form=$('#heroTrueForm');if(!form)return;
  const selected=trueFormCatalog.find(item=>item.id===(state.trueForm||'none'));
  form.className=`hero-true-form true-form-${selected?.id||'none'}`;
  if(selected?.image){form.src=selected.image;form.alt=selected.name;form.classList.remove('hidden')}
  else{form.removeAttribute('src');form.alt='';form.classList.add('hidden')}
}
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
function swordReq(level) { return req(level)*3; }
function formatLargeNumber(value){
  if(!Number.isFinite(value))return '∞';
  const rounded=Math.round(value),sign=rounded<0?'-':'',amount=Math.abs(rounded);
  if(amount<10000)return sign+amount;
  const yi=Math.floor(amount/100000000),wan=Math.floor(amount%100000000/10000),rest=amount%10000,parts=[];
  if(yi)parts.push(`${yi}億`);if(wan||yi&&rest)parts.push(`${wan}萬`);if(rest)parts.push(`${rest}`);
  return sign+parts.join('');
}
function legacySpiritAttributeGain(newLevel){const curve=1+Math.floor((Math.max(1,newLevel)-1)/20);return {trueQi:2+curve,rootBone:1+Math.ceil(curve/2),agility:newLevel%3===0?1+Math.floor(curve/6):0,physique:newLevel%5===0?1+Math.floor(curve/7):0,comprehension:newLevel%10===0?1+Math.floor(newLevel/50):0}}
function legacyBodyAttributeGain(newLevel){const curve=1+Math.floor((Math.max(1,newLevel)-1)/20);return {rootBone:2+curve,physique:2+curve,trueQi:newLevel%4===0?1+Math.floor(curve/5):0,agility:newLevel%5===0?1+Math.floor(curve/6):0}}
function growthStage(newLevel){return 1+Math.floor(Math.floor(Math.max(0,newLevel)/10)/4)}
function spiritAttributeGain(newLevel) {
  const stage=growthStage(newLevel),realm=Math.floor(newLevel/10),breakthrough=newLevel%10===0;
  return {trueQi:2+stage,rootBone:1+Math.ceil(stage/2),agility:newLevel%3===0?stage:0,physique:newLevel%5===0?Math.ceil(stage/2):0,comprehension:breakthrough?1+Math.floor(realm/5):0};
}
function bodyAttributeGain(newLevel) {
  const stage=growthStage(newLevel),breakthrough=newLevel%10===0;
  return {rootBone:2+stage+(breakthrough?2*stage:0),physique:2+stage+(breakthrough?2*stage:0),trueQi:newLevel%4===0?Math.ceil(stage/2):0,agility:newLevel%5===0?Math.ceil(stage/2):0};
}
function swordAttributeGain(newLevel) {
  const stage=growthStage(newLevel),breakthrough=newLevel%10===0;
  return {agility:1+Math.ceil(stage/2)+(breakthrough?2*stage:0),trueQi:newLevel%2===0?stage:0,spiritualPower:(newLevel%3===0?stage:0)+(breakthrough?2*stage:0)};
}
function applyAttributeGain(gain){Object.entries(gain).forEach(([key,value])=>state[key]=(state[key]||0)+value)}
function sumGrowth(total,gain,factor=1){Object.entries(gain).forEach(([key,value])=>total[key]=(total[key]||0)+value*factor);return total}
function cumulativeGrowth(spiritLevel,bodyLevel=0,swordLevel=0){const total={rootBone:0,trueQi:0,physique:0,agility:0,spiritualPower:0,comprehension:0};for(let i=1;i<=spiritLevel;i++)sumGrowth(total,spiritAttributeGain(i));for(let i=1;i<=bodyLevel;i++)sumGrowth(total,bodyAttributeGain(i));for(let i=1;i<=swordLevel;i++)sumGrowth(total,swordAttributeGain(i));return total}
function legacyCumulativeGrowth(spiritLevel,bodyLevel=0){const total={rootBone:0,trueQi:0,physique:0,agility:0,spiritualPower:0,comprehension:0};for(let i=1;i<=spiritLevel;i++)sumGrowth(total,legacySpiritAttributeGain(i));for(let i=1;i<=bodyLevel;i++)sumGrowth(total,legacyBodyAttributeGain(i));return total}
function migrateAttributeGrowth(version){
  if(version===2)return;
  // 舊版與未標記版本的存檔都已套用過原本的境界成長；先扣回再換算，避免重複加點。
  if(version<=1)sumGrowth(state,legacyCumulativeGrowth(state.spiritLevel||0,state.bodyLevel||0),-1);
  sumGrowth(state,cumulativeGrowth(state.spiritLevel,state.bodyLevel,state.swordLevel||0));
  ['rootBone','trueQi','physique','agility','spiritualPower','comprehension','fortune'].forEach(key=>state[key]=Math.max(0,Math.round(state[key]||0)));
  state.attributeGrowthVersion=2;
}
function normalizeSwordPath(){
  if(!swordEmbryos[state.swordEmbryo])state.swordEmbryo='';
  if(!state.swordEmbryo)state.swordName='';else state.swordName=String(state.swordName||'無名靈劍').trim().slice(0,12)||'無名靈劍';
  state.swordNurtureLevel=Math.max(0,Math.min(swordRealms.length,Math.floor(state.swordNurtureLevel||0)));state.swordIntent=Math.max(0,Math.floor(state.swordIntent||0));state.swordInsight=Math.max(0,Math.floor(state.swordInsight||0));state.swordTrialWins=Math.max(0,Math.min(maxSwordLevel+1,Math.floor(state.swordTrialWins||0)));
  if(!swordIntents[state.swordIntentType])state.swordIntentType='';
  const moves=Array.isArray(state.swordMoves)?state.swordMoves.filter(id=>swordTechniqueCatalog.some(move=>move.id===id)&&swordTechniqueUnlocked(id)):[];state.swordMoves=Array.from(new Set(moves)).slice(0,2);while(state.swordMoves.length<2)state.swordMoves.push(state.swordMoves.includes('origin')?'flow':'origin');state.swordPathVersion=2;
}
function activeBodyInjury(){return bodyInjuries[state.bodyInjury]&&(state.bodyInjuryUntil||0)>gameNow()?state.bodyInjury:''}
function refreshBodyState(){
  const now=gameNow();state.bodyStamina=Math.max(0,Number(state.bodyStamina)||0);if(!state.bodyStaminaUpdatedAt)state.bodyStaminaUpdatedAt=now;const recovered=Math.floor(Math.max(0,now-state.bodyStaminaUpdatedAt)/180000);if(recovered>0&&state.bodyStamina<100){state.bodyStamina=Math.min(100,state.bodyStamina+recovered);state.bodyStaminaUpdatedAt=state.bodyStamina>=100?now:state.bodyStaminaUpdatedAt+recovered*180000}else if(state.bodyStamina>=100)state.bodyStaminaUpdatedAt=now;if(state.bodyInjury&&!activeBodyInjury()){state.bodyInjury='';state.bodyInjuryUntil=0}return state.bodyStamina;
}
function normalizeBodyPath(){const stamina=Number(state.bodyStamina);state.bodyStamina=Number.isFinite(stamina)?Math.max(0,stamina):100;state.bodyStaminaUpdatedAt=Number(state.bodyStaminaUpdatedAt)||gameNow();state.bodyTemper=Math.max(0,Math.floor(state.bodyTemper||0));if(!bodyInjuries[state.bodyInjury]){state.bodyInjury='';state.bodyInjuryUntil=0}state.bodyPathVersion=1;refreshBodyState()}
function bodyTemperNeed(level=state.bodyLevel){return Math.max(100,Math.round(100*Math.pow(level+1,1.2)))}
function bodyTemperGain(base){return Math.max(1,Math.round(base*(activeBodyInjury()==='scratch'?.9:1)))}
function bodyTrainingOptions(){const realm=Math.floor((state.bodyLevel||0)/10)+1,need=bodyTemperNeed();return {
  basic:{name:'基礎鍛體',stamina:10,food:40*realm,wood:0,stone:0,gain:bodyTemperGain(need*.12),risk:0,description:'循序打磨筋骨，進度穩定且不會受傷。'},
  bath:{name:'藥浴鍛體',stamina:20,food:70*realm,wood:25*realm,stone:100*realm,gain:bodyTemperGain(need*.26),risk:0,description:'以洞府物資溫養肉身，並可治癒擦傷。'},
  extreme:{name:'極限鍛體',stamina:30,food:120*realm,wood:0,stone:0,gain:bodyTemperGain(need*.45),risk:30,description:'強行逼迫肉身突破極限，進度最快但可能受傷。'}
}}
function inflictBodyInjury(id){const injury=bodyInjuries[id];if(!injury)return;const current=bodyInjuries[activeBodyInjury()];if(!current||injury.severity>=current.severity){state.bodyInjury=id;state.bodyInjuryUntil=gameNow()+injury.duration}}
function trainBody(kind){
  refreshBodyState();const option=bodyTrainingOptions()[kind];if(!option)return;if(kind==='extreme'&&activeBodyInjury()==='tendon')return toast('筋傷未癒，無法進行極限鍛體');if(state.bodyStamina<option.stamina)return toast('體力不足');if(state.food<option.food||state.wood<option.wood||state.spiritStone<option.stone)return toast('鍛體所需資源不足');
  state.bodyStamina-=option.stamina;state.bodyStaminaUpdatedAt=gameNow();state.food-=option.food;state.wood-=option.wood;state.spiritStone-=option.stone;state.bodyTemper+=option.gain;if(kind==='bath'&&activeBodyInjury()==='scratch'){state.bodyInjury='';state.bodyInjuryUntil=0}if(option.risk&&Math.random()*100<option.risk){const roll=Math.random();inflictBodyInjury(roll<.5?'scratch':roll<.82?'internal':'tendon');toast(`${option.name}完成・淬鍊度+${option.gain}，但留下${bodyInjuries[state.bodyInjury].name}`)}else toast(`${option.name}完成・淬鍊度+${option.gain}`);renderExperiencePanel('training');render();save();
}
function healBodyInjury(){const id=activeBodyInjury();if(!id)return toast('目前沒有傷勢');const costs={scratch:{food:100,wood:20,stone:100},internal:{food:300,wood:60,stone:500},tendon:{food:500,wood:120,stone:1000}}[id];if(state.food<costs.food||state.wood<costs.wood||state.spiritStone<costs.stone)return toast('療傷所需資源不足');state.food-=costs.food;state.wood-=costs.wood;state.spiritStone-=costs.stone;state.bodyInjury='';state.bodyInjuryUntil=0;toast('傷勢已痊癒');renderExperiencePanel('body');render();save()}
function bodyHealCost(id=activeBodyInjury()){return {scratch:{food:100,wood:20,stone:100},internal:{food:300,wood:60,stone:500},tendon:{food:500,wood:120,stone:1000}}[id]}
function formatDuration(ms){const minutes=Math.max(0,Math.ceil(ms/60000));return minutes>=60?`${Math.floor(minutes/60)}時${minutes%60}分`:`${minutes}分`}
function hasMindEmbodiment() { return state.spiritLevel>=40; }
function setTribulationLock(locked){
  tribulationLocked=locked;
  $('#gameScreen').classList.toggle('tribulation-locked',locked);
}
function blockDuringTribulation(event){
  if(!tribulationLocked)return;
  if(event.target.closest?.('#tribulationExit'))return;
  event.preventDefault();event.stopImmediatePropagation();
}
['click','dblclick','pointerdown','pointerup','touchstart','touchend','keydown','keyup'].forEach(type=>document.addEventListener(type,blockDuringTribulation,true));
function experiencedYears() { return state.bornAt ? Math.max(0,Math.floor((gameNow()-state.bornAt)/900000)) : 0; }
function realmName(level, arr) {
  return `${arr[Math.min(Math.floor(level/10),arr.length-1)]}・${['一','二','三','四','五','六','七','八','九','十'][level%10]}層`;
}
function spiritRealmIndex(){return Math.floor(Math.max(0,state.spiritLevel||0)/10)}
function bodyRealmLimit(){return Math.floor(spiritRealmIndex()/2)}
function swordRealmLimit(){return spiritRealmIndex()}
function bodyPathBlocked(){return Math.floor((state.bodyLevel+1)/10)>bodyRealmLimit()}
function swordPathBlocked(){return Math.floor(((state.swordLevel||0)+1)/10)>swordRealmLimit()}
function swordPathUnlocked(){return (state.spiritLevel||0)>=20}
function swordIntentUnlocked(){return (state.spiritLevel||0)>=40&&(state.swordLevel||0)>=40&&(state.swordTrialWins||0)>=40&&!!state.swordEmbryo}
function swordPathBonus(attribute){
  if(!state.swordEmbryo)return 0;
  const nurture=Math.max(0,Math.floor(state.swordNurtureLevel||0)),realm=Math.max(1,Math.floor((state.swordLevel||0)/10)+1);let bonus=0;
  const embryoGain={heavy:{rootBone:2,physique:1},spirit:{trueQi:1,spiritualPower:1},shadow:{agility:2,spiritualPower:1}}[state.swordEmbryo]||{};bonus+=(embryoGain[attribute]||0)*nurture;
  const intentGain={break:{trueQi:2,physique:1},light:{agility:2,spiritualPower:1},origin:{rootBone:1,physique:1}}[state.swordIntentType]||{};bonus+=(intentGain[attribute]||0)*realm;
  return bonus;
}
function artBaseEffect(art){return Math.round(artTierMax[art.tier-1]*(art.level/10))}
function artRootEffect(art){return Math.round((state[`${art.element}Art`]||0)*art.tier*art.level)}
function artTotalEffect(art){return artBaseEffect(art)+artRootEffect(art)}
function artBonusFor(attribute){return (state.learnedArts||[]).filter(art=>artKinds[art.kind]?.attribute===attribute).reduce((sum,art)=>sum+artTotalEffect(art),0)}
function effectiveCore(attribute){const total=(state[attribute]||0)+artBonusFor(attribute)+swordPathBonus(attribute);return attribute==='agility'&&activeBodyInjury()==='tendon'?total*.85:total}
const combatPowerWeights={rootBone:10,trueQi:25,physique:20,agility:15,spiritualPower:30};
function combatPower(){return Math.round(Object.entries(combatPowerWeights).reduce((sum,[key,weight])=>sum+Math.max(0,effectiveCore(key))*weight,0))}
function formatCombatPower(value){
  const amount=Math.max(0,Math.floor(value));
  if(amount<10000)return amount.toLocaleString();
  const parts=[],yi=Math.floor(amount/100000000),wan=Math.floor(amount%100000000/10000),rest=amount%10000;
  if(yi)parts.push(`${yi}億`);
  if(wan||yi)parts.push(`${wan}萬`);
  if(rest||!parts.length)parts.push(rest.toString());
  return parts.join(' ');
}
function cultivationEfficiency() { return effectiveCore('comprehension')*.5; }
function auraEfficiency() { return Math.floor(1.25*Math.sqrt(Math.max(0,effectiveCore('fortune')))); }
function pathEfficiency(level){const realm=Math.min(Math.floor(level/10),realmEfficiencyMultipliers.length-1),layer=level%10;return realmEfficiencyMultipliers[realm]*(1+layer*.035)}
function realmEfficiency(){return Math.max(1,pathEfficiency(state.spiritLevel)+pathEfficiency(state.bodyLevel)+pathEfficiency(state.swordLevel||0)-realmEfficiencyMultipliers[0]*2)}
function baseRate() { return Math.max(1,Math.floor((10+cultivationEfficiency())*realmEfficiency())); }
function buffRemaining(key,now=gameNow()){const buff=state[key]||defaults[key];return buff.active?Math.max(0,(buff.until||0)-now):Math.max(0,buff.remaining||0)}
function buffActive(key,now=gameNow()){return !!state[key]?.active&&buffRemaining(key,now)>0}
function cultivationMultiplier(now=gameNow()){return 1+(buffActive('practiceBuff',now)?4:0)+(buffActive('transmissionBuff',now)?7:0)+caveCultivationBonus()}
function rate() { return Math.max(1,Math.floor(baseRate()*cultivationMultiplier())); }
function buffYears(key){return buffRemaining(key)/900000}
function addCultivationBuff(key,years){const remaining=buffRemaining(key),duration=years*900000,total=remaining+duration;state[key]={active:true,until:gameNow()+total,remaining:0,total}}
function buffClock(key){const seconds=Math.max(0,Math.ceil(buffRemaining(key)/1000)),hours=Math.floor(seconds/3600),minutes=Math.floor(seconds%3600/60),secs=seconds%60;return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(secs).padStart(2,'0')}`}
function buffPercent(key){const buff=state[key],total=Math.max(1,buff?.total||buffRemaining(key));return Math.max(0,Math.min(100,buffRemaining(key)/total*100))}
function offlineCultivationGain(from,to){const base=baseRate(),ticks=Math.max(0,(to-from)/5000);let gain=base*ticks*(1+caveCultivationBonus());for(const [key,bonus] of [['practiceBuff',4],['transmissionBuff',7]]){const buff=state[key];if(buff?.active)gain+=base*bonus*Math.max(0,Math.min(to,buff.until||0)-from)/5000}return Math.floor(gain)}
function auraRate() { return Math.max(1,Math.floor(5+(state.spiritPoolLevel-1)*2+auraEfficiency())); }
function poolStorageHours() { return Math.min(18,2+(state.spiritPoolLevel-1)*.75); }
function auraCapacity() { return Math.floor(auraRate()*720*poolStorageHours()); }
function spiritRootReq(level) { return Math.floor(500*Math.pow(1.38,level)); }
function poolWoodCost() { return Math.floor(120*Math.pow(state.spiritPoolLevel,1.55)); }
function poolIronCost() { return Math.floor(50*Math.pow(state.spiritPoolLevel,1.5)); }
function rootRank(level) { return `${spiritRootRanks[Math.min(Math.floor(level/10),spiritRootRanks.length-1)]}・${level%10+1}階`; }
function chanceFromRating(rating,cap) { return Math.min(cap,rating/(rating+1000)*100); }
function save() { if(suppressSave)return;const now=gameNow();state.lastSave=now;if(trustedClockReady)state.lastTrustedTime=Math.max(state.lastTrustedTime||0,now);localStorage.setItem(saveKey,JSON.stringify(state)); }
function grantTestTribulationPills(){
  Object.keys(tribulationPillDefaults).forEach(key=>state[key]=Math.max(200,state[key]||0));
  state.testTribulationPillGrantVersion=1;
}
function load() {
  try {
    const current=JSON.parse(localStorage.getItem(saveKey));
    if(current) { const growthVersion=current.attributeGrowthVersion||0,needsPillMigration=!current.tribulationPillMigration,needsTestJadeGrant=!current.testJadeGrantVersion,needsTestPillGrant=!current.testTribulationPillGrantVersion;state={...defaults,...current};if(needsTestJadeGrant){state.spiritJade=Math.max(99999,state.spiritJade||0);state.testJadeGrantVersion=1}if(needsPillMigration)state.tribPill1=(state.tribPill1||0)+Math.max(0,current.pills||0);delete state.pills;state.tribulationPillMigration=1;if(needsTestPillGrant)grantTestTribulationPills();state.learnedArts=Array.isArray(current.learnedArts)?current.learnedArts:[];state.learnedBookIds=Array.isArray(current.learnedBookIds)?current.learnedBookIds:[];state.mailbox=Array.isArray(current.mailbox)?current.mailbox:[];state.scripturePurchases={...defaults.scripturePurchases,...current.scripturePurchases};state.scripturePurchases.ids=Array.isArray(state.scripturePurchases.ids)?state.scripturePurchases.ids:[];state.marketPermanentPurchases=current.marketPermanentPurchases&&typeof current.marketPermanentPurchases==='object'?current.marketPermanentPurchases:{};state.marketDailyPurchases={...defaults.marketDailyPurchases,...current.marketDailyPurchases};state.marketDailyPurchases.counts=state.marketDailyPurchases.counts&&typeof state.marketDailyPurchases.counts==='object'?state.marketDailyPurchases.counts:{};state.sectTokenDaily={...defaults.sectTokenDaily,...current.sectTokenDaily};state.practiceBuff={...defaults.practiceBuff,...current.practiceBuff};state.transmissionBuff={...defaults.transmissionBuff,...current.transmissionBuff};migrateAttributeGrowth(growthVersion);state.bornAt ||= Date.now(); state.npcAffinity||={};state.npcDaily||={};normalizeLearnedArts();normalizeCaveWorkers();normalizeCaveState();migrateSectName(); return state; }
    const old=JSON.parse(localStorage.getItem('wendao-idle-v1'));
    if(old) { state={...defaults,...old,free:(old.free||0)+(old.spiritQi||0)+(old.bodyQi||0),spiritJade:99999,testJadeGrantVersion:1,tribPill1:Math.max(0,old.pills||0),tribulationPillMigration:1};delete state.pills;grantTestTribulationPills();state.bornAt ||= Date.now(); }
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
function createWelcomeMail(now){
  return {id:`welcome-${now}`,subject:'初入修途・迎新贈禮',sender:'問道長生',body:'道友既已結契入世，從此山高水長，自有仙途可尋。這份薄禮贈予初踏修途的你，願你守住本心，行遍九霄。',sentAt:now,read:false,claimed:false,attachments:[{type:'currency',key:'prestige',name:'聲望',image:'assets/qstyle-v2/reputation.png',amount:200}]};
}
function createTestTemporaryItemsMail(now){return {id:'test-temporary-items-v1',subject:'測試用臨時道具',sender:'問道長生・測試',body:'為方便測試目前版本內容，隨信附上兩項臨時道具。領取後可於儲物袋中使用。',sentAt:now,read:false,claimed:false,attachments:[{type:'item',key:'testCultivationPillCount',name:'修為丹',image:itemCatalog.testCultivationPill.image,amount:1},{type:'item',key:'testSpiritStoneTenMillionCount',name:'一千萬靈石',image:itemCatalog.testSpiritStoneTenMillion.image,amount:1}]}}
function ensureTestTemporaryItemsMail(){if(!state.name||state.testTemporaryItemsMailVersion>=1)return;if(!mailbox().some(mail=>mail.id==='test-temporary-items-v1'))mailbox().push(createTestTemporaryItemsMail(gameNow()));state.testTemporaryItemsMailVersion=1}
function createTestResourceSupplyMail(now){return {id:'test-resource-supply-v1',subject:'測試用資源補給',sender:'問道長生・測試',body:'為方便測試洞府、坊市與門派系統，隨信發放一批測試資源。',sentAt:now,read:false,claimed:false,attachments:[{type:'currency',key:'wood',name:'木材',image:'assets/qstyle-v2/wood-cutout.png',amount:10000000},{type:'currency',key:'meteorIron',name:'隕鐵',image:'assets/qstyle-v2/meteor-iron-cutout.png',amount:10000000},{type:'currency',key:'food',name:'食物',image:'assets/qstyle-v2/food-cutout.png',amount:10000000},{type:'currency',key:'prestige',name:'聲望',image:'assets/qstyle-v2/reputation.png',amount:10000000}]}}
function ensureTestResourceSupplyMail(){if(!state.name||state.testResourceSupplyMailVersion>=1)return;if(!mailbox().some(mail=>mail.id==='test-resource-supply-v1'))mailbox().push(createTestResourceSupplyMail(gameNow()));state.testResourceSupplyMailVersion=1}
function createTestFoodAuraSupplyMail(now){return {id:'test-resource-supply-v2',subject:'測試用資源補給',sender:'問道長生・測試',body:'為方便後續測試，隨信補發食物與靈氣。',sentAt:now,read:false,claimed:false,attachments:[{type:'currency',key:'food',name:'食物',image:'assets/qstyle-v2/food-cutout.png',amount:10000000},{type:'currency',key:'aura',name:'靈氣',image:'assets/qstyle-v2/spirit-pool.png',amount:10000000}]}}
function ensureTestFoodAuraSupplyMail(){if(!state.name||state.testFoodAuraSupplyMailVersion>=1)return;if(!mailbox().some(mail=>mail.id==='test-resource-supply-v2'))mailbox().push(createTestFoodAuraSupplyMail(gameNow()));state.testFoodAuraSupplyMailVersion=1}
function createTestSpiritMedicineMail(now){return {id:'test-spirit-medicine-v1',subject:'測試用資源補給',sender:'問道長生・測試',body:'為方便測試煉體之路，隨信附上一批可恢復體力的靈藥。',sentAt:now,read:false,claimed:false,attachments:[{type:'item',key:'spiritMedicineCount',name:'靈藥',image:itemCatalog.spiritMedicine.image,amount:500}]}}
function ensureTestSpiritMedicineMail(){if(!state.name||state.testSpiritMedicineMailVersion>=1)return;if(!mailbox().some(mail=>mail.id==='test-spirit-medicine-v1'))mailbox().push(createTestSpiritMedicineMail(gameNow()));state.testSpiritMedicineMailVersion=1}
function mailbox(){return Array.isArray(state.mailbox)?state.mailbox:(state.mailbox=[])}
function unreadMailCount(){return mailbox().filter(mail=>!mail.read).length}
function mailDate(value){return new Intl.DateTimeFormat('zh-TW',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(value||Date.now()))}
function renderMailButton(){
  const count=unreadMailCount(),badge=$('#mailUnreadBadge');if(!badge)return;
  badge.textContent=count>99?'99+':count;badge.classList.toggle('hidden',count===0);
}
function renderMailbox(){
  const list=$('#mailList');if(!list)return;const mails=[...mailbox()].sort((a,b)=>(b.sentAt||0)-(a.sentAt||0));
  $('#mailboxUnreadCount').textContent=unreadMailCount();
  list.innerHTML=mails.length?mails.map(mail=>`<button class="mail-list-item ${mail.read?'is-read':'is-unread'}" data-mail-id="${mail.id}"><i>${mail.read?'閱':'新'}</i><span><b>${mail.subject}</b><small>${mail.sender}・${mailDate(mail.sentAt)}</small></span>${mail.attachments?.length?`<em>${mail.claimed?'已領取':'有附件'}</em>`:''}</button>`).join(''):'<div class="mail-empty"><b>暫無書信</b><small>新的訊息與獎勵會送到此處。</small></div>';
  list.querySelectorAll('[data-mail-id]').forEach(button=>button.onclick=()=>openMailDetail(button.dataset.mailId));
}
function openMailbox(){renderMailbox();$('#mailboxModal').classList.remove('hidden')}
function closeMailbox(){$('#mailboxModal').classList.add('hidden')}
function renderMailDetail(){
  const mail=mailbox().find(entry=>entry.id===currentMailId);if(!mail)return closeMailDetail();
  $('#mailDetailSubject').textContent=mail.subject;$('#mailDetailSender').textContent=`寄件人：${mail.sender}`;$('#mailDetailDate').textContent=mailDate(mail.sentAt);$('#mailDetailBody').textContent=mail.body;
  const attachments=Array.isArray(mail.attachments)?mail.attachments:[],section=$('#mailAttachmentSection');section.classList.toggle('hidden',!attachments.length);
  $('#mailAttachmentList').innerHTML=attachments.map(item=>`<div class="mail-attachment ${mail.claimed?'is-claimed':''}"><img src="${item.image||''}" alt=""><span><b>${item.name}</b><small>× ${formatLargeNumber(Number(item.amount||0))}</small></span></div>`).join('');
  const claim=$('#mailClaimBtn');claim.classList.toggle('hidden',!attachments.length);claim.disabled=!!mail.claimed;claim.textContent=mail.claimed?'已領取':'領取附件';
}
function openMailDetail(id){const mail=mailbox().find(entry=>entry.id===id);if(!mail)return;mail.read=true;currentMailId=id;renderMailbox();renderMailButton();renderMailDetail();$('#mailDetailModal').classList.remove('hidden');save()}
function closeMailDetail(){$('#mailDetailModal').classList.add('hidden');currentMailId=null}
function claimMailAttachments(){
  const mail=mailbox().find(entry=>entry.id===currentMailId);if(!mail||mail.claimed)return;
  for(const attachment of mail.attachments||[]){if(attachment.type==='currency'&&Object.prototype.hasOwnProperty.call(state,attachment.key))state[attachment.key]=(Number(state[attachment.key])||0)+Number(attachment.amount||0);else if(attachment.type==='item'&&Object.prototype.hasOwnProperty.call(state,attachment.key))state[attachment.key]=(Number(state[attachment.key])||0)+Number(attachment.amount||0)}
  mail.claimed=true;renderMailDetail();renderMailbox();renderMailButton();render();save();toast('附件已收入囊中');
}
async function deleteCurrentMail(){
  const mail=mailbox().find(entry=>entry.id===currentMailId);if(!mail)return;
  if(mail.attachments?.length&&!mail.claimed){await gameConfirm('此信尚有未領取附件，請先領取附件後再刪除信件。',{title:'無法刪除信件',confirmText:'我知道了'});return}
  if(!await gameConfirm(`確定刪除「${mail.subject}」？`,{title:'刪除信件',confirmText:'確認刪除',danger:true}))return;
  state.mailbox=mailbox().filter(entry=>entry.id!==currentMailId);closeMailDetail();renderMailbox();renderMailButton();save();
}
function addCultivation(amount,silent=false) {
  state.free += amount; state.totalEarned += amount;
  if(!silent) { if(isPureCultivationView())toast(`修為+${formatLargeNumber(amount)}`,'cultivation'); playTone(); }
  render(); save();
}
function renderNoviceCultivation(){
  const awakened=!!state.cultivationAwakened,ready=!awakened&&state.free>=600,progress=Math.min(100,state.free/6),novice=$('#noviceCultivation'),button=$('#manualCultivateBtn');
  novice.classList.toggle('hidden',awakened);novice.classList.toggle('breakthrough-ready',ready);
  $('.path-actions').classList.toggle('hidden',!awakened);
  $$('.feature-tab[data-page="root"],.feature-tab[data-page="sect"]').forEach(tab=>tab.classList.toggle('novice-locked',!awakened));
  if(awakened)return;
  $('#noviceProgressText').textContent=ready?'修為已足，點擊突破踏入聽息一層':`入門進度 ${formatLargeNumber(state.free)} / 600`;
  $('#noviceProgressBar').style.width=`${progress}%`;
  button.classList.toggle('breakthrough-button',ready);
  if(ready){button.disabled=breakthroughInProgress;button.setAttribute('aria-label','突破至聽息一層');}
  else if(!manualCultivationStartedAt){button.disabled=false;button.classList.remove('channeling');$('#manualCultivateLabel').textContent='修練';$('#manualCultivateHint').textContent=`凝神吐納 5 秒・可得 ${rate()} 修為`;$('#manualCultivateBar').style.width='0%'}
}
function finishManualCultivation(){
  clearInterval(manualCultivationTimer);manualCultivationTimer=null;manualCultivationStartedAt=0;
  if(state.cultivationAwakened)return;
  const amount=rate();state.free+=amount;state.totalEarned+=amount;playTone();render();save();
  if(state.free<600)toast(`吐納完成・修為+${formatLargeNumber(amount)}`);
}
function beginManualCultivation(){
  if(state.cultivationAwakened||manualCultivationStartedAt||breakthroughInProgress)return;
  if(state.free>=600)return beginFirstBreakthrough();
  manualCultivationStartedAt=performance.now();const button=$('#manualCultivateBtn');button.disabled=true;button.classList.add('channeling');
  const update=()=>{const elapsed=performance.now()-manualCultivationStartedAt,left=Math.max(0,5-Math.floor(elapsed/1000));$('#manualCultivateLabel').textContent='吐納中';$('#manualCultivateHint').textContent=`尚需 ${left} 秒`;$('#manualCultivateBar').style.width=`${Math.min(100,elapsed/50)}%`;if(elapsed>=5000)finishManualCultivation()};
  update();manualCultivationTimer=setInterval(update,80);
}
function beginFirstBreakthrough(){
  if(state.cultivationAwakened||state.free<600||breakthroughInProgress)return;
  breakthroughInProgress=true;$('#manualCultivateBtn').disabled=true;$('#heroArt').classList.add('breakthrough-absorb');playBreakthroughSound();
  setTimeout(()=>{state.free-=600;state.cultivationAwakened=true;breakthroughInProgress=false;$('#heroArt').classList.remove('breakthrough-absorb');render();save();toast('已突破至聽息・一層，新手指引完成');},2100);
}
function playBreakthroughSound(){
  if(state.muted)return;
  try{
    audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();audioContext.resume?.();
    const now=audioContext.currentTime,master=audioContext.createGain();master.connect(audioContext.destination);
    master.gain.setValueAtTime(.0001,now);master.gain.exponentialRampToValueAtTime(.2,now+.18);master.gain.setValueAtTime(.2,now+1.35);master.gain.exponentialRampToValueAtTime(.0001,now+2.05);
    const length=Math.floor(audioContext.sampleRate*1.75),buffer=audioContext.createBuffer(1,length,audioContext.sampleRate),data=buffer.getChannelData(0);
    for(let i=0;i<length;i++){const t=i/length;data[i]=(Math.random()*2-1)*Math.sin(Math.PI*t)*.55}
    const breath=audioContext.createBufferSource(),breathFilter=audioContext.createBiquadFilter();breath.buffer=buffer;breathFilter.type='bandpass';breathFilter.Q.value=.8;breathFilter.frequency.setValueAtTime(260,now);breathFilter.frequency.exponentialRampToValueAtTime(1900,now+1.45);breath.connect(breathFilter).connect(master);breath.start(now);breath.stop(now+1.78);
    [164,246,369].forEach((frequency,index)=>{const tone=audioContext.createOscillator(),gain=audioContext.createGain();tone.type=index===1?'triangle':'sine';tone.frequency.setValueAtTime(frequency,now);tone.frequency.exponentialRampToValueAtTime(frequency*2.4,now+1.45);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.09-index*.018,now+.22+index*.08);gain.gain.exponentialRampToValueAtTime(.0001,now+1.7);tone.connect(gain).connect(master);tone.start(now);tone.stop(now+1.75)});
    const impact=audioContext.createOscillator(),impactGain=audioContext.createGain();impact.type='sine';impact.frequency.setValueAtTime(145,now+1.48);impact.frequency.exponentialRampToValueAtTime(42,now+1.98);impactGain.gain.setValueAtTime(.0001,now);impactGain.gain.setValueAtTime(.42,now+1.48);impactGain.gain.exponentialRampToValueAtTime(.0001,now+2.04);impact.connect(impactGain).connect(audioContext.destination);impact.start(now+1.48);impact.stop(now+2.06);
    [880,1320,1760].forEach((frequency,index)=>{const chime=audioContext.createOscillator(),gain=audioContext.createGain();chime.type='sine';chime.frequency.value=frequency;gain.gain.setValueAtTime(.0001,now);gain.gain.setValueAtTime(.07/(index+1),now+1.5+index*.04);gain.gain.exponentialRampToValueAtTime(.0001,now+2.08);chime.connect(gain).connect(audioContext.destination);chime.start(now+1.5+index*.04);chime.stop(now+2.1)});
  }catch{}
}
function addAura(amount) { const cap=auraCapacity();if(state.aura<cap)state.aura=Math.min(cap,state.aura+amount); }
function playTone() {
  if(state.muted) return;
  try { audioContext ||= new (window.AudioContext||window.webkitAudioContext)(); const o=audioContext.createOscillator(),g=audioContext.createGain();o.frequency.value=520;g.gain.setValueAtTime(.035,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.35);o.connect(g).connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+.35); } catch {}
}
function updateBgmVolume() {
  ['#titleBgm','#mainBgm','#battleBgm','#tribulationSuccessBgm','#tribulationFailureBgm'].forEach(id=>{const track=$(id);track.muted=state.muted;track.volume=id==='#battleBgm'?.48:id.startsWith('#tribulation')?.55:.42});
}
function startBgm(theme) {
  const tracks={title:$('#titleBgm'),main:$('#mainBgm'),battle:$('#battleBgm'),tribulationSuccess:$('#tribulationSuccessBgm'),tribulationFailure:$('#tribulationFailureBgm')}, next=tracks[theme];
  Object.entries(tracks).forEach(([name,track])=>{if(name!==theme){track.pause();track.currentTime=0}});
  bgmTheme=theme; updateBgmVolume();
  next.play().catch(()=>{});
}
function stopAllBgm() {
  ['#titleBgm','#mainBgm','#battleBgm','#tribulationSuccessBgm','#tribulationFailureBgm'].forEach(id=>{const track=$(id);track.pause();track.currentTime=0});
  bgmTheme=null;
}
function render() {
  const spiritMax=state.spiritLevel>=maxSpiritLevel,swordMax=(state.swordLevel||0)>=maxSwordLevel,swordBlocked=!swordMax&&swordPathBlocked(),spiritCost=spiritMax?Infinity:req(state.spiritLevel),swordCost=swordMax?Infinity:swordReq(state.swordLevel||0),free=Math.floor(state.free);
  $('#playerName').textContent=state.name; $('#totalQi').textContent=formatLargeNumber(free);
  $('#spiritStoneAmount').textContent=formatLargeNumber(state.spiritStone);
  $('#spiritJadeAmount').textContent=formatLargeNumber(state.spiritJade);
  $('#reputationAmount').textContent=formatLargeNumber(state.prestige);
  if($('#marketSpiritStone'))$('#marketSpiritStone').textContent=formatLargeNumber(state.spiritStone);
  if($('#marketSpiritJade'))$('#marketSpiritJade').textContent=formatLargeNumber(state.spiritJade);
  if($('#marketReputation'))$('#marketReputation').textContent=formatLargeNumber(state.prestige);
  $('#headerSpiritRealm').textContent=state.cultivationAwakened?realmName(state.spiritLevel,spiritRealms):'尚未入門';
  $('#headerSect').textContent=state.sect||'無門無派';
  $('#yearsElapsed').textContent=`${experiencedYears().toLocaleString()} 年`;
  $('#headerCombatPower').textContent=formatCombatPower(combatPower());
  $('#rateText').textContent=formatLargeNumber(rate())+' / 5秒';
  $('#spiritRealm').textContent=realmName(state.spiritLevel,spiritRealms);
  $('#bodyRealm').textContent=realmName(state.bodyLevel,bodyRealms);
  $('#swordRealm').textContent=realmName(state.swordLevel||0,swordRealms);
  $('#spiritCost').textContent=spiritMax?'已達最高境界':`提升需 ${formatLargeNumber(spiritCost)}`;
  const temperNeed=bodyTemperNeed();
  $('#bodyCost').textContent=`淬鍊 ${formatLargeNumber(state.bodyTemper)} / ${formatLargeNumber(temperNeed)}`;
  const nextSword=(state.swordLevel||0)+1,swordTrialRequired=nextSword%10===0&&(state.swordTrialWins||0)<nextSword;
  $('#swordCost').textContent=swordMax?'已達最高境界':swordBlocked?'需提升練氣境界':swordTrialRequired?`需通過試劍境第 ${nextSword} 關`:`提升需 ${formatLargeNumber(swordCost)}`;
  $('#spiritUp').classList.toggle('ready',!spiritMax&&free>=spiritCost);
  $('#bodyUp').classList.remove('ready');
  $('#swordUp').classList.toggle('ready',!swordMax&&!swordBlocked&&!swordTrialRequired&&free>=swordCost);
  $('#heroCharacterHotspot').disabled=!hasMindEmbodiment();
  $('#muteBtn').textContent=state.muted?'♫ 開啟音效':'♪ 靜音';
  renderMailButton();
  renderNoviceCultivation();
}
function upgrade(type) {
  const spirit=type==='spirit',sword=type==='sword',cost=spirit?req(state.spiritLevel):sword?swordReq(state.swordLevel||0):bodyReq(state.bodyLevel);
  if((spirit&&state.spiritLevel>=maxSpiritLevel)||(sword&&(state.swordLevel||0)>=maxSwordLevel)||(!spirit&&!sword&&state.bodyLevel>=maxBodyLevel))return toast('已達此道最高境界');
  if(sword&&swordPathBlocked())return toast(`淬劍境界不得超過練氣・${spiritRealms[swordRealmLimit()]}`);
  if(sword&&((state.swordLevel||0)+1)%10===0&&(state.swordTrialWins||0)<(state.swordLevel||0)+1){openExperienceView('trial');return toast(`突破前需通過試劍境第 ${(state.swordLevel||0)+1} 關`)}
  if(!spirit&&!sword&&bodyPathBlocked())return toast(`目前練氣境界僅能支撐${bodyRealms[bodyRealmLimit()]}境肉身`);
  if(!spirit&&!sword&&state.bodyTemper<bodyTemperNeed())return toast(`肉身淬鍊度不足，尚缺 ${formatLargeNumber(bodyTemperNeed()-state.bodyTemper)}`);
  if(!spirit&&!sword&&(state.bodyLevel+1)%10===0){openExperienceView('bodyTrial');return toast('大境界需通過歷練中的肉身試煉')}
  if(state.free<cost) return toast(`尚缺 ${formatLargeNumber(cost-state.free)} 修為`);
  if(spirit && state.spiritLevel+1>10) return openTrib();
  if(sword&&((state.swordLevel||0)+1)%10===0)return startSwordBreakthrough(cost);
  state.free-=cost;
  if(spirit) { const gain=spiritAttributeGain(state.spiritLevel+1);state.spiritLevel++;applyAttributeGain(gain);toast(`已提升至${realmName(state.spiritLevel,spiritRealms)}`); }
  else if(sword){const gain=swordAttributeGain((state.swordLevel||0)+1);state.swordLevel=(state.swordLevel||0)+1;applyAttributeGain(gain);toast(`已提升至${realmName(state.swordLevel,swordRealms)}`)}
  else {
    const need=bodyTemperNeed(),gain=bodyAttributeGain(state.bodyLevel+1);state.bodyTemper=Math.max(0,state.bodyTemper-need);state.bodyLevel++;applyAttributeGain(gain);
    toast(`已提升至${realmName(state.bodyLevel,bodyRealms)}`);
  }
  render(); save();
}
function openTrib() {
  const nextLevel=state.spiritLevel+1;
  $('#tribTitle').textContent=realmName(nextLevel,spiritRealms)+'雷劫';
  tribulationPillUseCount=0;updateTribulationPanel();$('#tribulationModal').classList.remove('hidden');
}
function currentTribulationPill(){const realmIndex=Math.floor((state.spiritLevel+1)/10),key=`tribPill${realmIndex}`;return {realmIndex,key,item:itemCatalog[key],count:state[key]||0}}
function tribulationBaseChance(realmIndex){
  if(realmIndex<=6)return 50;
  if(realmIndex<=12)return 40;
  if(realmIndex<=17)return 30;
  return 20;
}
function updateTribulationPanel(){
  const {realmIndex,item,count}=currentTribulationPill(),base=tribulationBaseChance(realmIndex),maxPills=Math.ceil((100-base)/5),used=Math.min(tribulationPillUseCount,count,maxPills);
  tribulationPillUseCount=used;$('#tribChance').textContent=`${base+used*5}%`;$('#tribPillImage').src=item.image;$('#tribPillImage').alt=item.name;$('#tribPillName').textContent=item.name;$('#pillCount').textContent=`持有 ${formatLargeNumber(count)} 顆`;$('#tribPillUseCount').textContent=used;$('#tribPillMinus').disabled=used<=0;$('#tribPillPlus').disabled=used>=Math.min(count,maxPills);$('#tribPillMax').disabled=used>=Math.min(count,maxPills);
}
function adjustTribulationPills(delta){tribulationPillUseCount=Math.max(0,tribulationPillUseCount+delta);updateTribulationPanel()}
function maximizeTribulationPills(){
  const {realmIndex,count}=currentTribulationPill(),base=tribulationBaseChance(realmIndex);
  tribulationPillUseCount=Math.min(count,Math.ceil((100-base)/5));updateTribulationPanel();
}
function scheduleTribulation(callback,delay){const timer=setTimeout(callback,delay);tribulationTimers.push(timer);return timer}
function cleanupTribulationScene(){
  tribulationTimers.forEach(clearTimeout);tribulationTimers=[];
  const scene=$('#tribulationScene');scene.className='tribulation-scene';scene.setAttribute('aria-hidden','true');
  setTribulationLock(false);
}
function exitTribulationResult(){
  if(!$('#tribulationScene').classList.contains('show-result'))return;
  cleanupTribulationScene();startBgm('main');
}
function tribulate() {
  if(tribulationLocked)return;
  const {realmIndex,key,count}=currentTribulationPill(),base=tribulationBaseChance(realmIndex),maxPills=Math.ceil((100-base)/5),used=Math.min(tribulationPillUseCount,count,maxPills),chance=Math.min(100,base+used*5);
  state[key]=count-used;tribulationPillUseCount=0;$('#tribulationModal').classList.add('hidden');
  const cost=req(state.spiritLevel),success=Math.random()*100<chance,scene=$('#tribulationScene'),nextRealm=realmName(state.spiritLevel+1,spiritRealms);
  setTribulationLock(true);scene.className='tribulation-scene active gathering';scene.setAttribute('aria-hidden','false');$('#tribulationCharacter').src=characterAsset();$('#tribulationCharacter').alt='渡劫中的修士';$('#tribulationSceneRealm').textContent=`${nextRealm}・天劫`;$('#tribulationSceneText').textContent='黑雲壓境・雷霆正在雲層間尋找氣機';startBgm(success?'tribulationSuccess':'tribulationFailure');
  scheduleTribulation(()=>{scene.classList.add('strike-one');$('#tribulationSceneText').textContent='主雷落地・護住道心'},1100);
  scheduleTribulation(()=>{scene.classList.add('strike-two');$('#tribulationSceneText').textContent='雷罔擴張・經脈承受天威'},2400);
  scheduleTribulation(()=>{scene.classList.add('final-strike');$('#tribulationSceneText').textContent='九霄紫電貫穿雲幕・最後一擊'},3750);
  scheduleTribulation(()=>{
    if(!sessionOnline){cleanupTribulationScene();return}
    scene.classList.add('show-result',success?'result-success':'result-failure');
    if(success) {
      const gain=spiritAttributeGain(state.spiritLevel+1);state.free-=cost;state.spiritLevel++;applyAttributeGain(gain);
      $('#tribulationResultSeal').textContent='成';$('#tribulationResultTitle').textContent='渡劫成功';$('#tribulationResultText').textContent=`境界提升至 ${realmName(state.spiritLevel,spiritRealms)}${state.spiritLevel===40?'・習得意念入體':''}`;
    } else {
      state.free=Math.max(0,state.free-Math.ceil(cost*.5));
      $('#tribulationResultSeal').textContent='敗';$('#tribulationResultTitle').textContent='渡劫失敗';$('#tribulationResultText').textContent='雷劫傷及道基，本次修為折損一半';
    }
    render();save();
  },5150);
}
function startSwordBreakthrough(cost=swordReq(state.swordLevel||0)){
  if(tribulationLocked)return;const next=(state.swordLevel||0)+1;if(next%10!==0||(state.swordTrialWins||0)<next)return toast(`需先通過試劍境第 ${next} 關`);if(state.free<cost)return toast(`尚缺 ${formatLargeNumber(cost-state.free)} 修為`);
  const scene=$('#tribulationScene'),nextRealm=realmName(next,swordRealms);setTribulationLock(true);stopAllBgm();scene.className='tribulation-scene active sword-breakthrough sword-still';scene.setAttribute('aria-hidden','false');$('#tribulationCharacter').src=characterAsset();$('#tribulationCharacter').alt='淬劍中的修士';$('#tribulationSceneRealm').textContent=`${nextRealm}・淬劍破境`;$('#tribulationSceneText').textContent='萬籟俱寂・劍候主人一念';$('#swordRealmMarkText').textContent=nextRealm;
  scheduleTribulation(()=>{scene.classList.remove('sword-still');scene.classList.add('sword-orbit');$('#tribulationSceneText').textContent='劍行周天・一明一滅繞主而行'},1100);
  scheduleTribulation(()=>{scene.classList.remove('sword-orbit');scene.classList.add('sword-temper');$('#tribulationSceneText').textContent='戰鬥感悟匯入劍脊・舊境雜質寸寸剝落'},3800);
  scheduleTribulation(()=>{scene.classList.remove('sword-temper');scene.classList.add('sword-resonance');$('#tribulationSceneText').textContent='人劍共鳴・一聲劍鳴分開山霧'},6100);
  scheduleTribulation(()=>{scene.classList.remove('sword-resonance');scene.classList.add('sword-settle');$('#tribulationSceneText').textContent='鋒芒漸斂・本命劍歸於主人身側'},7900);
  scheduleTribulation(()=>{scene.classList.remove('sword-settle');scene.classList.add('sword-inscription');$('#tribulationSceneText').textContent='劍域收束・新境烙入本命'},9600);
  scheduleTribulation(()=>{scene.classList.remove('sword-inscription');scene.classList.add('sword-aftermath');$('#tribulationSceneText').textContent='劍歸其位・心中自有一劍長鳴'},11200);
  scheduleTribulation(()=>{
    if(!sessionOnline){cleanupTribulationScene();return}state.free-=cost;state.swordLevel=next;applyAttributeGain(swordAttributeGain(next));scene.classList.add('show-result','result-success');$('#tribulationResultSeal').textContent='鋒';$('#tribulationResultTitle').textContent='淬劍破境';$('#tribulationResultText').textContent=`本命劍「${state.swordName||'無名靈劍'}」完成蛻變，淬劍提升至 ${realmName(state.swordLevel,swordRealms)}`;render();save();
  },12600);
}

function openHeroCharacterAttributes(){
  if(!isPureCultivationView()||!hasMindEmbodiment())return;
  const bagButton=$('.feature-tab[data-page="bag"]');
  currentFeature='bag';
  $$('.feature-tab').forEach(button=>button.classList.toggle('active',button===bagButton));
  $('#featurePanel').classList.remove('feature-locked','hidden');
  $('#gameScreen').classList.add('feature-open');
  renderBagPanel('character');
  showCharacterAttributes();
}
function rewardSnapshot(){return {free:state.free,aura:state.aura,spiritStone:state.spiritStone,food:state.food,wood:state.wood,meteorIron:state.meteorIron,swordIntent:state.swordIntent,bodyTemper:state.bodyTemper,sectContribution:state.sectContribution,prestige:state.prestige}}
function showOfflineRewards(before,seconds){
  const labels={free:'修為',aura:'靈氣',spiritStone:'靈石',food:'食物',wood:'木材',meteorIron:'隕鐵',swordIntent:'劍意',bodyTemper:'淬鍊度',sectContribution:'門派貢獻',prestige:'聲望'},after=rewardSnapshot(),rows=Object.entries(labels).map(([key,label])=>[label,Math.max(0,Math.floor(after[key]-before[key]))]).filter(([,amount])=>amount>0);
  const hours=Math.floor(seconds/3600),minutes=Math.floor(seconds%3600/60),secs=seconds%60;$('#offlineDuration').textContent=`離線時間 ${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  $('#offlineRewardList').innerHTML=rows.length?rows.map(([label,amount])=>`<div><span>${label}</span><b>+${formatLargeNumber(amount)}</b></div>`).join(''):'<p>本次離線時間不足，尚未產生收益。</p>';$('#offlineModal').classList.remove('hidden');
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
  applyCharacterVisual();
  const away=clockOkay&&!clockRollback?Math.max(0,Math.floor((now-savedLast)/5000)):0;
  if(away>0&&state.cultivationAwakened) { const gain=offlineCultivationGain(savedLast,now);addAura(away*auraRate());runSettlementTick(away);addCultivation(gain,true);setTimeout(()=>{if(sessionOnline)showOfflineRewards(offlineBefore,away*5)},180); }
  else if(clockRollback)setTimeout(()=>toast('偵測到時間異常，本次不結算離線收益'),250);
  else if(!clockOkay&&location.protocol!=='file:')setTimeout(()=>toast('無法取得可信時間，已暫停離線與每日結算'),250);
  tickStart=gameNow();render();save();
}
function updateCreator() {
  const g=createGender==='男'?'male':'female';
  $('#createCharacter').src=appearanceAsset(createGender,createAppearance,createOutfit);
  $$('.appearance-choice').forEach((b,i)=>b.querySelector('img').src=appearanceAsset(createGender,i+1,createOutfit));
  $$('.outfit-choice').forEach((b,i)=>b.querySelector('img').src=appearanceAsset(createGender,createAppearance,i+1));
  const appearances=createGender==='男'?['清衡','鶴髮','幽煞']:['清婉','霜華','幽姬'];
  $$('.appearance-choice').forEach((b,i)=>b.querySelector('small').textContent=appearances[i]);
  const names=createGender==='男'?['青雲袍','玄劍袍','山嶽袍']:['雲水袍','月華袍','丹霞袍'];
  $$('.outfit-choice').forEach((b,i)=>b.querySelector('small').textContent=names[i]);
}

function swordNurtureCost(){const level=Math.max(0,state.swordNurtureLevel||0);return {iron:Math.ceil(8*Math.pow(level+1,1.35)),stone:Math.ceil(150*Math.pow(level+1,1.42)),insight:2+Math.floor(level/5)}}
function swordNurtureMax(){return swordRealms.length}
function swordNurtureLimit(){return Math.min(swordNurtureMax(),1+Math.floor((state.swordTrialWins||0)/10))}
function swordTrialPower(stage){const progress=Math.max(0,Math.min(maxSwordLevel,stage-1))/maxSwordLevel;return Math.ceil((2500*Math.pow(40000,progress))/5)*5}
function swordTrialIntentReward(stage){return stage%10===0?3:0}
function swordTechniqueUnlockStage(id){return id==='mountain'?10:id==='echo'?20:0}
function swordTechniqueUnlocked(id){return (state.swordTrialWins||0)>=swordTechniqueUnlockStage(id)}
function equippedSwordTechniques(){return (state.swordMoves||[]).map(id=>swordTechniqueCatalog.find(move=>move.id===id)).filter(Boolean).slice(0,2)}
async function chooseSwordEmbryo(id){
  const embryo=swordEmbryos[id];if(!embryo||state.swordEmbryo||!swordPathUnlocked())return;
  if(!await gameConfirm(`凝成${embryo.name}後便會與性命相連，第一版本暫時無法更換劍胚。\n\n${embryo.description}`,{title:'凝聚本命劍',confirmText:'確認凝劍'}))return;
  state.swordEmbryo=id;state.swordName=`${state.name||''}之劍`.slice(0,12)||'無名靈劍';normalizeSwordPath();toast(`已凝聚${embryo.name}`);renderExperiencePanel('sword');render();save();
}
function renameSword(){const input=$('#swordNameInput');if(!input||!state.swordEmbryo)return;const name=input.value.trim().slice(0,12);if(!name)return toast('請輸入劍名');state.swordName=name;toast(`本命劍定名為「${name}」`);renderExperiencePanel('sword');save()}
function nurtureSword(){
  if(!state.swordEmbryo)return toast('尚未凝聚本命劍');if(state.swordNurtureLevel>=swordNurtureMax())return toast('本命劍已養成圓滿');if(state.swordNurtureLevel>=swordNurtureLimit())return toast(`通過試劍境第 ${state.swordNurtureLevel*10} 關後開放下一階養劍`);const cost=swordNurtureCost();if(state.meteorIron<cost.iron||state.spiritStone<cost.stone||state.swordInsight<cost.insight)return toast('養劍所需的戰鬥感悟、隕鐵或靈石不足');
  state.meteorIron-=cost.iron;state.spiritStone-=cost.stone;state.swordInsight-=cost.insight;state.swordNurtureLevel++;toast(`養劍完成・本命劍提升至${state.swordNurtureLevel}階`);renderExperiencePanel('sword');render();save();
}
async function chooseSwordIntent(id){
  const intent=swordIntents[id];if(!intent||state.swordIntentType||!swordIntentUnlocked())return;if(state.swordIntent<10)return toast('領悟劍意需要10點劍意');
  if(!await gameConfirm(`${intent.description}\n\n領悟後第一版本暫時無法更換。`,{title:'領悟劍意',confirmText:'領悟'}))return;state.swordIntent-=10;state.swordIntentType=id;toast(`已領悟${intent.name}`);renderExperiencePanel('sword');render();save();
}
function setSwordMove(id,slot){
  if(!swordTechniqueCatalog.some(move=>move.id===id)||slot<0||slot>1)return;if(!swordTechniqueUnlocked(id))return toast(`通過試劍境第${swordTechniqueUnlockStage(id)}關後解鎖`);state.swordMoves=[...(state.swordMoves||['origin','flow'])];const other=slot===0?1:0;if(state.swordMoves[other]===id)return toast('同一劍招不能重複裝配');state.swordMoves[slot]=id;toast(`${swordTechniqueCatalog.find(move=>move.id===id).name}已設為第${slot+1}式`);renderArtsPanel('moves');save();
}
function openExperienceView(view='sword'){
  const button=$('.feature-tab[data-page="experience"]');currentFeature='experience';$$('.feature-tab').forEach(item=>item.classList.toggle('active',item===button));$('#featurePanel').classList.remove('hidden','feature-locked');$('#gameScreen').classList.add('feature-open');renderExperiencePanel(view);
}
function renderBodyExperienceView(view,inner){
  refreshBodyState();const need=bodyTemperNeed(),injuryId=activeBodyInjury(),injury=bodyInjuries[injuryId],nextIsRealm=(state.bodyLevel+1)%10===0,cost=bodyReq(state.bodyLevel);
  if(view==='body'){
    const heal=bodyHealCost(injuryId);inner.innerHTML=`<section class="body-dashboard"><div class="body-seal">體</div><div><small>當前肉身</small><h2>${realmName(state.bodyLevel,bodyRealms)}</h2><p>先以鍛體累積淬鍊度；小層可直接突破，大境界必須撐過肉身試煉。</p></div><div class="body-meter"><span>體力 <b>${Math.floor(state.bodyStamina)} / 100</b></span><i><em style="width:${Math.min(100,state.bodyStamina)}%"></em></i><small>每3分鐘恢復1點・靈藥可使體力溢出</small></div><div class="body-meter temper"><span>淬鍊度 <b>${formatLargeNumber(state.bodyTemper)} / ${formatLargeNumber(need)}</b></span><i><em style="width:${Math.min(100,state.bodyTemper/need*100)}%"></em></i></div><div class="body-condition ${injury?'injured':''}"><b>${injury?injury.name:'肉身無傷'}</b><small>${injury?`${injury.description}・剩餘 ${formatDuration(state.bodyInjuryUntil-gameNow())}`:'目前可進行所有鍛體方式。'}</small>${injury?`<button id="healBodyBtn">療傷・食物 ${formatLargeNumber(heal.food)}／木材 ${formatLargeNumber(heal.wood)}／靈石 ${formatLargeNumber(heal.stone)}</button>`:''}</div><button id="goBodyAction" class="jade-button">${state.bodyTemper<need?'前往鍛體':nextIsRealm?'前往肉身試煉':`突破至${realmName(state.bodyLevel+1,bodyRealms)}・修為 ${formatLargeNumber(cost)}`}</button></section>`;if(injury)$('#healBodyBtn').onclick=healBodyInjury;$('#goBodyAction').onclick=()=>state.bodyTemper<need?renderExperiencePanel('training'):nextIsRealm?renderExperiencePanel('bodyTrial'):upgrade('body');return;
  }
  if(view==='training'){
    const options=bodyTrainingOptions();inner.innerHTML=`<section class="body-training-head"><h2>鍛體場</h2><p>體力不足時可等待自然恢復或使用靈藥；靈藥恢復的體力可溢出保留。受傷會暫時削弱鍛體或戰鬥能力。</p><div class="body-training-resources" aria-label="鍛體狀態與材料庫存"><span class="stamina-resource"><i class="body-resource-seal">體</i><small>體力</small><b>${Math.floor(state.bodyStamina)} / 100</b><em>每3分鐘恢復1點・靈藥可溢出</em></span><span><i class="body-resource-seal temper">煉</i><small>淬鍊度</small><b>${formatLargeNumber(state.bodyTemper)} / ${formatLargeNumber(need)}</b></span><span><img src="assets/qstyle-v2/food-cutout.png" alt=""><small>食物</small><b>${formatLargeNumber(state.food)}</b></span><span><img src="assets/qstyle-v2/wood-cutout.png" alt=""><small>木材</small><b>${formatLargeNumber(state.wood)}</b></span><span><img src="assets/qstyle-v2/spirit-stone.png" alt=""><small>靈石</small><b>${formatLargeNumber(state.spiritStone)}</b></span></div></section><div class="body-training-grid">${Object.entries(options).map(([id,item])=>`<article><h3>${item.name}</h3><p>${item.description}</p><small>消耗：體力 ${item.stamina}・食物 ${formatLargeNumber(item.food)}${item.wood?`・木材 ${formatLargeNumber(item.wood)}`:''}${item.stone?`・靈石 ${formatLargeNumber(item.stone)}`:''}</small><b>淬鍊度 +${formatLargeNumber(item.gain)}${item.risk?`・受傷率 ${item.risk}%`:''}</b><button data-body-training="${id}" ${state.bodyStamina<item.stamina||state.food<item.food||state.wood<item.wood||state.spiritStone<item.stone||id==='extreme'&&injuryId==='tendon'?'disabled':''}>開始鍛體</button></article>`).join('')}</div>`;$$('[data-body-training]').forEach(button=>button.onclick=()=>trainBody(button.dataset.bodyTraining));return;
  }
  const target=5+Math.floor((state.bodyLevel+1)/20),blocked=bodyPathBlocked();inner.innerHTML=`<section class="body-trial-card"><div class="trial-orb body-orb">守</div><h2>${nextIsRealm?`${realmName(state.bodyLevel+1,bodyRealms)}・肉身試煉`:'尚未抵達大境界關口'}</h2><p>${nextIsRealm?`不求擊倒試煉化身，只需在猛烈攻勢下撐過 ${target} 回合。失敗將留下傷勢，但可再次挑戰。`:'此處僅用於每十層的大境界突破；小層請在肉身頁直接突破。'}</p><strong>${blocked?'練氣境界不足':state.bodyTemper<need?`淬鍊度尚缺 ${formatLargeNumber(need-state.bodyTemper)}`:state.free<cost?`修為尚缺 ${formatLargeNumber(cost-state.free)}`:`已具備試煉資格・需修為 ${formatLargeNumber(cost)}`}</strong><button id="startBodyTrial" class="jade-button" ${!nextIsRealm||blocked||state.bodyTemper<need||state.free<cost?'disabled':''}>承受試煉</button></section>`;$('#startBodyTrial').onclick=startBodyTrial;
}
function renderExperiencePanel(view='sword'){
  currentExperienceView=view;const bodyMode=['body','training','bodyTrial'].includes(view),tabs=bodyMode?[['body','肉身'],['training','鍛體'],['bodyTrial','試煉']]:[['sword','本命劍'],['trial','試劍境']];$('#featureDescription').innerHTML=`<div class="experience-road-tabs"><button data-road="sword" class="${bodyMode?'':'active'}">淬劍之路</button><button data-road="body" class="${bodyMode?'active':''}">煉體之路</button></div><div class="experience-tabs ${bodyMode?'':'two-tabs'}">${tabs.map(([id,label])=>`<button data-experience-view="${id}" class="${id===view?'active':''}">${label}</button>`).join('')}</div><div id="experienceInner"></div>`;$$('[data-road]').forEach(button=>button.onclick=()=>renderExperiencePanel(button.dataset.road));$$('[data-experience-view]').forEach(button=>button.onclick=()=>renderExperiencePanel(button.dataset.experienceView));const inner=$('#experienceInner');if(bodyMode){renderBodyExperienceView(view,inner);return}
  if(!swordPathUnlocked()){inner.innerHTML=`<div class="realm-lock"><b>凝曜境開啟本命劍</b><small>當前境界：${realmName(state.spiritLevel,spiritRealms)}</small></div>`;return}
  if(view==='sword'){
    if(!state.swordEmbryo){inner.innerHTML=`<section class="sword-intro"><h2>凝聚本命劍</h2><p>選擇一枚劍胚，讓它隨你一同養成。第一版本選定後無法更換。</p><div class="sword-choice-grid">${Object.entries(swordEmbryos).map(([id,item])=>`<button data-sword-embryo="${id}"><b>${item.name}</b><span>${item.description}</span></button>`).join('')}</div></section>`;$$('[data-sword-embryo]').forEach(button=>button.onclick=()=>chooseSwordEmbryo(button.dataset.swordEmbryo));return}
    const embryo=swordEmbryos[state.swordEmbryo],cost=swordNurtureCost(),intent=swordIntents[state.swordIntentType],nurtureMax=swordNurtureMax(),nurtureLimit=swordNurtureLimit(),nurtureMilestone=state.swordNurtureLevel*10;inner.innerHTML=`<section class="sword-dashboard"><div class="sword-seal">劍</div><div class="sword-heading"><small>${embryo.name}・養劍 ${state.swordNurtureLevel} / ${nurtureMax} 階</small><h2>${state.swordName}</h2><p>${embryo.description}</p></div><div class="sword-resources"><span>劍意 <b>${formatLargeNumber(state.swordIntent)}</b></span><span>戰鬥感悟 <b>${formatLargeNumber(state.swordInsight)}</b></span><span>試劍進度 <b>${state.swordTrialWins} / ${maxSwordLevel+1}</b></span></div><div class="sword-rename"><input id="swordNameInput" maxlength="12" value="${state.swordName.replace(/"/g,'&quot;')}" aria-label="本命劍名稱"><button id="renameSwordBtn">定名</button></div><button id="nurtureSwordBtn" class="jade-button" ${state.swordNurtureLevel>=nurtureLimit||state.meteorIron<cost.iron||state.spiritStone<cost.stone||state.swordInsight<cost.insight?'disabled':''}>${state.swordNurtureLevel>=nurtureMax?'本命劍養成圓滿':state.swordNurtureLevel>=nurtureLimit?`通過試劍境第 ${nurtureMilestone} 關開放下一階`:`養劍・感悟 ${formatLargeNumber(cost.insight)}／隕鐵 ${formatLargeNumber(cost.iron)}／靈石 ${formatLargeNumber(cost.stone)}`}</button></section><section class="intent-section"><h3>${intent?`已悟・${intent.name}`:'第一劍意'}</h3>${intent?`<p>${intent.description}</p>`:!swordIntentUnlocked()?`<p>需練氣達化念、淬劍達凝魄，並通過試劍境第40關。目前劍意 ${formatLargeNumber(state.swordIntent)} / 10。</p>`:`<div class="intent-grid">${Object.entries(swordIntents).map(([id,item])=>`<button data-sword-intent="${id}" ${state.swordIntent<10?'disabled':''}><b>${item.name}</b><small>${item.description}</small></button>`).join('')}</div>`}</section>`;$('#renameSwordBtn').onclick=renameSword;$('#nurtureSwordBtn').onclick=nurtureSword;$$('[data-sword-intent]').forEach(button=>button.onclick=()=>chooseSwordIntent(button.dataset.swordIntent));return
  }
  if(!state.swordEmbryo){inner.innerHTML='<div class="realm-lock"><b>尚未凝聚本命劍</b><small>凝聚劍胚後方可進入試劍境。</small></div>';return}const stage=state.swordTrialWins+1,power=swordTrialPower(stage),intentReward=swordTrialIntentReward(stage),available=stage<=Math.min(maxSwordLevel+1,(state.swordLevel||0)+1);inner.innerHTML=`<section class="sword-trial-card"><div class="trial-orb">幻</div><h2>劍道幻影・第 ${stage} 關</h2><p>本關為固定戰力，不會隨人物變強。淬劍每提升一層即可開放下一關，每逢十層突破前必須先通關。</p><div class="trial-power">關卡戰力・<b>${formatCombatPower(power)}</b></div><strong>首勝獎勵・戰鬥感悟 1${intentReward?`・劍意 ${intentReward}`:''}</strong><button id="startSwordTrial" class="jade-button" ${available?'':'disabled'}>${available?'進入試劍境':`需先將淬劍提升至 ${stage-1} 層`}</button></section>`;$('#startSwordTrial').onclick=startSwordTrial;
}

function clearSwordTrialAdvance(){clearTimeout(swordTrialAdvanceTimer);clearInterval(swordTrialCountdownTimer);swordTrialAdvanceTimer=null;swordTrialCountdownTimer=null}
function canAdvanceSwordTrial(){const next=(state.swordTrialWins||0)+1;return !!state.swordEmbryo&&next<=maxSwordLevel+1&&next<=(state.swordLevel||0)+1}
function advanceSwordTrial(){if(!battle||battle.mode!=='swordTrial'||!battle.resolved||!battle.won||!canAdvanceSwordTrial())return;clearSwordTrialAdvance();startSwordTrial()}
function scheduleSwordTrialAdvance(){
  clearSwordTrialAdvance();const button=$('#battleResultNext');let remaining=3;button.textContent=`下一關・${remaining}秒`;
  swordTrialCountdownTimer=setInterval(()=>{remaining--;if(remaining>0)button.textContent=`下一關・${remaining}秒`},1000);
  swordTrialAdvanceTimer=setTimeout(advanceSwordTrial,3000);
}
function startSwordTrial(){
  clearSwordTrialAdvance();
  const stage=(state.swordTrialWins||0)+1;if(!state.swordEmbryo||stage>maxSwordLevel+1||stage>(state.swordLevel||0)+1)return toast('目前淬劍層數尚未開放此關');clearTimeout(battleTimer);startBgm('battle');const player=battlePlayerStats(),generated=npcCoreFromPower(swordTrialPower(stage),{id:900000+stage,seedScope:'sword-trial'}),core=generated.core,enemy={combatPower:generated.combatPower,core,maxHp:combatHealth(core.rootBone),attack:Math.max(12,core.trueQi*5),defense:Math.max(0,core.physique*20),evasion:combatEvasion(core.agility),accuracy:combatAccuracy(core.spiritualPower),crit:combatCritical(core.spiritualPower)};
  battle={active:true,resolved:false,mode:'swordTrial',round:1,completedRounds:0,playerMoveIndex:0,player:{...player,hp:player.maxHp},enemy:{...enemy,hp:enemy.maxHp,name:'劍道幻影',npc:{id:`sword-trial-${state.swordTrialWins}`},race:'human'},logs:[]};$('#battleModal').classList.remove('hidden');$('#battleStage').classList.remove('hidden');$('#battleResult').classList.add('hidden');$('#playerSilhouette').className=`battle-silhouette ${state.gender==='女'?'silhouette-player-female':'silhouette-player-male'}`;$('#enemySilhouette').className='battle-silhouette silhouette-human';$('#battlePlayerName').textContent=state.name;$('#battleEnemyName').textContent='劍道幻影';$('#battleLog').innerHTML=`<p><b>${state.name}</b>執起本命劍「${state.swordName}」，劍道幻影應念而生。</p>`;updateBattleUi();battleTimer=setTimeout(playerBattleTurn,700);
}
function startBodyTrial(){
  refreshBodyState();const need=bodyTemperNeed(),cost=bodyReq(state.bodyLevel),nextIsRealm=(state.bodyLevel+1)%10===0;if(!nextIsRealm||bodyPathBlocked()||state.bodyTemper<need||state.free<cost)return toast('尚未具備肉身試煉資格');clearTimeout(battleTimer);startBgm('battle');const player=battlePlayerStats(),targetRounds=5+Math.floor((state.bodyLevel+1)/20),factor=1.05+(state.bodyLevel+1)/10*.08,generated=npcCoreFromPower(Math.ceil(combatPower()*factor),{id:910000+state.bodyLevel}),core=generated.core,enemy={combatPower:generated.combatPower,core,maxHp:combatHealth(core.rootBone)*8,attack:Math.max(12,core.trueQi*5),defense:Math.max(0,core.physique*20),evasion:combatEvasion(core.agility),accuracy:combatAccuracy(core.spiritualPower),crit:combatCritical(core.spiritualPower)};
  battle={active:true,resolved:false,mode:'bodyTrial',round:1,completedRounds:0,targetRounds,playerMoveIndex:0,player:{...player,hp:player.maxHp},enemy:{...enemy,hp:enemy.maxHp,name:'煉體試煉化身',npc:{id:`body-trial-${state.bodyLevel}`},race:'human'},logs:[]};$('#battleModal').classList.remove('hidden');$('#battleStage').classList.remove('hidden');$('#battleResult').classList.add('hidden');$('#playerSilhouette').className=`battle-silhouette ${state.gender==='女'?'silhouette-player-female':'silhouette-player-male'}`;$('#enemySilhouette').className='battle-silhouette silhouette-human';$('#battlePlayerName').textContent=state.name;$('#battleEnemyName').textContent='煉體試煉化身';$('#battleLog').innerHTML=`<p><b>${state.name}</b>踏入試煉，必須以肉身撐過 ${targetRounds} 回合。</p>`;updateBattleUi();battleTimer=setTimeout(playerBattleTurn,700);
}

function toggleFeature(button) {
  const page=button.dataset.page;
  if(!state.cultivationAwakened&&(page==='root'||page==='sect'))return toast(`${page==='root'?'靈池':'門派'}需踏入聽息・一層後開啟`);
  if(currentFeature===page) {
    currentFeature=null;
    $('#featurePanel').classList.add('hidden');
    $('#gameScreen').classList.remove('feature-open');
    $$('.feature-tab').forEach(x=>x.classList.remove('active'));
    return;
  }
  currentFeature=page;
  $$('.feature-tab').forEach(x=>x.classList.toggle('active',x===button));
  const descriptions={arts:'功法蒐集、參悟與裝配功能將於後續版本開放。'};
  if(page==='root') {
    $('#featurePanel').classList.remove('feature-locked'); renderSpiritRootPanel('root');
  } else if(page==='cave') {
    const unlocked=state.spiritLevel>=10;
    $('#featurePanel').classList.toggle('feature-locked',!unlocked);
    if(unlocked)renderCavePanel('dwelling');else $('#featureDescription').innerHTML=`<div class="realm-lock"><b>引霞境開啟</b><small>當前境界：${realmName(state.spiritLevel,spiritRealms)}</small></div>`;
  } else if(page==='bag') {
    $('#featurePanel').classList.remove('feature-locked'); renderBagPanel('bag');
  } else if(page==='sect') {
    $('#featurePanel').classList.remove('feature-locked'); renderSectPanel('home');
  } else if(page==='arts') {
    $('#featurePanel').classList.remove('feature-locked');renderArtsPanel('sect');
  } else if(page==='experience') {
    $('#featurePanel').classList.remove('feature-locked');renderExperiencePanel('sword');
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
  const suffix={secret:'玄錄',formula:'命篇',sutra:'體典',escape:'行章',ultimate:'悟卷',fragment:'天箋'},clean=sect.replace(/(仙宮|神宗|聖宗|天宗|劍宗|魔宗|宗|派|門|宮|谷|堂|殿|樓|府|院|山|庭|教|寨|幫|觀|閣|都|海)$/,'');
  return picked.map((kind,index)=>{const element=artElements[(seed+index*star+index)%artElements.length][0],name=`${clean}${suffix[kind]}`;return{id:`${sect}-${index}`,sourceSect:sect,name,kind,element,tier:star,level:1,slot:index}})
}
function normalizeLearnedArts(){state.learnedArts=(state.learnedArts||[]).map(art=>{if(!art.sourceSect)return art;const group=sectCatalog.find(entry=>[...entry.good,...entry.evil].includes(art.sourceSect)),expected=group?sectTechniqueSet(art.sourceSect,group.star).find(item=>item.id===art.id):null;return expected?{...expected,level:Math.max(1,Math.min(10,art.level||1))}:art});state.learnedBookIds=Array.from(new Set([...(state.learnedBookIds||[]),...state.learnedArts.filter(art=>art.source==='book').map(art=>art.id)]))}
function sectLearnLimit(){return state.sectRank>=3?3:state.sectRank>=2?2:1}
function artUpgradeCost(art){return Math.round(500*art.tier*art.tier*Math.pow(1.5,art.level-1))}
function artsExpandCost(){return Math.round(1000*Math.pow(1.28,Math.max(0,state.artsCapacity-8)))}
const artElementOrder=Object.fromEntries(artElements.map(([element],index)=>[element,index]));
function sortLearnedArts(arts){return [...arts].sort((a,b)=>(Number(a.tier)||0)-(Number(b.tier)||0)||(artElementOrder[a.element]??99)-(artElementOrder[b.element]??99)||String(a.name||'').localeCompare(String(b.name||''),'zh-Hant'))}
function artCard(art){
  const kind=artKinds[art.kind],element=artElements.find(([key])=>key===art.element),cost=art.level<10?artUpgradeCost(art):0,tier=['一','二','三','四','五','六','七','八','九'][art.tier-1];
  return `<article class="art-card element-${art.element}"><span class="art-element">${element[1]}</span><div><b>${tier}階・${art.name}（${art.level}級）</b><p>${kind.label}+${artBaseEffect(art)}（${element[1]}系靈根效果+${artRootEffect(art)}）</p></div><div class="art-actions"><button data-art-upgrade="${art.id}" data-art-cost="${cost}" ${art.level>=10||state.aura<cost?'disabled':''}>${art.level>=10?'已滿級':`升級<br><small>${formatLargeNumber(cost)} 靈氣</small>`}</button>${art.sourceSect?`<button class="forget-art" data-art-forget="${art.id}">遺忘</button>`:''}</div></article>`
}
function renderSwordMoves(inner){
  if(!state.swordEmbryo){inner.innerHTML='<div class="realm-lock"><b>尚未凝聚本命劍</b><small>先於歷練・淬劍之路凝聚劍胚，即可在此裝配招式。</small></div>';return}
  const equipped=equippedSwordTechniques();inner.innerHTML=`<section class="move-loadout"><h2>兩式劍招</h2><div class="equipped-moves"><span>第一式・<b>${equipped[0]?.name||'未裝配'}</b></span><span>第二式・<b>${equipped[1]?.name||'未裝配'}</b></span></div><p>戰鬥時會依第一式、第二式循環施展；更多招式將隨試劍境進度解鎖。</p></section><div class="sword-move-grid">${swordTechniqueCatalog.map(move=>{const unlock=swordTechniqueUnlockStage(move.id),locked=!swordTechniqueUnlocked(move.id);return `<article class="${locked?'locked':''}"><b>${move.name}</b><p>${move.description}</p><small>${locked?`試劍境第 ${unlock} 關解鎖`:`傷害 ${Math.round(move.min*100)}%～${Math.round(move.max*100)}%`}</small><div><button data-equip-move="${move.id}" data-slot="0" ${locked||state.swordMoves[0]===move.id?'disabled':''}>設為第一式</button><button data-equip-move="${move.id}" data-slot="1" ${locked||state.swordMoves[1]===move.id?'disabled':''}>設為第二式</button></div></article>`}).join('')}</div>`;$$('[data-equip-move]').forEach(button=>button.onclick=()=>setSwordMove(button.dataset.equipMove,+button.dataset.slot));
}
function renderArtsPanel(view='sect'){
  currentArtsView=view;
  const learned=state.learnedArts||[],sectLearned=sortLearnedArts(learned.filter(art=>art.sourceSect)),cap=state.artsCapacity||8,expand=artsExpandCost();
  const wallet=view==='moves'?'':`<div class="arts-wallet"><span id="artsAuraAmount">當前靈氣 ${formatLargeNumber(state.aura)}</span>${view==='sect'?`<span>門派技能 ${sectLearned.length} / ${cap}</span>${cap<40?`<button id="expandArtsBtn" ${state.spiritStone>=expand?'':'disabled'}>擴充一格・${formatLargeNumber(expand)}靈石</button>`:'<b>已達40格上限</b>'}`:''}</div>`;
  $('#featureDescription').innerHTML=`<div class="arts-tabs">${artTabs.map(([key,label])=>`<button data-art-view="${key}" class="${key===view?'active':''}">${label}</button>`).join('')}</div>${wallet}<div id="artsInner"></div>`;
  $$('.arts-tabs button').forEach(button=>button.onclick=()=>renderArtsPanel(button.dataset.artView));if(view==='sect'&&cap<40)$('#expandArtsBtn').onclick=expandArtsCapacity;
  const inner=$('#artsInner');if(view==='moves'){renderSwordMoves(inner);return}const list=view==='sect'?sectLearned:sortLearnedArts(learned.filter(art=>!art.sourceSect&&art.kind===view));inner.innerHTML=list.length?`<div class="art-list">${list.map(artCard).join('')}</div>${view==='sect'?`<div class="arts-total">門派技能總計：${Object.values(artKinds).map(kind=>`${kind.label}+${sectLearned.filter(art=>artKinds[art.kind].attribute===kind.attribute).reduce((sum,art)=>sum+artTotalEffect(art),0).toLocaleString()}`).join('・')}</div>`:''}`:`<div class="arts-empty"><b>${artTabs.find(([key])=>key===view)[1]}尚無功法</b><small>${view==='sect'?'可向目前門派的大長老學習功法。':'可於藏經閣購得相應功法書，並在儲物袋中使用習得。'}</small></div>`;
  $$('[data-art-upgrade]').forEach(button=>button.onclick=()=>upgradeArt(button.dataset.artUpgrade,view));$$('[data-art-forget]').forEach(button=>button.onclick=()=>forgetArt(button.dataset.artForget,view));
}
function upgradeArt(id,view){const art=state.learnedArts.find(item=>item.id===id);if(!art||art.level>=10)return;const cost=artUpgradeCost(art);if(state.aura<cost)return toast('靈氣不足');state.aura-=cost;art.level++;toast(`${art.name}提升至${art.level}級`);renderArtsPanel(view);render();save()}
async function forgetArt(id,view='sect'){const index=state.learnedArts.findIndex(item=>item.id===id);if(index<0)return;const art=state.learnedArts[index],kind=artKinds[art.kind],lost=artTotalEffect(art);if(!await gameConfirm(`確定遺忘「${art.name}」？\n將失去 ${kind.label}+${lost.toLocaleString()}，已投入的靈氣不會返還。`,{title:'遺忘功法',confirmText:'確認遺忘',danger:true}))return;state.learnedArts.splice(index,1);toast(`已遺忘${art.name}・${kind.label}-${lost}`);renderArtsPanel(view);render();save()}
function updateArtsLive(){if(currentFeature!=='arts')return;const amount=$('#artsAuraAmount');if(amount)amount.textContent=`當前靈氣 ${formatLargeNumber(state.aura)}`;$$('[data-art-upgrade]').forEach(button=>{const art=state.learnedArts.find(item=>item.id===button.dataset.artUpgrade);button.disabled=!art||art.level>=10||state.aura<+button.dataset.artCost})}
function expandArtsCapacity(){if(state.artsCapacity>=40)return;const cost=artsExpandCost();if(state.spiritStone<cost)return toast('靈石不足');state.spiritStone-=cost;state.artsCapacity++;toast(`門派技能上限擴充至${state.artsCapacity}格`);renderArtsPanel('sect');render();save()}
function renderSectLearning(){
  if(!state.sect)return toast('目前無門無派');const techniques=sectTechniqueSet(),limit=sectLearnLimit(),learned=state.learnedArts||[],sectLearned=learned.filter(art=>art.sourceSect);
  $('#sectInner').innerHTML=`<section class="sect-learning"><button id="learningBackBtn" class="text-button">返回門人</button><h2>${state.sect}・傳功閣</h2><div class="learning-list">${techniques.map((art,index)=>{const known=learned.some(item=>item.id===art.id),rankReady=index<limit,full=sectLearned.length>=state.artsCapacity,tier=['一','二','三','四','五','六','七','八','九'][art.tier-1];return `<article><b>${tier}階・${art.name}</b><span>${artElements.find(([key])=>key===art.element)[1]}系・${artKinds[art.kind].tab}・${artKinds[art.kind].label}+${artBaseEffect(art)}</span><button data-learn-art="${art.id}" ${known||!rankReady||full?'disabled':''}>${known?'已習得':!rankReady?`需${index===1?'親傳弟子':'供奉'}`:full?'技能欄已滿':'學習'}</button></article>`}).join('')}</div></section>`;
  $('#learningBackBtn').onclick=()=>renderSectPanel('npcs');$$('[data-learn-art]').forEach(button=>button.onclick=()=>learnSectArt(button.dataset.learnArt));
}
function learnSectArt(id){const art=sectTechniqueSet().find(item=>item.id===id);if(!art||state.learnedArts.some(item=>item.id===id))return;if(art.slot>=sectLearnLimit())return toast('目前職位不足');if(state.learnedArts.filter(item=>item.sourceSect).length>=state.artsCapacity)return toast('門派技能欄已滿');state.learnedArts.push(art);toast(`習得${art.name}`);renderSectLearning();render();save()}

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
  const practices=['擅長以劍意磨礪道心','精研丹道與靈藥培育','傳承符籙、陣法與禁制之術','重視肉身與元息並行淬鍊','以觀星推演尋求大道軌跡','修習御風踏雲與行章妙法','守護古老典籍與失傳玄錄','講究在生死歷練中突破桎梏','以五行流轉淬鍊門人根基','世代鎮守一處危險的天地裂隙','崇尚萬法歸一、道心澄明'];
  const path=state.sectFaction==='正'?'門人奉行正道、護持蒼生，行事以仁義為先，以清正自守。':'門人不受正統戒律束縛，被世人視為旁門左道；行事只問本心與實力，恩怨必報。';
  return `${state.sect}立於${places[index%places.length]}，${practices[(index*3+Math.floor(index/places.length))%practices.length]}。${path}`;
}
function allEligibleSects(){return sectCatalog.filter(g=>state.spiritLevel>=g.need).flatMap(g=>[...g.good.map(name=>({name,faction:'正',star:g.star})),...g.evil.map(name=>({name,faction:'邪',star:g.star}))])}
function joinSect(pick){
  if(!pick||state.sect)return false;
  state.sect=pick.name;state.sectFaction=pick.faction;state.sectStar=pick.star;state.sectContribution=0;state.sectRank=0;state.sectTask='';state.sectJoinedAt=gameNow();state.sectYearsProcessed=0;state.actingLeader=false;state.npcAffinity={};state.npcDaily={};state.sectNpcSnapshot=createSectNpcSnapshot();
  toast(`拜入${['一','二','三','四','五','六','七','八','九'][pick.star-1]}星門派・${pick.name}`);render();if(currentFeature==='sect')renderSectPanel('home');save();return true;
}
function joinRandomSect(){
  const pool=allEligibleSects(),pick=pool[Math.floor(Math.random()*pool.length)];if(!pick)return;
  joinSect(pick);
}
async function leaveSect(){
  if(state.prestige<200)return toast('脫離門派需要200聲望');
  if(!await gameConfirm(`確定脫離${state.sect}？\n將扣除200聲望，剩餘 ${Math.floor(state.sectContribution)} 門派貢獻亦會全部清空。`,{title:'脫離門派',confirmText:'確認脫離',danger:true}))return;
  state.prestige-=200;
  state.sect='';state.sectFaction='';state.sectStar=0;state.sectContribution=0;state.sectRank=0;state.sectTask='';state.sectJoinedAt=null;state.sectYearsProcessed=0;state.sectNpcSnapshot=null;state.actingLeader=false;state.npcAffinity={};toast('已脫離門派');render();renderSectPanel('home');save();
}
function npcSeed(){const names=sectCatalog.flatMap(g=>[...g.good,...g.evil]);return Math.max(0,names.indexOf(state.sect))}
function sectNpcs(){
  const surnames=['趙','錢','孫','李','周','吳','鄭','王','馮','陳','褚','衛','蔣','沈','韓','楊','朱','秦','尤','許','何','呂','施','張','孔','曹','嚴','華','金','魏','陶','姜','戚','謝','鄒','喻','柏','水','竇','章','雲','蘇','潘','葛','奚','范','彭','郎','魯','韋','昌','馬','苗','鳳','花','方','俞','任','袁','柳','唐','羅','薛','歐陽','上官','司馬','諸葛','夏侯','東方','皇甫','尉遲','公孫','慕容','長孫','宇文','司徒','南宮','令狐','軒轅'];
  const maleGiven=['玄策','清衡','道一','長淵','若塵','星河','無涯','景行','明淵','懷瑾','扶光','晏清','承淵','照夜','守一','修遠','子墨','凌霄','朔','衡','澈','玄','川','長生遠','觀滄海','問天行','凌九霄','守山河','雲歸處','硯無聲'];
  const femaleGiven=['雲舒','清漪','知微','映雪','秋水','昭寧','疏影','望舒','青梧','霽月','含章','雲岫','驚鴻','凝霜','聽瀾','若水','靈犀','月華','瑤','霜','寧','蘭','月','月如霜','雲知意','柳含煙','星照晚','雪無痕','花解語','夢長安'];
  const seed=npcSeed(),mode=seed%12,roles=['掌門','大長老','供奉','師兄','師弟'];
  return roles.map((role,i)=>{const id=seed*5+i,gender=mode===0?'男':mode===1?'女':textSeed(`${state.sect}・${role}・${i}`)%2===0?'男':'女',given=gender==='男'?maleGiven:femaleGiven,name=surnames[(id*37)%surnames.length]+given[id%given.length],title=i===3?(gender==='男'?'師兄':'師姐'):i===4?(gender==='男'?'師弟':'師妹'):role,portrait=i+(gender==='女'?5:0),statSeed=textSeed(`${state.sect}・${name}・戰鬥`);return {title,name,gender,portrait,id,role:i,statBias:{vitality:.92+statSeed%17/100,offense:.92+Math.floor(statSeed/7)%19/100,guard:.92+Math.floor(statSeed/13)%17/100,speed:.92+Math.floor(statSeed/19)%15/100,spirit:.92+Math.floor(statSeed/29)%17/100}}});
}
function renderSectPanel(view='home'){
  currentSectView=view;processSectYears();
  if(!state.sect){
    const unlocked=sectCatalog.filter(g=>state.spiritLevel>=g.need);const max=unlocked.at(-1);
    $('#featureDescription').innerHTML=`<section class="sectless"><div class="sect-seal">無</div><h2>無門無派</h2><p>你尚未拜入任何門派，可外出尋訪仙門、求取入道機緣。</p><div class="sect-unlocks">目前最高可加入：${['一','二','三','四','五','六','七','八','九'][max.star-1]}星門派・需求${max.realm}</div><button id="joinSectBtn" class="jade-button">尋訪仙門</button></section>`;
    $('#joinSectBtn').onclick=joinRandomSect;return;
  }
  const tabs=[['home','門派'],['npcs','門人'],['practice','練功房'],['tasks','任務'],['salary','俸祿']];
  $('#featureDescription').innerHTML=`<div class="sect-tabs">${tabs.map(([k,n])=>`<button data-sect-view="${k}" class="${k===view?'active':''}">${n}</button>`).join('')}</div><div id="sectInner"></div>`;
  $$('.sect-tabs button').forEach(b=>b.onclick=()=>renderSectPanel(b.dataset.sectView));renderSectView(view);save();
}
function renderSectView(view){
  currentSectView=view;const inner=$('#sectInner');if(!inner)return;
  $$('.sect-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.sectView===view));
  if(view==='home'){
    const next=sectPromotionCosts[state.sectRank];
    inner.innerHTML=`<section class="sect-home ${state.sectFaction==='邪'?'evil':''}"><div class="sect-heading"><span>${['一','二','三','四','五','六','七','八','九'][state.sectStar-1]}星門派</span><h2>${state.sect}</h2></div><p>${sectDescription()}</p><div class="sect-status"><b>${sectRanks[state.sectRank]}${state.actingLeader?'・代理掌門':''}</b><span>門派貢獻 ${formatLargeNumber(state.sectContribution)}</span><span>聲望 ${formatLargeNumber(state.prestige)}</span></div>${next?`<button id="promoteSectBtn" class="jade-button" ${state.sectContribution>=next?'':'disabled'}>晉升${sectRanks[state.sectRank+1]}・需 ${formatLargeNumber(next)} 貢獻</button>`:'<strong class="rank-max">已達最高職位・護法</strong>'}<button id="leaveSectBtn" class="text-button danger-text" ${state.prestige>=200?'':'disabled'}>脫離門派・消耗200聲望</button></section>`;
    if(next)$('#promoteSectBtn').onclick=promoteSect;$('#leaveSectBtn').onclick=leaveSect;return;
  }
  if(view==='npcs'){if(!validSectNpcSnapshot()){state.sectNpcSnapshot=createSectNpcSnapshot();save()}inner.innerHTML=`<div class="npc-grid">${sectNpcs().map((n,index)=>{const power=state.sectNpcSnapshot.stats[String(n.id)].combatPower;return `<button class="npc-card" data-npc="${index}"><span class="npc-portrait p${n.portrait}" style="--portrait-hue:${n.id%37-18}deg;--portrait-bright:${.92+(n.id%9)*.02}"></span><b>${n.title}</b><strong>${n.name}</strong><small>戰力 ${formatCombatPower(power)}</small></button>`}).join('')}</div><div id="npcDetail" class="npc-detail">點選一位門人進行互動</div>`;$$('.npc-card').forEach(b=>b.onclick=()=>renderNpcDetail(+b.dataset.npc));return}
  if(view==='shop'){renderSectShop();return}
  if(view==='tasks'){inner.innerHTML=`<div class="task-list">${sectTasks.map(t=>`<button data-task="${t.id}" class="task-card ${state.sectTask===t.id?'active':''}" ${state.spiritLevel<t.need?'disabled':''}><b>${t.name}</b><span>每年：貢獻+${t.gain}・靈石+${t.stone}・聲望+${t.prestige}</span><small>${t.desc}</small><em>${state.sectTask===t.id?'已接取':state.spiritLevel>=t.need?'可接取':`需 ${realmName(t.need,spiritRealms)}`}</em></button>`).join('')}</div><p class="sect-note">任務會持續執行；境界提高後不會自動更換。脫離門派時任務立即終止。</p>`;$$('.task-card:not(:disabled)').forEach(b=>b.onclick=()=>{state.sectTask=b.dataset.task;toast(`開始持續任務：${selectedSectTask().name}`);renderSectView('tasks');save()});return}
  if(view==='practice'){
    const can=state.sectRank>=1,done=state.lastPracticeDay===dateKey(),practiceOn=buffActive('practiceBuff'),transmissionOn=buffActive('transmissionBuff');
    const practiceReason=!can?'需晉升內門弟子':done?'今日已完成':state.spiritStone<1000?`尚缺 ${Math.ceil(1000-state.spiritStone)} 靈石`:'開始練功';
    inner.innerHTML=`<div class="practice-grid"><article class="buff-card ${practiceOn?'running':''}"><b>練功</b><p>消耗1000靈石，獲得5倍修為修練${state.actingLeader?20:10}年。每日一次，開啟後持續至時間結束。</p><div class="buff-timer ${practiceOn?'active':''}"><i id="practiceTimerBar" style="width:${buffPercent('practiceBuff')}%"></i><span id="practiceTimerText">${practiceOn?buffClock('practiceBuff'):'未開啟'}</span></div><button id="dailyPractice" ${can&&!done&&state.spiritStone>=1000?'':'disabled'}>${practiceReason}</button></article><article class="buff-card ${transmissionOn?'running':''}"><b>掌門傳功</b><p>每次獲得8倍修為修練10年，可與練功同時進行，開啟後無法暫停。</p><div class="buff-timer ${transmissionOn?'active':''}"><i id="transmissionTimerBar" style="width:${buffPercent('transmissionBuff')}%"></i><span id="transmissionTimerText">${transmissionOn?buffClock('transmissionBuff'):'未開啟'}</span></div><div class="transmit-buttons"><button data-transmit="1" data-cost="5">1次・5靈玉</button><button data-transmit="30" data-cost="120">30次・120靈玉</button><button data-transmit="100" data-cost="300">100次・300靈玉</button></div></article></div>${can?'':'<p class="sect-note">練功房需達內門弟子以上；目前靈石足夠，但職位尚未符合。</p>'}<p class="sect-note">目前總修練倍率：${cultivationMultiplier()}倍・主介面修練效率 ${rate().toLocaleString()} / 5秒</p>`;
    $('#dailyPractice').onclick=dailyPractice;$$('[data-transmit]').forEach(b=>{b.disabled=transmissionOn||!can||state.spiritJade<+b.dataset.cost;b.onclick=()=>masterTransmission(+b.dataset.transmit,+b.dataset.cost)});return
  }
  if(view==='salary'){const amount=sectSalary[state.sectRank],done=state.lastSalaryDay===dateKey();inner.innerHTML=`<div class="salary-card"><b>${sectRanks[state.sectRank]}俸祿</b><strong>${formatLargeNumber(amount)} 靈石／每日</strong><p>依目前門派職位發放，每日僅可領取一次。</p><button id="claimSalary" class="jade-button" ${done?'disabled':''}>${done?'今日已領取':'領取俸祿'}</button></div>`;$('#claimSalary').onclick=claimSalary;return}
}
function sectTokenDailyState(){
  const today=dateKey();if(!today)return state.sectTokenDaily||{date:'',exchanged:3};
  if(!state.sectTokenDaily||state.sectTokenDaily.date!==today)state.sectTokenDaily={date:today,exchanged:0};
  return state.sectTokenDaily;
}
function renderSectShop(){
  const inner=$('#sectInner'),daily=sectTokenDailyState(),remaining=Math.max(0,3-daily.exchanged),canExchange=remaining>0&&state.sectContribution>=200&&canStoreItem('sectToken');
  inner.innerHTML=`<section class="sect-shop"><button id="shopBackBtn" class="text-button">返回門人</button><div class="shop-heading"><small>供奉・物資兌換</small><h2>門派寶庫</h2><span>門派貢獻 ${formatLargeNumber(state.sectContribution)}</span></div><article class="shop-item"><img src="assets/qstyle-v2/sect-token-cutout.png" alt="門派令牌"><div class="shop-item-copy"><b>門派令牌</b><p>使用後增加 100 門派貢獻。</p><strong>兌換需要 200 門派貢獻</strong><small>今日剩餘 ${remaining} / 3 次・持有 ${formatLargeNumber(state.sectTokens||0)}</small></div><div class="shop-actions"><button id="exchangeSectToken" class="jade-button" ${canExchange?'':'disabled'}>兌換</button></div></article></section>`;
  $('#shopBackBtn').onclick=()=>renderSectPanel('npcs');$('#exchangeSectToken').onclick=exchangeSectToken;
}
function exchangeSectToken(){
  if(!requireTrustedTime())return;
  const daily=sectTokenDailyState();if(daily.exchanged>=3)return toast('今日兌換次數已用完');if(state.sectContribution<200)return toast('門派貢獻不足');
  if(!canStoreItem('sectToken'))return toast('儲物袋已滿，無法放入門派令牌');
  state.sectContribution-=200;state.sectTokens=(state.sectTokens||0)+1;daily.exchanged++;toast('兌換門派令牌 ×1');renderSectShop();save();
}
function useSectToken(quantity=1){
  if(!state.sect){toast('目前無門無派，無法使用門派令牌');return false}if((state.sectTokens||0)<1){toast('沒有可使用的門派令牌');return false}
  quantity=Math.max(1,Math.min(state.sectTokens,Math.floor(quantity)));state.sectTokens-=quantity;state.sectContribution+=100*quantity;toast(`使用門派令牌 ${formatLargeNumber(quantity)}個・門派貢獻+${formatLargeNumber(100*quantity)}`);
  if(currentFeature==='sect'&&currentSectView==='shop')renderSectShop();else if(currentFeature==='bag')renderBagView('bag');render();save();return true
}
function openItemModal(key){
  const item=itemCatalog[key];if(!item)return;const count=state[item.count]||0;
  const learned=!!item.techniqueBook&&(state.learnedBookIds||[]).includes(item.techniqueBook.id);
  const sectBlocked=!!item.sectInvitation&&!!state.sect;
  refreshBodyState();
  itemModalKey=key;itemModalQuantity=1;$('#itemModalImage').src=item.image;$('#itemModalImage').alt=item.name;$('#itemModalName').textContent=item.name;$('#itemModalDescription').textContent=item.description+(learned?'\n\n此功法已習得，本書只能售出。':'')+(sectBlocked?'\n\n你目前已有門派，必須先脫離門派才能使用此信物。':'');$('#itemModalCount').textContent=`持有數量：${formatLargeNumber(count)}`;
  const sell=$('#itemModalSell');sell.disabled=count<1;sell.onclick=()=>openSellModal(key,itemModalQuantity);
  const showUse=item.usable&&!learned,canUse=showUse&&!sectBlocked;const use=$('#itemModalUse');use.classList.toggle('hidden',!showUse);use.disabled=!canUse||count<1;use.onclick=canUse?()=>useItem(key,itemModalQuantity):null;
  updateItemQuantity();
  $('#itemModalActions').classList.toggle('no-use',!showUse);$('#itemModal').classList.remove('hidden');
}
function closeItemModal(){$('#itemModal').classList.add('hidden');itemModalKey=null;itemModalQuantity=1}
function updateItemQuantity(){const item=itemCatalog[itemModalKey];if(!item)return;const owned=Math.max(0,Math.floor(Number(state[item.count])||0));itemModalQuantity=Math.max(1,Math.min(Math.max(1,owned),itemModalQuantity));$('#itemQuantity').textContent=formatLargeNumber(itemModalQuantity);$('#itemMinusBtn').disabled=itemModalQuantity<=1;$('#itemMinBtn').disabled=itemModalQuantity<=1;$('#itemPlusBtn').disabled=itemModalQuantity>=owned;$('#itemMaxBtn').disabled=itemModalQuantity>=owned}
function useTechniqueBook(key){
  const item=itemCatalog[key],book=item?.techniqueBook;if(!book)return false;
  if((state.learnedBookIds||[]).includes(book.id)){toast('此功法已習得，道具只能售出');return false}
  if((state[item.count]||0)<1)return false;
  state[item.count]--;state.learnedBookIds.push(book.id);state.learnedArts.push({...book,level:1});
  toast(`習得「${book.name}」・${artKinds[book.kind].label}+${artBaseEffect(book)}`);render();save();return true;
}
function useSectInvitation(key){
  const item=itemCatalog[key],invitation=item?.sectInvitation;if(!invitation)return false;
  if(state.sect){toast('已有門派時無法使用門派信物');return false}if((state[item.count]||0)<1)return false;
  state[item.count]--;return joinSect(invitation);
}
function useResourceBundle(key,quantity=1){
  const item=itemCatalog[key],bundle=item?.resourceBundle;if(!bundle||(state[item.count]||0)<1)return false;
  quantity=Math.max(1,Math.min(state[item.count],Math.floor(quantity)));state[item.count]-=quantity;state[bundle.resource]=(state[bundle.resource]||0)+bundle.amount*quantity;toast(`使用${item.name} ${formatLargeNumber(quantity)}個・${bundle.label}+${formatLargeNumber(bundle.amount*quantity)}`);render();save();return true;
}
function useCultivationBundle(key,quantity=1){const item=itemCatalog[key],amount=Number(item?.cultivationBundle)||0;if(amount<=0||(state[item.count]||0)<1)return false;quantity=Math.max(1,Math.min(state[item.count],Math.floor(quantity)));state[item.count]-=quantity;state.free+=amount*quantity;state.totalEarned+=amount*quantity;toast(`使用${item.name} ${formatLargeNumber(quantity)}個・修為+${formatLargeNumber(amount*quantity)}`);render();save();return true}
function useStaminaMedicine(key,quantity=1){const item=itemCatalog[key],amount=Number(item?.staminaRestore)||0;refreshBodyState();if(amount<=0||(state[item.count]||0)<1)return false;quantity=Math.max(1,Math.min(state[item.count],Math.floor(quantity)));state[item.count]-=quantity;state.bodyStamina+=amount*quantity;state.bodyStaminaUpdatedAt=gameNow();toast(`使用${item.name} ${formatLargeNumber(quantity)}個・體力+${formatLargeNumber(amount*quantity)}${state.bodyStamina>100?'（已溢出保留）':''}`);render();save();return true}
function useItem(key,quantity=1){let used=false;const item=itemCatalog[key];if(key==='sectToken')used=useSectToken(quantity);else if(item?.techniqueBook)used=useTechniqueBook(key);else if(item?.sectInvitation)used=useSectInvitation(key);else if(item?.cultivationBundle)used=useCultivationBundle(key,quantity);else if(item?.resourceBundle)used=useResourceBundle(key,quantity);else if(item?.staminaRestore)used=useStaminaMedicine(key,quantity);if(used){closeItemModal();if(currentFeature==='bag')renderBagView('bag')}}
function itemSellPrice(item){return Math.max(1,Math.floor(Number(item.sellPrice)||1))}
function updateSellModal(){
  const item=itemCatalog[sellItemKey];if(!item)return;
  const owned=Math.max(0,Math.floor(Number(state[item.count])||0));
  sellItemQuantity=Math.max(1,Math.min(owned,sellItemQuantity));
  $('#sellModalTotal').textContent=`可獲得靈石：${formatLargeNumber(sellItemQuantity*itemSellPrice(item))}`;
  $('#sellConfirmBtn').disabled=owned<1;
}
function openSellModal(key,quantity=1){
  const item=itemCatalog[key];if(!item)return;
  const owned=Math.max(0,Math.floor(Number(state[item.count])||0));if(owned<1)return;
  sellItemKey=key;sellItemQuantity=Math.max(1,Math.min(owned,Math.floor(quantity)));
  $('#sellModalMessage').textContent=`確定販售「${item.name}」${formatLargeNumber(sellItemQuantity)}個？`;
  updateSellModal();$('#sellModal').classList.remove('hidden');
}
function closeSellModal(){$('#sellModal').classList.add('hidden');sellItemKey=null;sellItemQuantity=1}
function confirmSellItem(){
  const item=itemCatalog[sellItemKey];if(!item)return closeSellModal();
  const owned=Math.max(0,Math.floor(Number(state[item.count])||0));
  const quantity=Math.max(1,Math.min(owned,sellItemQuantity));if(owned<1)return closeSellModal();
  const earned=quantity*itemSellPrice(item);state[item.count]=owned-quantity;state.spiritStone+=earned;
  closeSellModal();closeItemModal();
  if(currentFeature==='bag')renderBagView('bag');render();save();toast(`已售出 ${item.name} ×${quantity}・靈石+${earned}`);
}
function promoteSect(){const cost=sectPromotionCosts[state.sectRank];if(state.sectContribution<cost)return;state.sectContribution-=cost;state.sectRank++;toast(`晉升為${sectRanks[state.sectRank]}`);renderSectView('home');save()}
function npcDailyState(index){const key=String(sectNpcs()[index].id),record=state.npcDaily[key],today=dateKey();if(!today)return record||{date:'',chat:3,gift:3,sparWon:true};if(!record||record.date!==today)state.npcDaily[key]={date:today,chat:0,gift:0,sparWon:false};else if(typeof record.sparWon!=='boolean')record.sparWon=false;return state.npcDaily[key]}
function availableGiftItem(){return Object.entries(itemCatalog).find(([,item])=>item.giftable&&(state[item.count]||0)>0)}
function renderNpcDetail(index){const n=sectNpcs()[index],npcStats=battleEnemyStats(n),aff=state.npcAffinity[n.id]||0,daily=npcDailyState(index),gift=availableGiftItem(),master=index===0,elder=index===1,offering=index===2,challengeDisabled=master?(state.sectRank<2||state.prestige<200||state.actingLeader):daily.sparWon,combatLabel=master?(state.actingLeader?'已是代理掌門':state.sectRank<2?'挑戰掌門・需親傳弟子':state.prestige>=200?'挑戰掌門':'挑戰掌門・需200聲望'):(daily.sparWon?'今日切磋已勝':'切磋');$('#npcDetail').innerHTML=`<b>${n.title}・${n.name}</b><span>戰力 ${formatCombatPower(npcStats.combatPower)}・好感 ${aff} / 100</span><div><button data-npc-action="chat" ${daily.chat>=3||aff>=100?'disabled':''}>聊天 ${daily.chat}/3</button><button data-npc-action="gift" ${daily.gift>=3||aff>=100||!gift?'disabled':''}>${gift?`送禮 ${daily.gift}/3`:'送禮・無道具'}</button><button data-npc-action="${master?'challenge':'spar'}" ${challengeDisabled?'disabled':''}>${combatLabel}</button>${master?'<button data-npc-action="greet">請安</button>':''}${elder?'<button data-npc-action="arts">學習功法</button>':''}${offering?'<button data-npc-action="shop">物資兌換</button>':''}</div>`;$$('[data-npc-action]').forEach(b=>b.onclick=()=>npcAction(index,b.dataset.npcAction))}
function npcAction(index,action){const n=sectNpcs()[index],daily=npcDailyState(index),aff=state.npcAffinity[n.id]||0;if(['chat','gift','greet','spar'].includes(action)&&!requireTrustedTime())return;if(action==='chat'){if(daily.chat>=3||aff>=100)return;daily.chat++;state.npcAffinity[n.id]=Math.min(100,aff+1);toast('交談甚歡・好感+1')}else if(action==='gift'){const gift=availableGiftItem();if(!gift)return toast('身上沒有可贈送的道具');if(daily.gift>=3||aff>=100)return;const [,item]=gift;state[item.count]--;daily.gift++;state.npcAffinity[n.id]=Math.min(100,aff+5);toast(`送出${item.name}・好感+5`)}else if(action==='spar'){if(daily.sparWon)return toast('今日已切磋勝利，明日再來');startNpcBattle(n);return}else if(action==='challenge'){challengeMaster();return}else if(action==='greet'){if(state.lastGreetingDay===dateKey())return toast('今日已向掌門請安');state.lastGreetingDay=dateKey();state.sectContribution+=100;toast('掌門頷首嘉許・門派貢獻+100')}else if(action==='arts'){renderSectLearning();return}else if(action==='shop'){renderSectPanel('shop');return}renderNpcDetail(index);save()}

function combatHealth(rootBone){return Math.max(125,120+Math.max(0,rootBone)*4)}
function combatEvasion(agility){return Math.max(0,agility)*3}
function combatAccuracy(spiritualPower){return Math.max(0,spiritualPower)*3}
function combatDodgeChance(attacker,defender){const evasion=Math.max(0,defender.evasion||0),accuracy=Math.max(0,attacker.accuracy||0);return Math.min(.5,evasion/(evasion+accuracy*2+1000))}
function combatCritical(spiritualPower){const rating=Math.max(0,spiritualPower)*3;return Math.min(.45,rating/(rating+3000))}
function battlePlayerStats(){
  const rootBone=effectiveCore('rootBone'),trueQi=effectiveCore('trueQi'),physique=effectiveCore('physique'),agility=effectiveCore('agility'),spiritualPower=effectiveCore('spiritualPower');
  const swordPower=1+(state.swordLevel||0)*.008;
  return {
    maxHp:Math.round(combatHealth(rootBone)*(activeBodyInjury()==='internal'?.85:1)),attack:Math.max(12,trueQi*5)*swordPower,defense:Math.max(0,physique*20),
    evasion:combatEvasion(agility),accuracy:combatAccuracy(spiritualPower),crit:combatCritical(spiritualPower)
  };
}
function validSectNpcSnapshot(snapshot=state.sectNpcSnapshot){
  if(!state.sect||!snapshot||snapshot.version!==5||snapshot.sect!==state.sect||!snapshot.stats)return false;
  return sectNpcs().every(n=>{const stats=snapshot.stats[String(n.id)];return stats&&Number.isFinite(stats.combatPower)&&stats.core&&Object.keys(combatPowerWeights).every(key=>Number.isInteger(stats.core[key]))&&['maxHp','attack','defense','evasion','accuracy','crit'].every(key=>Number.isFinite(stats[key]))});
}
function npcCoreFromPower(rawPower,n){
  const keys=Object.keys(combatPowerWeights),costs=keys.map(key=>combatPowerWeights[key]/5),profiles=[[1,1,1,1,1],[2,.85,1.2,.9,.85],[.85,2,.9,.95,1.2],[1.15,.85,2,.85,.9],[.85,.95,.85,2,1.15],[.85,1.15,.9,1.2,2]],seed=textSeed(`${n.seedScope||state.sect}・${n.id}・${n.seedScope?'fixed':state.sectJoinedAt||0}・屬性`);
  let target=Math.max(100,Math.ceil(rawPower/5)*5);while(target/5-20===1)target+=5;
  let randomState=seed||1;const random=()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296},profile=profiles[seed%profiles.length],weights=profile.map(value=>value*(.85+random()*.3)),weightTotal=weights.reduce((sum,value)=>sum+value,0),cores=Object.fromEntries(keys.map(key=>[key,1])),budget=target/5-20;
  let spent=0;keys.forEach((key,index)=>{const points=Math.floor(budget*(weights[index]/weightTotal)/costs[index]);cores[key]+=points;spent+=points*costs[index]});
  let remaining=budget-spent;if(remaining===1){const index=cores[keys[0]]>1?0:cores[keys[1]]>1?1:cores[keys[2]]>1?2:cores[keys[3]]>1?3:4;cores[keys[index]]--;remaining+=costs[index]}
  while(remaining>0){const candidates=costs.map((cost,index)=>({cost,index})).filter(item=>item.cost<=remaining&&remaining-item.cost!==1),pick=candidates[Math.floor(random()*candidates.length)];cores[keys[pick.index]]++;remaining-=pick.cost}
  return {combatPower:target,core:cores};
}
function createSectNpcSnapshot(){
  if(!state.sect)return null;
  const player=battlePlayerStats(),playerPower=combatPower(),star=Math.max(1,state.sectStar||1),starPower=1+(star-1)*.06,masterPower=(1.75+star*.2)*1.25,rolePower=[masterPower,2.2*starPower,1.8*starPower,1.4*starPower,1*starPower],stats={};
  sectNpcs().forEach((n,index)=>{
    const generated=npcCoreFromPower(Math.ceil(playerPower*(rolePower[index]||1)),n),core=generated.core;
    stats[String(n.id)]={
      combatPower:generated.combatPower,core,
      maxHp:combatHealth(core.rootBone),attack:Math.max(12,core.trueQi*5),defense:Math.max(0,core.physique*20),
      evasion:combatEvasion(core.agility),accuracy:combatAccuracy(core.spiritualPower),crit:combatCritical(core.spiritualPower)
    };
  });
  return {version:5,sect:state.sect,joinedAt:state.sectJoinedAt||gameNow(),createdAt:gameNow(),player:{...player,combatPower:playerPower},stats};
}
function battleEnemyStats(n){
  if(!validSectNpcSnapshot()){state.sectNpcSnapshot=createSectNpcSnapshot();save()}
  return {...state.sectNpcSnapshot.stats[String(n.id)]};
}
function startNpcBattle(n,mode='spar'){
  clearTimeout(battleTimer);
  startBgm('battle');
  const player=battlePlayerStats(),enemy=battleEnemyStats(n);
  battle={active:true,resolved:false,mode,round:1,completedRounds:0,playerMoveIndex:0,player:{...player,hp:player.maxHp},enemy:{...enemy,hp:enemy.maxHp,name:n.name,npc:n,race:'human'},logs:[]};
  $('#battleModal').classList.remove('hidden');$('#battleStage').classList.remove('hidden');$('#battleResult').classList.add('hidden');
  $('#playerSilhouette').className=`battle-silhouette ${state.gender==='女'?'silhouette-player-female':'silhouette-player-male'}`;
  $('#enemySilhouette').className='battle-silhouette silhouette-human';
  $('#battlePlayerName').textContent=state.name;$('#battleEnemyName').textContent=n.name;
  $('#battleLog').innerHTML=`<p><b>${state.name}</b>與<b>${n.name}</b>抱拳行禮，${mode==='master'?'掌門之位挑戰':'切磋'}開始。</p>`;
  updateBattleUi();battleTimer=setTimeout(playerBattleTurn,700);
}
function damageRoll(attacker,defender,multiplier=1){
  if(Math.random()<combatDodgeChance(attacker,defender))return {damage:0,dodged:true,crit:false};
  const crit=Math.random()<attacker.crit,raw=attacker.attack*multiplier*(crit?1.5:1),offensePressure=Math.max(160,attacker.attack*.8),mitigation=Math.max(.15,offensePressure/(offensePressure+defender.defense));
  return {damage:Math.max(1,Math.round(raw*mitigation)),dodged:false,crit};
}
function animateBattleStrike(attacker,target,damage,technique){
  const attackEl=$(attacker),targetEl=$(target),damageEl=$(target==='#enemySilhouette'?'#enemyDamage':'#playerDamage');
  const enemyCast=attacker==='#enemySilhouette',fx=$('#battleTechniqueFx'),arena=$('.battle-arena');
  attackEl.classList.remove('attacking');targetEl.classList.remove('hit');damageEl.classList.remove('show');
  arena?.classList.remove('clashing','player-strike','enemy-strike');
  fx.className='battle-technique-fx';void attackEl.offsetWidth;
  attackEl.classList.add('attacking');if(!damage.dodged)targetEl.classList.add('hit');
  arena?.classList.add('clashing',enemyCast?'enemy-strike':'player-strike');
  fx.classList.add(enemyCast?'enemy-cast':'player-cast',`${technique.kind}-technique`,`${technique.id}-move`);playTechniqueSound(enemyCast,technique.kind);
  damageEl.textContent=damage.dodged?'閃避':`-${damage.damage}${damage.crit?' 暴擊':''}`;damageEl.classList.add('show');
  setTimeout(()=>{attackEl.classList.remove('attacking');targetEl.classList.remove('hit');damageEl.classList.remove('show');arena?.classList.remove('clashing','player-strike','enemy-strike');fx.className='battle-technique-fx'},860);
}
function playTechniqueSound(enemyCast=false,kind='sword'){
  if(state.muted)return;
  try{
    audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();audioContext.resume?.();
    if(kind==='sword'){playSwordTechniqueSound(enemyCast);return}
    const now=audioContext.currentTime,master=audioContext.createGain(),wind=audioContext.createOscillator(),impact=audioContext.createOscillator(),impactGain=audioContext.createGain(),steel=audioContext.createOscillator(),steelGain=audioContext.createGain();
    master.connect(audioContext.destination);master.gain.setValueAtTime(.0001,now);master.gain.exponentialRampToValueAtTime(.22,now+.04);master.gain.exponentialRampToValueAtTime(.0001,now+.48);
    wind.type='triangle';wind.frequency.setValueAtTime(enemyCast?210:250,now);wind.frequency.exponentialRampToValueAtTime(enemyCast?620:780,now+.34);wind.connect(master);wind.start(now);wind.stop(now+.5);
    impact.type='sine';impact.frequency.setValueAtTime(enemyCast?150:190,now+.32);impact.frequency.exponentialRampToValueAtTime(70,now+.55);impactGain.gain.setValueAtTime(.0001,now);impactGain.gain.setValueAtTime(.28,now+.32);impactGain.gain.exponentialRampToValueAtTime(.0001,now+.58);impact.connect(impactGain);impactGain.connect(audioContext.destination);impact.start(now+.32);impact.stop(now+.6);
    steel.type='sine';steel.frequency.setValueAtTime(kind==='origin'?(enemyCast?620:720):(enemyCast?1320:1580),now+.3);steel.frequency.exponentialRampToValueAtTime(kind==='origin'?260:720,now+.58);steelGain.gain.setValueAtTime(.0001,now);steelGain.gain.setValueAtTime(kind==='origin'?.11:.16,now+.3);steelGain.gain.exponentialRampToValueAtTime(.0001,now+.62);steel.connect(steelGain).connect(audioContext.destination);steel.start(now+.3);steel.stop(now+.64);
  }catch{}
}
function playSwordTechniqueSound(enemyCast=false){
  const now=audioContext.currentTime,output=audioContext.createGain();output.connect(audioContext.destination);
  output.gain.setValueAtTime(.0001,now);output.gain.exponentialRampToValueAtTime(.34,now+.025);output.gain.exponentialRampToValueAtTime(.0001,now+.72);
  const length=Math.floor(audioContext.sampleRate*.7),buffer=audioContext.createBuffer(1,length,audioContext.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<length;i++){const falloff=1-i/length;data[i]=(Math.random()*2-1)*falloff}
  const rush=audioContext.createBufferSource(),filter=audioContext.createBiquadFilter();rush.buffer=buffer;filter.type='bandpass';filter.Q.value=1.15;filter.frequency.setValueAtTime(enemyCast?540:680,now);filter.frequency.exponentialRampToValueAtTime(enemyCast?2800:3600,now+.26);filter.frequency.exponentialRampToValueAtTime(950,now+.58);rush.connect(filter).connect(output);rush.start(now);rush.stop(now+.7);
  [0,.075,.15].forEach((delay,index)=>{const blade=audioContext.createOscillator(),gain=audioContext.createGain();blade.type=index===1?'triangle':'sine';blade.frequency.setValueAtTime((enemyCast?1180:1480)+index*310,now+delay);blade.frequency.exponentialRampToValueAtTime(520+index*80,now+delay+.25);gain.gain.setValueAtTime(.0001,now+delay);gain.gain.exponentialRampToValueAtTime(.18-index*.025,now+delay+.018);gain.gain.exponentialRampToValueAtTime(.0001,now+delay+.29);blade.connect(gain).connect(output);blade.start(now+delay);blade.stop(now+delay+.31)});
  const clash=audioContext.createOscillator(),clashGain=audioContext.createGain();clash.type='square';clash.frequency.setValueAtTime(enemyCast?1780:2140,now+.3);clash.frequency.exponentialRampToValueAtTime(460,now+.55);clashGain.gain.setValueAtTime(.0001,now);clashGain.gain.setValueAtTime(.12,now+.3);clashGain.gain.exponentialRampToValueAtTime(.0001,now+.58);clash.connect(clashGain).connect(output);clash.start(now+.3);clash.stop(now+.6);
}
function appendBattleLog(text,side='player'){
  battle.logs.push(text);if(battle.logs.length>6)battle.logs.shift();
  $('#battleLog').innerHTML=battle.logs.map((x,i)=>`<p class="${i===battle.logs.length-1?side:''}">${x}</p>`).join('');$('#battleLog').scrollTop=$('#battleLog').scrollHeight;
}
function playerBattleTurn(){
  if(!battle?.active)return;const moves=state.swordEmbryo?equippedSwordTechniques():startingTechniques,technique=moves[battle.playerMoveIndex%moves.length]||startingTechniques[0];battle.playerMoveIndex++;const mult=technique.min+Math.random()*(technique.max-technique.min),hit=damageRoll(battle.player,battle.enemy,mult);
  battle.enemy.hp=Math.max(battle.mode==='bodyTrial'?1:0,battle.enemy.hp-hit.damage);animateBattleStrike('#playerSilhouette','#enemySilhouette',hit,technique);
  appendBattleLog(hit.dodged?`${battle.enemy.name}看破招式來勢，避開了${state.name}的${technique.name}。`:`${state.name}${technique.kind==='sword'?'引氣淬鋒':'凝神引元'}，使出${technique.name}，對${battle.enemy.name}造成了${hit.damage}傷害。`,'player');updateBattleUi();
  if(battle.enemy.hp<=0)return setTimeout(()=>finishBattle(true,'對手氣息已散，無力再戰。'),650);
  battleTimer=setTimeout(enemyBattleTurn,950);
}
function enemyBattleTurn(){
  if(!battle?.active)return;const technique=startingTechniques[Math.floor(Math.random()*startingTechniques.length)],mult=technique.min+Math.random()*(technique.max-technique.min),hit=damageRoll(battle.enemy,battle.player,mult);
  battle.player.hp=Math.max(0,battle.player.hp-hit.damage);animateBattleStrike('#enemySilhouette','#playerSilhouette',hit,technique);
  appendBattleLog(hit.dodged?`${state.name}踏影側身，避開了${battle.enemy.name}的${technique.name}。`:`${battle.enemy.name}${technique.kind==='sword'?'引氣淬鋒':'凝神引元'}，使出${technique.name}，對${state.name}造成了${hit.damage}傷害。`,'enemy');
  battle.completedRounds++;updateBattleUi();
  if(battle.player.hp<=0)return setTimeout(()=>finishBattle(false,battle.mode==='master'?'你氣力不支，本次掌門挑戰落敗。':battle.mode==='swordTrial'?'劍道幻影破去招式，本次試劍落敗。':battle.mode==='bodyTrial'?'肉身未能撐住試煉化身的攻勢。':'你氣力不支，本次切磋落敗。'),650);
  if(battle.mode==='bodyTrial'&&battle.completedRounds>=battle.targetRounds)return setTimeout(()=>finishBattle(true,`你以肉身承受猛攻，成功撐過 ${battle.targetRounds} 回合。`),650);
  battle.round++;updateBattleUi();battleTimer=setTimeout(playerBattleTurn,900);
}
function updateBattleUi(){
  if(!battle)return;$('#battleTurn').textContent=battle.mode==='bodyTrial'?`第 ${Math.min(battle.round,battle.targetRounds)} / ${battle.targetRounds} 回合`:`第${['一','二','三','四','五','六','七','八','九','十'][Math.min(9,battle.round-1)]||battle.round}回合`;
  $('#playerHealthBar').style.width=`${Math.max(0,battle.player.hp/battle.player.maxHp*100)}%`;$('#enemyHealthBar').style.width=`${Math.max(0,battle.enemy.hp/battle.enemy.maxHp*100)}%`;
  $('#playerHealthText').textContent=`${Math.ceil(battle.player.hp).toLocaleString()} / ${battle.player.maxHp.toLocaleString()}`;$('#enemyHealthText').textContent=`${Math.ceil(battle.enemy.hp).toLocaleString()} / ${battle.enemy.maxHp.toLocaleString()}`;
  const exit=$('#battleExitBtn'),ready=battle.completedRounds>=3;exit.disabled=!ready;exit.textContent=battle.mode==='spar'?'退出':'認輸';
}
function forceEndBattle(){
  if(!battle?.active||battle.completedRounds<3)return;
  if(battle.mode!=='spar')return finishBattle(false,battle.mode==='master'?'你中途認輸，本次掌門挑戰落敗。':battle.mode==='bodyTrial'?'你中途退出，本次肉身試煉落敗。':'你收劍退出，本次試劍落敗。');
  const playerRate=battle.player.hp/battle.player.maxHp,enemyRate=battle.enemy.hp/battle.enemy.maxHp;
  finishBattle(playerRate>=enemyRate,`三回合後終止${battle.mode==='master'?'掌門挑戰':'切磋'}，以剩餘氣血比例判定${playerRate>=enemyRate?'勝出':'落敗'}。`);
}
function finishBattle(won,reason){
  if(!battle||battle.resolved)return;clearTimeout(battleTimer);clearSwordTrialAdvance();battle.active=false;battle.resolved=true;battle.won=won;
  let reward='';
  if(won&&battle.mode==='master'){state.actingLeader=true;reward=' 已取得代理掌門身分。'}
  else if(battle.mode==='swordTrial'){if(won){const stage=state.swordTrialWins+1,intent=swordTrialIntentReward(stage);state.swordTrialWins++;state.swordInsight++;state.swordIntent+=intent;reward=` 戰鬥感悟+1${intent?`、劍意+${intent}`:''}。`;}else reward=' 本關沒有消耗挑戰次數，可調整劍招後再戰。'}
  else if(battle.mode==='bodyTrial'){if(won){const need=bodyTemperNeed(),cost=bodyReq(state.bodyLevel);if(state.bodyTemper>=need&&state.free>=cost){state.bodyTemper-=need;state.free-=cost;state.bodyLevel++;applyAttributeGain(bodyAttributeGain(state.bodyLevel));reward=` 肉身突破至${realmName(state.bodyLevel,bodyRealms)}。`}else reward=' 試煉資格已失效，未完成突破。'}else{const injury=Math.random()<.6?'internal':'tendon';inflictBodyInjury(injury);reward=` 留下${bodyInjuries[injury].name}，療傷後可再次挑戰。`}}
  else if(battle.mode==='spar'&&won){const index=sectNpcs().findIndex(n=>n.id===battle.enemy.npc?.id),intentGain=[0,6,4,2,1][index]||0;if(index>=0)npcDailyState(index).sparWon=true;state.prestige+=5;if(state.swordEmbryo&&intentGain)state.swordIntent+=intentGain;reward=` 聲望+5${state.swordEmbryo&&intentGain?`、劍意+${intentGain}`:''}；今日無法再與此人切磋。`}
  else if(battle.mode==='spar'&&!won&&state.swordEmbryo){state.swordInsight++;reward=' 戰鬥感悟+1。'}
  save();render();
  $('#battleStage').classList.add('hidden');$('#battleResult').classList.remove('hidden');$('#battleResultSeal').textContent=won?'勝':'敗';$('#battleResultSeal').classList.toggle('defeat',!won);
  const nextButton=$('#battleResultNext'),closeButton=$('#battleResultClose');
  nextButton.classList.add('hidden');closeButton.textContent=battle.mode==='swordTrial'?'退出':'返回';
  $('#battleResultTitle').textContent=won?'戰鬥勝利':'戰鬥失敗';
  let resultText=`${reason}${reward}`;
  if(battle.mode==='swordTrial'&&won){
    if(canAdvanceSwordTrial()){nextButton.classList.remove('hidden');scheduleSwordTrialAdvance()}
    else resultText+=' 已達目前淬劍境界可挑戰的上限，完成境界同步後方可繼續。';
  }
  $('#battleResultText').textContent=resultText;
}
function closeBattle(){const npcId=battle?.enemy?.npc?.id,mode=battle?.mode;clearTimeout(battleTimer);clearSwordTrialAdvance();battle=null;$('#battleModal').classList.add('hidden');startBgm('main');if(currentFeature==='sect'&&npcId!=null){const index=sectNpcs().findIndex(n=>n.id===npcId);renderSectPanel('npcs');if(index>=0)renderNpcDetail(index)}else if(currentFeature==='experience'&&mode==='swordTrial')renderExperiencePanel('trial');else if(currentFeature==='experience'&&mode==='bodyTrial')renderExperiencePanel('bodyTrial')}
function updatePracticeTimers(){
  if(currentFeature!=='sect'||currentSectView!=='practice')return;
  for(const [key,prefix] of [['practiceBuff','practice'],['transmissionBuff','transmission']]){const bar=$(`#${prefix}TimerBar`),text=$(`#${prefix}TimerText`);if(!bar||!text)continue;const active=buffActive(key);bar.style.width=`${buffPercent(key)}%`;text.textContent=active?buffClock(key):'未開啟';if(!active&&text.closest('.buff-timer')?.classList.contains('active')){renderSectView('practice');render();break}}
}
function dailyPractice(){if(!requireTrustedTime())return;if(state.sectRank<1)return toast('需晉升內門弟子才能使用練功房');if(state.lastPracticeDay===dateKey())return toast('今日已完成練功');if(state.spiritStone<1000)return toast(`尚缺 ${Math.ceil(1000-state.spiritStone)} 靈石`);state.spiritStone-=1000;state.lastPracticeDay=dateKey();const years=state.actingLeader?20:10;addCultivationBuff('practiceBuff',years);toast(`練功已開啟・5倍修為持續${years}年`);renderSectView('practice');render();save()}
function masterTransmission(times,cost){if(state.sectRank<1)return toast('需晉升內門弟子才能接受掌門傳功');if(buffActive('transmissionBuff'))return toast('掌門傳功進行中，需等待本次傳功結束');if(state.spiritJade<cost)return toast('靈玉不足');state.spiritJade-=cost;addCultivationBuff('transmissionBuff',10*times);toast(`掌門傳功已開啟・8倍修為增加 ${10*times} 年`);renderSectView('practice');render();save()}
function claimSalary(){if(!requireTrustedTime())return;if(state.lastSalaryDay===dateKey())return;const amount=sectSalary[state.sectRank];state.spiritStone+=amount;state.lastSalaryDay=dateKey();toast(`俸祿・靈石+${formatLargeNumber(amount)}`);renderSectView('salary');render();save()}
async function challengeMaster(){
  if(state.actingLeader)return toast('你已是代理掌門');
  if(state.sectRank<2)return toast('需晉升親傳弟子，才有資格挑戰掌門');
  if(state.prestige<200)return toast('挑戰掌門需要200聲望');
  const confirmed=await gameConfirm('此戰將消耗 200 聲望。\n戰勝掌門可取得代理掌門身分；若挑戰失敗，聲望不予退還。\n\n是否確認挑戰？',{title:'挑戰掌門',confirmText:'消耗200聲望挑戰',danger:true});
  if(!confirmed||state.actingLeader)return;
  if(state.prestige<200)return toast('目前聲望不足，無法挑戰掌門');
  state.prestige-=200;save();render();startNpcBattle(sectNpcs()[0],'master');
}

const caveAreas = {
  spiritStone:{label:'靈石',value:'spiritStone',worker:'workerSpiritStone',level:'spiritStoneAreaLevel',icon:'assets/qstyle-v2/spirit-stone.png',baseCap:5760,output:1,foodCost:3,upgradeBase:240},
  food:{label:'食物',value:'food',worker:'workerFood',level:'foodAreaLevel',icon:'assets/qstyle-v2/food-cutout.png',baseCap:34560,output:6,foodCost:0,upgradeBase:180},
  wood:{label:'木材',value:'wood',worker:'workerWood',level:'woodAreaLevel',icon:'assets/qstyle-v2/wood-cutout.png',baseCap:11520,output:2,foodCost:1,upgradeBase:280},
  meteorIron:{label:'隕鐵',value:'meteorIron',worker:'workerMeteorIron',level:'meteorIronAreaLevel',icon:'assets/qstyle-v2/meteor-iron-cutout.png',baseCap:5760,output:1,foodCost:2,upgradeBase:360}
};
const caveFacilities={
  cultivation:{label:'聚靈室',seal:'氣',level:'caveCultivationLevel',enabled:'caveCultivationEnabled',description:'引靈入室，持續提高線上與離線修為。'},
  sword:{label:'洗劍池',seal:'劍',level:'caveSwordLevel',enabled:'caveSwordEnabled',description:'本命劍浸養於靈泉，掛機時緩慢凝聚劍意。'},
  body:{label:'鍛體室',seal:'體',level:'caveBodyLevel',enabled:'caveBodyEnabled',description:'以地脈溫養筋骨，掛機時緩慢累積淬鍊度。'}
};
function areaCapacity(area){return Math.floor(area.baseCap*Math.pow(state[area.level],1.45))}
function areaWorkerMax(area){return state[area.level]}
function areaUpgradeCost(area){return Math.floor(area.upgradeBase*Math.pow(state[area.level],1.45))}
function normalizeCaveWorkers(){Object.values(caveAreas).forEach(area=>state[area.worker]=Math.max(0,Math.min(Math.floor(state[area.worker]||0),areaWorkerMax(area))))}
function normalizeCaveState(){
  state.caveCoreLevel=Math.max(1,Math.min(7,Math.floor(state.caveCoreLevel||1)));
  for(const facility of Object.values(caveFacilities)){state[facility.level]=Math.max(1,Math.min(7,Math.floor(state[facility.level]||1)));state[facility.enabled]=!!state[facility.enabled]}
  state.caveSwordTicks=Math.max(0,Math.floor(state.caveSwordTicks||0));state.caveBodyTicks=Math.max(0,Math.floor(state.caveBodyTicks||0));
  while(caveSpiritUsed()>caveSpiritCapacity()){const enabled=Object.values(caveFacilities).reverse().find(f=>state[f.enabled]);if(!enabled)break;state[enabled.enabled]=false}
}
function caveSpiritCapacity(){return 4+(state.caveCoreLevel-1)*2}
function caveFacilityDraw(facility){return 3+Math.floor((state[facility.level]-1)/2)}
function caveSpiritUsed(){return Object.values(caveFacilities).reduce((sum,facility)=>sum+(state[facility.enabled]?caveFacilityDraw(facility):0),0)}
function caveCultivationBonus(){return state.caveCultivationEnabled&&state.spiritLevel>=10?.08+state.caveCultivationLevel*.02:0}
function caveFacilityEffect(key){
  const level=state[caveFacilities[key].level];
  if(key==='cultivation')return `修為效率 +${Math.round((.08+level*.02)*100)}%`;
  if(key==='sword')return `每 ${formatDuration(caveSwordInterval(level)*5000)} 凝聚 1 劍意`;
  return `每小時獲得需求量 ${(0.25+level*.1).toFixed(2)}% 的淬鍊度`;
}
function caveSwordInterval(level){return Math.max(360,1440-(level-1)*180)}
function caveCoreUpgradeCost(){const level=state.caveCoreLevel;return {stone:Math.floor(1200*Math.pow(level,1.7)),wood:Math.floor(420*Math.pow(level,1.5)),iron:Math.floor(180*Math.pow(level,1.45))}}
function caveFacilityUpgradeCost(key){const level=state[caveFacilities[key].level],weight={cultivation:1,sword:1.15,body:1.1}[key];return {stone:Math.floor(800*weight*Math.pow(level,1.65)),wood:Math.floor(240*weight*Math.pow(level,1.5)),iron:Math.floor(100*weight*Math.pow(level,1.45))}}
function assignedChildren(){return Object.values(caveAreas).reduce((sum,a)=>sum+state[a.worker],0)}
function availableChildren(){return Math.max(0,state.daoChildTotal-assignedChildren())}
function daoChildCost(){return Math.floor(100*Math.pow(state.daoChildBought+1,1.45))}
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
  const cards=Object.entries(caveAreas).map(([key,a])=>{const cap=areaCapacity(a),max=areaWorkerMax(a),upgrade=areaUpgradeCost(a),stored=Math.floor(state[a.value]),full=stored>=cap;return `<article class="resource-area ${full?'storage-full':''}"><img src="${a.icon}" alt="${a.label}"><div class="resource-copy"><b>${a.label}・${state[a.level]}級</b><strong>${formatLargeNumber(stored)} / ${formatLargeNumber(cap)}</strong><small>${full?'倉儲已滿・暫停生產':`1道童 = ${formatLargeNumber(a.output)}／5秒${a.foodCost?`・消耗${formatLargeNumber(a.foodCost)}食物`:''}`}</small></div><div class="worker-stepper"><button data-worker="${key}" data-change="-1">−</button><span>${state[a.worker]} / ${max}</span><button data-worker="${key}" data-change="1">＋</button></div><button class="area-upgrade" data-upgrade-area="${key}" ${state.wood>=upgrade?'':'disabled'}>擴建倉儲・木材 ${formatLargeNumber(upgrade)}</button></article>`}).join('');
  const coreCost=caveCoreUpgradeCost(),coreMax=state.caveCoreLevel>=7,canCore=!coreMax&&state.spiritStone>=coreCost.stone&&state.wood>=coreCost.wood&&state.meteorIron>=coreCost.iron;
  const facilities=Object.entries(caveFacilities).map(([key,f])=>{const level=state[f.level],enabled=state[f.enabled],draw=caveFacilityDraw(f),cost=caveFacilityUpgradeCost(key),maxed=level>=7,locked=key==='sword'&&!state.swordEmbryo,canUpgrade=!maxed&&state.spiritStone>=cost.stone&&state.wood>=cost.wood&&state.meteorIron>=cost.iron;return `<article class="cave-facility ${enabled?'running':''} ${locked?'facility-locked':''}"><span class="facility-seal">${f.seal}</span><div><small>${enabled?'靈氣流轉中':'目前停用'}・耗用 ${draw}</small><b>${f.label}・${level}級</b><p>${f.description}</p><strong>${caveFacilityEffect(key)}</strong></div><div class="facility-actions"><button data-toggle-facility="${key}" ${locked?'disabled':''}>${locked?'凝聚本命劍後開放':enabled?'停止運轉':'開啟運轉'}</button><button data-upgrade-facility="${key}" ${canUpgrade?'':'disabled'}>${maxed?'已達最高級':`升級・靈石 ${formatLargeNumber(cost.stone)}／木 ${formatLargeNumber(cost.wood)}／鐵 ${formatLargeNumber(cost.iron)}`}</button></div></article>`}).join('');
  const cost=daoChildCost();
  inner.innerHTML=`<section class="cave-core"><div><small>洞府靈脈・${state.caveCoreLevel}階</small><b>供應 ${caveSpiritUsed()} / ${caveSpiritCapacity()}</b><p>修行房間共用靈氣供應；資源區由道童獨立運作。</p></div><button id="upgradeCaveCore" ${canCore?'':'disabled'}>${coreMax?'靈脈已圓滿':`升階・靈石 ${formatLargeNumber(coreCost.stone)}／木 ${formatLargeNumber(coreCost.wood)}／鐵 ${formatLargeNumber(coreCost.iron)}`}</button></section><section class="cave-section-title"><b>修行布置</b><small>依目前目標啟停房間，離線期間同樣生效</small></section><div class="cave-facility-grid">${facilities}</div><section class="cave-section-title"><b>資源產地</b><small>一級倉儲約可容納單一道童 8 小時產量</small></section><section class="dao-child-yard"><img src="assets/qstyle-v2/dao-child.png" alt="道童"><div><small>可用道童</small><b>${availableChildren()} / ${state.daoChildTotal}</b><em>未安排的道童會在此等候</em></div><button id="buyDaoChild" ${state.food>=cost?'':'disabled'}>招募<br>食物 ${formatLargeNumber(cost)}</button></section><div class="resource-area-grid">${cards}</div>`;
  $$('.worker-stepper button').forEach(b=>b.onclick=()=>assignWorker(b.dataset.worker,+b.dataset.change));
  $$('.area-upgrade').forEach(b=>b.onclick=()=>upgradeCaveArea(b.dataset.upgradeArea));
  $$('[data-toggle-facility]').forEach(b=>b.onclick=()=>toggleCaveFacility(b.dataset.toggleFacility));
  $$('[data-upgrade-facility]').forEach(b=>b.onclick=()=>upgradeCaveFacility(b.dataset.upgradeFacility));
  $('#upgradeCaveCore').onclick=upgradeCaveCore;
  $('#buyDaoChild').onclick=buyDaoChild;
}
function assignWorker(key,change){const a=caveAreas[key];if(change>0){if(availableChildren()<1)return toast('目前沒有閒置道童');if(state[a.worker]>=areaWorkerMax(a))return toast('此區域已達道童上限')}else if(state[a.worker]<=0)return;state[a.worker]+=change;renderCaveView('dwelling');save()}
function buyDaoChild(){const cost=daoChildCost();if(state.food<cost)return toast('食物不足');state.food-=cost;state.daoChildTotal++;state.daoChildBought++;toast('新道童前來投效');renderCaveView('dwelling');render();save()}
function upgradeCaveArea(key){const a=caveAreas[key],cost=areaUpgradeCost(a);if(state.wood<cost)return toast('木材不足');state.wood-=cost;state[a.level]++;toast(`${a.label}區域提升至${state[a.level]}級`);renderCaveView('dwelling');save()}
function toggleCaveFacility(key){
  const facility=caveFacilities[key];if(!facility)return;if(key==='sword'&&!state.swordEmbryo)return toast('凝聚本命劍後才能開啟洗劍池');
  if(state[facility.enabled])state[facility.enabled]=false;
  else{const next=caveSpiritUsed()+caveFacilityDraw(facility);if(next>caveSpiritCapacity())return toast(`洞府靈氣不足・尚缺 ${next-caveSpiritCapacity()} 點供應`);state[facility.enabled]=true}
  renderCaveView('dwelling');save();
}
function upgradeCaveCore(){const cost=caveCoreUpgradeCost();if(state.caveCoreLevel>=7)return;if(state.spiritStone<cost.stone||state.wood<cost.wood||state.meteorIron<cost.iron)return toast('洞府靈脈升階材料不足');state.spiritStone-=cost.stone;state.wood-=cost.wood;state.meteorIron-=cost.iron;state.caveCoreLevel++;toast(`洞府靈脈提升至${state.caveCoreLevel}階・供應上限增加`);renderCaveView('dwelling');render();save()}
function upgradeCaveFacility(key){const facility=caveFacilities[key];if(!facility||state[facility.level]>=7)return;const cost=caveFacilityUpgradeCost(key);if(state.spiritStone<cost.stone||state.wood<cost.wood||state.meteorIron<cost.iron)return toast('修行房間升級材料不足');const oldDraw=caveFacilityDraw(facility);state[facility.level]++;const newDraw=caveFacilityDraw(facility);if(state[facility.enabled]&&caveSpiritUsed()>caveSpiritCapacity()){state[facility.level]--;return toast(`升級後需多 ${newDraw-oldDraw} 點靈氣供應，請先提升洞府靈脈`)}state.spiritStone-=cost.stone;state.wood-=cost.wood;state.meteorIron-=cost.iron;toast(`${facility.label}提升至${state[facility.level]}級`);renderCaveView('dwelling');render();save()}
function runCaveFacilities(ticks){
  if(ticks<=0||state.spiritLevel<10)return;
  if(state.caveSwordEnabled&&state.swordEmbryo){state.caveSwordTicks+=ticks;const interval=caveSwordInterval(state.caveSwordLevel),gain=Math.floor(state.caveSwordTicks/interval);if(gain>0){state.caveSwordTicks-=gain*interval;state.swordIntent+=gain}}
  if(state.caveBodyEnabled){state.caveBodyTicks+=ticks;const cycles=Math.floor(state.caveBodyTicks/720);if(cycles>0){state.caveBodyTicks-=cycles*720;const gain=Math.max(1,Math.floor(bodyTemperNeed()*(.0025+state.caveBodyLevel*.001)));state.bodyTemper+=gain*cycles}}
}
function runSettlementTick(ticks=1){
  for(let i=0;i<ticks;i++){
    const foodArea=caveAreas.food,foodWorkers=Math.min(state.workerFood,areaWorkerMax(foodArea)),foodCapacity=areaCapacity(foodArea);
    if(state.food<foodCapacity)state.food=Math.min(foodCapacity,state.food+foodWorkers*foodArea.output);
    for(const key of ['spiritStone','wood','meteorIron']){
      const a=caveAreas[key],room=Math.max(0,areaCapacity(a)-state[a.value]),workers=Math.min(state[a.worker],areaWorkerMax(a));
      const possible=Math.min(workers,Math.floor(room/a.output),a.foodCost?Math.floor(state.food/a.foodCost):workers);
      if(possible>0){state.food-=possible*a.foodCost;state[a.value]+=possible*a.output}
    }
  }
  runCaveFacilities(ticks);
}

const elementData = {
  metal:{label:'金',root:'metalRoot',art:'metalArt',icon:'assets/qstyle-v2/element-metal.png'},
  wood:{label:'木',root:'woodRoot',art:'woodArt',icon:'assets/qstyle-v2/element-wood.png'},
  water:{label:'水',root:'waterRoot',art:'waterArt',icon:'assets/qstyle-v2/element-water.png'},
  fire:{label:'火',root:'fireRoot',art:'fireArt',icon:'assets/qstyle-v2/element-fire.png'},
  earth:{label:'土',root:'earthRoot',art:'earthArt',icon:'assets/qstyle-v2/element-earth.png'}
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
    inner.innerHTML=`<div class="pool-page"><div class="pool-level">${state.spiritPoolLevel}階靈池</div><div class="pool-art small"><span></span><img src="assets/qstyle-v2/spirit-pool.png" alt="靈池"></div><div class="pool-stats"><div><small>靈氣產量</small><b>${formatLargeNumber(auraRate())} / 5秒</b></div><div><small>儲存靈氣</small><b>${formatLargeNumber(state.aura)} / ${formatLargeNumber(auraCapacity())}</b></div></div><div class="pool-materials"><div class="pool-owned-materials"><span><img src="assets/qstyle-v2/wood-cutout.png" alt="木材"><em>木材</em><b>${formatLargeNumber(state.wood)}</b></span><i></i><span><img src="assets/qstyle-v2/meteor-iron-cutout.png" alt="隕鐵"><em>隕鐵</em><b>${formatLargeNumber(state.meteorIron)}</b></span></div><div class="pool-upgrade-cost">升階需要：木材 ${formatLargeNumber(woodCost)}・隕鐵 ${formatLargeNumber(ironCost)}</div></div><button id="upgradePoolBtn" class="jade-button" ${can?'':'disabled'}>靈池升階</button></div>`;
    $('#upgradePoolBtn').onclick=upgradeSpiritPool;
    return;
  }
  const elements=Object.entries(elementData).map(([key,e],index)=>{const level=state[e.root],cost=spiritRootReq(level);return `<button class="element-node element-${key}" data-element="${key}" style="--i:${index}"><img src="${e.icon}" alt="${e.label}系"><b>${e.label}</b><small>${rootRank(level)}</small><em>${e.label}系功法 +${state[e.art]}</em><span>需 ${formatLargeNumber(cost)} 靈氣</span></button>`}).join('');
  inner.innerHTML=`<div class="spirit-root-stage"><div class="element-orbit">${elements}<div class="pool-art"><span></span><img src="assets/qstyle-v2/spirit-pool.png" alt="靈池"><strong>靈氣<br>${formatLargeNumber(state.aura)} / ${formatLargeNumber(auraCapacity())}</strong></div></div><small class="root-hint">點擊五系圖騰，以靈氣淬鍊對應靈根</small></div>`;
  $$('.element-node').forEach(b=>b.onclick=()=>upgradeSpiritRoot(b.dataset.element));
}
function upgradeSpiritRoot(key) {
  const e=elementData[key],level=state[e.root],cost=spiritRootReq(level);
  if(state.aura<cost)return toast(`尚缺 ${formatLargeNumber(cost-state.aura)} 靈氣`);
  state.aura-=cost;state[e.root]++;state[e.art]+=2;toast(`${e.label}系靈根提升至${rootRank(state[e.root])}`);renderSpiritRootView('root');save();
}
function upgradeSpiritPool() {
  const woodCost=poolWoodCost(),ironCost=poolIronCost();
  if(state.wood<woodCost||state.meteorIron<ironCost)return toast('升階材料不足');
  state.wood-=woodCost;state.meteorIron-=ironCost;state.spiritPoolLevel++;toast(`靈池提升至${state.spiritPoolLevel}階`);renderSpiritRootView('pool');save();
}

function renderBagPanel(view='bag') {
  $('#featureDescription').innerHTML='<div class="bag-tabs"><button data-bag-view="bag">儲物袋</button><button data-bag-view="character">人物</button><button data-bag-view="wardrobe">衣閣</button></div><div id="bagInner"></div>';
  $$('.bag-tabs button').forEach(b=>b.onclick=()=>renderBagView(b.dataset.bagView));
  renderBagView(view);
}
const bagRankNames=['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六'];
function bagCapacity(){return 50+(Math.max(1,Math.min(16,state.bagRank||1))-1)*10}
function bagUpgradeCost(){return Math.max(1,state.bagRank||1)}
function bagUsedSlots(){return Object.values(itemCatalog).filter(item=>(state[item.count]||0)>0).length}
function canStoreItem(key){const item=itemCatalog[key];return !!item&&((state[item.count]||0)>0||bagUsedSlots()<bagCapacity())}
function upgradeBag(){
  if(state.bagRank>=16)return;const cost=bagUpgradeCost();
  if((state.mendingSilk||0)<cost)return toast(`尚缺 ${formatLargeNumber(cost-(state.mendingSilk||0))} 補天絲`);
  state.mendingSilk-=cost;state.bagRank++;toast(`儲物袋提升至${bagRankNames[state.bagRank-1]}階`);renderBagView('bag');save();
}
function renderBagView(view) {
  $$('.bag-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.bagView===view));
  const inner=$('#bagInner'); if(!inner)return;
  if(view==='bag') {
    const items=Object.entries(itemCatalog).filter(([,item])=>(state[item.count]||0)>0),capacity=bagCapacity(),used=items.length,cost=bagUpgradeCost();
    const itemButtons=items.map(([key,item])=>`<button class="inventory-item" data-bag-item="${key}"><img src="${item.image}" alt="${item.name}"><b>${formatLargeNumber(state[item.count])}</b><small>${item.name}</small></button>`).join('');
    const emptySlots=Array.from({length:Math.max(0,capacity-used)},()=>'<span></span>').join('');
    inner.innerHTML=`<section class="bag-rank-panel"><div><small>儲物袋品階</small><b>${bagRankNames[state.bagRank-1]}階</b><span>已用 ${used} / ${capacity} 格</span></div><img src="assets/qstyle-v2/mending-silk-cutout.png" alt="補天絲"><div><small>持有補天絲</small><b>${formatLargeNumber(state.mendingSilk||0)}</b>${state.bagRank<16?`<span>升階需要 ${formatLargeNumber(cost)}</span>`:'<span>已達最高品階</span>'}</div>${state.bagRank<16?`<button id="upgradeBagBtn" ${(state.mendingSilk||0)>=cost?'':'disabled'}>升至${bagRankNames[state.bagRank]}階</button>`:'<strong>十六階</strong>'}</section><div class="inventory-grid">${itemButtons}${emptySlots}</div><small class="empty-note">${used?'點擊道具可查看詳細資訊':'目前儲物袋空空如也'}</small>`;
    $$('[data-bag-item]').forEach(button=>button.onclick=()=>openItemModal(button.dataset.bagItem));if(state.bagRank<16)$('#upgradeBagBtn').onclick=upgradeBag;
    return;
  }
  if(view==='wardrobe'){renderWardrobeView('outfits');return}
  const src=characterAsset();
  const slots=Array.from({length:4},()=>'<span class="equip-slot"></span>').join('');
  inner.innerHTML=`<div class="equipment-layout"><div class="equipment-side">${slots}</div><div class="equipment-character"><img src="${src}" alt="人物"><button id="characterAttributesBtn">人物屬性</button></div><div class="equipment-side">${slots}</div></div>`;
  $('#characterAttributesBtn').onclick=()=>hasMindEmbodiment()?showCharacterAttributes():toast('習得意念入體以後方能查看。');
}
function renderWardrobeView(section='outfits'){
  const inner=$('#bagInner');if(!inner)return;
  inner.innerHTML=`<div class="wardrobe-tabs"><button data-wardrobe-view="outfits">服裝</button><button data-wardrobe-view="true-forms">真身</button></div><div id="wardrobeInner"></div>`;
  $$('.wardrobe-tabs button').forEach(button=>button.onclick=()=>renderWardrobeSection(button.dataset.wardrobeView));
  renderWardrobeSection(section);
}
function renderWardrobeSection(section){
  $$('.wardrobe-tabs button').forEach(button=>button.classList.toggle('active',button.dataset.wardrobeView===section));
  const inner=$('#wardrobeInner');if(!inner)return;
  if(section==='outfits'){
    const g=state.gender==='男'?'male':'female',appearance=state.appearance||1;
    inner.innerHTML=`<div class="wardrobe-intro"><b>衣閣藏衣</b><span>服裝只改變外觀，不影響人物屬性。</span></div><div class="wardrobe-grid">${wardrobeOutfits[state.gender].map(outfit=>`<button class="wardrobe-card ${state.outfit===outfit.id?'selected':''}" data-outfit="${outfit.id}"><span class="wardrobe-preview"><img src="${appearanceAsset(state.gender,appearance,outfit.id)}" alt="${outfit.name}"></span><b>${outfit.name}</b><small>${outfit.kind}</small><em>${state.outfit===outfit.id?'穿戴中':'更換'}</em></button>`).join('')}</div>`;
    $$('[data-outfit]').forEach(button=>button.onclick=()=>{state.outfit=+button.dataset.outfit;applyCharacterVisual();renderWardrobeSection('outfits');save()});
    return;
  }
  inner.innerHTML=`<div class="wardrobe-intro"><b>真身異象</b><span>真身為半透明元息異象，不屬於實體裝備。</span></div><div class="true-form-grid">${trueFormCatalog.map(form=>`<button class="true-form-card ${state.trueForm===form.id?'selected':''}" data-true-form="${form.id}"><span class="true-form-preview ${form.id==='none'?'empty':''}">${form.image?`<img src="${form.image}" alt="${form.name}">`:'<i>無相</i>'}</span><span><b>${form.name}</b><small>${form.description}</small></span><em>${state.trueForm===form.id?'顯化中':'顯化'}</em></button>`).join('')}</div>`;
  $$('[data-true-form]').forEach(button=>button.onclick=()=>{state.trueForm=button.dataset.trueForm;applyCharacterVisual();renderWardrobeSection('true-forms');save()});
}
function showCharacterAttributes() {
  const inner=$('#bagInner');
  const rootBone=effectiveCore('rootBone'),trueQi=effectiveCore('trueQi'),physique=effectiveCore('physique'),agility=effectiveCore('agility'),spiritualPower=effectiveCore('spiritualPower'),comprehension=effectiveCore('comprehension'),fortune=effectiveCore('fortune'),health=combatHealth(rootBone),attack=trueQi*5,defense=physique*20,evasion=combatEvasion(agility),critical=(combatCritical(spiritualPower)*100).toFixed(1);
  inner.innerHTML=`<section class="character-sheet"><div class="sheet-header"><div><small>姓名</small><b>${state.name}</b></div><div><small>修煉歲月</small><b>${experiencedYears().toLocaleString()}年</b></div><div><small>練氣境界</small><b>${realmName(state.spiritLevel,spiritRealms)}</b></div><div><small>煉體境界</small><b>${realmName(state.bodyLevel,bodyRealms)}</b></div><div><small>出生</small><b>${state.origin}</b></div><div><small>門派</small><b>${state.sect||'無門無派'}${state.actingLeader?'・代理掌門':''}</b></div></div><div class="sheet-title">屬性</div><div class="sheet-attributes"><div><span>命骨：${rootBone}</span><strong>氣血：${health}</strong></div><div><span>元息：${trueQi}</span><strong>攻擊：${attack}</strong></div><div><span>玄軀：${physique}</span><strong>防禦：${defense}</strong></div><div><span>游影：${agility}</span><strong>閃避評級：${evasion}</strong></div><div><span>銳識：${spiritualPower}</span><strong>暴擊：${critical}%</strong></div><div><span>道悟：${comprehension}</span><strong>修練效率：+${cultivationEfficiency()}</strong></div><div><span>天契：${fortune}</span><strong>靈氣獲取：+${auraEfficiency()}</strong></div><div><span>正氣：${Math.floor(state.righteousness)}</span><strong>邪氣：${Math.floor(state.evilQi)}</strong></div></div><div class="five-arts"><b>五系功法屬性</b><span>金 +${state.metalArt}</span><span>木 +${state.woodArt}</span><span>水 +${state.waterArt}</span><span>火 +${state.fireArt}</span><span>土 +${state.earthArt}</span></div></section><button id="attributeBackBtn" class="text-button">返回人物</button>`;
  inner.querySelector('.character-sheet').insertAdjacentHTML('afterbegin',`<div class="sheet-combat-power"><small>人物戰力</small><b>${formatCombatPower(combatPower())}</b></div>`);
  inner.querySelector('.sheet-header').insertAdjacentHTML('beforeend',`<div><small>淬劍境界</small><b>${realmName(state.swordLevel||0,swordRealms)}</b></div>`);
  if(state.swordEmbryo)inner.querySelector('.sheet-title').insertAdjacentHTML('beforebegin',`<div class="sheet-sword"><small>本命劍・${swordEmbryos[state.swordEmbryo].name}</small><b>${state.swordName}</b><span>養劍 ${state.swordNurtureLevel} 階${state.swordIntentType?`・${swordIntents[state.swordIntentType].name}`:''}</span></div>`);
  $('#attributeBackBtn').onclick=()=>renderBagView('character');
}

function finishPause(){
  pauseStartedAt=null;
}
function forceOffline(){
  if(suppressSave||!state.name||pauseStartedAt!==null)return;pauseStartedAt=gameNow();sessionOnline=false;clearTimeout(battleTimer);clearSwordTrialAdvance();battle=null;if(tribulationLocked)cleanupTribulationScene();
  $('#mailboxModal').classList.add('hidden');$('#mailDetailModal').classList.add('hidden');
  $('#battleModal').classList.add('hidden');$('#tribulationModal').classList.add('hidden');$('#itemModal').classList.add('hidden');$('#sellModal').classList.add('hidden');$('#offlineModal').classList.add('hidden');$('#marketModal').classList.add('hidden');$('#marketPurchaseModal').classList.add('hidden');$('#gameMenu').classList.add('hidden');$('#settingsModal').classList.add('hidden');$('#helpModal').classList.add('hidden');stopAllBgm();show('#titleScreen');$('#titleHint').textContent='已離線・點擊螢幕重新進入';save();
}
function finishCreationPrologue(){
  clearTimeout(prologueTimer);prologueTimer=null;
  $('#prologueScreen').classList.remove('playing');startBgm('title');show('#createScreen');
}
function showCreationPrologue(){
  clearTimeout(prologueTimer);show('#prologueScreen');
  const screen=$('#prologueScreen');screen.classList.remove('playing');void screen.offsetWidth;screen.classList.add('playing');
  prologueTimer=setTimeout(finishCreationPrologue,5200);
}
function enterFromTitle() { if(state.name) startGame(); else showCreationPrologue(); }
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
function openHelp(){
  $('#gameMenu').classList.add('hidden');renderHelpRealms();$('#helpModal').classList.remove('hidden');
}
function renderHelpRealms(){
  const groups=[['練氣',spiritRealms],['煉體',bodyRealms],['淬劍',swordRealms]];
  $('#helpContent').innerHTML=groups.map(([title,realms])=>`<section class="help-realm-group"><h3>${title}</h3><ol>${realms.map((realm,index)=>`<li><span>${index+1}</span><b>${realm}</b><small>每境十層</small></li>`).join('')}</ol></section>`).join('');
}
const scriptureFloorTiers=[[1,2],[3,4],[5,6],[7,8],[9]];
const scriptureTierPrices=[200,600,1800,5400,16000,48000,145000,435000,1300000];
const reputationFloorStars=[[1,2],[3,4],[5,6],[7,8],[9]];
const sectInvitationPrices=[150,250,450,700,1000,1400,1900,2500,3300];
const reputationResourcePrices={100:{spiritStone:25,wood:10,meteorIron:18},1000:{spiritStone:180,wood:80,meteorIron:130},10000:{spiritStone:1200,wood:600,meteorIron:900}};
function seededRandom(seedText){let seed=[...seedText].reduce((value,char)=>(value*31+char.charCodeAt(0))>>>0,2166136261);return()=>{seed+=0x6D2B79F5;let value=seed;value=Math.imul(value^value>>>15,value|1);value^=value+Math.imul(value^value>>>7,value|61);return((value^value>>>14)>>>0)/4294967296}}
function scriptureDailyState(){const today=dateKey()||'local';if(state.scripturePurchases.date!==today){state.scripturePurchases={date:today,ids:[]};save()}return state.scripturePurchases}
function scriptureStock(floor){
  const today=dateKey()||'local',tiers=scriptureFloorTiers[floor-1]||[1,2],pool=techniqueBooks.filter(book=>tiers.includes(book.tier)),random=seededRandom(`藏經閣-${today}-${floor}`);
  for(let index=pool.length-1;index>0;index--){const swap=Math.floor(random()*(index+1));[pool[index],pool[swap]]=[pool[swap],pool[index]]}
  return pool.slice(0,9);
}
function reputationStock(floor){
  const today=dateKey()||'local',stars=reputationFloorStars[floor-1]||[1,2],pool=sectInvitationItems.filter(entry=>stars.includes(entry.star)),random=seededRandom(`聲望堂-${today}-${floor}`);
  for(let index=pool.length-1;index>0;index--){const swap=Math.floor(random()*(index+1));[pool[index],pool[swap]]=[pool[swap],pool[index]]}
  const resources=reputationResourceItems.filter(entry=>floor>=entry.minFloor&&floor<=entry.maxFloor).map(entry=>entry.id);
  return [...resources,...pool.slice(0,6).map(entry=>entry.id)];
}
function marketDailyState(){
  const today=dateKey()||'local';
  if(state.marketDailyPurchases.date!==today)state.marketDailyPurchases={date:today,counts:{}};
  state.marketDailyPurchases.counts||={};return state.marketDailyPurchases;
}
function marketOfferForBook(id){
  const book=techniqueBooks.find(entry=>entry.id===id),item=itemCatalog[id];if(!book||!item)return null;
  const tier=['一','二','三','四','五','六','七','八','九'][book.tier-1];
  return {id,item,name:book.name,image:item.image,description:`${item.description}\n功法效果：${artKinds[book.kind].label}+${artBaseEffect(book).toLocaleString()}（${book.elementName}行・${tier}階）`,currencyKey:'spiritStone',currencyName:'靈石',currencyImage:'assets/qstyle-v2/spirit-stone.png',price:scriptureTierPrices[book.tier-1],dailyLimit:null,permanentLimit:1,quantityEnabled:false};
}
function marketOfferForItem(id){
  const bookOffer=marketOfferForBook(id);if(bookOffer)return bookOffer;
  const item=itemCatalog[id];if(!item)return null;
  if(item.sectInvitation){const star=item.sectInvitation.star;return {id,item,name:item.name,image:item.image,description:item.description,currencyKey:'prestige',currencyName:'聲望',currencyImage:'assets/qstyle-v2/reputation.png',price:sectInvitationPrices[star-1],dailyLimit:1,permanentLimit:null,quantityEnabled:false}}
  if(item.resourceBundle){const bundle=item.resourceBundle,price=reputationResourcePrices[bundle.amount]?.[bundle.resource];if(!price)return null;return {id,item,name:item.name,image:item.image,description:item.description,currencyKey:'prestige',currencyName:'聲望',currencyImage:'assets/qstyle-v2/reputation.png',price,dailyLimit:3,permanentLimit:null,quantityEnabled:true}}
  return null;
}
function marketPermanentBought(offer){
  let count=Number(state.marketPermanentPurchases?.[offer.id]||0);
  if(offer.item?.techniqueBook){
    if((state.learnedBookIds||[]).includes(offer.id)||(state[offer.item.count]||0)>0||(state.scripturePurchases?.ids||[]).includes(offer.id))count=Math.max(1,count);
  }
  return count;
}
function marketDailyBought(offer){return Number(marketDailyState().counts[offer.id]||0)}
function marketPurchaseCapacity(offer){
  if(!offer)return 0;
  const affordable=Math.floor((state[offer.currencyKey]||0)/offer.price);
  const dailyRemaining=offer.dailyLimit==null?Infinity:Math.max(0,offer.dailyLimit-marketDailyBought(offer));
  const permanentRemaining=offer.permanentLimit==null?Infinity:Math.max(0,offer.permanentLimit-marketPermanentBought(offer));
  return Math.max(0,Math.min(affordable,dailyRemaining,permanentRemaining,999));
}
function marketPurchaseBlockReason(offer){
  if(!offer)return '商品資料不存在';
  if(offer.item?.techniqueBook&&(state.learnedBookIds||[]).includes(offer.id))return '此功法已習得，無法再次購買';
  if(offer.permanentLimit!=null&&marketPermanentBought(offer)>=offer.permanentLimit)return '此商品已達永久限購上限';
  if(offer.dailyLimit!=null&&marketDailyBought(offer)>=offer.dailyLimit)return '此商品今日購買次數已達上限';
  if((state[offer.currencyKey]||0)<offer.price)return `${offer.currencyName}不足`;
  if(!canStoreItem(offer.id))return '儲物袋已滿';
  return '';
}
function updateMarketPurchaseModal(){
  const offer=marketPurchaseOffer;if(!offer)return;
  const maximum=marketPurchaseCapacity(offer),reason=marketPurchaseBlockReason(offer);
  marketPurchaseQuantity=Math.max(1,Math.min(marketPurchaseQuantity,Math.max(1,maximum)));
  $('#marketPurchaseQuantity').textContent=formatLargeNumber(marketPurchaseQuantity);
  $('#marketPurchaseQuantityPanel').classList.toggle('hidden',!offer.quantityEnabled);
  $('#marketPurchasePrice').innerHTML=`單價：<img src="${offer.currencyImage}" alt="${offer.currencyName}"> ${formatLargeNumber(offer.price)} ${offer.currencyName}`;
  const limits=[];
  if(offer.dailyLimit!=null)limits.push(`每日限購：${marketDailyBought(offer).toLocaleString()} / ${offer.dailyLimit.toLocaleString()}`);
  if(offer.permanentLimit!=null)limits.push(`永久限購：${marketPermanentBought(offer).toLocaleString()} / ${offer.permanentLimit.toLocaleString()}`);
  $('#marketPurchaseLimits').textContent=limits.join('　')||'不限購';
  $('#marketPurchaseTotal').innerHTML=`合計：<img src="${offer.currencyImage}" alt="${offer.currencyName}"> ${formatLargeNumber(offer.price*marketPurchaseQuantity)} ${offer.currencyName}`;
  $('#marketPurchaseReason').textContent=reason;
  $('#marketPurchaseConfirm').disabled=!!reason||maximum<marketPurchaseQuantity;
  ['marketPurchaseMinus','marketPurchaseMin'].forEach(id=>$('#'+id).disabled=marketPurchaseQuantity<=1);
  ['marketPurchasePlus','marketPurchaseMax'].forEach(id=>$('#'+id).disabled=marketPurchaseQuantity>=maximum);
}
function openMarketPurchase(id){
  const offer=marketOfferForItem(id);if(!offer)return;
  marketPurchaseOffer=offer;marketPurchaseQuantity=1;
  $('#marketPurchaseImage').src=offer.image;$('#marketPurchaseImage').alt=offer.name;$('#marketPurchaseName').textContent=offer.name;$('#marketPurchaseDescription').textContent=offer.description;
  updateMarketPurchaseModal();$('#marketPurchaseModal').classList.remove('hidden');
}
function closeMarketPurchase(){$('#marketPurchaseModal').classList.add('hidden');marketPurchaseOffer=null;marketPurchaseQuantity=1}
function confirmMarketPurchase(){
  const offer=marketPurchaseOffer,reason=marketPurchaseBlockReason(offer),maximum=marketPurchaseCapacity(offer);if(!offer)return;if(reason)return toast(reason);
  const quantity=offer.quantityEnabled?Math.min(marketPurchaseQuantity,maximum):1;if(quantity<1)return;
  state[offer.currencyKey]-=offer.price*quantity;state[offer.item.count]=(state[offer.item.count]||0)+quantity;
  if(offer.dailyLimit!=null){const daily=marketDailyState();daily.counts[offer.id]=(daily.counts[offer.id]||0)+quantity}
  if(offer.permanentLimit!=null)state.marketPermanentPurchases[offer.id]=(state.marketPermanentPurchases[offer.id]||0)+quantity;
  if(offer.item.techniqueBook){const legacy=scriptureDailyState();if(!legacy.ids.includes(offer.id))legacy.ids.push(offer.id)}
  toast(`購得「${offer.name}」${quantity>1?` × ${quantity}`:''}`);closeMarketPurchase();renderMarket(currentMarketTab);save();
}
function renderMarket(tab=currentMarketTab){
  currentMarketTab=tab;
  const data={
    market:{title:'坊市',subtitle:'雲市百貨',currency:'stone',floors:[[],[],[],[],[]]},
    scripture:{title:'藏經閣',subtitle:'古卷玉簡',currency:'stone',floors:[[],[],[],[],[]]},
    reputation:{title:'聲望堂',subtitle:'名望珍藏',currency:'reputation',floors:[[],[],[],[],[]]},
    treasure:{title:'百寶樓',subtitle:'仙珍奇物',currency:'jade',products:[]}
  }[tab];
  const hasFloors=tab!=='treasure';
  const floor=hasFloors?(marketFloors[tab]||1):1;
  const products=tab==='scripture'?scriptureStock(floor):tab==='reputation'?reputationStock(floor):(hasFloors?data.floors[floor-1]:data.products);
  const floorTitle=hasFloors?`${data.title}‧${chineseFloorNames[floor-1]}樓`:data.title;
  const floorControls=hasFloors?`<div class="market-floor-controls">
    ${floor>1?`<button class="market-floor-button market-floor-down" type="button" data-market-floor="down" aria-label="下樓"><img src="assets/qstyle-v2/market-floor-up.png" alt=""><span>下樓</span></button>`:''}
    ${floor<5?`<button class="market-floor-button market-floor-up" type="button" data-market-floor="up" aria-label="上樓"><img src="assets/qstyle-v2/market-floor-up.png" alt=""><span>上樓</span></button>`:''}
  </div>`:'';
  $$('.market-tabs button').forEach(button=>button.classList.toggle('active',button.dataset.marketTab===tab));
  const currency={stone:['assets/qstyle-v2/spirit-stone.png','靈石'],jade:['assets/qstyle-v2/spirit-jade.png','靈玉'],reputation:['assets/qstyle-v2/reputation.png','聲望']}[data.currency];
  const productHtml=tab==='scripture'?products.map(book=>{const item=itemCatalog[book.id],price=scriptureTierPrices[book.tier-1],offer=marketOfferForBook(book.id),learned=(state.learnedBookIds||[]).includes(book.id),limited=marketPermanentBought(offer)>=1,tier=['一','二','三','四','五','六','七','八','九'][book.tier-1],interaction=limited?' aria-disabled="true" tabindex="-1"':` data-market-purchase="${book.id}"`;return `<button class="market-product${limited?' sold-out':''}" type="button"${interaction}><span class="market-product-image"><img src="${item.image}" alt="${book.name}"></span><b>${book.name}</b><em><img src="${currency[0]}" alt="${currency[1]}">${formatLargeNumber(price)}</em><small>${limited?'已購買':learned?'已習得':`${book.elementName}行・${tier}階・${artKinds[book.kind].label}+${artBaseEffect(book)}`}</small></button>`}).join(''):tab==='reputation'?products.map(id=>{const item=itemCatalog[id],offer=marketOfferForItem(id),bought=marketDailyBought(offer),limited=bought>=offer.dailyLimit,interaction=limited?' aria-disabled="true" tabindex="-1"':` data-market-purchase="${id}"`,detail=item.sectInvitation?`${['一','二','三','四','五','六','七','八','九'][item.sectInvitation.star-1]}星門派`:`今日 ${bought} / ${offer.dailyLimit}`;return `<button class="market-product${limited?' sold-out daily-limit':''}" type="button"${interaction}><span class="market-product-image"><img src="${item.image}" alt="${item.name}"></span><b>${item.name}</b><em><img src="${currency[0]}" alt="${currency[1]}">${formatLargeNumber(offer.price)}</em><small>${limited?'今日已購足':detail}</small></button>`}).join(''):products.map(([name,image,price])=>`<button class="market-product" type="button" disabled><span class="market-product-image"><img src="${image}" alt="${name}"></span><b>${name}</b><em><img src="${currency[0]}" alt="${currency[1]}">${formatLargeNumber(price)}</em><small>籌備中</small></button>`).join('');
  $('#marketContent').innerHTML=`<div class="market-shop-banner"><small>${data.subtitle}</small><b>${floorTitle}</b></div>${floorControls}<div id="marketFloorNotice" class="market-floor-notice" role="status"></div><div class="market-product-grid">${productHtml}</div><p class="market-restock">${tab==='scripture'||tab==='reputation'?'每日 00:00 自動刷新':'目前尚無商品'}</p>`;
  $$('[data-market-floor]').forEach(button=>button.onclick=()=>changeMarketFloor(button.dataset.marketFloor==='up'?1:-1));
  $$('[data-market-purchase]').forEach(button=>button.onclick=()=>openMarketPurchase(button.dataset.marketPurchase));
  render();
}
function showMarketFloorNotice(text){
  const notice=$('#marketFloorNotice');
  if(!notice)return;
  clearTimeout(marketFloorNoticeTimer);
  notice.textContent=text;
  notice.classList.add('show');
  marketFloorNoticeTimer=setTimeout(()=>notice.classList.remove('show'),2200);
}
function changeMarketFloor(direction){
  if(currentMarketTab==='treasure')return;
  const current=marketFloors[currentMarketTab]||1;
  const next=Math.max(1,Math.min(5,current+direction));
  if(next===current)return;
  if(next>current){
    const requiredStar=marketFloorStars[next-1];
    const requiredLevel=sectCatalog.find(group=>group.star===requiredStar)?.need??0;
    if(state.spiritLevel<requiredLevel){
      showMarketFloorNotice(`需達到${realmName(requiredLevel,spiritRealms)}才可上樓`);
      return;
    }
  }
  marketFloors[currentMarketTab]=next;
  renderMarket(currentMarketTab);
}
function resetMarketNavigation(){currentMarketTab='market';Object.keys(marketFloors).forEach(tab=>marketFloors[tab]=1)}
function switchMarketTab(tab){if(Object.prototype.hasOwnProperty.call(marketFloors,tab))marketFloors[tab]=1;renderMarket(tab)}
function openMarket(){
  $('#gameMenu').classList.add('hidden');
  resetMarketNavigation();
  lastScriptureDayKey=dateKey()||'local';
  renderMarket('market');
  $('#marketModal').classList.remove('hidden');
}
function closeMarket(){
  closeMarketPurchase();
  $('#marketModal').classList.add('hidden');
  resetMarketNavigation();
}

load();normalizeSwordPath();normalizeBodyPath();ensureTestTemporaryItemsMail();ensureTestResourceSupplyMail();ensureTestFoodAuraSupplyMail();ensureTestSpiritMedicineMail();
try{const existing=JSON.parse(localStorage.getItem(saveKey));if(state.name&&(!existing||!Object.prototype.hasOwnProperty.call(existing,'cultivationAwakened')))state.cultivationAwakened=true}catch{}
setClockAnchor(state.lastTrustedTime||Math.min(state.lastSave||Date.now(),Date.now()),location.protocol==='file:');
if(state.sect&&!validSectNpcSnapshot()){state.sectNpcSnapshot=createSectNpcSnapshot();save()}
$('#titleHint').textContent=state.name?'點擊螢幕繼續修煉':'點擊螢幕進入遊戲';
$('#titleScreen').onclick=enterFromTitle;
$('#titleScreen').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();enterFromTitle()}};
$('#prologueScreen').onclick=finishCreationPrologue;
$('#prologueScreen').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();finishCreationPrologue()}};
$('#backTitleBtn').onclick=()=>{startBgm('title');show('#titleScreen')};
$$('.gender').forEach(b=>b.onclick=()=>{$$('.gender').forEach(x=>x.classList.remove('active'));b.classList.add('active');createGender=b.dataset.gender;updateCreator()});
$$('.appearance-choice').forEach(b=>b.onclick=()=>{$$('.appearance-choice').forEach(x=>x.classList.remove('active'));b.classList.add('active');createAppearance=+b.dataset.appearance;updateCreator()});
$$('.outfit-choice').forEach(b=>b.onclick=()=>{$$('.outfit-choice').forEach(x=>x.classList.remove('active'));b.classList.add('active');createOutfit=+b.dataset.style;updateCreator()});
function updateOriginPreview(){$('#originStats').textContent=originDescriptions[createOrigin]}
$$('.origin-choice').forEach(b=>b.onclick=()=>{$$('.origin-choice').forEach(x=>x.classList.remove('active'));b.classList.add('active');createOrigin=b.dataset.origin;updateOriginPreview()});
$('#createBtn').onclick=()=>{const n=$('#nameInput').value.trim();if(!n){$('#nameError').textContent='請輸入暱稱';return}const now=gameNow();state={...defaults,...originProfiles[createOrigin],name:n,gender:createGender,appearance:createAppearance,hair:1,outfit:createOutfit,origin:createOrigin,bornAt:now,lastSave:now};Object.keys(tribulationPillDefaults).forEach(key=>state[key]=200);state.mailbox=[createWelcomeMail(now)];ensureTestTemporaryItemsMail();ensureTestResourceSupplyMail();ensureTestFoodAuraSupplyMail();ensureTestSpiritMedicineMail();startGame();save()};
$('#spiritUp').onclick=()=>upgrade('spirit'); $('#swordUp').onclick=()=>upgrade('sword'); $('#bodyUp').onclick=()=>openExperienceView('body');
$('#tribConfirm').onclick=tribulate; $('#tribCancel').onclick=()=>$('#tribulationModal').classList.add('hidden');
$('#tribulationExit').onclick=exitTribulationResult;
$('#tribPillMinus').onclick=()=>adjustTribulationPills(-1);$('#tribPillPlus').onclick=()=>adjustTribulationPills(1);$('#tribPillMax').onclick=maximizeTribulationPills;
$('#heroCharacterHotspot').onclick=openHeroCharacterAttributes;
$$('.feature-tab').forEach(b=>b.onclick=()=>toggleFeature(b));
$('#menuBtn').onclick=()=>$('#gameMenu').classList.toggle('hidden');
$('#settingsBtn').onclick=openSettings;
$('#helpBtn').onclick=openHelp;
$('#settingsCloseBtn').onclick=()=>$('#settingsModal').classList.add('hidden');
$('#helpCloseBtn').onclick=()=>$('#helpModal').classList.add('hidden');
$('#marketButton').onclick=openMarket;
$('#mailButton').onclick=openMailbox;
$('#mailboxCloseBtn').onclick=closeMailbox;
$('#mailDetailCloseBtn').onclick=closeMailDetail;
$('#mailClaimBtn').onclick=claimMailAttachments;
$('#mailDeleteBtn').onclick=deleteCurrentMail;
$('#marketCloseBtn').onclick=closeMarket;
$$('[data-market-tab]').forEach(button=>button.onclick=()=>switchMarketTab(button.dataset.marketTab));
$('#marketPurchaseCancel').onclick=closeMarketPurchase;
$('#marketPurchaseConfirm').onclick=confirmMarketPurchase;
$('#marketPurchaseMin').onclick=()=>{marketPurchaseQuantity=1;updateMarketPurchaseModal()};
$('#marketPurchaseMinus').onclick=()=>{marketPurchaseQuantity--;updateMarketPurchaseModal()};
$('#marketPurchasePlus').onclick=()=>{marketPurchaseQuantity++;updateMarketPurchaseModal()};
$('#marketPurchaseMax').onclick=()=>{marketPurchaseQuantity=Math.max(1,marketPurchaseCapacity(marketPurchaseOffer));updateMarketPurchaseModal()};
$('#itemModalClose').onclick=closeItemModal;
$('#itemMinBtn').onclick=()=>{itemModalQuantity=1;updateItemQuantity()};
$('#itemMinusBtn').onclick=()=>{itemModalQuantity--;updateItemQuantity()};
$('#itemPlusBtn').onclick=()=>{itemModalQuantity++;updateItemQuantity()};
$('#itemMaxBtn').onclick=()=>{const item=itemCatalog[itemModalKey];if(item)itemModalQuantity=state[item.count]||1;updateItemQuantity()};
$('#sellCancelBtn').onclick=closeSellModal;
$('#sellConfirmBtn').onclick=confirmSellItem;
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
$('#deleteFinalBtn').onclick=()=>{suppressSave=true;sessionOnline=false;clearTimeout(battleTimer);clearSwordTrialAdvance();battle=null;stopAllBgm();localStorage.removeItem(saveKey);localStorage.removeItem('wendao-idle-v1');state={...defaults,name:'',bornAt:null,lastSave:gameNow()};location.reload()};
$('#backToTitle').onclick=()=>{save();$('#gameMenu').classList.add('hidden');$('#settingsModal').classList.add('hidden');$('#helpModal').classList.add('hidden');$('#marketModal').classList.add('hidden');$('#marketPurchaseModal').classList.add('hidden');$('#titleHint').textContent='點擊螢幕繼續修煉';show('#titleScreen');startBgm('title')};
$('#backToTitle').addEventListener('click',()=>{$('#mailboxModal').classList.add('hidden');$('#mailDetailModal').classList.add('hidden');currentMailId=null});
$('#muteBtn').onclick=()=>{state.muted=!state.muted;updateBgmVolume();render();save()};
$('#battleExitBtn').onclick=forceEndBattle;
$('#battleResultNext').onclick=advanceSwordTrial;
$('#battleResultClose').onclick=closeBattle;
document.addEventListener('contextmenu',event=>{if(event.target.closest?.('img'))event.preventDefault()});
document.addEventListener('dragstart',event=>{if(event.target.closest?.('img'))event.preventDefault()});
$('#manualCultivateBtn').onclick=beginManualCultivation;
setInterval(()=>{if($('#gameScreen').classList.contains('active')){if(state.cultivationAwakened){addAura(auraRate());runSettlementTick();processSectYears();addCultivation(rate())}if(currentFeature==='root')renderSpiritRootView(currentRootView);if(currentFeature==='cave'&&state.spiritLevel>=10)renderCavePanel(currentCaveView);if(currentFeature==='sect'&&currentSectView!=='npcs')renderSectPanel(currentSectView);if(currentFeature==='arts')updateArtsLive();tickStart=gameNow()}},5000);
setInterval(()=>{if($('#gameScreen').classList.contains('active'))$('#tickBar').style.width=Math.min(100,(gameNow()-tickStart)/50)+'%'},50);
setInterval(()=>{if($('#gameScreen').classList.contains('active'))$('#yearsElapsed').textContent=`${experiencedYears().toLocaleString()} 年`},1000);
setInterval(updatePracticeTimers,1000);
setInterval(()=>{const today=dateKey()||'local';if(today!==lastScriptureDayKey){lastScriptureDayKey=today;if(!$('#marketModal').classList.contains('hidden')&&['scripture','reputation'].includes(currentMarketTab))renderMarket(currentMarketTab)}},1000);
setInterval(()=>{if(sessionOnline&&!document.hidden)syncTrustedTime()},600000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)forceOffline();else finishPause()});
window.addEventListener('blur',forceOffline);window.addEventListener('focus',finishPause);window.addEventListener('pagehide',forceOffline);
window.addEventListener('beforeunload',()=>{if(!suppressSave)save()}); updateCreator(); updateOriginPreview(); render();
