/* ===== 오픈소스 호환 기반 엔진 ===== */

let pet=[];
let chart=null;
let currentType="hp";

/* pets.json 로드 (DOM Ready 이후 실행) */
$(document).ready(function(){

```
$.getJSON("./pets.json",function(data){
    pet=data;
    console.log("pets loaded:",pet.length);
});
```

});

/* ===== S초기치 계산 ===== */
function calcSRank(p){

```
let rank=0;
const sum=p.hp+p.atk+p.def+p.agi;

if(p.rank>0) rank=p.rank;
else if(sum>=110) rank=435;
else if(sum>=105) rank=455;
else if(sum>=100) rank=475;
else if(sum>=95) rank=495;
else if(sum>=90) rank=515;
else if(sum>=85) rank=535;
else if(sum>=80) rank=555;
else rank=575;

const hp=p.initnum*(p.hp+4.5)/100;
const atk=p.initnum*(p.atk+4.5)/100;
const def=p.initnum*(p.def+4.5)/100;
const agi=p.initnum*(p.agi+4.5)/100;

return {
    hp:(hp*4)+atk+def+agi,
    atk:(hp*0.1)+atk+(def*0.1)+(agi*0.05),
    def:(hp*0.1)+(atk*0.1)+def+(agi*0.05),
    agi:agi,
    rank:rank
};
```

}

/* 이름 입력 즉시 S초기치 */
$("#name").on("input",function(){

```
const name=$(this).val();
const p=pet.find(x=>x.name===name);
if(!p) return;

const s=calcSRank(p);

$("#sresult").html(
    `S초기치 → HP ${s.hp.toFixed(2)} / ATK ${s.atk.toFixed(2)} / DEF ${s.def.toFixed(2)} / AGI ${s.agi.toFixed(2)}`
);
```

});

/* ===== 성장 분석 ===== */
$("#analyze").on("click",function(){

```
const lvl=parseInt($("#level").val());
if(!lvl) return;

const curSum=
    Number($("#catk").val())+
    Number($("#cdef").val())+
    Number($("#cagi").val());

const expect=curSum/lvl;
const probability=Math.min(100,(expect/3.8)*100);
const trust=Math.min(100,lvl*0.9);

$("#analysisResult").html(
    `120레벨 8등급 예상확률 : <b>${probability.toFixed(1)}%</b><br>
    성장 신뢰도 : <b>${trust.toFixed(1)}%</b>`
);

drawChart(probability);
```

});

/* ===== 그래프 ===== */

function drawChart(power){

```
const labels=[];
const my=[];
const normal=[];
const late=[];
const early=[];
const god=[];

for(let lv=1;lv<=150;lv++){

    labels.push(lv);

    my.push(power*lv*0.05);
    normal.push(lv*2.2);
    late.push(lv*lv*0.015);
    early.push(Math.sqrt(lv)*15);
    god.push(lv*2.8);
}

if(chart) chart.destroy();

chart=new Chart(document.getElementById("growthChart"),{
    type:"line",
    data:{
        labels:labels,
        datasets:[
            {label:"내 페트",data:my,borderColor:"#ff6384"},
            {label:"노말 8등급",data:normal,borderColor:"#36a2eb"},
            {label:"후반형",data:late,borderColor:"#4bc0c0"},
            {label:"초반형",data:early,borderColor:"#ffcd56"},
            {label:"지존급",data:god,borderColor:"#8e5ea2"}
        ]
    },
    options:{
        responsive:true,
        plugins:{
            zoom:{
                zoom:{wheel:{enabled:true},mode:"x"},
                pan:{enabled:true,mode:"x"}
            }
        }
    }
});
```

}

/* 그래프 탭 */
$(".tabs button").on("click",function(){
$(".tabs button").removeClass("active");
$(this).addClass("active");
});
