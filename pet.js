let pet = [];
let selectedPet = null;

/* 펫 데이터 로드 */
$(function(){
    $.getJSON("./pets.json?v="+Date.now(),function(data){
        pet=data;
    });
});

/* 자동완성 */
$("#name").on("input",function(){
    let val=this.value.toLowerCase();
    if(!val){$("#suggest").hide();return;}

    let list=pet.filter(p=>p.name.toLowerCase().includes(val)).slice(0,10);
    let html="";
    list.forEach(p=>html+="<div>"+p.name+"</div>");
    $("#suggest").html(html).show();
});

$(document).on("click","#suggest div",function(){
    $("#name").val($(this).text());
    $("#suggest").hide();
    selectedPet=pet.find(p=>p.name===$(this).text());
});

/* 1레벨 계산 */
$("#calculate").click(function(){
    if(!selectedPet){
        alert("페트를 먼저 선택하세요");
        return;
    }

    const hp=parseInt($("#hp").val());
    const atk=parseInt($("#atk").val());
    const def=parseInt($("#def").val());
    const agi=parseInt($("#agi").val());

    let sum = hp+atk+def+agi;

    let result="";
    if(sum>=95) result="🔥 매우 높은 8등급 확률";
    else if(sum>=90) result="🟡 8등급 가능성 있음";
    else result="❌ 낮은 개체";

    $("#leftResult").text("초기치 합계: "+sum+"\n판정: "+result);
});

/* 성장 분석 */
$("#analyze").click(function(){

    if(!selectedPet){
        alert("페트를 먼저 선택하세요");
        return;
    }

    const level=parseInt($("#curLevel").val());
    const hp=parseFloat($("#curHp").val());
    const atk=parseFloat($("#curAtk").val());
    const def=parseFloat($("#curDef").val());
    const agi=parseFloat($("#curAgi").val());

    if(level<5){
        $("#analysisResult").text("레벨이 너무 낮아 분석 불가 (최소 10레벨 권장)");
        return;
    }

    const growth={
        hp:hp/level,
        atk:atk/level,
        def:def/level,
        agi:agi/level
    };

    const base={
        hp:selectedPet.hp,
        atk:selectedPet.atk,
        def:selectedPet.def,
        agi:selectedPet.agi
    };

    let ratio=(growth.hp/base.hp+growth.atk/base.atk+growth.def/base.def+growth.agi/base.agi)/4;
    let confidence=Math.min(99,Math.max(0,(ratio-0.9)*200));

    let text=
        "성장 적합도: "+(ratio*100).toFixed(1)+"%\n"+
        "8등급 확신도: "+confidence.toFixed(1)+"%";

    $("#analysisResult").text(text);

    drawGraph(level,growth,base);
});

/* 그래프 */
let chart=null;
function drawGraph(level,growth,base){

    const labels=[];
    const hp=[],atk=[],def=[],agi=[];

    for(let l=1;l<=150;l++){
        labels.push(l);
        hp.push(growth.hp*l);
        atk.push(growth.atk*l);
        def.push(growth.def*l);
        agi.push(growth.agi*l);
    }

    if(chart) chart.destroy();

    chart=new Chart(document.getElementById("statChart"),{
        type:"line",
        data:{
            labels:labels,
            datasets:[
                {label:"내구력",data:hp,borderWidth:2},
                {label:"공격력",data:atk,borderWidth:2},
                {label:"방어력",data:def,borderWidth:2},
                {label:"순발력",data:agi,borderWidth:2}
            ]
        },
        options:{
            responsive:false,
            scales:{y:{beginAtZero:true}}
        }
    });

}
