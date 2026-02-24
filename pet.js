let pets=[];
let chart=null;
let currentType="hp";

/* ---------- pets.json 로드 ---------- */
async function loadPets(){
const res=await fetch("./pets.json?"+Date.now());
pets=await res.json();

const sel=document.getElementById("petSelect");
pets.forEach(p=>{
const op=document.createElement("option");
op.value=p.name;
op.textContent=p.name;
sel.appendChild(op);
});
}
loadPets();

/* ---------- S초기치 계산 (공식) ---------- */
function calcS(p){
const calcHp  = preciseRound(p.initnum*(p.hp+4.5)/100);
const calcAtk = preciseRound(p.initnum*(p.atk+4.5)/100);
const calcDef = preciseRound(p.initnum*(p.def+4.5)/100);
const calcAgi = preciseRound(p.initnum*(p.agi+4.5)/100);

return {
hp:(calcHp*4)+calcAtk+calcDef+calcAgi,
atk:(calcHp*0.1)+calcAtk+(calcDef*0.1)+(calcAgi*0.05),
def:(calcHp*0.1)+(calcAtk*0.1)+calcDef+(calcAgi*0.05),
agi:calcAgi
};
}

/* ---------- 그래프 ---------- */
function buildGraph(){
const name=petSelect.value;
const p=pets.find(x=>x.name===name);
if(!p)return;

const s=calcS(p);

s_hp.value=s.hp.toFixed(2);
s_atk.value=s.atk.toFixed(2);
s_def.value=s.def.toFixed(2);
s_agi.value=s.agi.toFixed(2);

const growth={
hp:(p.hp+4.5)/100,
atk:(p.atk+4.5)/100,
def:(p.def+4.5)/100,
agi:(p.agi+4.5)/100
};

const labels=[];
const data=[];

for(let lv=1;lv<=150;lv++){
labels.push(lv);

let val;
if(currentType==="hp") val=s.hp+growth.hp*(lv-1);
if(currentType==="atk") val=s.atk+growth.atk*(lv-1);
if(currentType==="def") val=s.def+growth.def*(lv-1);
if(currentType==="agi") val=s.agi+growth.agi*(lv-1);
if(currentType==="sum") val=(growth.atk+growth.def+growth.agi)*(lv-1);

data.push(val);
}

if(chart) chart.destroy();

chart=new Chart(growthChart,{
type:'line',
data:{
labels:labels,
datasets:[{
label:'내 페트 성장',
data:data,
borderWidth:3
}]
},
options:{
responsive:true,
interaction:{mode:'index',intersect:false},
scales:{
x:{ticks:{autoSkip:true,maxTicksLimit:12}},
y:{beginAtZero:false}
},
plugins:{
zoom:{
zoom:{wheel:{enabled:true},pinch:{enabled:true},mode:'x'},
pan:{enabled:true,mode:'x'}
}
}
}
});
}

loadGraph.onclick=buildGraph;

/* ---------- 탭 ---------- */
document.querySelectorAll(".tab").forEach(btn=>{
btn.onclick=()=>{
document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
currentType=btn.dataset.type;
buildGraph();
};
});

/* ---------- 확률 (탐색 축소판) ---------- */
calcProb.onclick=()=>{
const name=petName.value;
const p=pets.find(x=>x.name===name);
if(!p){probResult.textContent="페트 없음";return;}
probResult.textContent="분석 기능은 그래프 기반으로 확인하세요.";
};

function preciseRound(num){
return Math.round(num*1e12)/1e12;
}
