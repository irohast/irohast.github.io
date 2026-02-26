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
/* S초기치 자동입력 */
function autoFillStat(){
    const name=document.getElementById("pet-name").value;
    const found=petList.find(p=>p.name===name);
    if(!found) return;

    // ★ pet.js 엔진 검색모드 시동
    btnName = "search";
    document.getElementById("name").value = name;

    // 엔진 실행
    setSRank(found);
    setBase(found);


    /* S초기치 결과 읽어서 입력칸에 넣기 */
    setTimeout(()=>{
        const cells=$("#myPet tbody tr:first td");
        if(cells.length>=5){
            $("#hp").val(parseInt(cells.eq(1).text()));
            $("#atk").val(parseInt(cells.eq(2).text()));
            $("#def").val(parseInt(cells.eq(3).text()));
            $("#agi").val(parseInt(cells.eq(4).text()));
        }
    },200);
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

    btnName="calculate";

    $("#name").val(name);
    $("#hp").val(parseInt(document.getElementById("hp").value||0));
    $("#atk").val(parseInt(document.getElementById("atk").value||0));
    $("#def").val(parseInt(document.getElementById("def").value||0));
    $("#agi").val(parseInt(document.getElementById("agi").value||0));

    const copiedPet = JSON.parse(JSON.stringify(found));
    setSRank(copiedPet);
    setBase(found);

    setTimeout(()=>{
        const label=document.getElementById("srank-label");
        if(label){
            document.getElementById("excellent-rate").innerHTML=label.innerText;
        }
    },300);
}
.stat-row input{
    width:110px;
    height:40px;
    font-size:16px;
}

.stat-row button{
    width:42px;
    height:40px;
    font-size:18px;
}

