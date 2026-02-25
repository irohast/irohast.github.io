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

    $('#myPet tbody').append(''
        + '<tr class="srank">'
        + '<td id="srank-label" style="vertical-align: middle;">S 초기치</td>'
        + '<td>' + limitDecimalPlaces(resultHp, 2) + '</td>'
        + '<td>' + limitDecimalPlaces(resultAtk, 2) + '</td>'
        + '<td>' + limitDecimalPlaces(resultDef, 2) + '</td>'
        + '<td>' + limitDecimalPlaces(resultAgi, 2) + '</td>'
        + '<td></td>'
        + '</tr>'
        + '<tr class="srank">'
        + '<td>S 성장률</td>'
        + '<td>' + resultUpHp.toFixed(2) + '</td>'
        + '<td>' + resultUpAtk.toFixed(2) + '</td>'
        + '<td>' + resultUpDef.toFixed(2) + '</td>'
        + '<td>' + resultUpAgi.toFixed(2) + '</td>'
        + '<td>' + resultSum.toFixed(2) + '</td>'
        + '</tr>'
    );

    if (btnName == "search") {
        $("#hp").val(parseInt(resultHp, 10));
        $("#atk").val(parseInt(resultAtk, 10));
        $("#def").val(parseInt(resultDef, 10));
        $("#agi").val(parseInt(resultAgi, 10));
    }
}

function setBase(foundPet) {
    $('#result tbody').empty();
    result.length = 0;
    const baseInit = -2;
    let base = {"hp":-2,"atk":-2,"def":-2,"agi":-2};
    
    for (let i = 0; i < 5; i++) {
        for (let ii = 0; ii < 5; ii++) {
            for (let iii = 0; iii < 5; iii++) {
                for (let iiii = 0; iiii < 5; iiii++) {
                    setBonus(foundPet, base);
                    base.hp++;
                    if (base.hp == 3) base.hp = baseInit;
                }
                base.atk++;
                if (base.atk == 3) base.atk = baseInit;
            }
            base.def++;
            if (base.def == 3) base.def = baseInit;
        }
        base.agi++;
        if (base.agi == 3) base.agi = baseInit;
    }
    print();
}

function setBonus(foundPet, base) {
    let bonus = {"hp":0,"atk":0,"def":0,"agi":0};
    for (let i = 0; i < 11; i++) {
        for (let ii = 0; ii < 11; ii++) {
            for (let iii = 0; iii < 11; iii++) {
                for (let iiii = 0; iiii < 11; iiii++) {
                    if (bonus.hp + bonus.atk + bonus.def + bonus.agi == 10) {
                        addData(foundPet, base, bonus);
                    }
                    bonus.hp++;
                    if (bonus.hp == 11) bonus.hp = 0;
                }
                bonus.atk++;
                if (bonus.atk == 11) bonus.atk = 0;
            }
            bonus.def++;
            if (bonus.def == 11) bonus.def = 0;
        }
        bonus.agi++;
        if (bonus.agi == 11) bonus.agi = 0;
    }
}

function addData(foundPet, base, bonus) {
    const hp  = preciseRound(foundPet.initnum * (foundPet.hp  + base.hp  + bonus.hp)  / 100);
    const atk = preciseRound(foundPet.initnum * (foundPet.atk + base.atk + bonus.atk) / 100);
    const def = preciseRound(foundPet.initnum * (foundPet.def + base.def + bonus.def) / 100);
    const agi = preciseRound(foundPet.initnum * (foundPet.agi + base.agi + bonus.agi) / 100);
    
    let stat = {"rank":0,"hp":0,"atk":0,"def":0,"agi":0,"baseHp":0,"baseAtk":0,"baseDef":0,"baseAgi":0,"bonusHp":0,"bonusAtk":0,"bonusDef":0,"bonusAgi":0};
    
    stat.hp  = preciseRound((hp * 4) + atk + def + agi);
    stat.atk = preciseRound((hp * 0.1) + atk + (def * 0.1) + (agi * 0.05));
    stat.def = preciseRound((hp * 0.1) + (atk * 0.1) + def + (agi * 0.05));
    stat.agi = agi;

    if (btnName == "calculate") {
        if (Math.floor(stat.hp)  === parseInt($("#hp").val(), 10) &&
            Math.floor(stat.atk) === parseInt($("#atk").val(), 10) &&
            Math.floor(stat.def) === parseInt($("#def").val(), 10) &&
            Math.floor(stat.agi) === parseInt($("#agi").val(), 10)) {
            stat.rank     = base.hp + base.atk + base.def + base.agi;
            stat.baseHp   = base.hp; stat.baseAtk  = base.atk; stat.baseDef  = base.def; stat.baseAgi  = base.agi;
            stat.bonusHp  = bonus.hp; stat.bonusAtk = bonus.atk; stat.bonusDef = bonus.def; stat.bonusAgi = bonus.agi;
            result.push(stat);
        }
    } else if (btnName == "search") {
        if (base.hp + base.atk + base.def + base.agi == 8) {
            stat.rank     = 8;
            stat.baseHp   = base.hp; stat.baseAtk  = base.atk; stat.baseDef  = base.def; stat.baseAgi  = base.agi;
            stat.bonusHp  = bonus.hp; stat.bonusAtk = bonus.atk; stat.bonusDef = bonus.def; stat.bonusAgi = bonus.agi;
            result.push(stat);
        }
    }
}

function print() {
    result.sort((a, b) => b.rank - a.rank || b.hp - a.hp);

    $('#result tbody').empty();
    for (let i = 0; i < result.length; i++) {
        $('#result tbody').append(''
            + '<tr>'
            + '<td>' + (i + 1) + '</td>'
            + '<td class="' + (result[i].rank === 8 ? 'text-danger' : '') + '">' + result[i].rank + '</td>'
            + '<td>' + limitDecimalPlaces(result[i].hp,  2) + '[' + result[i].baseHp  + '](' + result[i].bonusHp  + ')</td>'
            + '<td>' + limitDecimalPlaces(result[i].atk, 2) + '[' + result[i].baseAtk + '](' + result[i].bonusAtk + ')</td>'
            + '<td>' + limitDecimalPlaces(result[i].def, 2) + '[' + result[i].baseDef + '](' + result[i].bonusDef + ')</td>'
            + '<td>' + limitDecimalPlaces(result[i].agi, 2) + '[' + result[i].baseAgi + '](' + result[i].bonusAgi + ')</td>'
            + '</tr>'
        );
        if (i + 1 >= 300) break;
    }
}

function limitDecimalPlaces(number, places) {
    var power = Math.pow(10, places);
    return (Math.floor(number * power) / power).toFixed(places);
}

function preciseRound(num) {
    return Math.round(num * 1e12) / 1e12;
}