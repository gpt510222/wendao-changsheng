/* 道侶十章與結緣後洞府系統。此檔先載入，函式於 game.js 完成初始化後呼叫。 */
const partnerChapterNames=['山間血跡','故人未識','同路一程','故人來訪','來而有往','久無音訊','旁觀者清','無事相尋','各有其道','與君同行'];
const partnerScenes=['forest','market','mountain-road','cave-exterior','cultivation-platform','market','market','cave-interior','mountain-road','cave-exterior'];
const partnerDelays=[[192,576],[120,360],[240,720],[480,1200],[720,1800],[960,1920],[480,1200],[480,960],[240,600],[120,360]];
const partnerPersonalities={warm:'溫和',reserved:'清冷',free:'灑脫',devoted:'執著'};
const partnerRoutes={qi:'練氣',sword:'淬劍',body:'煉體'};
const partnerStateNames={rest:'休憩',cultivate:'修煉',seclusion:'閉關',travel:'遊歷'};
const partnerStoryData=[
 {intro:'山林雨後，石階旁一道血跡蜿蜒入林。循跡而去，一名陌生修士倚樹而坐，仍警惕地護著懷中玉符。',steps:[
  {speaker:'旁白',text:'血跡尚新，林中卻沒有求救聲。',choices:[['循著血跡查看',0,0],['暫且離去',0,0,'leave']]},
  {speaker:'陌生修士',text:'「若是來取我性命，便不必多言。」對方氣息紊亂，手仍未離開兵刃。',choices:[['替其療傷',0,0],['先辨傷勢與來路',0,0],['移至避雨處',0,0]]},
  {speaker:'陌生修士',text:'傷勢稍穩，對方取出一枚空白身份玉牌，似在等你問名。',name:true},
  {speaker:'同道人',text:'「今日之事，我會記得。」',choices:[['等到傷勢穩定再走',0,0],['留下傷藥',0,0],['替其尋一處藏身地',0,0]]}
 ]},
 {intro:'坊市人潮中，那道曾在山林見過的身影停在舊地圖攤前。若當日未曾相救，這便是你們真正的初見。',steps:[
  {speaker:'同道人',text:'「我在找一條失落的古道，你可曾聽聞？」',choices:[['陪同尋找',1,1],['給出線索',1,1],['由其自行處理',0,-1]]},
  {speaker:'同道人',text:'事情告一段落後，對方忽然問起你這些年的修行。',choices:[['尚好，只是偶有疲憊',1,0],['修行而已，無甚可說',0,1],['發生不少事，慢慢說來',1,0]]}
 ]},
 {intro:'離開坊市後，你們恰巧同赴一處古道。山風很長，沉默也並不難熬。',steps:[
  {speaker:'同道人',text:'「既然同路，要不要一起走？」',choices:[['並肩同行',1,0],['約定彼此照應但各走各的',0,1],['獨自上路',-1,0]]},
  {speaker:'旁白',text:'途中有凡人受困崖下，而天色正迅速轉壞。',choices:[['立刻救人',0,1],['先察地勢再救',0,2],['不涉此因果',0,-1]]},
  {speaker:'同道人',text:'崖後藏有一株罕見靈草，兩人同時看見。',choices:[['交由對方處置',1,0],['平分所得',1,2],['各憑本事',0,1],['留作共同路資',1,2]]}
 ]},
 {intro:'某日洞府外傳來叩門聲。來者沒有傳訊，只帶著一壺尚溫的茶。',steps:[
  {speaker:'同道人',text:'「路過此地，想起你在這裡。」',choices:[['請入洞府',2,1],['在門外小坐',1,1],['今日不便相見',0,1,'skip']]},
  {speaker:'同道人',text:'「若有一日，我把性命託在你手上呢？」',choices:[['我會接住',1,1],['先問清因果，再與你共擔',0,2],['你的路仍該由你自己走',0,1]]},
  {speaker:'同道人',text:'「你覺得我們如今算是什麼？」',choices:[['可信之人',0,1],['難得的知己',1,1],['我在意的人',2,0],['只是同道',-1,0]]}
 ]},
 {intro:'修煉台上靈氣翻湧，你行功至緊要處時，對方恰好來訪。',steps:[
  {speaker:'同道人',text:'「你氣息不穩。若信得過我，我替你守住靈台。」',choices:[['全心相託',2,2,'rely'],['只請其護法',1,0],['婉拒相助',-1,0]]},
  {speaker:'同道人',text:'危機過後，對方把手收回，神情仍有些緊繃。',choices:[['道謝',1,0],['握住那隻尚未放鬆的手',2,0],['談論方才的功法',0,1],['當作無事發生',-1,0]]},
  {speaker:'同道人',text:'「下一次，也別什麼都自己扛。」',choices:[['答應',2,0,'rely'],['我會斟酌',1,1],['不必擔心我',-1,0],['你也是',1,1]]}
 ]},
 {intro:'坊市傳聞有人在險地見過熟悉的身影，此後數百年再無音訊。',steps:[
  {speaker:'旁白',text:'消息真假難辨，你決定如何做？',choices:[['親自尋找',1,1,'care'],['託人四處打聽',1,0,'care'],['留下只有對方看得懂的訊息',1,1,'care'],['相信對方自會歸來',0,1]]},
  {speaker:'同道人',text:'你終於在歸途遇見對方。那人安然無恙，只是風塵滿身：「若再有一次，你還會找嗎？」',choices:[['會，因為是你',2,0],['至少要知道你是否平安',1,1],['若你不希望，我會尊重',0,2],['未必',-1,0]]}
 ]},
 {intro:'坊市酒樓裡，店家自然地把你們安排在同席，笑稱二位果然又一同來了。',steps:[
  {speaker:'路人',text:'「二位道侶今日也照舊？」空氣忽然安靜。',choices:[['含笑不否認',2,0],['尚未到那一步',1,1,'possible'],['只是同行之人',-1,0],['看向對方，讓其回答',0,1]]},
  {speaker:'同道人',text:'離開後，對方問：「這種事，應當由旁人來定嗎？」',choices:[['自然要兩人都願意',1,2],['稱呼而已，不必在意',0,0],['若是你，我並不排斥',2,1,'possible']]}
 ]},
 {intro:'沒有急事、沒有異象，也沒有需要交換的東西。對方只是在傍晚來到你的洞府。',steps:[
  {speaker:'同道人',text:'「今日無事，只想來坐坐。」',choices:[['請其入內',2,0],['取茶對坐',1,1],['笑問是否當真無事',1,0],['繼續修煉',-1,1]]},
  {speaker:'同道人',text:'談話兜轉回初見之日。原來許多細節，對方都還記得。',choices:[['我也記得',2,0],['那時不曾想會走到今日',1,1],['往事已遠',0,1]]},
  {speaker:'同道人',text:'月上枝頭，對方起身告辭。',choices:[['有空再來',1,1,'welcome'],['送至洞府外',1,0],['道一聲珍重',0,1]]}
 ]},
 {intro:'古道將分岔。對方要獨自去一處危險秘境，這不是邀請，也不是試探。',steps:[
  {speaker:'同道人',text:'「這一段路，我必須自己走。」',choices:[['尊重選擇，也說明牽掛',1,2],['坦言擔心',2,0],['堅持同行',1,-1],['只道一聲珍重',0,1]]},
  {speaker:'旁白',text:'等待沒有回音的日子裡，你如何安置這份心？',choices:[['照常修行，為其留燈',1,2],['每隔一段歲月傳訊',1,1],['親赴入口等候',2,0],['不再等待',-2,0]]},
  {speaker:'同道人',text:'多年後，那道身影終於從山霧裡走回來：「我回來了。」',choices:[['回來便好',2,1],['你的路，可曾走明白？',0,2],['下次先告訴我',1,1]]}
 ]},
 {intro:'夕陽落在洞府外。走過漫長歲月，有些話終究要由其中一人先說。',steps:[]}
];

function partnerClamp(value){return Math.max(-5,Math.min(5,Math.round(Number(value)||0)))}
function partnerChoice(label,bond=0,accord=0,flag=''){return {label,bond,accord,flag,path:'balance',rewards:[]}}
function partnerNormalize(){
 if(state.partnerStory){const s=state.partnerStory;s.bond=partnerClamp(s.bond);s.accord=partnerClamp(s.accord);s.flags=s.flags&&typeof s.flags==='object'?s.flags:{};s.memories=Array.isArray(s.memories)?s.memories:[];s.chapter=Math.max(0,Math.min(10,Math.floor(s.chapter||0)));s.nextYear=Math.max(0,Math.floor(s.nextYear||0))}
 if(state.partnerSystem?.established){const p=state.partnerSystem;p.milestones=p.milestones||{};p.companionCultivation=p.companionCultivation||{cooldownEndYear:0,activeBuff:null};p.lastResolvedYear=Math.max(0,Math.floor(p.lastResolvedYear||experiencedYears()));if(!p.state?.type)partnerBeginState('rest',true)}
}
function partnerCreateStory(year){const genders=state.gender==='男'?['女']:['男'],routes=['qi','sword','body'],personalities=Object.keys(partnerPersonalities);state.partnerStory={id:`fated-${state.name}-${state.bornAt}`,name:'',gender:genders[0],route:routes[Math.floor(Math.random()*3)],personality:personalities[Math.floor(Math.random()*4)],bond:0,accord:0,flags:{},memories:[],chapter:0,nextYear:year,ending:'',completed:false}}
function partnerProcess(year=experiencedYears()){
 if(!state.partnerStory&&year>=192)partnerCreateStory(year);
 const story=state.partnerStory;if(story&&!story.completed&&story.chapter<10&&year>=story.nextYear&&!state.encounterQueue.some(e=>e.kind==='partner')){const chapter=story.chapter+1;state.encounterQueue.unshift(partnerMakeEvent(chapter));updateEncounterButton()}
 partnerResolveRuntime(year);
}
function partnerMakeEvent(chapter){const data=partnerStoryData[chapter-1],step=0;return {id:`partner-${chapter}-${Date.now()}`,kind:'partner',chapter,step,title:`第${['一','二','三','四','五','六','七','八','九','十'][chapter-1]}章・${partnerChapterNames[chapter-1]}`,text:data.intro,choices:[partnerChoice('繼續')]}}
function partnerArt(kind='dialogue'){const gender=state.partnerStory?.gender||state.partnerSystem?.partner?.gender||'女';return `assets/qstyle-v2/partner/partner-${gender==='男'?'male':'female'}-${kind}-v1.png`}
function partnerScene(chapter){return `assets/qstyle-v2/partner/bg-${partnerScenes[chapter-1]}-v1.png`}
function partnerDisplayName(){return state.partnerStory?.name||state.partnerSystem?.partner?.name||'陌生修士'}
function partnerRenderEncounter(event,content){
 const story=state.partnerStory,data=partnerStoryData[event.chapter-1];
 if(event.chapter===10)return partnerRenderEnding(event,content);
 const step=data.steps[event.step],intro=event.step===0?`<p class="partner-prose">${data.intro}</p>`:'',speaker=step?.speaker==='同道人'?partnerDisplayName():step?.speaker||'旁白';
 if(step?.name){content.innerHTML=`<section class="partner-story" style="--partner-scene:url('${partnerScene(event.chapter)}')"><img class="partner-dialogue-art" src="${partnerArt('dialogue')}" alt="${story.gender}修士半身像"><div class="partner-dialogue-card">${intro}<small>${event.title}</small><h2>${speaker}</h2><p>${step.text}</p><label class="partner-name-field">為這位${story.gender}修士題名<input id="partnerNameInput" maxlength="8" placeholder="輸入姓名"></label><button id="partnerNameConfirm" class="jade-button">記下姓名</button></div></section>`;document.querySelector('#partnerNameConfirm').onclick=()=>partnerConfirmName(event);return}
 const choices=(step?.choices||[]).map(args=>partnerChoice(...args));event.choices=choices;
 content.innerHTML=`<section class="partner-story" style="--partner-scene:url('${partnerScene(event.chapter)}')"><img class="partner-dialogue-art" src="${partnerArt('dialogue')}" alt="${story.gender}修士半身像"><div class="partner-dialogue-card">${intro}<small>${event.title}・${partnerRoutes[story.route]}・${partnerPersonalities[story.personality]}</small><h2>${speaker}</h2><p>${step.text}</p><div class="encounter-choices">${choices.map((c,i)=>`<button data-encounter-choice="${i}"><b>${c.label}</b></button>`).join('')}</div></div></section>`;document.querySelectorAll('[data-encounter-choice]').forEach(b=>b.onclick=()=>partnerResolveChoice(event,+b.dataset.encounterChoice))
}
function partnerConfirmName(event){const input=document.querySelector('#partnerNameInput'),name=(input?.value||'').trim().slice(0,8);if(!name)return toast('請先替這位修士記下姓名');state.partnerStory.name=name;event.step++;renderEncounterModal();save()}
function partnerResolveChoice(event,index){const data=partnerStoryData[event.chapter-1],step=data.steps[event.step],raw=step?.choices?.[index];if(!raw)return;const [label,bond=0,accord=0,flag='']=raw,story=state.partnerStory;story.chapterBond=(story.chapterBond||0)+bond;story.chapterAccord=(story.chapterAccord||0)+accord;if(flag)story.flags[flag]=true;story.memories.push({chapter:event.chapter,label,year:experiencedYears()});if(flag==='leave'&&event.chapter===1){if(!story.name)story.name=story.gender==='男'?'沈硯':'蘇晚';return partnerFinishChapter(event,label,'你沒有循跡入林。這段緣分並未消失，只是把真正的初見留給了下一次。')}event.step++;if(event.step>=data.steps.length)return partnerFinishChapter(event,label,'此章已記入歲月。');renderEncounterModal();save()}
function partnerFinishChapter(event,choice,result){const story=state.partnerStory,delta=v=>v>=2?1:v<=-2?-1:0;story.bond=partnerClamp(story.bond+delta(story.chapterBond||0));story.accord=partnerClamp(story.accord+delta(story.chapterAccord||0));story.chapterBond=0;story.chapterAccord=0;story.chapter=event.chapter;const delay=partnerDelays[Math.min(9,event.chapter)],range=delay||[120,360];story.nextYear=experiencedYears()+range[0]+Math.floor(Math.random()*(range[1]-range[0]+1));state.encounterHistory.unshift({title:event.title,choice,result,year:experiencedYears(),at:gameNow(),tags:['life','partner']});state.encounterHistory=state.encounterHistory.slice(0,60);state.encounterQueue.shift();render();renderEncounterModal();updateEncounterButton();save();toast(`${event.title}・已收入歲月錄`)}
function partnerEndingEligible(){const s=state.partnerStory,flags=['rely','care','possible','welcome'].filter(k=>s.flags[k]).length;return s.bond>=3&&s.accord>=3&&flags>=2}
function partnerRenderEnding(event,content){const s=state.partnerStory,eligible=partnerEndingEligible(),ending=eligible?'兩心同道':s.bond>=3?'有情未同道':s.accord>=3?'同道未有情':'各自長生';const question=eligible?`「${state.name}，往後的長生路，你可願與我同行？」`:`你們在夕照中說完最後一段話。此心或近、此道或同，卻終究沒有走成同一條路。`;event.choices=eligible?[partnerChoice('我願意'),partnerChoice('仍選擇獨行')]:[partnerChoice('記住這段歲月')];content.innerHTML=`<section class="partner-story partner-ending" style="--partner-scene:url('${partnerScene(10)}')"><img class="partner-dialogue-art" src="${partnerArt('dialogue')}" alt="${s.gender}修士半身像"><div class="partner-dialogue-card"><small>${event.title}・${ending}</small><h2>${partnerDisplayName()}</h2><p>${question}</p><div class="encounter-choices">${event.choices.map((c,i)=>`<button data-partner-ending="${i}"><b>${c.label}</b></button>`).join('')}</div></div></section>`;document.querySelectorAll('[data-partner-ending]').forEach(b=>b.onclick=()=>partnerResolveEnding(event,+b.dataset.partnerEnding))}
function partnerResolveEnding(event,index){const s=state.partnerStory,accepted=partnerEndingEligible()&&index===0;s.chapter=10;s.completed=true;s.ending=accepted?'與君同行':partnerEndingEligible()?'自選獨行':s.bond>=3?'有情未同道':s.accord>=3?'同道未有情':'各自長生';if(accepted)partnerEstablish();state.encounterHistory.unshift({title:event.title,choice:s.ending,result:accepted?`${partnerDisplayName()}自此成為你的道侶。`:'你們將這段相逢收進各自的歲月。',year:experiencedYears(),at:gameNow(),tags:['life','partner']});state.encounterQueue.shift();render();renderEncounterModal();updateEncounterButton();save();toast(accepted?'同心結已成・洞府道侶頁開啟':'緣起緣落，皆為長生路')}

function partnerEstablish(){const s=state.partnerStory,year=experiencedYears();state.partnerSystem={established:true,partneredAtYear:year,partner:{id:s.id,name:s.name,gender:s.gender,route:s.route,personality:s.personality,realm:Math.max(1,Math.min(9,worldProgressTier())),cultivationProgress:0},state:null,companionCultivation:{cooldownEndYear:0,activeBuff:null},milestones:{firstCompanionCultivationDone:false,firstSeclusionDone:false,firstTravelDone:false},lastResolvedYear:year};partnerBeginState('rest',true)}
function partnerStateDuration(type,first=false){if(first)return [96,120,144,168,192][Math.floor(Math.random()*5)];const ranges={rest:[48,144],cultivate:[96,240],seclusion:[240,720],travel:[144,480]},r=ranges[type],values=[];for(let n=r[0];n<=r[1];n+=24)values.push(n);return values[Math.floor(Math.random()*values.length)]}
function partnerChooseState(){const p=state.partnerSystem,weights={warm:[30,35,15,20],reserved:[20,35,25,20],free:[25,20,10,45],devoted:[10,40,40,10]}[p.partner.personality],types=['rest','cultivate','seclusion','travel'],allowed=types.filter(t=>!(t===p.state?.type&&(t==='seclusion'||t==='travel')));let pool=allowed.map(t=>[t,weights[types.indexOf(t)]]),total=pool.reduce((a,[,w])=>a+w,0),roll=Math.random()*total;for(const [t,w] of pool){roll-=w;if(roll<=0)return t}return 'rest'}
function partnerBeginState(type=partnerChooseState(),first=false,start=experiencedYears()){const p=state.partnerSystem,duration=partnerStateDuration(type,first);p.state={type,startYear:start,endYear:start+duration,previousType:p.state?.type||'',consecutiveRestOrCultivate:['rest','cultivate'].includes(type)&&p.state?.type===type?(p.state.consecutiveRestOrCultivate||1)+1:1,destinationType:type==='travel'?['訪古','尋藥','觀海','問劍'][Math.floor(Math.random()*4)] :''}}
function partnerResolveRuntime(year=experiencedYears()){const p=state.partnerSystem;if(!p?.established)return;partnerRefreshBuff(year);let guard=0;while(p.state&&year>=p.state.endYear&&guard++<1000){const duration=p.state.endYear-p.state.startYear,mult={rest:.75,cultivate:1,seclusion:1.1,travel:.95}[p.state.type];p.partner.cultivationProgress+=duration*mult;if(p.state.type==='seclusion'&&duration>=480&&!p.milestones.firstSeclusionDone){p.milestones.firstSeclusionDone=true;partnerLog('閉關歲月',`${p.partner.name}完成了一次漫長閉關。`)}if(p.state.type==='travel'&&duration>=360&&!p.milestones.firstTravelDone){p.milestones.firstTravelDone=true;partnerLog('遠遊歸來',`${p.partner.name}自漫長遊歷中歸來。`)}while(p.partner.realm<9&&p.partner.cultivationProgress>=p.partner.realm*900){p.partner.cultivationProgress-=p.partner.realm*900;p.partner.realm++;partnerLog('道侶破境',`${p.partner.name}踏入${p.partner.realm}境。`)}const end=p.state.endYear,next=partnerChooseState();partnerBeginState(next,false,end)}p.lastResolvedYear=year}
function partnerLog(title,result){state.encounterHistory.unshift({title,choice:partnerDisplayName(),result,year:experiencedYears(),at:gameNow(),tags:['partner']});state.encounterHistory=state.encounterHistory.slice(0,60)}
function partnerRefreshBuff(year=experiencedYears()){const c=state.partnerSystem?.companionCultivation;if(c?.activeBuff&&year>=c.activeBuff.endYear)c.activeBuff=null}
function partnerRouteMultiplier(route){const c=state.partnerSystem?.companionCultivation;partnerRefreshBuff();return c?.activeBuff?.route===route?1.03:1}
function partnerCompanionPractice(route){const p=state.partnerSystem,year=experiencedYears();if(!p?.established||!['rest','cultivate'].includes(p.state.type))return toast('道侶目前不在洞府，無法共同修煉');if(year<(p.companionCultivation.cooldownEndYear||0))return toast('同修心境尚未平復');const unlocked={qi:state.spiritPathOpened,sword:state.swordPathOpened,body:state.bodyPathOpened};if(!unlocked[route])return;p.companionCultivation.cooldownEndYear=year+192;p.companionCultivation.activeBuff={route,startYear:year,endYear:year+96,bonus:.03};if(!p.milestones.firstCompanionCultivationDone){p.milestones.firstCompanionCultivationDone=true;partnerLog('初次同修',`${state.name}與${p.partner.name}第一次並肩參悟。`)}save();renderCavePanel('partner');toast(`${partnerPracticeName(route,p.partner.route)}・${partnerRoutes[route]}效率提升3%（96年）`)}
function partnerPracticeName(a,b){const pair=[a,b].sort().join('-'),map={'qi-qi':'對坐論氣','sword-sword':'互證劍勢','body-body':'對練磨身','qi-sword':'氣劍相證','body-qi':'氣血相參','body-sword':'劍身互證'};return map[pair]||'同參大道'}
function partnerRenderCave(inner){const p=state.partnerSystem;if(!inner||!p?.established)return;partnerResolveRuntime();const year=experiencedYears(),s=p.state,can=['rest','cultivate'].includes(s.type),remaining=Math.max(0,s.endYear-year),vague=remaining<=48?'歸期將近':remaining<=144?'尚需一段時日':'歸期未定',active=p.companionCultivation.activeBuff,unlocked=[['qi','練氣'],['sword','淬劍'],['body','煉體']].filter(([k])=>({qi:state.spiritPathOpened,sword:state.swordPathOpened,body:state.bodyPathOpened}[k]));inner.innerHTML=`<section class="partner-cave"><div class="partner-cave-scene"><img src="assets/qstyle-v2/partner/bg-cave-interior-v1.png" alt="洞府內景"><img class="partner-full-art" src="${partnerArt('full')}" alt="${p.partner.name}全身像"></div><header><small>結為道侶 ${Math.max(0,year-p.partneredAtYear)} 年</small><h2>${p.partner.name}</h2><p>${partnerRoutes[p.partner.route]}・${p.partner.realm}境・${partnerPersonalities[p.partner.personality]}</p></header><div class="partner-status"><article><small>當前行止</small><b>${partnerStateNames[s.type]}</b><span>已過 ${Math.max(0,year-s.startYear)} 年・${vague}</span></article><article><small>同修狀態</small><b>${active?`${partnerRoutes[active.route]} +3%`:'尚無加持'}</b><span>${active?`餘約 ${Math.max(0,active.endYear-year)} 年`:`${Math.max(0,(p.companionCultivation.cooldownEndYear||0)-year)} 年後可再同修`}</span></article></div><section class="partner-practice"><h3>${can?'與君同修':'洞府空席'}</h3><p>${can?'選擇自己已開啟的一途，共參九十六年；同一時間只保留一種加持。':`${p.partner.name}正在${partnerStateNames[s.type]}，待其歸來再一同修行。`}</p><div>${unlocked.map(([k,n])=>`<button data-partner-practice="${k}" ${can&&year>=(p.companionCultivation.cooldownEndYear||0)?'':'disabled'}>${partnerPracticeName(k,p.partner.route)}<small>${n}效率 +3%</small></button>`).join('')}</div></section></section>`;document.querySelectorAll('[data-partner-practice]').forEach(b=>b.onclick=()=>partnerCompanionPractice(b.dataset.partnerPractice))}

let partnerHistoryFilter='life';
function partnerRenderHistory(content){const partnered=!!state.partnerSystem?.established,tabs=[['cultivation','修練'],['life','歲月']];if(partnered)tabs.push(['partner','道侶']);if(!tabs.some(([k])=>k===partnerHistoryFilter))partnerHistoryFilter='life';const entries=(state.encounterHistory||[]).filter(e=>(e.tags||['life']).includes(partnerHistoryFilter));content.innerHTML=`<p class="eyebrow">歲月錄</p><h2>往事留痕</h2><nav class="partner-history-tabs">${tabs.map(([k,n])=>`<button data-history-filter="${k}" class="${k===partnerHistoryFilter?'active':''}">${n}</button>`).join('')}</nav><div class="encounter-history">${entries.length?entries.map(e=>`<article><b>${e.title}</b><span>${e.choice||''}</span><small>${e.result||''}</small></article>`).join(''):'<p>此卷尚是一片空白。</p>'}</div>`;document.querySelectorAll('[data-history-filter]').forEach(b=>b.onclick=()=>{partnerHistoryFilter=b.dataset.historyFilter;partnerRenderHistory(content)})}
