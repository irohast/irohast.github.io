let petsData = {};
let chart = null;

// JSON 로드
async function loadPets(){
    const res = await fetch("pets.json");
    petsData = await res.json();

    const select = document.getElementById("petSelect");
    select.innerHTML = "";

    Object.keys(petsData).forEach(name=>{
        const op = document.createElement("option");
        op.value = name;
        op.textContent = name;
        select.appendChild(op);
    });

    loadPet();
}

window.addEventListener("load", loadPets);

// S초기치 표시
function loadPet(){
    const name = document.getElementById("petSelect").value;
    if(!petsData[name]) return;

    const pet = petsData[name];

    s_atk.value = pet.base.atk;
    s_def.value = pet.base.def;
    s_agi.value = pet.base.agi;
    s_hp.value = pet.base.hp;

    drawGraph();
}

// 좌측 (기존 초기치 확률)
function calcPure(){
    let sum =
    Number(l_atk.value||0)+
    Number(l_def.value||0)+
    Number(l_agi.value||0)+
    Number(l_hp.value||0);

    // 기존 초기버전 방식 유지용 (건드리지 않음)
    let prob = Math.min(100, Math.max(0, (sum-70)*3));
    pureResult.textContent = prob.toFixed(2)+"%";
}

// 중앙 분석
function analyze(){
    const name = document.getElementById("petSelect").value;
    const pet = petsData[name];
    if(!pet) return;

    const lv = Number(curLv.value);

    const cur = {
        atk:Number(cur_atk.value),
        def:Number(cur_def.value),
        agi:Number(cur_agi.value),
        hp:Number(cur_hp.value)
    };

    // 성장 편차 계산
    const dev = {
        atk: cur.atk - (pet.base.atk + pet.growth.atk*(lv-1)),
        def: cur.def - (pet.base.def + pet.growth.def*(lv-1)),
        agi: cur.agi - (pet.base.agi + pet.growth.agi*(lv-1)),
        hp: cur.hp - (pet.base.hp + pet.growth.hp*(lv-1))
    };

    // 120 예측
    const L = 120;
    const future = {
        atk: pet.base.atk + pet.growth.atk*(L-1) + dev.atk,
        def: pet.base.def + pet.growth.def*(L-1) + dev.def,
        agi: pet.base.agi + pet.growth.agi*(L-1) + dev.agi,
        hp: pet.base.hp + pet.growth.hp*(L-1) + dev.hp
    };

    const total = future.atk + future.def + future.agi + future.hp;
    const prob = Math.min(100, Math.max(0,(total-650)/4));

    futureResult.textContent =
    "Lv120 예상 8등급 기대치 : " + prob.toFixed(2) + "%";

    drawGraph(dev);
}

// 그래프
function drawGraph(dev={atk:0,def:0,agi:0,hp:0}){
    const name = document.getElementById("petSelect").value;
    const pet = petsData[name];
    if(!pet) return;

    const labels = [];
    const sAtk=[], myAtk=[];
    const sDef=[], myDef=[];
    const sAgi=[], myAgi=[];
    const sHp=[], myHp=[];

    for(let i=1;i<=150;i++){
        labels.push(i);

        sAtk.push(pet.base.atk + pet.growth.atk*(i-1));
        myAtk.push(sAtk[i-1] + dev.atk);

        sDef.push(pet.base.def + pet.growth.def*(i-1));
        myDef.push(sDef[i-1] + dev.def);

        sAgi.push(pet.base.agi + pet.growth.agi*(i-1));
        myAgi.push(sAgi[i-1] + dev.agi);

        sHp.push(pet.base.hp + pet.growth.hp*(i-1));
        myHp.push(sHp[i-1] + dev.hp);
    }

    if(chart) chart.destroy();

    chart = new Chart(document.getElementById("growthChart"),{
        type:'line',
        data:{
            labels:labels,
            datasets:[
                {label:'S 공격',data:sAtk,borderWidth:2},
                {label:'내 공격',data:myAtk,borderDash:[5,5]},
                {label:'S 방어',data:sDef,borderWidth:2},
                {label:'내 방어',data:myDef,borderDash:[5,5]},
                {label:'S 순발',data:sAgi,borderWidth:2},
                {label:'내 순발',data:myAgi,borderDash:[5,5]},
                {label:'S 내구',data:sHp,borderWidth:2},
                {label:'내 내구',data:myHp,borderDash:[5,5]},
            ]
        },
        options:{
            responsive:true,
            interaction:{mode:'index',intersect:false},
            plugins:{legend:{position:'bottom'}}
        }
    });
}