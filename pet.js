var pet = [];
let btnName = "";
const result = [];

/* ---------------- 데이터 로드 ---------------- */
function loadPetData() {
    return $.getJSON('./pets.json?v=' + new Date().getTime())
        .done(function(data) { pet = data; })
        .fail(function() { alert("데이터 로드 실패"); });
}

/* ---------------- 추천 검색 ---------------- */
function showSuggestions(inputVal) {
    inputVal = inputVal.toLowerCase();
    let matches = inputVal ? pet.filter(p => (p.name+"").toLowerCase().includes(inputVal)) : [];
    let $box = $('#pet-suggestions-box');
    let $ul = $('#pet-suggestions');
    $ul.empty();

    if(matches.length){
        matches.slice(0,10).forEach(p=>{
            $ul.append('<li>'+p.name+'</li>');
        });
        $box.show();
    }else{
        $box.hide();
    }
}

/* ---------------- S랭크 계산 ---------------- */
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

    $('#myPet tbody').append(
        '<tr class="srank">'
        + '<td>S 초기치</td>'
        + '<td>' + resultHp.toFixed(2) + '</td>'
        + '<td>' + resultAtk.toFixed(2) + '</td>'
        + '<td>' + resultDef.toFixed(2) + '</td>'
        + '<td>' + resultAgi.toFixed(2) + '</td>'
        + '<td></td>'
        + '</tr>'
    );
}

/* ---------------- 베이스 계산 ---------------- */
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

/* ---------------- 보너스 계산 ---------------- */
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

/* ---------------- 결과 추가 ---------------- */
function addData(foundPet, base, bonus) {
    const hp  = preciseRound(foundPet.initnum * (foundPet.hp  + base.hp  + bonus.hp)  / 100);
    const atk = preciseRound(foundPet.initnum * (foundPet.atk + base.atk + bonus.atk) / 100);
    const def = preciseRound(foundPet.initnum * (foundPet.def + base.def + bonus.def) / 100);
    const agi = preciseRound(foundPet.initnum * (foundPet.agi + base.agi + bonus.agi) / 100);
    
    let stat = {"rank":0,"hp":0,"atk":0,"def":0,"agi":0};

    stat.hp  = preciseRound((hp * 4) + atk + def + agi);
    stat.atk = preciseRound((hp * 0.1) + atk + (def * 0.1) + (agi * 0.05));
    stat.def = preciseRound((hp * 0.1) + (atk * 0.1) + def + (agi * 0.05));
    stat.agi = agi;

    result.push(stat);
}

/* ---------------- 출력 ---------------- */
function print() {
    $('#result tbody').empty();
    for (let i = 0; i < result.length && i < 300; i++) {
        $('#result tbody').append(
            '<tr>'
            + '<td>' + (i+1) + '</td>'
            + '<td>' + result[i].rank + '</td>'
            + '<td>' + result[i].hp.toFixed(2) + '</td>'
            + '<td>' + result[i].atk.toFixed(2) + '</td>'
            + '<td>' + result[i].def.toFixed(2) + '</td>'
            + '<td>' + result[i].agi.toFixed(2) + '</td>'
            + '</tr>'
        );
    }
}

/* ---------------- 공통 ---------------- */
function preciseRound(num) {
    return Math.round(num * 1e12) / 1e12;
}

/* ---------------- 이벤트 ---------------- */
$(document).ready(function(){

    loadPetData();

    $("#name").on("input",function(){
        showSuggestions($(this).val());
    });

    $(document).on("mousedown","#pet-suggestions li",function(){
        $("#name").val($(this).text());
        $("#pet-suggestions-box").hide();
        $("#search").click();
    });

    $("#search, #calculate").on("click", function(){
        if (pet.length === 0) return;

        const foundPet = pet.find(p => p.name === $("#name").val());
        if (!foundPet){
            alert("페트 정보를 찾을 수 없습니다.");
            return;
        }

        btnName = this.id;
        $("#myPet").show();
        $("#result-master-container").show();

        const copiedPet = JSON.parse(JSON.stringify(foundPet));
        setSRank(copiedPet);
        setBase(foundPet);
    });

    $(window).scroll(function(){
        if($(this).scrollTop()>100) $('#btnTop').fadeIn();
        else $('#btnTop').fadeOut();
    });

    $('#btnTop').click(function(){
        $('html, body').animate({scrollTop:0},400);
    });
});