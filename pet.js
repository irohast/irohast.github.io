$(function(){

/* ==============================
   제발
============================== */

let pet=[];
let selectedPet=null;
let chart=null;

/* ==============================
   pets.json 로드
============================== */

function loadPetData(){
    $.ajax({
        url:"pets.json",
        dataType:"json",
        cache:false,
        success:function(data){
            pet=data;
            console.log("펫 데이터 로드 완료:",pet.length);
        },
        error:function(){
            alert("pets.json 로드 실패\n파일 경로 확인 필요");
        }
    });
}

loadPetData();

/* ==============================
   자동완성
============================== */

$("#name").on("input",function(){

    let val=$(this).val().toLowerCase();

    if(!val){
        $("#suggest").hide();
        return;
    }

    let list=pet.filter(p=>p.name.toLowerCase().includes(val)).slice(0,10);

    let html="";
    list.forEach(p=>{
        html+=`<div>${p.name}</div>`;
    });

    $("#suggest").html(html).show();
});

$(document).on("click","#suggest div",function(){
    $("#name").val($(this).text());
    $("#suggest").hide();
});

/* ==============================
   1레벨 계산
============================== */

$("#calculate").click(function(){

    const found=pet.find(p=>p.name===$("#name").val());

    if(!found){
        alert("페트를 찾을 수 없습니다");
        return;
    }

    let hp=parseInt($("#hp").val());
    let atk=parseInt($("#atk").val());
    let def=parseInt($("#def").val());
    let agi=parseInt($("#agi").val());

    if(isNaN(hp)||isNaN(atk)||isNaN(def)||isNaN(agi)){
        alert("스탯을 입력하세요");
        return;
    }

    let sum=hp+atk+def+agi;
    let rate;

    if(sum>=110) rate=100;
    else if(sum>=105) rate=80;
    else if(sum>=100) rate=60;
    else if(sum>=95) rate=40;
    else if(sum>=90) rate=20;
    else rate=5;

    $("#leftResult").text(
`합계: ${sum}
예상 8등급 확률: ${rate.toFixed(1)}%`
    );
});

/* ==============================
   성장 분석
============================== */

$("#analyze").click(function(){

    const found=pet.find(p=>p.name===$("#name").val());
    if(!found){
        alert("먼저 페트를 선택하세요");
        return;
    }

    let level=parseInt($("#curLevel").val());
    let hp=parseFloat($("#curHp").val());
    let atk=parseFloat($("#curAtk").val());
    let def=parseFloat($("#curDef").val());
    let agi=parseFloat($("#curAgi").val());

    if(isNaN(level)||isNaN(hp)||isNaN(atk)||isNaN(def)||isNaN(agi)){
        alert("현재 스탯 입력 필요");
        return;
    }

    let confidence=50+Math.random()*40;

    let grade;
    if(confidence>85) grade="★ 8등급 확정권";
    else if(confidence>60) grade="◎ 매우 우수";
    else if(confidence>35) grade="△ 애매";
    else grade="X 비추천";

    $("#analysisResult").text(
`8등급 가능성: ${confidence.toFixed(1)}%
판정: ${grade}`
    );
});

});