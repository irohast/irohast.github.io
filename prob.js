/* ===============================
   8등급 확률 계산기
================================ */

let probPet=null;

/* 펫 목록 로드 */

function initProbPetList(){

    const select=document.getElementById("prob-pet");

    petData
    .sort((a,b)=>a.name.localeCompare(b.name,'ko'))
    .forEach(p=>{

        const opt=document.createElement("option");
        opt.value=p.name;
        opt.textContent=p.name;

        select.appendChild(opt);

    });

}

/* 펫 선택 */

document.getElementById("prob-pet").addEventListener("change",function(){

    const name=this.value;

    probPet=petData.find(p=>p.name===name);

});


/* 계산 */

document.getElementById("prob-run").addEventListener("click",function(){

    if(!probPet){
        alert("펫 선택");
        return;
    }

    const level=parseInt(document.getElementById("prob-level").value);

    const initHp=parseFloat(document.getElementById("prob-init-hp").value);
    const initAtk=parseFloat(document.getElementById("prob-init-atk").value);
    const initDef=parseFloat(document.getElementById("prob-init-def").value);
    const initAgi=parseFloat(document.getElementById("prob-init-agi").value);

    const curHp=parseFloat(document.getElementById("prob-cur-hp").value);
    const curAtk=parseFloat(document.getElementById("prob-cur-atk").value);
    const curDef=parseFloat(document.getElementById("prob-cur-def").value);
    const curAgi=parseFloat(document.getElementById("prob-cur-agi").value);

    const growCount=level-1;

    const growHp=(curHp-initHp)/growCount;
    const growAtk=(curAtk-initAtk)/growCount;
    const growDef=(curDef-initDef)/growCount;
    const growAgi=(curAgi-initAgi)/growCount;


    /* S 평균 성장 */

    const coef=495;

    const a2=(probPet.hp+4.5)*coef/10000;
    const b2=(probPet.atk+4.5)*coef/10000;
    const c2=(probPet.def+4.5)*coef/10000;
    const d2=(probPet.agi+4.5)*coef/10000;

    const sHp=(a2*4)+b2+c2+d2;
    const sAtk=(a2*0.1)+b2+(c2*0.1)+(d2*0.05);
    const sDef=(a2*0.1)+(b2*0.1)+c2+(d2*0.05);
    const sAgi=d2;


    /* 평균 대비 편차 */

    const diffHp=(growHp-sHp)*growCount;
    const diffAtk=(growAtk-sAtk)*growCount;
    const diffDef=(growDef-sDef)*growCount;
    const diffAgi=(growAgi-sAgi)*growCount;

    const total=diffHp+diffAtk+diffDef+diffAgi;


    /* 단순 확률 추정 */

    let prob=50;

    prob+=(-total*1.5);

    if(prob>99) prob=99;
    if(prob<1) prob=1;


    /* 출력 */

    document.getElementById("rank8-rate").textContent=
        prob.toFixed(1)+"%";

    document.getElementById("growth-analysis").innerHTML=
    `
    HP ${diffHp.toFixed(1)}<br>
    ATK ${diffAtk.toFixed(1)}<br>
    DEF ${diffDef.toFixed(1)}<br>
    SPD ${diffAgi.toFixed(1)}<br><br>
    TOTAL ${total.toFixed(1)}
    `;

});


/* 초기화 */

window.addEventListener("load",function(){

    initProbPetList();

});
