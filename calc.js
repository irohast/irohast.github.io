let petData = [];

/* ================= 펫 데이터 로드 ================= */
fetch("pets.json")
.then(r => r.json())
.then(data => {
    pet = JSON.parse(JSON.stringify(data)); // 엔진용
    petData = data; // UI용
});


/* ================= 자동완성 검색 ================= */
const searchInput = document.getElementById("pet-search");
const suggestionBox = document.getElementById("suggestions");
const allList = document.getElementById("all-pet-list");
const openBtn = document.getElementById("open-list");

/* 타이핑 자동완성 */
searchInput.addEventListener("input", function(){

    const value = this.value.trim();
    suggestionBox.innerHTML = "";
    allList.style.display="none";

    if(!value) return;

    const filtered = petData
        .filter(p => p.name.includes(value))
        .sort((a,b)=>a.name.localeCompare(b.name,'ko'))
        .slice(0,15);

    filtered.forEach(p=>{
        const div=document.createElement("div");
        div.className="suggest-item";
        div.textContent=p.name;

        div.onclick=()=>{
            searchInput.value=p.name;
            suggestionBox.innerHTML="";
            startSearch(p.name);
        };

        suggestionBox.appendChild(div);
    });
});


/* ================= ▼ 전체 펫 목록 ================= */
openBtn.onclick=()=>{

    if(allList.style.display==="block"){
        allList.style.display="none";
        return;
    }

    suggestionBox.innerHTML="";
    allList.innerHTML="";

    const sorted=[...petData].sort((a,b)=>a.name.localeCompare(b.name,'ko'));

    sorted.forEach(p=>{
        const div=document.createElement("div");
        div.className="pet-item";
        div.textContent=p.name;

        div.onclick=()=>{
            searchInput.value=p.name;
            allList.style.display="none";
            startSearch(p.name);
        };

        allList.appendChild(div);
    });

    allList.style.display="block";
};


/* ================= 검색 실행 (S초기치 생성) ================= */
async function startSearch(name){

    document.getElementById("name").value=name;
    btnName="search";

    $("#search").trigger("click");

    await waitFor(()=>$("#myPet tbody tr").length>0,3000);

    const td=$("#myPet tbody tr:first td");

    $("#hp").val(parseInt(td.eq(1).text()));
    $("#atk").val(parseInt(td.eq(2).text()));
    $("#def").val(parseInt(td.eq(3).text()));
    $("#agi").val(parseInt(td.eq(4).text()));

    $("#s-init").text(
        `S초기치 : ${td.eq(1).text()} / ${td.eq(2).text()} / ${td.eq(3).text()} / ${td.eq(4).text()}`
    );
}


/* ================= 계산 ================= */
document.getElementById("run-btn").addEventListener("click", async function(){

    const name = searchInput.value.trim();
    if(!name){
        alert("펫 이름을 입력하세요");
        return;
    }

    document.getElementById("name").value=name;
    btnName="calculate";

    $("#calculate").trigger("click");

    /* 확률 생성 대기 */
    await waitFor(()=>$("#srank-label").text().length>0,6000);

    const text=$("#srank-label").text();
    const m=text.match(/\((.*?)\)/);

    if(m) $("#excellent-rate").text(m[1].trim()+"%");
    else $("#excellent-rate").text("계산 실패");


    /* S성장률 표시 */
    const grow=$("#myPet tbody tr").eq(1).find("td");
    $("#s-grow").text(
        `S성장률 : ${grow.eq(1).text()} / ${grow.eq(2).text()} / ${grow.eq(3).text()} / ${grow.eq(4).text()}`
    );


    /* 결과 생성 대기 */
    await waitFor(()=>$("#result tbody tr").length>0,6000);

    const rows=$("#result tbody tr");
    let html="";

    rows.each(function(){

        const rank=$(this).find("td").eq(1).text().trim();

        /* 8등급만 표시 */
        if(rank!=="8") return;

        let txt=$(this).text();

        /* [2] 제거 */
        txt=txt.replace(/\[\d+\]/g,"");

        /* (2) 제거 */
        txt=txt.replace(/\(\d+\)/g,"");

        html+=`<div class="row">${txt}</div>`;
    });

    if(html==="") html="<div class='row'>8등급 결과 없음</div>";

    $("#top10-list").html(html);
});


/* ================= 대기 함수 ================= */
function waitFor(cond,timeout){
return new Promise((resolve,reject)=>{
    const start=Date.now();
    const timer=setInterval(()=>{
        if(cond()){
            clearInterval(timer);
            resolve();
        }
        if(Date.now()-start>timeout){
            clearInterval(timer);
            reject();
        }
    },50);
});
}
