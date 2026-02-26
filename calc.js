let petList = [];

/* 펫 데이터 로드 */
fetch("pets.json")
.then(res => res.json())
.then(data => {
    petList = data.sort((a,b)=>a.name.localeCompare(b.name,'ko'));
    initPetSelector();
});

/* 목록 생성 */
function initPetSelector(){
    const select = document.getElementById("pet-name");
    select.innerHTML = '<option value="">페트 선택</option>';

    petList.forEach(p=>{
        const option=document.createElement("option");
        option.value=p.name;
        option.textContent=p.name;
        select.appendChild(option);
    });

    select.addEventListener("change",autoFillStat);
}

/* 펫 선택 → 검색버튼 대신 클릭 */
function autoFillStat(){

    const name=document.getElementById("pet-name").value;
    if(!name) return;

    document.getElementById("name").value=name;

    // 엔진 search 클릭
    $("#search").trigger("click");

    // S초기치 읽기
    setTimeout(()=>{
        const cells=$("#myPet tbody tr:first td");
        if(cells.length>=5){
            $("#hp").val(parseInt(cells.eq(1).text()));
            $("#atk").val(parseInt(cells.eq(2).text()));
            $("#def").val(parseInt(cells.eq(3).text()));
            $("#agi").val(parseInt(cells.eq(4).text()));
        }
    },350);
}

/* +- 버튼 */
function changeStat(stat,delta){
    const el=document.getElementById(stat);
    let v=parseInt(el.value)||0;
    v+=delta;
    if(v<0)v=0;
    el.value=v;
}

/* 계산 */
function runCalc(){

    const name=document.getElementById("pet-name").value;
    if(!name){
        alert("페트를 선택해주세요");
        return;
    }

    document.getElementById("name").value=name;

    // 엔진 calculate 클릭
    $("#calculate").trigger("click");

    // 확률 읽기
    setTimeout(()=>{
        const label=document.getElementById("srank-label");

        if(!label||label.innerText===""){
            document.getElementById("excellent-rate").innerText="계산 실패";
            return;
        }

        const match=label.innerText.match(/\((.*?)\)/);

        if(match){
            document.getElementById("excellent-rate").innerText="우수확률 : "+match[1];
        }else{
            document.getElementById("excellent-rate").innerText="계산 실패";
        }

    },700);
}
