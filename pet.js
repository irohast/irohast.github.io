/* ==================================================
   별과바다 부족 계산기 엔진 26.02.25 - by 라프땅
================================================== */

let pet = [];
let selectedPet = null;
let chart = null;

/* ---------------- 데이터 로드 ---------------- */

function loadPetData(){
    $.getJSON("pets.json?v="+Date.now())
    .done(function(data){
        pet = data;
        console.log("pets.json 로드 성공:", pet.length);
    })
    .fail(function(){
        alert("pets.json 로드 실패 (파일 위치 또는 인코딩 확인)");
    });
}

loadPetData();


/* ---------------- 자동완성 ---------------- */

$("#name").on("input", function(){
    const val = $(this).val().toLowerCase();

    if(!val){
        $("#suggest").hide();
        return;
    }

    const list = pet.filter(p => p.name.toLowerCase().includes(val)).slice(0,10);

    let html="";
    list.forEach(p=>{
        html += `<div>${p.name}</div>`;
    });

    $("#suggest").html(html).show();
});

$(document).on("click","#suggest div",function(){
    $("#name").val($(this).text());
    $("#suggest").hide();
});


/* ---------------- 1레벨 8등급 계산 ---------------- */

$("#calculate").click(function(){

    const name=$("#name").val();
    const found=pet.find(p=>p.name===name);

    if(!found){
        alert("페트를 찾을 수 없습니다");
        return;
    }

    const hp=parseInt($("#hp").val());
    const atk=parseInt($("#atk").val());
    const def=parseInt($("#def").val());
    const agi=parseInt($("#agi").val());

    if(isNaN(hp)||isNaN(atk)||isNaN(def)||isNaN(agi)){
        alert("스탯을 입력하세요");
        return;
    }

    const sum = hp+atk+def+agi;

    let rate;

    if(sum>=110) rate=100;
    else if(sum>=105) rate=80;
    else if(sum>=100) rate=60;
    else if(sum>=95) rate=40;
    else if(sum>=90) rate=20;
    else rate=5;

    $("#leftResult").html(
`입력 합계 : ${sum}

예상 8등급 확률 :
${rate.toFixed(1)} %`
    );

});


/* ---------------- 성장 분석 ---------------- */

$("#analyze").click(function(){

    const name=$("#name").val();
    const found=pet.find(p=>p.name===name);

    if(!found){
        alert("먼저 페트를 검색하세요");
        return;
    }

    const level=parseInt($("#curLevel").val());
    const hp=parseFloat($("#curHp").val());
    const atk=parseFloat($("#curAtk").val());
    const def=parseFloat($("#curDef").val());
    const agi=parseFloat($("#curAgi").val());

    if(isNaN(level)||isNaN(hp)||isNaN(atk)||isNaN(def)||isNaN(agi)){
        alert("현재 스탯을 모두 입력하세요");
        return;
    }

    /* 성장률 추정 */

    const growthHp = (hp-found.init_hp)/level;
    const growthAtk = (atk-found.init_atk)/level;
    const growthDef = (def-found.init_def)/level;
    const growthAgi = (agi-found.init_agi)/level;

    const avg = (growthHp/growthAgi + growthAtk/growthDef) /2;

    let confidence = Math.max(0, Math.min(100, 100 - Math.abs(avg-1)*120));

    let grade;

    if(confidence>85) grade="★ 8등급 확정권";
    else if(confidence>60) grade="◎ 매우 우수";
    else if(confidence>35) grade="△ 애매 (더 키워보기)";
    else grade="X 비추천 개체";

    $("#analysisResult").html(
`8등급 가능성 : ${confidence.toFixed(1)} %

판정 : ${grade}`
    );

    drawChart(found, level, hp, atk, def, agi);

});


/* ---------------- 그래프 ---------------- */

function drawChart(found, level, hp, atk, def, agi){

    const labels=[];
    const hpArr=[], atkArr=[], defArr=[], agiArr=[];

    for(let i=1;i<=150;i++){
        labels.push(i);

        hpArr.push(found.init_hp + (hp-found.init_hp)/level*i);
        atkArr.push(found.init_atk + (atk-found.init_atk)/level*i);
        defArr.push(found.init_def + (def-found.init_def)/level*i);
        agiArr.push(found.init_agi + (agi-found.init_agi)/level*i);
    }

    const ctx=document.getElementById("statChart");

    if(chart) chart.destroy();

    chart=new Chart(ctx,{
        type:'line',
        data:{
            labels:labels,
            datasets:[
                {label:'내구력',data:hpArr,borderColor:'red'},
                {label:'공격력',data:atkArr,borderColor:'orange'},
                {label:'방어력',data:defArr,borderColor:'green'},
                {label:'순발력',data:agiArr,borderColor:'blue'}
            ]
        },
        options:{
            responsive:false,
            animation:false
        }
    });
}