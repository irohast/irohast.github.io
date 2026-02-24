/* ===============================
   별과바다 펫 계산 엔진 (완전 수정본)
   그대로 덮어쓰기용 260205
================================ */

var pet=[];
let btnName="";
const result=[];

/* ---------------- 정밀 반올림 ---------------- */
function preciseRound(num){
    return Math.round(num * 1e12) / 1e12;
}

function limitDecimalPlaces(number, places){
    const power=Math.pow(10,places);
    return (Math.floor(number*power)/power).toFixed(places);
}

/* ---------------- S초기치 계산 ---------------- */
function setSRank(copiedPet){

    $("#myPet tbody").empty();

    let rank=0;
    const statSum=copiedPet.hp+copiedPet.atk+copiedPet.def+copiedPet.agi;

    if(copiedPet.rank>0) rank=copiedPet.rank;
    else if(statSum>=110) rank=435;
    else if(statSum>=105) rank=455;
    else if(statSum>=100) rank=475;
    else if(statSum>=95)  rank=495;
    else if(statSum>=90)  rank=515;
    else if(statSum>=85)  rank=535;
    else if(statSum>=80)  rank=555;
    else rank=575;

    const calcHp  = preciseRound(copiedPet.initnum*(copiedPet.hp+4.5)/100);
    const calcAtk = preciseRound(copiedPet.initnum*(copiedPet.atk+4.5)/100);
    const calcDef = preciseRound(copiedPet.initnum*(copiedPet.def+4.5)/100);
    const calcAgi = preciseRound(copiedPet.initnum*(copiedPet.agi+4.5)/100);

    const resultHp  = preciseRound((calcHp*4)+calcAtk+calcDef+calcAgi);
    const resultAtk = preciseRound((calcHp*0.1)+calcAtk+(calcDef*0.1)+(calcAgi*0.05));
    const resultDef = preciseRound((calcHp*0.1)+(calcAtk*0.1)+calcDef+(calcAgi*0.05));
    const resultAgi = calcAgi;

    $('#myPet tbody').append(`
        <tr>
        <td>S 초기치</td>
        <td>${limitDecimalPlaces(resultHp,2)}</td>
        <td>${limitDecimalPlaces(resultAtk,2)}</td>
        <td>${limitDecimalPlaces(resultDef,2)}</td>
        <td>${limitDecimalPlaces(resultAgi,2)}</td>
        </tr>
    `);

    $("#hp").val(parseInt(resultHp));
    $("#atk").val(parseInt(resultAtk));
    $("#def").val(parseInt(resultDef));
    $("#agi").val(parseInt(resultAgi));

    $("#hp").data("init",resultHp);
    $("#atk").data("init",resultAtk);
    $("#def").data("init",resultDef);
    $("#agi").data("init",resultAgi);
}

/* ---------------- 8등급 탐색 ---------------- */
function setBase(foundPet){

    $('#result tbody').empty();
    result.length=0;

    let rankCount={};

    for(let b1=-2;b1<=2;b1++)
    for(let b2=-2;b2<=2;b2++)
    for(let b3=-2;b3<=2;b3++)
    for(let b4=-2;b4<=2;b4++){

        const hp  = preciseRound(foundPet.initnum*(foundPet.hp+b1)/100);
        const atk = preciseRound(foundPet.initnum*(foundPet.atk+b2)/100);
        const def = preciseRound(foundPet.initnum*(foundPet.def+b3)/100);
        const agi = preciseRound(foundPet.initnum*(foundPet.agi+b4)/100);

        const statHp  = Math.floor((hp*4)+atk+def+agi);
        const statAtk = Math.floor((hp*0.1)+atk+(def*0.1)+(agi*0.05));
        const statDef = Math.floor((hp*0.1)+(atk*0.1)+def+(agi*0.05));
        const statAgi = Math.floor(agi);

        if(
            statHp===$("#hp").val()*1 &&
            statAtk===$("#atk").val()*1 &&
            statDef===$("#def").val()*1 &&
            statAgi===$("#agi").val()*1
        ){
            const rank=b1+b2+b3+b4;
            rankCount[rank]=(rankCount[rank]||0)+1;
        }
    }

    let total=0;
    Object.values(rankCount).forEach(v=>total+=v);

    let sRate=0;
    if(rankCount[8]) sRate=(rankCount[8]/total*100).toFixed(2);

    alert(`[${$("#name").val()}] 계산 완료\n8등급 확률 : ${sRate}%`);
}

/* ---------------- 현재레벨 기반 예측 ---------------- */
function analyzeGrowth(foundPet){

    const level=parseInt($("#curLevel").val());
    if(!level) return alert("현재 레벨을 입력하세요");

    const now={
        hp:parseFloat($("#curHp").val()),
        atk:parseFloat($("#curAtk").val()),
        def:parseFloat($("#curDef").val()),
        agi:parseFloat($("#curAgi").val())
    };

    const init={
        hp:parseFloat($("#hp").data("init")),
        atk:parseFloat($("#atk").data("init")),
        def:parseFloat($("#def").data("init")),
        agi:parseFloat($("#agi").data("init"))
    };

    let growth={
        hp:now.hp-init.hp,
        atk:now.atk-init.atk,
        def:now.def-init.def,
        agi:now.agi-init.agi
    };

    let base={
        hp:foundPet.hp*level,
        atk:foundPet.atk*level,
        def:foundPet.def*level,
        agi:foundPet.agi*level
    };

    let B={
        hp:growth.hp/base.hp*10000,
        atk:growth.atk/base.atk*10000,
        def:growth.def/base.def*10000,
        agi:growth.agi/base.agi*10000
    };

    const avgB=(B.hp+B.atk+B.def+B.agi)/4;

    let confidence=Math.max(0,100-Math.abs(avgB-450)*0.6);

    /* 120레벨 예상치 */
    const futureLevel=120;
    let future={
        hp:(foundPet.hp*(futureLevel))+init.hp,
        atk:(foundPet.atk*(futureLevel))+init.atk,
        def:(foundPet.def*(futureLevel))+init.def,
        agi:(foundPet.agi*(futureLevel))+init.agi
    };

    $("#analysisResult").html(`
        <b>추정 B값 :</b> ${avgB.toFixed(2)}<br>
        <b>8등급 확신도 :</b> <span style="color:#4ef08a">${confidence.toFixed(1)}%</span>
        <hr>
        <b>120레벨 예상 스탯</b><br>
        내구력: ${future.hp.toFixed(1)}<br>
        공격력: ${future.atk.toFixed(1)}<br>
        방어력: ${future.def.toFixed(1)}<br>
        순발력: ${future.agi.toFixed(1)}
    `);
}