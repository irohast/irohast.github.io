let pets=[];
let charts={};
let activeGraph="hp";

/* ---------- pets.json 로드 ---------- */
async function loadPets(){
const res = await fetch("./pets.json?ver="+Date.now());
pets = await res.json();

```
const sel=document.getElementById("petSelect");
sel.innerHTML="";
pets.forEach(p=>{
    const o=document.createElement("option");
    o.value=p.name;
    o.textContent=p.name;
    sel.appendChild(o);
});
```

}
loadPets();

/* ---------- 정밀 계산 함수 (오픈소스 로직 그대로) ---------- */
function preciseRound(num){
return Math.round(num*1e12)/1e12;
}
function limitDecimalPlaces(number, places){
let power=Math.pow(10,places);
return (Math.floor(number*power)/power).toFixed(places);
}

/* ---------- S초기치 계산 ---------- */
function calcS(p){
let rank=0;
const sum=p.hp+p.atk+p.def+p.agi;

```
if(p.rank>0) rank=p.rank;
else if(sum>=110)rank=435;
else if(sum>=105)rank=455;
else if(sum>=100)rank=475;
else if(sum>=95)rank=495;
else if(sum>=90)rank=515;
else if(sum>=85)rank=535;
else if(sum>=80)rank=555;
else rank=575;

const calcHp =preciseRound(p.initnum*(p.hp+4.5)/100);
const calcAtk=preciseRound(p.initnum*(p.atk+4.5)/100);
const calcDef=preciseRound(p.initnum*(p.def+4.5)/100);
const calcAgi=preciseRound(p.initnum*(p.agi+4.5)/100);

return {
    hp:preciseRound((calcHp*4)+calcAtk+calcDef+calcAgi),
    atk:preciseRound((calcHp*0.1)+calcAtk+(calcDef*0.1)+(calcAgi*0.05)),
    def:preciseRound((calcHp*0.1)+(calcAtk*0.1)+calcDef+(calcAgi*0.05)),
    agi:calcAgi,
    rank
};
```

}

/* ---------- 이름 입력시 자동 S초기치 ---------- */
document.getElementById("name").addEventListener("input",()=>{
const name=document.getElementById("name").value;
const p=pets.find(x=>x.name===name);
if(!p)return;

```
const s=calcS(p);

document.getElementById("sinfo").innerHTML=
    "S초기치 : HP "+limitDecimalPlaces(s.hp,2)+
    " / ATK "+limitDecimalPlaces(s.atk,2)+
    " / DEF "+limitDecimalPlaces(s.def,2)+
    " / AGI "+limitDecimalPlaces(s.agi,2);

document.getElementById("s_hp").value=s.hp.toFixed(2);
document.getElementById("s_atk").value=s.atk.toFixed(2);
document.getElementById("s_def").value=s.def.toFixed(2);
document.getElementById("s_agi").value=s.agi.toFixed(2);
```

});

/* ---------- 성장 시뮬레이션 ---------- */
function simulateGrowth(baseStat,level){
return preciseRound(baseStat + (level*0.85));
}

/* ---------- 그래프 생성 ---------- */
document.getElementById("graph").onclick=()=>{
const s={
hp:Number(s_hp.value),
atk:Number(s_atk.value),
def:Number(s_def.value),
agi:Number(s_agi.value)
};

```
const labels=[];
const hp=[],atk=[],def=[],agi=[],total=[];

for(let lv=1;lv<=150;lv++){
    labels.push(lv);
    const h=simulateGrowth(s.hp,lv);
    const a=simulateGrowth(s.atk,lv);
    const d=simulateGrowth(s.def,lv);
    const g=simulateGrowth(s.agi,lv);

    hp.push(h);
    atk.push(a);
    def.push(d);
    agi.push(g);
    total.push(a+d+g);
}

createChart("hpChart","내구 성장률",labels,hp,"#ff6384");
createChart("atkChart","공격 성장률",labels,atk,"#36a2eb");
createChart("defChart","방어 성장률",labels,def,"#ffce56");
createChart("agiChart","순발 성장률",labels,agi,"#4bc0c0");
createChart("totalChart","총 성장률",labels,total,"#8e5cff");
```

};

function createChart(id,label,labels,data,color){
if(charts[id]) charts[id].destroy();

```
const ctx=document.getElementById(id);
charts[id]=new Chart(ctx,{
    type:'line',
    data:{
        labels:labels,
        datasets:[{
            label:label,
            data:data,
            borderColor:color,
            tension:.25,
            pointRadius:0
        }]
    },
    options:{
        responsive:true,
        interaction:{mode:'index',intersect:false},
        scales:{
            x:{ticks:{maxTicksLimit:12}},
            y:{beginAtZero:false}
        },
        plugins:{
            zoom:{
                zoom:{
                    wheel:{enabled:true},
                    pinch:{enabled:true},
                    mode:'x'
                },
                pan:{enabled:true,mode:'x'}
            }
        }
    }
});
```

}
