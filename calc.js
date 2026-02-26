let petList = [];

/* 펫 데이터 로드 */
fetch("pets.json")
.then(res => res.json())
.then(data => {
    petList = data.sort((a,b)=>a.name.localeCompare(b.name,'ko'));
    initPetSelector();
});

/* 드롭다운 생성 */
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

/* 펫 선택 → search 버튼 실제 클릭 */
function autoFillStat(){

    const name = document.getElementById("pet-name").value;
    if(!name) return;

    // 엔진이 읽는 hidden 값 세팅
    document.getElementById("name").value = name;

    // 🔥 실제 DOM 클릭 발생 (중요)
    const searchBtn = document.getElementById("search");
    if(searchBtn){
        searchBtn.click();
    }

    // S초기치 읽어서 입력창에 반영
    setTimeout(()=>{
        const cells = $("#myPet tbody tr:first td");

        if(cells.length >= 5){
            $("#hp").val(parseInt(cells.eq(1).text()) || 0);
            $("#atk").val(parseInt(cells.eq(2).text()) || 0);
            $("#def").val(parseInt(cells.eq(3).text()) || 0);
            $("#agi").val(parseInt(cells.eq(4).text()) || 0);
        }
    }, 400);
}

/* + - 버튼 */
function changeStat(stat, delta){
    const el = document.getElementById(stat);
    let v = parseInt(el.value) || 0;
    v += delta;
    if(v < 0) v = 0;
    el.value = v;
}

/* 계산하기 버튼 */
function runCalc(){

    const name = document.getElementById("pet-name").value;

    if(!name){
        alert("페트를 선택해주세요");
        return;
    }

    // 엔진 hidden name 세팅
    document.getElementById("name").value = name;

    // 🔥 calculate 버튼 실제 클릭
    const calcBtn = document.getElementById("calculate");
    if(calcBtn){
        calcBtn.click();
    }

    // 확률 읽기
    setTimeout(()=>{
        const label = document.getElementById("srank-label");

        if(!label || label.innerText.trim() === ""){
            document.getElementById("excellent-rate").innerText = "계산 실패";
            return;
        }

        const match = label.innerText.match(/\((.*?)\)/);

        if(match){
            document.getElementById("excellent-rate").innerText = "우수확률 : " + match[1];
        }else{
            document.getElementById("excellent-rate").innerText = "계산 실패";
        }

    }, 700);
}
