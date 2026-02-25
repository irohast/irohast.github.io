var pet = [];
let btnName = "";
const result = [];

/* 데이터 로드 */
function loadPetData(){
    return $.getJSON('./pets.json?v=' + new Date().getTime())
        .done(data => pet = data)
        .fail(()=>alert("pets.json 로드 실패"));
}

/* 자동완성 */
function showSuggestions(val){
    let matches = pet.filter(p=>p.name.includes(val));
    let ul=$("#pet-suggestions");
    ul.empty();
    matches.slice(0,10).forEach(p=>{
        ul.append(`<li style="cursor:pointer;padding:6px;">${p.name}</li>`);
    });
}

/* 이름 입력시 자동 계산 */
function autoCalculate(name){
    const found = pet.find(p=>p.name===name);
    if(!found) return;

    btnName="search";
    $("#myPet").show();
    $("#result-master-container").show();

    const copied=JSON.parse(JSON.stringify(found));
    setSRank(copied);
    setBase(found);
}

/* S초기치 + S성장률 */
function setSRank(p){
    $(".srank").remove();

    let rank=0;
    const sum=p.hp+p.atk+p.def+p.agi;

    if(p.rank>0) rank=p.rank;
    else if(sum>=110)rank=435;
    else if(sum>=105)rank=455;
    else if(sum>=100)rank=475;
    else if(sum>=95)rank=495;
    else if(sum>=90)rank=515;
    else if(sum>=85)rank=535;
    else if(sum>=80)rank=555;
    else rank=575;

    const hp=p.initnum*(p.hp+4.5)/100;
    const atk=p.initnum*(p.atk+4.5)/100;
    const def=p.initnum*(p.def+4.5)/100;
    const agi=p.initnum*(p.agi+4.5)/100;

    const rHp=(hp*4)+atk+def+agi;
    const rAtk=(hp*0.1)+atk+(def*0.1)+(agi*0.05);
    const rDef=(hp*0.1)+(atk*0.1)+def+(agi*0.05);

    const upHp=(p.hp+4.5)*rank/10000;
    const upAtk=(p.atk+4.5)*rank/10000;
    const upDef=(p.def+4.5)*rank/10000;
    const upAgi=(p.agi+4.5)*rank/10000;

    const sumUp=(upAtk+upDef+upAgi).toFixed(2);

    $('#myPet tbody').html(`
    <tr class="srank">
    <td>S 초기치</td>
    <td>${rHp.toFixed(2)}</td>
    <td>${rAtk.toFixed(2)}</td>
    <td>${rDef.toFixed(2)}</td>
    <td>${agi.toFixed(2)}</td>
    <td></td>
    </tr>
    <tr class="srank">
    <td>S 성장률</td>
    <td>${upHp.toFixed(2)}</td>
    <td>${upAtk.toFixed(2)}</td>
    <td>${upDef.toFixed(2)}</td>
    <td>${upAgi.toFixed(2)}</td>
    <td>${sumUp}</td>
    </tr>
    `);

    $("#hp").val(parseInt(rHp));
    $("#atk").val(parseInt(rAtk));
    $("#def").val(parseInt(rDef));
    $("#agi").val(parseInt(agi));
}

/* 결과 출력 10개 제한 */
function print(){
    $('#result tbody').empty();
    for(let i=0;i<result.length && i<10;i++){
        $('#result tbody').append(`
        <tr>
        <td>${i+1}</td>
        <td>${result[i].rank}</td>
        <td>${result[i].hp.toFixed(2)}</td>
        <td>${result[i].atk.toFixed(2)}</td>
        <td>${result[i].def.toFixed(2)}</td>
        <td>${result[i].agi.toFixed(2)}</td>
        </tr>`);
    }
}

/* 이벤트 */
$(document).ready(function(){
    loadPetData();

    $("#name").on("input",function(){
        showSuggestions(this.value);
    });

    $(document).on("click","#pet-suggestions li",function(){
        const name=$(this).text();
        $("#name").val(name);
        $("#pet-suggestions").empty();
        autoCalculate(name);
    });

    $("#calculate").click(function(){
        const name=$("#name").val();
        autoCalculate(name);
    });
});