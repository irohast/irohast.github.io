let petList = [];

/* 펫 데이터 로드 */
fetch("pets.json")
.then(res => res.json())
.then(data => {
    petList = data.sort((a,b)=>a.name.localeCompare(b.name,'ko'));
    initPetSelector();
});

/* 이름 선택 목록 생성 */
function initPetSelector(){
    const input = document.getElementById("pet-name");
    const list = document.getElementById("pet-list");

    list.innerHTML = "";

    petList.forEach(p=>{
        const option = document.createElement("option");
        option.value = p.name;
        list.appendChild(option);
    });
}

/* + - 버튼 */
function changeStat(stat,delta){
    const el=document.getElementById(stat);
    let v=parseInt(el.value)||0;
    v+=delta;
    if(v<0)v=0;
    el.value=v;
}

/* 계산 버튼 */
function runCalc(){

    const name=document.getElementById("pet-name").value;
    const found=petList.find(p=>p.name===name);

    if(!found){
        alert("페트를 선택해주세요");
        return;
    }

    /* pet.js가 사용하는 방식 그대로 실행 */
    btnName="calculate";

    $("#name").val(name);
    $("#hp").val(parseInt(document.getElementById("hp").value||0));
    $("#atk").val(parseInt(document.getElementById("atk").value||0));
    $("#def").val(parseInt(document.getElementById("def").value||0));
    $("#agi").val(parseInt(document.getElementById("agi").value||0));

    const copiedPet = JSON.parse(JSON.stringify(found));
    setSRank(copiedPet);
    setBase(found);

    /* 우수확률 추출 */
    setTimeout(()=>{
        const label=document.getElementById("srank-label");
        if(label){
            document.getElementById("excellent-rate").innerHTML=label.innerText;
        }
    },300);
}