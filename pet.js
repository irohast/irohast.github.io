let pet=[];
let result=[];
let btnName="";

/* 데이터 로드 */
$(document).ready(function(){

    $.getJSON("./pets.json?v="+Date.now(),function(data){
        pet=data.sort((a,b)=>a.name.localeCompare(b.name,'ko'));
    });

    $("#name").on("input",function(){
        showSuggestions($(this).val());
    });

    $("#dropdownBtn").click(function(){
        showSuggestions("");
    });

    $(document).on("click","#pet-suggestions li",function(){
        const name=$(this).text();
        $("#name").val(name);
        $("#pet-suggestions").empty();
        autoFillS(name);
    });

    $("#calculateBtn").click(function(){
        calculate();
    });

});

/* 자동완성 */
function showSuggestions(val){
    const ul=$("#pet-suggestions");
    ul.empty();

    let list=pet;
    if(val) list=pet.filter(p=>p.name.startsWith(val));

    list.slice(0,80).forEach(p=>{
        ul.append("<li>"+p.name+"</li>");
    });
}

/* S초기치 자동 입력 */
function autoFillS(name){
    const found=pet.find(p=>p.name===name);
    if(!found) return;

    const s=calcS(found);

    $("#hp").val(Math.floor(s.hp));
    $("#atk").val(Math.floor(s.atk));
    $("#def").val(Math.floor(s.def));
    $("#agi").val(Math.floor(s.agi));

    $("#myPet").html(`
    <table>
    <tr><th></th><th>내구력</th><th>공격력</th><th>방어력</th><th>순발력</th></tr>
    <tr>
    <td>S 초기치</td>
    <td>${s.hp.toFixed(2)}</td>
    <td>${s.atk.toFixed(2)}</td>
    <td>${s.def.toFixed(2)}</td>
    <td>${s.agi.toFixed(2)}</td>
    </tr>
    </table>
    `);
}

/* 계산 로직 (오픈소스 방식 유지) */
function calcS(p){

    const calcHp=p.initnum*(p.hp+4.5)/100;
    const calcAtk=p.initnum*(p.atk+4.5)/100;
    const calcDef=p.initnum*(p.def+4.5)/100;
    const calcAgi=p.initnum*(p.agi+4.5)/100;

    return{
        hp:(calcHp*4)+calcAtk+calcDef+calcAgi,
        atk:(calcHp*0.1)+calcAtk+(calcDef*0.1)+(calcAgi*0.05),
        def:(calcHp*0.1)+(calcAtk*0.1)+calcDef+(calcAgi*0.05),
        agi:calcAgi
    };
}

function calculate(){

    const name=$("#name").val();
    const found=pet.find(p=>p.name===name);
    if(!found){ alert("페트 없음"); return; }

    result=[];
    btnName="calculate";

    const baseInit=-2;
    let base={hp:-2,atk:-2,def:-2,agi:-2};

    for(let i=0;i<5;i++){
        for(let ii=0;ii<5;ii++){
            for(let iii=0;iii<5;iii++){
                for(let iiii=0;iiii<5;iiii++){
                    setBonus(found,base);
                    base.hp++; if(base.hp==3) base.hp=baseInit;
                }
                base.atk++; if(base.atk==3) base.atk=baseInit;
            }
            base.def++; if(base.def==3) base.def=baseInit;
        }
        base.agi++; if(base.agi==3) base.agi=baseInit;
    }

    const total=result.length;
    const eight=result.filter(r=>r===8).length;
    const rate= total? (eight/total*100).toFixed(2):"0.00";

    $("#resultArea").html(`<br><b>8등급 확률 : ${rate}%</b>`);
}

function setBonus(foundPet,base){
    let bonus={hp:0,atk:0,def:0,agi:0};

    for(let i=0;i<11;i++){
        for(let ii=0;ii<11;ii++){
            for(let iii=0;iii<11;iii++){
                for(let iiii=0;iiii<11;iiii++){
                    if(bonus.hp+bonus.atk+bonus.def+bonus.agi==10){
                        addData(base);
                    }
                    bonus.hp++; if(bonus.hp==11) bonus.hp=0;
                }
                bonus.atk++; if(bonus.atk==11) bonus.atk=0;
            }
            bonus.def++; if(bonus.def==11) bonus.def=0;
        }
        bonus.agi++; if(bonus.agi==11) bonus.agi=0;
    }
}

function addData(base){
    result.push(base.hp+base.atk+base.def+base.agi);
}

function changeStat(id,delta){
    let val=parseInt($("#"+id).val())||0;
    val+=delta;
    if(val<0) val=0;
    $("#"+id).val(val);
}