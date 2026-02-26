let petList = [];

/* 펫 데이터 로드 */
fetch("pets.json")
.then(res => res.json())
.then(data => {

```
/* ★★★★★ 핵심 : pet.js 엔진용 전역 데이터 주입 ★★★★★ */
pet = JSON.parse(JSON.stringify(data));

petList = data.sort((a,b)=>a.name.localeCompare(b.name,'ko'));
initPetSelector();
```

});

/* 이름 선택 목록 생성 */
function initPetSelector(){
const select = document.getElementById("pet-name");

```
select.innerHTML = '<option value="">페트 선택</option>';

petList.forEach(p=>{
    const option = document.createElement("option");
    option.value = p.name;
    option.textContent = p.name;
    select.appendChild(option);
});

select.addEventListener("change", autoFillStat);
```

}

/* S초기치 자동입력 */
function autoFillStat(){

```
const name = document.getElementById("pet-name").value;
const found = pet.find(p=>p.name===name);
if(!found) return;

/* pet.js가 실제로 쓰는 트리거 상태 */
btnName = "search";
document.getElementById("name").value = name;

/* ★ 버튼 클릭을 강제로 발생시킴 (원본 동작 모방) */
document.getElementById("search").click();

/* 결과 읽어서 입력칸 채우기 */
setTimeout(()=>{
    const cells = $("#myPet tbody tr:first td");

    if(cells.length >= 5){
        document.getElementById("hp").value  = parseInt(cells.eq(1).text());
        document.getElementById("atk").value = parseInt(cells.eq(2).text());
        document.getElementById("def").value = parseInt(cells.eq(3).text());
        document.getElementById("agi").value = parseInt(cells.eq(4).text());
    }
},600);
```

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

```
const name = document.getElementById("pet-name").value;
if(!name){
    alert("페트를 선택해주세요");
    return;
}

btnName = "calculate";
document.getElementById("name").value = name;

/* ★ 실제 계산 트리거 */
document.getElementById("calculate").click();

/* 결과 읽기 */
setTimeout(()=>{
    const label = document.getElementById("srank-label");

    if(!label){
        document.getElementById("excellent-rate").innerText="계산 실패";
        return;
    }

    const match = label.innerText.match(/\((.*?)\)/);

    if(match){
        document.getElementById("excellent-rate").innerText="우수확률 : "+match[1];
    }else{
        document.getElementById("excellent-rate").innerText="계산 실패";
    }

},1200);
```

}
