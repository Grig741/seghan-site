/* SEGHAN: движок приглашения. Общий для демо и для бэкенда (web/static/invite-engine.js). */
(function(){
function wrap(inner,w){return '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round">'+inner+'</svg>'}
function rot(n,fn){var s="";for(var i=0;i<n;i++)s+='<g transform="rotate('+(i*360/n).toFixed(2)+' 50 50)">'+fn(i)+'</g>';return s}
var ORN={
  rosette:function(n){return '<circle cx="50" cy="50" r="47"/><circle cx="50" cy="50" r="40" opacity=".5"/><circle cx="50" cy="50" r="6"/>'+rot(n,function(){return '<path d="M50 50C44 36 44 20 50 6C56 20 56 36 50 50Z"/><circle cx="50" cy="13" r="1.6"/>'})},
  eternity:function(n){return '<circle cx="50" cy="50" r="47" opacity=".6"/>'+rot(n,function(){return '<path d="M50 50C50 38 58 30 66 30C74 30 78 38 74 44"/><path d="M50 50C50 42 54 37 59 37" opacity=".6"/>'})+'<circle cx="50" cy="50" r="4"/>'},
  star:function(n){var p="",k;for(k=0;k<n*2;k++){var a=Math.PI*k/n-Math.PI/2,r=k%2?22:44;p+=(k?"L":"M")+(50+r*Math.cos(a)).toFixed(2)+" "+(50+r*Math.sin(a)).toFixed(2)}return '<path d="'+p+'Z"/><circle cx="50" cy="50" r="16"/><circle cx="50" cy="50" r="47" opacity=".5"/>'+rot(n,function(){return '<circle cx="50" cy="4" r="1.4"/>'})},
  pomegranate:function(){return '<circle cx="50" cy="50" r="47" opacity=".5"/><path d="M50 22l-5-8 5 3 5-3-5 8"/><path d="M50 22C30 22 22 38 22 54C22 72 35 84 50 84C65 84 78 72 78 54C78 38 70 22 50 22Z"/>'+[[40,46],[50,42],[60,46],[36,58],[46,56],[56,56],[64,60],[42,68],[52,68],[60,72],[48,78]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3"/>'}).join("")},
  wreath:function(n){return rot(n,function(){return '<path d="M50 8C55 12 56 18 50 22C44 18 45 12 50 8Z"/><path d="M50 22v3" opacity=".6"/>'})+'<circle cx="50" cy="50" r="30" opacity=".6"/><circle cx="50" cy="50" r="8"/>'},
  sun:function(n){return '<circle cx="50" cy="50" r="18"/><circle cx="50" cy="50" r="11" opacity=".6"/>'+rot(n,function(i){return '<path d="M50 '+(i%2?14:8)+'V26"/>'})+'<circle cx="50" cy="50" r="47" opacity=".4"/>'},
  bloom:function(n){return rot(n,function(){return '<circle cx="50" cy="32" r="18"/>'})+'<circle cx="50" cy="50" r="36" opacity=".5"/><circle cx="50" cy="50" r="47" opacity=".5"/>'},
  grapes:function(){var s='<circle cx="50" cy="50" r="47" opacity=".5"/><path d="M50 18v8M50 22c6-6 14-6 18-2c-6 1-12 2-18-2"/>',r=[[3,30],[4,38],[3,46],[2,54],[1,62]],y,i;for(y=0;y<r.length;y++)for(i=0;i<r[y][0];i++)s+='<circle cx="'+(50+(i-(r[y][0]-1)/2)*9)+'" cy="'+(r[y][1]+4)+'" r="4.4"/>';return s},
  arch:function(){return '<path d="M20 86V44a30 30 0 0 1 60 0v42"/><path d="M28 86V46a22 22 0 0 1 44 0v40" opacity=".6"/><path d="M14 86h72"/><path d="M50 30l4 6-4 6-4-6Z"/><circle cx="50" cy="58" r="8"/><path d="M50 50v16M42 58h16" opacity=".6"/>'}
};
function orn(kind,n,w){return wrap(ORN[kind](n||12),w||1.2)}

/* ---------- 40 тем: [название, лист, чернила, акцент, линии, второй цвет, фон, орнамент, лучи, шрифт, форма]
   шрифт: c Cormorant, p Playfair, f Forum, r Prata, s Great Vibes (рукописный), m Marcellus
   форма: a арка, o овальный верх, s прямой лист ---------- */
var THEMES=[
 ["Гранат","#f9f0e6","#3a1218","#8f1d2c","#ead6c8","#c9661d","#e9dbd1","rosette",12,"c","a"],
 ["Абрикос","#fcf1dc","#3b2410","#a94f14","#f0dab4","#6f7a2e","#ecdcc0","bloom",6,"c","a"],
 ["Туф","#e6d3cc","#33201e","#6f332f","#d4b9af","#a8603a","#d6c0b6","arch",1,"m","a"],
 ["Ночь","#231619","#f2e7dc","#e2a864","#3a2a2e","#d0606f","#140c0e","star",8,"c","a"],
 ["Арарат","#f6f8fa","#1d2a38","#3f6383","#dce4ec","#a07a3c","#dfe6ec","sun",24,"r","o"],
 ["Севан","#eef4f4","#123238","#1f6f78","#cfe1e1","#b0874a","#d3e3e3","eternity",8,"p","a"],
 ["Дилижан","#f1f3ea","#1e2b1e","#3d6b43","#d8e0cc","#a8763a","#d9e0cf","wreath",14,"c","o"],
 ["Гарни","#ebe9e6","#222224","#55555b","#d4d1cc","#9a6b3a","#cfccc7","arch",1,"m","s"],
 ["Татев","#f4efe8","#2a2420","#7c5a3c","#e3d8ca","#4f6e5a","#ddd2c4","eternity",6,"f","a"],
 ["Лаваш","#fbf3e2","#3b2d18","#9a6a22","#efdfbd","#7a3b22","#ecdcbc","wreath",18,"c","s"],
 ["Шёлк","#fbf7f2","#3a3330","#8e6a55","#ece2d8","#7c8c86","#ece4dc","bloom",8,"s","o"],
 ["Пудра","#fbefee","#40272b","#b5677a","#f0d9da","#8a6d55","#f0dddd","rosette",16,"s","a"],
 ["Шампань","#faf4e8","#3a3226","#8a6a2e","#ecdfc4","#7d6a8a","#ece2cc","star",12,"p","o"],
 ["Слоновая кость","#fdfaf3","#2c2925","#7a6a52","#ece6d8","#9a4a3a","#ebe5d8","arch",1,"r","a"],
 ["Изумруд","#0f2a24","#ecf2ea","#c9a85c","#1f3d36","#7fbf9c","#0a1c18","rosette",12,"p","a"],
 ["Сапфир","#14213d","#eef0f6","#d6b36a","#22335a","#8fa8d8","#0d1629","star",8,"r","o"],
 ["Бордо","#3a0f18","#f6e6e0","#e0b07a","#55202c","#e88a8a","#270910","pomegranate",1,"c","a"],
 ["Мята","#eef6f1","#1f3329","#3f8a68","#d3e8dc","#c07a4a","#d6e9df","bloom",5,"m","o"],
 ["Лаванда","#f3f1f8","#2c2838","#6d5f94","#e0dcec","#a0784a","#e2deec","wreath",12,"s","a"],
 ["Олива","#f2f1e4","#2c2c18","#6b6a2c","#dcdbc0","#9a4e2a","#dcdbc4","wreath",10,"c","s"],
 ["Терракота","#f7ebe2","#3a2016","#b0532c","#ecd2c2","#3f6a6a","#ead6c8","sun",16,"m","a"],
 ["Графит и золото","#1c1c1e","#efe9dc","#c9a24b","#2e2d2b","#9aa4a0","#111112","eternity",8,"m","s"],
 ["Жемчуг","#f6f5f2","#2e2f33","#7c818b","#e3e2de","#a07a5a","#e2e1dc","bloom",7,"r","o"],
 ["Роза","#fdf0f1","#40202a","#c2405e","#f4d6dc","#6a8a5a","#f3dcdf","rosette",10,"s","a"],
 ["Пион","#fbeef2","#3d1f2c","#a83d6a","#f0d4de","#5f7f4f","#efd8e0","bloom",9,"p","a"],
 ["Сирень","#f6f0f6","#33263a","#87578f","#e8d9ea","#5a7a5a","#e8dce9","rosette",14,"c","o"],
 ["Кофе","#f3ebe3","#2d1f17","#6e4a33","#e2d2c4","#a8763a","#ddcbbb","grapes",1,"f","a"],
 ["Корица","#f8eee4","#33231a","#9a5a32","#ead7c6","#4f6e6a","#ead8c6","sun",12,"c","a"],
 ["Морская соль","#f1f5f7","#1d2f3a","#4b7c93","#d7e4ea","#b07a4a","#d8e4ea","eternity",12,"r","s"],
 ["Горный мёд","#fdf5e1","#3a2c10","#a6741a","#f0e0b5","#7a3e22","#efe0bb","star",6,"c","o"],
 ["Арени","#2e1220","#f4e4ea","#d99ab0","#45202f","#e0b070","#200b16","grapes",1,"p","a"],
 ["Ковёр","#f5ece0","#2a1a1a","#9b2b2b","#e6d2be","#24477a","#e3cfb9","star",8,"f","s"],
 ["Миниатюра","#f8f0de","#22243a","#2f4a8a","#ead9b8","#b3322f","#eadbbd","eternity",10,"m","a"],
 ["Ахтамар","#f4ebde","#2c2216","#8a6236","#e4d4bc","#3d6b6b","#e0d0b8","arch",1,"f","a"],
 ["Звёздная ночь","#101b2e","#eef1f8","#e8c66a","#1d2a44","#9fb4e0","#0a1222","star",5,"s","o"],
 ["Рассвет","#fdf1ea","#3a2420","#c4643e","#f4d8ca","#6a6a9a","#f4dccf","sun",20,"p","a"],
 ["Снег","#fbfcfd","#26303a","#5c7690","#e6ebf0","#a88a5a","#e8edf2","eternity",6,"r","a"],
 ["Мак","#fbf1ec","#2e1414","#c23a2a","#f2d6cc","#3a5a3a","#f1dcd4","bloom",5,"c","s"],
 ["Хачкар","#e9e3dc","#2a2420","#5e4a3c","#d6ccc0","#8a3a2a","#d3c9bd","eternity",4,"m","s"],
 ["Эчмиадзин","#fffdf8","#2a241a","#9c7a30","#efe6d2","#7a2a2a","#eee6d4","arch",1,"r","a"]
];
var FONTS={c:'"Cormorant","Noto Serif Armenian",Georgia,serif',p:'"Playfair Display","Noto Serif Armenian",Georgia,serif',f:'"Forum","Noto Serif Armenian",Georgia,serif',r:'"Prata","Noto Serif Armenian",Georgia,serif',s:'"Great Vibes","Noto Serif Armenian",cursive',m:'"Marcellus","Noto Serif Armenian",Georgia,serif'};
var SHAPES={a:[210,202,198],o:[90,84,80],s:[16,9,6]};
var ICONS={
  cup:'<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M9 3c-1 1.5 1 2.5 0 4M12.5 3c-1 1.5 1 2.5 0 4"/>',
  umbrella:'<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v7a2 2 0 0 1-4 0"/>',
  home:'<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>',
  ring:'<circle cx="12" cy="15" r="6"/><path d="M9 6l3-3 3 3-3 3z"/>'
};
var FONT_CSS={c:"Cormorant:ital,wght@0,400;0,500;0,600;1,400;1,500",p:"Playfair+Display:ital,wght@0,400;0,600;1,400",f:"Forum",r:"Prata",s:"Great+Vibes",m:"Marcellus"};
var loadedFonts={};
/* на старых телефонах и слабом интернете грузим только шрифт текущей темы */
function loadFont(k){
  var keys=k==="s"?["s","c"]:[k];
  keys.forEach(function(x){if(loadedFonts[x])return;loadedFonts[x]=1;var l=document.createElement("link");l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family="+FONT_CSS[x]+"&display=swap";document.head.appendChild(l)});
}
var SHAPES={a:[210,202,198],o:[90,84,80],s:[16,9,6]};
function lum(hex){var n=parseInt(hex.slice(1),16);return (.2126*(n>>16&255)+.7152*(n>>8&255)+.0722*(n&255))/255}
function mix(a,b,t){var x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16),o="#";[16,8,0].forEach(function(s){var v=Math.round((x>>s&255)*(1-t)+(y>>s&255)*t);o+=("0"+v.toString(16)).slice(-2)});return o}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function pad(n){return (n<10?"0":"")+n}

var UI={
 hy:{lead:{wedding:"Սիրով հրավիրում ենք մեր հարսանիքին",engagement:"Սիրով հրավիրում ենք մեր նշանադրությանը",christening:"Սիրով հրավիրում ենք կնունքի",anniversary:"Սիրով հրավիրում ենք հոբելյանին",birthday:"Սիրով հրավիրում ենք ծննդյան տոնին"},
  and:"և",months:["հունվարի","փետրվարի","մարտի","ապրիլի","մայիսի","հունիսի","հուլիսի","օգոստոսի","սեպտեմբերի","հոկտեմբերի","նոյեմբերի","դեկտեմբերի"],at:"ժամը",
  d:"օր",h:"ժամ",m:"րոպե",s:"վրկ",past:"Տոնն արդեն կայացել է",story:"Մեր պատմությունը",prog:"Ծրագիր",map:"Ինչպես հասնել",cal:"Ավելացնել օրացույցում",
  q:"Կգա՞ք",name:"Ձեր անունը",count:"Մեծահասակներ",kids:"Երեխաներ",by:"Խնդրում ենք պատասխանել մինչև {d}",yes:"Կգամ",no:"Չեմ կարող",need:"Գրեք ձեր անունը",sending:"Ուղարկում ենք…",
  ty:"Շնորհակալություն, {n}։ Սպասում ենք ձեզ",tn:"Ափսոս, {n}։ Շնորհակալություն պատասխանի համար",change:"Փոխել պատասխանը",gift:"Նվեր",
  fail:"Չհաջողվեց ուղարկել։ Ստուգեք ինտերնետը և կրկնեք։",offline:"Ինտերնետ չկա։ Պատասխանը կուղարկենք, երբ կապը վերականգնվի։",made:"Ստեղծված է SEGHAN-ում",want:"Ուզում եմ այսպիսի հրավեր"},
 ru:{lead:{wedding:"Приглашаем вас на нашу свадьбу",engagement:"Приглашаем вас на нашу помолвку",christening:"Приглашаем вас на крестины",anniversary:"Приглашаем вас на юбилей",birthday:"Приглашаем вас на день рождения"},
  and:"и",months:["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"],at:"в",
  d:"дней",h:"часов",m:"минут",s:"секунд",past:"Праздник уже состоялся",story:"Наша история",prog:"Программа дня",map:"Как добраться",cal:"Добавить в календарь",
  q:"Вы придёте?",name:"Ваше имя",count:"Взрослых",kids:"Детей",by:"Пожалуйста, ответьте до {d}",yes:"Приду",no:"Не смогу",need:"Напишите ваше имя",sending:"Отправляем…",
  ty:"Спасибо, {n}! Ждём вас",tn:"Жаль, {n}. Спасибо, что ответили",change:"Изменить ответ",gift:"Подарок от",
  fail:"Не получилось отправить. Проверьте интернет и нажмите ещё раз.",offline:"Нет интернета. Ответ отправится, когда связь вернётся.",made:"Сделано в SEGHAN",want:"Хочу такое приглашение"},
 en:{lead:{wedding:"Together with our families we invite you to our wedding",engagement:"We invite you to our engagement",christening:"We invite you to the christening",anniversary:"We invite you to the anniversary",birthday:"We invite you to the birthday party"},
  and:"&",months:["January","February","March","April","May","June","July","August","September","October","November","December"],at:"at",
  d:"days",h:"hours",m:"min",s:"sec",past:"The celebration has taken place",story:"Our story",prog:"The day",map:"Get directions",cal:"Add to calendar",
  q:"Will you come?",name:"Your name",count:"Adults",kids:"Children",by:"Please reply by {d}",yes:"I'll come",no:"Can't make it",need:"Please enter your name",sending:"Sending…",
  ty:"Thank you, {n}! See you there",tn:"Sorry to miss you, {n}. Thanks for replying",change:"Change my answer",gift:"A gift from",
  fail:"Couldn't send. Check your connection and try again.",offline:"No connection. Your reply will be sent when you're back online.",made:"Made with SEGHAN",want:"I want an invitation like this"}
};
var PIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
var CAL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M12 13v4M10 15h4"/></svg>';

/* поле содержания: строка или {hy,ru,en} */
function pick(v,L){if(v==null)return "";if(typeof v==="string")return v;return v[L]||v.ru||v.hy||v.en||""}

/* data: {event_type, lang, langs?, n1, n2, starts_at, venue, address, map_url, story:[{icon,year,title,text}], program:[{time,title,place}], note, gift_from, theme, cta_url, ics_url}
   opts: {root, themePicker, onRsvp(payload)->Promise, storageKey} */
function mount(data,opts){
  var root=opts.root,key=opts.storageKey||"hrv-inv",langs=data.langs||[data.lang||"hy"];
  var S={lang:data.lang||langs[0],theme:+data.theme||0,count:2,kids:0,answer:null,name:data.guest_name||"",pending:null};
  try{var sv=JSON.parse(localStorage.getItem(key)||"null");if(sv){S.answer=sv.answer||null;S.name=sv.name||"";S.count=sv.count||2;S.kids=sv.kids||0;S.pending=sv.pending||null;if(opts.themePicker&&sv.theme!=null)S.theme=Math.min(THEMES.length-1,sv.theme)}}catch(e){}
  function save(){try{localStorage.setItem(key,JSON.stringify({answer:S.answer,name:S.name,count:S.count,kids:S.kids,theme:S.theme,pending:S.pending}))}catch(e){}}
  var start=new Date(data.starts_at),$=function(id){return root.querySelector("#"+id)};

  root.innerHTML='<div class="scene"><div class="ros" id="ros" aria-hidden="true"></div>'+
   '<div class="bar">'+(langs.length>1?'<div class="langs" role="group" aria-label="Language">'+langs.map(function(l){return '<button type="button" class="pill" id="l-'+l+'" data-l="'+l+'" lang="'+l+'" aria-pressed="false">'+{hy:"Հայերեն",ru:"Русский",en:"English"}[l]+'</button>'}).join("")+'</div>':"")+
   (opts.themePicker?'<div class="themes"><button type="button" class="pill" id="prev" aria-label="Предыдущая тема">‹</button><div class="tname" aria-live="polite"><span id="tnum"></span><b id="tname"></b></div><button type="button" class="pill" id="next" aria-label="Следующая тема">›</button></div><div class="sw" id="sw" role="group" aria-label="Темы приглашения"></div>':"")+'</div>'+
   '<div class="leaf"><article class="card" id="card">'+
     '<div class="orn" id="orn" aria-hidden="true"></div><p class="to" id="to" hidden></p><p class="lead" id="lead"></p><h1 class="names" id="names"></h1><div class="rule"><b></b></div>'+
     '<p class="when" id="when"></p><div class="cd" id="cd"></div>'+
     '<section class="story" id="storyS" aria-labelledby="storyH"><h2 id="storyH"></h2><ol id="story"></ol></section>'+
     '<p class="sec" id="progH"></p><ol class="prog" id="prog"></ol>'+
     '<div class="acts"><a class="map" id="map" target="_blank" rel="noopener">'+PIN+'<span id="mapT"></span></a><a class="map" id="cal" target="_blank" rel="noopener">'+CAL+'<span id="calT"></span></a></div>'+
     '<p class="note" id="note"></p>'+
     '<section class="rsvp" id="rsvp" aria-labelledby="rq"><h2 id="rq"></h2><p class="by" id="by" hidden></p>'+
       '<div class="f" id="fname"><label for="gname" id="gnameL"></label><input id="gname" autocomplete="name" maxlength="80"><span class="err" id="gerr" role="alert"></span></div>'+
       '<div class="two"><div class="f"><label id="gcountL" for="plus"></label><div class="cnt"><button type="button" id="minus" aria-label="−1">−</button><output id="gcount" aria-labelledby="gcountL">2</output><button type="button" id="plus" aria-label="+1">+</button></div></div>'+
       '<div class="f"><label id="kcountL" for="kplus"></label><div class="cnt"><button type="button" id="kminus" aria-label="−1">−</button><output id="kcount" aria-labelledby="kcountL">0</output><button type="button" id="kplus" aria-label="+1">+</button></div></div></div>'+
       '<div class="rb"><button type="button" class="yes" id="yes"></button><button type="button" id="no"></button></div></section>'+
     '<div class="done" id="done" hidden role="status"><p class="note" id="doneT"></p><button type="button" class="again" id="again"></button></div>'+
     '<p class="gift" id="gift"></p>'+
   '</article></div>'+
   '<div class="foot"><span class="wm">'+orn("rosette",8,2)+'<b>SEGHAN</b></span><span id="madeT"></span>'+(data.cta_url?'<a class="cta" id="cta" target="_blank" rel="noopener"></a>':"")+'</div>'+
   '<div class="offline" id="off" hidden role="status"></div></div>';
  if(data.cta_url)$("cta").href=data.cta_url;

  function applyTheme(anim){
    var t=THEMES[S.theme]||THEMES[0],r=document.documentElement.style,sh=SHAPES[t[10]],dark=lum(t[6])<.3;
    loadFont(t[9]);
    r.setProperty("--c-bg",t[1]);r.setProperty("--c-ink",t[2]);r.setProperty("--c-acc",t[3]);r.setProperty("--c-soft",t[4]);r.setProperty("--c-two",t[5]);
    r.setProperty("--ground",t[6]);r.setProperty("--ground2",mix(t[6],dark?"#ffffff":"#000000",dark?.08:.07));
    r.setProperty("--g-ink",dark?"#f3ece4":t[2]);r.setProperty("--g-mute",dark?"#b9ada3":mix(t[2],t[6],.4));
    r.setProperty("--orn",mix(t[6],t[3],dark?.35:.3));r.setProperty("--shadow",dark?"rgba(0,0,0,.6)":"rgba(40,14,12,.3)");
    r.setProperty("--names",FONTS[t[9]]);r.setProperty("--display",FONTS[t[9]==="s"?"c":t[9]]);
    r.setProperty("--r-top",sh[0]+"px");r.setProperty("--r-in",sh[1]+"px");r.setProperty("--r-in2",sh[2]+"px");
    var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=t[6];
    $("card").classList.toggle("script",t[9]==="s");
    $("orn").innerHTML=orn(t[7],t[8],1.2);$("ros").innerHTML=orn(t[7],t[8],.45);
    if(opts.themePicker){
      $("tname").textContent=t[0];$("tnum").textContent="Тема "+(S.theme+1)+" из "+THEMES.length;
      root.querySelectorAll("#sw button").forEach(function(b){b.setAttribute("aria-pressed",String(+b.dataset.i===S.theme))});
      var cur=$("th-"+S.theme),box=$("sw");box.scrollTo({left:cur.offsetLeft-box.clientWidth/2+cur.offsetWidth/2,behavior:anim?"smooth":"auto"});
    }
    if(anim){var c=$("card");c.classList.remove("swap");void c.offsetWidth;c.classList.add("swap")}
  }
  if(opts.themePicker){
    $("sw").innerHTML=THEMES.map(function(t,i){return '<button type="button" id="th-'+i+'" data-i="'+i+'" aria-pressed="false" aria-label="'+t[0]+'" title="'+t[0]+'" style="background:'+t[1]+'"><i style="background:'+t[3]+'"></i></button>'}).join("");
    var set=function(i){S.theme=(i+THEMES.length)%THEMES.length;applyTheme(true);save()};
    $("sw").addEventListener("click",function(e){var b=e.target.closest("button");if(b)set(+b.dataset.i)});
    $("prev").onclick=function(){set(S.theme-1)};$("next").onclick=function(){set(S.theme+1)};
  }

  function calUrl(){
    var f=function(d){return d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"")},end=new Date(start.getTime()+6*3600e3);
    var title=pick(data.n1,S.lang)+(data.n2?" & "+pick(data.n2,S.lang):"");
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(title)+"&dates="+f(start)+"/"+f(end)+"&location="+encodeURIComponent(pick(data.venue,S.lang)+(data.address?", "+pick(data.address,S.lang):""))+"&details="+encodeURIComponent(location.href.split("#")[0]);
  }
  function render(){
    var t=UI[S.lang],L=S.lang;
    $("card").lang=L;document.documentElement.lang=L;
    $("lead").textContent=t.lead[data.event_type]||t.lead.wedding;
    $("to").hidden=!data.guest_name;$("to").textContent=data.guest_name?data.guest_name+",":"";
    var nm=$("names");nm.textContent="";nm.append(pick(data.n1,L));
    if(pick(data.n2,L)){var i=document.createElement("i");i.textContent=t.and;nm.append(i,pick(data.n2,L))}
    var y=new Date(start.getTime()+4*3600e3);
    $("when").innerHTML="<b>"+y.getUTCDate()+"</b>"+t.months[y.getUTCMonth()]+" "+y.getUTCFullYear()+" · "+t.at+" "+pad(y.getUTCHours())+":"+pad(y.getUTCMinutes());
    var st=data.story||[];$("storyS").hidden=!st.length;$("storyH").textContent=t.story;
    $("story").innerHTML=st.map(function(s,k){return '<li style="--k:'+k+'"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[s.icon]||ICONS.ring)+'</svg></span><div>'+(s.year?'<span class="yr">'+esc(s.year)+'</span>':"")+'<h3>'+esc(pick(s.title,L))+'</h3><p>'+esc(pick(s.text,L))+'</p></div></li>'}).join("");
    var pr=data.program||[];$("progH").hidden=$("prog").hidden=!pr.length;$("progH").textContent=t.prog;
    $("prog").innerHTML=pr.map(function(s){var pl=pick(s.place,L);return "<li><b>"+esc(s.time)+"</b><span>"+esc(pick(s.title,L))+(pl?"<small>"+esc(pl)+"</small>":"")+"</span></li>"}).join("");
    var v=pick(data.venue,L);
    $("map").hidden=!v&&!data.map_url;$("map").href=data.map_url||"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(v+" "+pick(data.address,L));
    $("mapT").textContent=t.map+(v?" · "+v:"");
    $("cal").href=data.ics_url||calUrl();$("calT").textContent=t.cal;
    $("note").textContent=pick(data.note,L);$("note").hidden=!pick(data.note,L);
    $("rq").textContent=t.q;$("gnameL").textContent=t.name;$("gcountL").textContent=t.count;$("kcountL").textContent=t.kids;
    $("fname").hidden=!!data.guest_name;if(data.guest_name)$("gname").value=data.guest_name;
    if(data.rsvp_by){var bd=new Date(data.rsvp_by+"T12:00:00Z");$("by").hidden=false;$("by").textContent=t.by.replace("{d}",bd.getUTCDate()+" "+t.months[bd.getUTCMonth()])}
    $("yes").textContent=t.yes;$("no").textContent=t.no;$("again").textContent=t.change;
    var g=$("gift");g.textContent="";g.hidden=!data.gift_from;
    if(data.gift_from){g.append(t.gift);var b=document.createElement("b");b.textContent=pick(data.gift_from,L);g.append(b)}
    $("madeT").textContent=t.made;if(data.cta_url)$("cta").textContent=t.want;
    root.querySelectorAll(".langs button").forEach(function(x){x.setAttribute("aria-pressed",String(x.dataset.l===L))});
    rsvpView();tick();
  }
  function rsvpView(){
    var t=UI[S.lang];
    $("rsvp").hidden=!!S.answer;$("done").hidden=!S.answer;$("gcount").textContent=S.count;$("kcount").textContent=S.kids;
    if(S.answer)$("doneT").textContent=(S.answer==="yes"?t.ty:t.tn).replace("{n}",S.name);
    $("off").hidden=!S.pending;$("off").textContent=t.offline;
  }
  function tick(){
    var t=UI[S.lang],left=start-Date.now();
    if(left<=0){$("cd").innerHTML='<div style="grid-column:1/-1">'+t.past+"</div>";return}
    var s=Math.floor(left/1000),v=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];
    $("cd").innerHTML=[t.d,t.h,t.m,t.s].map(function(l,k){return "<div><b>"+pad(v[k])+"</b><span>"+l+"</span></div>"}).join("");
  }
  /* ответ гостя: отправляем на сервер; без сети держим в браузере и досылаем, когда связь вернётся */
  function send(p){
    if(!opts.onRsvp)return Promise.resolve();
    return opts.onRsvp(p);
  }
  function flush(){
    if(!S.pending||!navigator.onLine)return;
    var p=S.pending;send(p).then(function(){S.pending=null;save();rsvpView()},function(){});
  }
  function answer(a,btn){
    var t=UI[S.lang],n=$("gname").value.trim();
    if(!n){$("fname").classList.add("bad");$("gerr").textContent=t.need;$("gname").focus();return}
    var p={name:n,attending:a==="yes",guests:S.count,children:S.kids},txt=btn.textContent;
    btn.disabled=true;btn.textContent=t.sending;
    var ok=function(){S.answer=a;S.name=n;S.pending=null;save();rsvpView();btn.disabled=false;btn.textContent=txt};
    if(!navigator.onLine&&opts.onRsvp){S.answer=a;S.name=n;S.pending=p;save();rsvpView();btn.disabled=false;btn.textContent=txt;return}
    send(p).then(ok,function(e){btn.disabled=false;btn.textContent=txt;$("gerr").textContent=(e&&e.message)||t.fail});
  }
  $("gname").addEventListener("input",function(){$("fname").classList.remove("bad");$("gerr").textContent=""});
  $("minus").onclick=function(){S.count=Math.max(1,S.count-1);rsvpView()};
  $("plus").onclick=function(){S.count=Math.min(12,S.count+1);rsvpView()};
  $("kminus").onclick=function(){S.kids=Math.max(0,S.kids-1);rsvpView()};
  $("kplus").onclick=function(){S.kids=Math.min(12,S.kids+1);rsvpView()};
  $("yes").onclick=function(){answer("yes",this)};$("no").onclick=function(){answer("no",this)};
  $("again").onclick=function(){S.answer=null;$("gname").value=S.name;save();rsvpView()};
  root.querySelectorAll(".langs button").forEach(function(x){x.onclick=function(){S.lang=x.dataset.l;render()}});
  window.addEventListener("online",flush);
  applyTheme(false);render();flush();setInterval(tick,1000);
}
window.HRV={mount:mount,THEMES:THEMES,orn:orn,loadFont:loadFont};
})();
