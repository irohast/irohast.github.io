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
    const select = document.getElementById("pet-name");

    select.innerHTML = '<option value="">페트 선택</option>';

    petList.forEach(p=>{
        const option = document.createElement("option");
        option.value = p.name;
        option.textContent = p.name;
        select.appendChild(option);
    });

    select.addEventListener("change", autoFillStat);
}

/* S초기치 자동입력 */
function autoFillStat(){
    const name = document.getElementById("pet-name").value;
    const found = petList.find(p=>p.name===name);
    if(!found) return;

    btnName = "search";
    document.getElementById("name").value = name;

    setSRank(found);
    setBase(found);

    setTimeout(()=>{
        const cells = $("#myPet tbody tr:first td");
        if(cells.length >= 5){
            document.getElementById("hp").value  = parseInt(cells.eq(1).text());
            document.getElementById("atk").value = parseInt(cells.eq(2).text());
            document.getElementById("def").value = parseInt(cells.eq(3).text());
            document.getElementById("agi").value = parseInt(cells.eq(4).text());
        }
    },200);
}

/* + - 버튼 */
function changeStat(stat,delta){
    const el = document.getElementById(stat);
    let v = parseInt(el.value)||0;
    v += delta;
    if(v < 0) v = 0;
    el.value = v;
}

/* 계산 버튼 */
function runCalc(){

    const name = document.getElementById("pet-name").value;
    const found = petList.find(p=>p.name===name);

    if(!found){
        alert("페트를 선택해주세요");
        return;
    }

    btnName = "calculate";

    // 엔진이 읽는 hidden name 값 세팅
    document.getElementById("name").value = name;

    // 입력된 현재 스탯 그대로 유지 (엔진이 직접 읽음)
    setSRank(found);
    setBase(found);

    setTimeout(()=>{
        const label = document.getElementById("srank-label");
        if(!label) return;

        const txt = label.innerText;
        const match = txt.match(/\((.*?)\)/);

        if(match){
            document.getElementById("excellent-rate").innerText = "우수확률 : " + match[1];
        }else{
            document.getElementById("excellent-rate").innerText = "우수확률 계산 실패";
        }
    },400);
}
