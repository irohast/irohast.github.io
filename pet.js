let pets = [];
let petMap = {};
let result = [];
let chart = null;

// ------------------ pets.json 로드 ------------------
async function loadPets(){
    const res = await fetch("./pets.json",{cache:"no-store"});
    pets = await res.json();

    // 이름으로 빠르게 찾기용 맵 생성
    pets.forEach(p=>{
        petMap[p.name] = p;
    });

    const pure = document.getElementById("purePet");
    const center = document.getElementById("petSelect");

    pure.innerHTML="";
    center.innerHTML="";

    pets.forEach(p=>{
        pure.add(new Option(p.name,p.name));
        center.add(new Option(p.name,p.name));
    });

    loadPet();
}
window.onload = loadPets;

// ------------------ S초기치 표시 ------------------
function loadPet(){
    const name = document.getElementById("petSelect").value;
    const pet = petMap[name];
    if(!pet) return;

    // 오픈소스 공식 S초기치 계산
    const calcHp  = preciseRound(pet.initnum * (pet.hp + 4.5) / 100);
    const calcAtk = preciseRound(pet.initnum * (pet.atk + 4.5) / 100);
    const calcDef = preciseRound(pet.initnum * (pet.def + 4.5) / 100);
    const calcAgi = preciseRound(pet.initnum * (pet.agi + 4.5) / 100);

    const resultHp  = preciseRound((calcHp * 4) + calcAtk + calcDef + calcAgi);
    const resultAtk = preciseRound((calcHp * 0.1) + calcAtk + (calcDef * 0.1) + (calcAgi * 0.05));
    const resultDef = preciseRound((calcHp * 0.1) + (calcAtk * 0.1) + calcDef + (calcAgi * 0.05));
    const resultAgi = calcAgi;

    s_hp.value  = resultHp.toFixed(2);
    s_atk.value = resultAtk.toFixed(2);
    s_def.value = resultDef.toFixed(2);
    s_agi.value = resultAgi.toFixed(2);

    drawGraph();
}
document.getElementById("petSelect").onchange = loadPet;

// ------------------ 좌측 8등급 확률 ------------------
function runSRank(){
    result = [];

    const foundPet = {
        initnum: petMap[purePet.value].initnum,
        hp: Number(hp.value),
        atk: Number(atk.value),
        def: Number(def.value),
        agi: Number(agi.value)
    };

    setBase(foundPet);

    let total = result.length;
    let r8 = result.filter(r=>r.rank===8).length;

    pureResult.textContent = "8등급 확률 : " + ((r8/total)*100).toFixed(2) + "%";
}

// ---- 오픈소스 완전탐색 엔진 ----
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
    const hp  = preciseRound(p.initnum*(p.hp+base.hp+bonus.hp)/100);
    const atk = preciseRound(p.initnum*(p.atk+base.atk+bonus.atk)/100);
    const def = preciseRound(p.initnum*(p.def+base.def+bonus.def)/100);
    const agi = preciseRound(p.initnum*(p.agi+base.agi+bonus.agi)/100);

    result.push({
        hp:(hp*4)+atk+def+agi,
        atk:(hp*0.1)+atk+(def*0.1)+(agi*0.05),
        def:(hp*0.1)+(atk*0.1)+def+(agi*0.05),
        agi:agi,
        rank:base.hp+base.atk+base.def+base.agi
    });
}

// ------------------ 그래프 ------------------
function drawGraph(){
    const labels=[];
    const data=[];

    for(let i=1;i<=150;i++){
        labels.push(i);
        data.push(i); // 정상 출력 확인용
    }

    if(chart) chart.destroy();
    chart=new Chart(growthChart,{
        type:'line',
        data:{labels,datasets:[{label:'성장곡선',data}]}
    });
}

// ------------------ 유틸 ------------------
function preciseRound(num){
    return Math.round(num*1e12)/1e12;
}