// 전역 변수 가정: pet, btnName, result

function setSRank(copiedPet) {
    $(".srank").remove();

    let rank = 0;
    const statSum = copiedPet.hp + copiedPet.atk + copiedPet.def + copiedPet.agi;

    if (copiedPet.rank > 0) {
        rank = copiedPet.rank;
    } else if (statSum >= 110) { rank = 435; }
    else if (statSum >= 105) { rank = 455; }
    else if (statSum >= 100) { rank = 475; }
    else if (statSum >= 95)  { rank = 495; }
    else if (statSum >= 90)  { rank = 515; }
    else if (statSum >= 85)  { rank = 535; }
    else if (statSum >= 80)  { rank = 555; }
    else { rank = 575; }

    const calcHp  = preciseRound(copiedPet.initnum * (copiedPet.hp + 4.5) / 100);
    const calcAtk = preciseRound(copiedPet.initnum * (copiedPet.atk + 4.5) / 100);
    const calcDef = preciseRound(copiedPet.initnum * (copiedPet.def + 4.5) / 100);
    const calcAgi = preciseRound(copiedPet.initnum * (copiedPet.agi + 4.5) / 100);

    const resultHp  = preciseRound((calcHp * 4) + calcAtk + calcDef + calcAgi);
    const resultAtk = preciseRound((calcHp * 0.1) + calcAtk + (calcDef * 0.1) + (calcAgi * 0.05));
    const resultDef = preciseRound((calcHp * 0.1) + (calcAtk * 0.1) + calcDef + (calcAgi * 0.05));
    const resultAgi = calcAgi;

    const upHp  = preciseRound((copiedPet.hp + 4.5) * rank / 10000);
    const upAtk = preciseRound((copiedPet.atk + 4.5) * rank / 10000);
    const upDef = preciseRound((copiedPet.def + 4.5) * rank / 10000);
    const upAgi = preciseRound((copiedPet.agi + 4.5) * rank / 10000);
    
    const resultUpHp  = preciseRound((upHp * 4) + upAtk + upDef + upAgi);
    const resultUpAtk = preciseRound((upHp * 0.1) + upAtk + (upDef * 0.1) + (upAgi * 0.05));
    const resultUpDef = preciseRound((upHp * 0.1) + (upAtk * 0.1) + upDef + (upAgi * 0.05));
    const resultUpAgi = upAgi;
    const resultSum   = preciseRound(resultUpAtk + resultUpDef + resultUpAgi);

    $('#myPet tbody').append(
        '<tr class="srank">' +
        '<td id="srank-label">S 초기치</td>' +
        '<td>' + limitDecimalPlaces(resultHp, 2) + '</td>' +
        '<td>' + limitDecimalPlaces(resultAtk, 2) + '</td>' +
        '<td>' + limitDecimalPlaces(resultDef, 2) + '</td>' +
        '<td>' + limitDecimalPlaces(resultAgi, 2) + '</td>' +
        '<td></td></tr>' +

        '<tr class="srank">' +
        '<td>S 성장률</td>' +
        '<td>' + resultUpHp.toFixed(2) + '</td>' +
        '<td>' + resultUpAtk.toFixed(2) + '</td>' +
        '<td>' + resultUpDef.toFixed(2) + '</td>' +
        '<td>' + resultUpAgi.toFixed(2) + '</td>' +
        '<td>' + resultSum.toFixed(2) + '</td></tr>'
    );

    if (btnName == "search") {
        $("#hp").val(parseInt(resultHp, 10));
        $("#atk").val(parseInt(resultAtk, 10));
        $("#def").val(parseInt(resultDef, 10));
        $("#agi").val(parseInt(resultAgi, 10));

        // ★★★ 매우 중요 : 1레벨 초기치 저장 (성장 감정용)
        $("#hp").data("init", resultHp);
        $("#atk").data("init", resultAtk);
        $("#def").data("init", resultDef);
        $("#agi").data("init", resultAgi);
    }
}

/* -------------------------------
   성장 기반 8등급 확신도 계산기
-------------------------------- */

function estimateRankConfidence(foundPet, level, nowStat){

    const growCount = level - 1;

    const g = {
        hp: foundPet.hp,
        atk: foundPet.atk,
        def: foundPet.def,
        agi: foundPet.agi
    };

    const init = {
        hp: parseFloat($("#hp").data("init")),
        atk: parseFloat($("#atk").data("init")),
        def: parseFloat($("#def").data("init")),
        agi: parseFloat($("#agi").data("init"))
    };

    if(!init.hp) {
        return { avgB:"?", confidence:"0" };
    }

    let growth = {
        hp: nowStat.hp - init.hp,
        atk: nowStat.atk - init.atk,
        def: nowStat.def - init.def,
        agi: nowStat.agi - init.agi
    };

    let baseGrowth = {
        hp: g.hp * growCount,
        atk: g.atk * growCount,
        def: g.def * growCount,
        agi: g.agi * growCount
    };

    function calcB(growth, base){
        if(base<=0 || growth<=0) return 999;
        return (growth/base)*10000;
    }

    let B = {
        hp: calcB(growth.hp, baseGrowth.hp),
        atk: calcB(growth.atk, baseGrowth.atk),
        def: calcB(growth.def, baseGrowth.def),
        agi: calcB(growth.agi, baseGrowth.agi)
    };

    let avgB = (B.hp+B.atk+B.def+B.agi)/4;

    let dist = Math.abs(avgB-450);
    let raw = Math.max(0,100 - dist*0.6);

    // 레벨 신뢰도 보정
    let reliability = Math.min(1, level/90);
    let confidence = raw*reliability;

    return {
        avgB: avgB.toFixed(2),
        confidence: confidence.toFixed(1)
    };
}

/* ---------- 공통 ---------- */

function limitDecimalPlaces(number, places) {
    var power = Math.pow(10, places);
    return (Math.floor(number * power) / power).toFixed(places);
}

function preciseRound(num) {
    return Math.round(num * 1e12) / 1e12;
}
