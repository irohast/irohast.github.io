/* ===============================
별과바다 부족 계산기 - 메인 JS
(오픈소스 로직 기반 그대로 유지 + UI 연결)
================================= */

let pet = [];
let btnName = "";
const result = [];

/* ---------- 데이터 로드 ---------- */
function loadPetData(){
return fetch("./pets.json?v=" + Date.now())
.then(res => res.json())
.then(data=>{
pet = data;

```
    /* ㄱㄴㄷ 정렬 */
    pet.sort((a,b)=> a.name.localeCompare(b.name,'ko'));
})
.catch(()=>{
    alert("pets.json 로드 실패");
});
```

}

/* ---------- 자동완성 ---------- */
function showSuggestions(val){
const list = document.getElementById("pet-suggestions");
list.innerHTML="";

```
let filtered;

if(!val){
    filtered = pet; // 전체 리스트
}else{
    filtered = pet.filter(p=>p.name.includes(val));
}

filtered.slice(0,80).forEach(p=>{
    const li=document.createElement("li");
    li.textContent=p.name;
    li.onclick=()=>{
        document.getElementById("name").value=p.name;
        list.innerHTML="";
        fillSPet(p.name);
    };
    list.appendChild(li);
});
```

}

/* ---------- S초기치 표시 ---------- */
function fillSPet(name){
const found = pet.find(p=>p.name===name);
if(!found) return;

```
const s = calcS(found);

document.getElementById("sinfo").innerHTML =
    `S초기치 → 내구 ${limitDecimalPlaces(s.hp,2)} / 공격 ${limitDecimalPlaces(s.atk,2)} / 방어 ${limitDecimalPlaces(s.def,2)} / 순발 ${limitDecimalPlaces(s.agi,2)}`;
```

}

/* ---------- S초기치 계산 ---------- */
function calcS(p){

```
let rank=0;
const sum=p.hp+p.atk+p.def+p.agi;

if(p.rank>0) rank=p.rank;
else if(sum>=110) rank=435;
else if(sum>=105) rank=455;
else if(sum>=100) rank=475;
else if(sum>=95) rank=495;
else if(sum>=90) rank=515;
else if(sum>=85) rank=535;
else if(sum>=80) rank=555;
else rank=575;

const calcHp  = preciseRound(p.initnum*(p.hp+4.5)/100);
const calcAtk = preciseRound(p.initnum*(p.atk+4.5)/100);
const calcDef = preciseRound(p.initnum*(p.def+4.5)/100);
const calcAgi = preciseRound(p.initnum*(p.agi+4.5)/100);

return {
    hp:preciseRound((calcHp*4)+calcAtk+calcDef+calcAgi),
    atk:preciseRound((calcHp*0.1)+calcAtk+(calcDef*0.1)+(calcAgi*0.05)),
    def:preciseRound((calcHp*0.1)+(calcAtk*0.1)+calcDef+(calcAgi*0.05)),
    agi:calcAgi,
    rank:rank
};
```

}

/* ---------- 8등급 확률 계산 ---------- */
function calculateRank(){

```
const name=document.getElementById("name").value;
const found=pet.find(p=>p.name===name);
if(!found){ alert("페트 없음"); return; }

btnName="calculate";
result.length=0;

const baseInit=-2;
let base={hp:-2,atk:-2,def:-2,agi:-2};

for(let i=0;i<5;i++){
    for(let ii=0;ii<5;ii++){
        for(let iii=0;iii<5;iii++){
            for(let iiii=0;iiii<5;iiii++){
                setBonus(found,base);
                base.hp++; if(base.hp==3) base.hp=baseInit;
            }
            base.atk++; if(base.atk==3) base.atk=baseInit;
        }
        base.def++; if(base.def==3) base.def=baseInit;
    }
    base.agi++; if(base.agi==3) base.agi=baseInit;
}

printRate();
```

}

function setBonus(foundPet,base){
let bonus={hp:0,atk:0,def:0,agi:0};

```
for(let i=0;i<11;i++){
    for(let ii=0;ii<11;ii++){
        for(let iii=0;iii<11;iii++){
            for(let iiii=0;iiii<11;iiii++){

                if(bonus.hp+bonus.atk+bonus.def+bonus.agi==10){
                    addData(foundPet,base,bonus);
                }

                bonus.hp++; if(bonus.hp==11) bonus.hp=0;
            }
            bonus.atk++; if(bonus.atk==11) bonus.atk=0;
        }
        bonus.def++; if(bonus.def==11) bonus.def=0;
    }
    bonus.agi++; if(bonus.agi==11) bonus.agi=0;
}
```

}

function addData(foundPet,base,bonus){

```
const hp  = preciseRound(foundPet.initnum*(foundPet.hp+base.hp+bonus.hp)/100);
const atk = preciseRound(foundPet.initnum*(foundPet.atk+base.atk+bonus.atk)/100);
const def = preciseRound(foundPet.initnum*(foundPet.def+base.def+bonus.def)/100);
const agi = preciseRound(foundPet.initnum*(foundPet.agi+base.agi+bonus.agi)/100);

const statHp  = preciseRound((hp*4)+atk+def+agi);
const statAtk = preciseRound((hp*0.1)+atk+(def*0.1)+(agi*0.05));
const statDef = preciseRound((hp*0.1)+(atk*0.1)+def+(agi*0.05));
const statAgi = agi;

if(
    Math.floor(statHp)==parseInt(document.getElementById("hp").value) &&
    Math.floor(statAtk)==parseInt(document.getElementById("atk").value) &&
    Math.floor(statDef)==parseInt(document.getElementById("def").value) &&
    Math.floor(statAgi)==parseInt(document.getElementById("agi").value)
){
    result.push(base.hp+base.atk+base.def+base.agi);
}
```

}

function printRate(){
const total=result.length;
let eight=result.filter(r=>r===8).length;
let rate= total? (eight/total*100).toFixed(2):"0.00";

```
alert("8등급 확률 : "+rate+"%");
```

}

/* ---------- 유틸 ---------- */
function limitDecimalPlaces(number,places){
var power=Math.pow(10,places);
return (Math.floor(number*power)/power).toFixed(places);
}
function preciseRound(num){
return Math.round(num*1e12)/1e12;
}

/* ---------- 이벤트 ---------- */
document.addEventListener("DOMContentLoaded",async()=>{
await loadPetData();

```
const nameInput=document.getElementById("name");

nameInput.addEventListener("input",e=>{
    showSuggestions(e.target.value);
});

nameInput.addEventListener("focus",()=>{
    showSuggestions("");
});

document.getElementById("calcBtn").onclick=calculateRank;
```

});
