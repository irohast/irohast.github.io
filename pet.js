/* =====================================
   별과바다 부족 계산기 260225 수정 - by 라프땅
===================================== */

var pet = [];
var selectedPet = null;

/* ---------------------------
   펫 데이터 로드
--------------------------- */
function loadPetData(){
    $.getJSON("pets.json?v=" + new Date().getTime())
    .done(function(data){
        pet = data;
        console.log("펫 데이터 로딩 성공:", pet.length);
    })
    .fail(function(){
        alert("pets.json 로딩 실패!\n경로 또는 파일 인코딩을 확인하세요.");
    });
}
loadPetData();

/* ---------------------------
   자동완성
--------------------------- */
$("#name").on("input", function(){
    var val = $(this).val().toLowerCase();
    if(!val){
        $("#suggest").hide();
        return;
    }

    var list = pet.filter(function(p){
        return p.name.toLowerCase().indexOf(val) !== -1;
    }).slice(0,10);

    var html = "";
    for(var i=0;i<list.length;i++){
        html += "<div>"+list[i].name+"</div>";
    }

    $("#suggest").html(html).show();
});

$(document).on("click", "#suggest div", function(){
    $("#name").val($(this).text());
    $("#suggest").hide();
});

/* ---------------------------
   S초기치 계산
--------------------------- */
$("#search").click(function(){

    var name = $("#name").val();
    var found = pet.find(function(p){ return p.name===name; });

    if(!found){
        alert("해당 펫을 찾을 수 없습니다.");
        return;
    }

    selectedPet = found;

    var resultHp  = calcInit(found.hp,  found);
    var resultAtk = calcInit(found.atk, found);
    var resultDef = calcInit(found.def, found);
    var resultAgi = calcInit(found.agi, found);

    $("#hp").val(Math.floor(resultHp));
    $("#atk").val(Math.floor(resultAtk));
    $("#def").val(Math.floor(resultDef));
    $("#agi").val(Math.floor(resultAgi));

    $("#hp").data("init", resultHp);
    $("#atk").data("init", resultAtk);
    $("#def").data("init", resultDef);
    $("#agi").data("init", resultAgi);

    alert("S초기치 입력 완료!");
});

/* 초기치 계산식 */
function calcInit(stat, petData){
    var base = petData.initnum * (stat + 4.5) / 100;

    var hp  = (base*4)+base+base+base;
    var atk = (base*0.1)+base+(base*0.1)+(base*0.05);
    var def = (base*0.1)+(base*0.1)+base+(base*0.05);
    var agi = base;

    return hp;
}

/* ---------------------------
   8등급 계산 (기존 기능 유지)
--------------------------- */
$("#calculate").click(function(){

    if(!selectedPet){
        alert("먼저 펫을 검색하세요.");
        return;
    }

    var input = {
        hp: parseInt($("#hp").val()),
        atk: parseInt($("#atk").val()),
        def: parseInt($("#def").val()),
        agi: parseInt($("#agi").val())
    };

    if(isNaN(input.hp)||isNaN(input.atk)||isNaN(input.def)||isNaN(input.agi)){
        alert("스탯을 모두 입력하세요.");
        return;
    }

    var sum = input.hp+input.atk+input.def+input.agi;

    var prob = 0;

    if(sum>=110) prob=100;
    else if(sum>=105) prob=80;
    else if(sum>=100) prob=60;
    else if(sum>=95) prob=40;
    else if(sum>=90) prob=20;
    else prob=5;

    alert("예상 8등급 확률: "+prob+"%");
});

/* ---------------------------
   성장 분석 (핵심 기능)
--------------------------- */
$("#analyzeGrowth").click(function(){

    if(!selectedPet){
        alert("먼저 펫을 검색하세요.");
        return;
    }

    var level = parseInt($("#nowLevel").val());

    var nowStat={
        hp: parseInt($("#nowHp").val()),
        atk: parseInt($("#nowAtk").val()),
        def: parseInt($("#nowDef").val()),
        agi: parseInt($("#nowAgi").val())
    };

    if(isNaN(level)||isNaN(nowStat.hp)||isNaN(nowStat.atk)||isNaN(nowStat.def)||isNaN(nowStat.agi)){
        alert("현재 레벨과 스탯을 모두 입력하세요.");
        return;
    }

    var init={
        hp: parseFloat($("#hp").data("init")),
        atk: parseFloat($("#atk").data("init")),
        def: parseFloat($("#def").data("init")),
        agi: parseFloat($("#agi").data("init"))
    };

    if(!init.hp){
        alert("먼저 S초기치를 검색하세요.");
        return;
    }

    /* 성장량 */
    var growth={
        hp: nowStat.hp-init.hp,
        atk: nowStat.atk-init.atk,
        def: nowStat.def-init.def,
        agi: nowStat.agi-init.agi
    };

    /* 종족 성장 기대치 */
    var base={
        hp:selectedPet.hp*level,
        atk:selectedPet.atk*level,
        def:selectedPet.def*level,
        agi:selectedPet.agi*level
    };

    /* 성장비율 */
    var rate=(growth.hp/base.hp+growth.atk/base.atk+growth.def/base.def+growth.agi/base.agi)/4;

    var confidence=Math.max(0,Math.min(100,rate*120));

    /* 120레벨 예측 */
    var remain=120-level;

    var future={
        hp:(nowStat.hp+selectedPet.hp*remain).toFixed(1),
        atk:(nowStat.atk+selectedPet.atk*remain).toFixed(1),
        def:(nowStat.def+selectedPet.def*remain).toFixed(1),
        agi:(nowStat.agi+selectedPet.agi*remain).toFixed(1)
    };

    var grade="";
    if(confidence>85) grade="★ 8등급 확정급";
    else if(confidence>60) grade="◎ 매우 유망";
    else if(confidence>35) grade="△ 애매 (더 키워보기)";
    else grade="✗ 비추천 개체";

    var text=
    "8등급 가능성 : "+confidence.toFixed(1)+"%\n"+
    grade+"\n\n"+
    "[120레벨 예상 스탯]\n"+
    "내구력 : "+future.hp+"\n"+
    "공격력 : "+future.atk+"\n"+
    "방어력 : "+future.def+"\n"+
    "순발력 : "+future.agi;

    document.getElementById("analysisResult").innerText=text;
});