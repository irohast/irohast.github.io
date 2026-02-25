/* ======================================================
별과바다 부족 계산기 - pet.js
오픈소스 로직 호환 버전 (jQuery ready 기반 유지)
====================================================== */

let pet = [];
let btnName = "";
const result = [];
let chart = null;

/* ------------------ 공통 유틸 ------------------ */

function preciseRound(num){
return Math.round(num * 1e12) / 1e12;
}
function limitDecimalPlaces(number, places){
const power = Math.pow(10, places);
return (Math.floor(number * power) / power).toFixed(places);
}

/* ------------------ 데이터 로드 ------------------ */

function loadPetData(){
return $.getJSON('./pets.json?v=' + new Date().getTime())
.done(function(data){
// ㄱㄴㄷ 정렬
pet = data.sort((a,b)=>a.name.localeCompare(b.name,'ko'));
buildSuggestionList();
})
.fail(function(){
alert("pets.json 로드 실패 (파일 경로 확인)");
});
}

/* ------------------ 자동완성 ------------------ */

function buildSuggestionList(){
const ul = $("#pet-suggestions");
ul.empty();
pet.forEach(p=>{
ul.append(`<li>${p.name}</li>`);
});
}

function filterSuggestions(txt){
txt = txt.trim();
const ul = $("#pet-suggestions");
ul.empty();

```
let list = pet;
if(txt.length>0){
    list = pet.filter(p=>p.name.startsWith(txt));
}

list.forEach(p=>{
    ul.append(`<li>${p.name}</li>`);
});
```

}

/* ------------------ S초기치 계산 ------------------ */

function setSRank(copiedPet){

```
$(".srank").remove();

let rank = 0;
const statSum = copiedPet.hp + copiedPet.atk + copiedPet.def + copiedPet.agi;

if(copiedPet.rank>0) rank=copiedPet.rank;
else if(statSum>=110) rank=435;
else if(statSum>=105) rank=455;
else if(statSum>=100) rank=475;
else if(statSum>=95) rank=495;
else if(statSum>=90) rank=515;
else if(statSum>=85) rank=535;
else if(statSum>=80) rank=555;
else rank=575;

const calcHp  = preciseRound(copiedPet.initnum*(copiedPet.hp+4.5)/100);
const calcAtk = preciseRound(copiedPet.initnum*(copiedPet.atk+4.5)/100);
const calcDef = preciseRound(copiedPet.initnum*(copiedPet.def+4.5)/100);
const calcAgi = preciseRound(copiedPet.initnum*(copiedPet.agi+4.5)/100);

const resultHp  = preciseRound((calcHp*4)+calcAtk+calcDef+calcAgi);
const resultAtk = preciseRound((calcHp*0.1)+calcAtk+(calcDef*0.1)+(calcAgi*0.05));
const resultDef = preciseRound((calcHp*0.1)+(calcAtk*0.1)+calcDef+(calcAgi*0.05));
const resultAgi = calcAgi;

const upHp  = preciseRound((copiedPet.hp+4.5)*rank/10000);
const upAtk = preciseRound((copiedPet.atk+4.5)*rank/10000);
const upDef = preciseRound((copiedPet.def+4.5)*rank/10000);
const upAgi = preciseRound((copiedPet.agi+4.5)*rank/10000);

const resultUpHp  = preciseRound((upHp*4)+upAtk+upDef+upAgi);
const resultUpAtk = preciseRound((upHp*0.1)+upAtk+(upDef*0.1)+(upAgi*0.05));
const resultUpDef = preciseRound((upHp*0.1)+(upAtk*0.1)+upDef+(upAgi*0.05));
const resultUpAgi = upAgi;
const resultSum   = preciseRound(resultUpAtk+resultUpDef+resultUpAgi);

$('#myPet tbody').append(`
<tr class="srank">
    <td><b>S 초기치</b></td>
    <td>${limitDecimalPlaces(resultHp,2)}</td>
    <td>${limitDecimalPlaces(resultAtk,2)}</td>
    <td>${limitDecimalPlaces(resultDef,2)}</td>
    <td>${limitDecimalPlaces(resultAgi,2)}</td>
</tr>
<tr class="srank">
    <td><b>S 성장률</b></td>
    <td>${resultUpHp.toFixed(2)}</td>
    <td>${resultUpAtk.toFixed(2)}</td>
    <td>${resultUpDef.toFixed(2)}</td>
    <td>${resultUpAgi.toFixed(2)}</td>
</tr>`);

$("#myPet").show();
```

}

/* ------------------ 그래프 ------------------ */

function drawGraph(){
const ctx = document.getElementById("graphArea");

```
if(chart) chart.destroy();

let labels=[];
let hp=[],atk=[],def=[],agi=[],sum=[];

let baseHp=Number($("#curHp").val());
let baseAtk=Number($("#curAtk").val());
let baseDef=Number($("#curDef").val());
let baseAgi=Number($("#curAgi").val());
let curLv=Number($("#curLv").val());

for(let lv=curLv; lv<=150; lv++){
    labels.push(lv);

    baseHp+=0.8;
    baseAtk+=0.25;
    baseDef+=0.22;
    baseAgi+=0.24;

    hp.push(baseHp);
    atk.push(baseAtk);
    def.push(baseDef);
    agi.push(baseAgi);
    sum.push(baseAtk+baseDef+baseAgi);
}

chart=new Chart(ctx,{
    type:'line',
    data:{
        labels:labels,
        datasets:[
        {label:'내구력',data:hp,borderColor:'#ff6b6b',fill:false},
        {label:'공격력',data:atk,borderColor:'#4dabf7',fill:false},
        {label:'방어력',data:def,borderColor:'#51cf66',fill:false},
        {label:'순발력',data:agi,borderColor:'#fcc419',fill:false},
        {label:'총성장(내구제외)',data:sum,borderColor:'#845ef7',fill:false}
        ]
    },
    options:{
        responsive:true,
        interaction:{mode:'index',intersect:false},
        plugins:{legend:{position:'bottom'}},
        scales:{x:{title:{display:true,text:'레벨'}},y:{title:{display:true,text:'능력치'}}}
    }
});
```

}

/* ------------------ 이벤트 ------------------ */

$(document).ready(function(){

```
loadPetData();

// 자동완성 입력
$("#name").on("input",function(){
    filterSuggestions($(this).val());
});

// 리스트 클릭
$(document).on("click","#pet-suggestions li",function(){
    const name=$(this).text();
    $("#name").val(name);

    const found=pet.find(p=>p.name===name);
    if(found){
        $("#myPet tbody").empty();
        setSRank(JSON.parse(JSON.stringify(found)));
    }
});

// 성장 그래프
$("#growthCheck").click(function(){
    drawGraph();
});
```

});
