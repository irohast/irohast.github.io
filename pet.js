let pets={},chart=null,result=[],btnName="calculate";

// ===== pets.json 로드 =====
async function loadPets(){
const res=await fetch("./pets.json",{cache:"no-store"});
pets=await res.json();

const p1=document.getElementById("purePet");
const p2=document.getElementById("petSelect");

Object.keys(pets).forEach(name=>{
let o1=new Option(name,name);
let o2=new Option(name,name);
p1.add(o1); p2.add(o2);
});

loadPet();
}
window.onload=loadPets;

// ===== S초기치 표시 =====
function loadPet(){
const pet=pets[petSelect.value];
if(!pet) return;
s_atk.value=pet.base.atk;
s_def.value=pet.base.def;
s_agi.value=pet.base.agi;
s_hp.value=pet.base.hp;
drawGraph();
}
petSelect.onchange=loadPet;

// ===== 야차 8등급 계산 =====
function runSRank(){
btnName="calculate";
result=[];
setBase({
initnum:100,
hp:Number(hp.value),
atk:Number(atk.value),
def:Number(def.value),
agi:Number(agi.value)
});
pureResult.textContent="8등급 확률 : "+calcRate()+"%";
}

function calcRate(){
let cnt=result.length;
if(cnt==0) return "0.00";
let r8=result.filter(r=>r.rank==8).length;
return ((r8/cnt)*100).toFixed(2);
}

function setBase(foundPet){
const baseInit=-2;
let base={hp:-2,atk:-2,def:-2,agi:-2};

for(let a=0;a<5;a++)
for(let b=0;b<5;b++)
for(let c=0;c<5;c++)
for(let d=0;d<5;d++){
setBonus(foundPet,base);
base.hp++; if(base.hp==3) base.hp=baseInit;
}
}

function setBonus(foundPet,base){
let bonus={hp:0,atk:0,def:0,agi:0};
for(let i=0;i<11;i++)
for(let j=0;j<11;j++)
for(let k=0;k<11;k++)
for(let l=0;l<11;l++){
if(bonus.hp+bonus.atk+bonus.def+bonus.agi==10)
addData(foundPet,base,bonus);
bonus.hp++; if(bonus.hp==11) bonus.hp=0;
}
}

function addData(p,base,bonus){
const hp=(p.initnum*(p.hp+base.hp+bonus.hp))/100;
const atk=(p.initnum*(p.atk+base.atk+bonus.atk))/100;
const def=(p.initnum*(p.def+base.def+bonus.def))/100;
const agi=(p.initnum*(p.agi+base.agi+bonus.agi))/100;

let stat={
hp:(hp*4)+atk+def+agi,
atk:(hp*0.1)+atk+(def*0.1)+(agi*0.05),
def:(hp*0.1)+(atk*0.1)+def+(agi*0.05),
agi:agi,
rank:base.hp+base.atk+base.def+base.agi
};
result.push(stat);
}

// ===== 중앙 분석 =====
function analyze(){
const pet=pets[petSelect.value];
const lv=Number(curLv.value);

const dev={
atk:cur_atk.value-(pet.base.atk+pet.growth.atk*(lv-1)),
def:cur_def.value-(pet.base.def+pet.growth.def*(lv-1)),
agi:cur_agi.value-(pet.base.agi+pet.growth.agi*(lv-1)),
hp:cur_hp.value-(pet.base.hp+pet.growth.hp*(lv-1))
};

const L=120;
let total=
pet.base.atk+pet.growth.atk*(L-1)+dev.atk+
pet.base.def+pet.growth.def*(L-1)+dev.def+
pet.base.agi+pet.growth.agi*(L-1)+dev.agi+
pet.base.hp+pet.growth.hp*(L-1)+dev.hp;

let prob=Math.max(0,Math.min(100,(total-650)/4));
futureResult.textContent="Lv120 예상 8등급 기대치 : "+prob.toFixed(2)+"%";

drawGraph(dev);
}

// ===== 그래프 =====
function drawGraph(dev={atk:0,def:0,agi:0,hp:0}){
const pet=pets[petSelect.value];
if(!pet) return;

let labels=[],sAtk=[],mAtk=[];
for(let i=1;i<=150;i++){
labels.push(i);
let s=pet.base.atk+pet.growth.atk*(i-1);
sAtk.push(s);
mAtk.push(s+dev.atk);
}

if(chart) chart.destroy();
chart=new Chart(growthChart,{
type:'line',
data:{labels,datasets:[
{label:'S 성장',data:sAtk,borderWidth:2},
{label:'내 페트',data:mAtk,borderDash:[6,6]}
]},
options:{responsive:true}
});
}