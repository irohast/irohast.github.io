let petData=[];

/* 펫 데이터 로드 */
fetch("pets.json")
.then(r=>r.json())
.then(data=>{
    pet=JSON.parse(JSON.stringify(data));
    petData=data;
});

/* 자동완성 */
const searchInput=document.getElementById("pet-search");
const suggestionBox=document.getElementById("suggestions");

searchInput.addEventListener("input",function(){

    const value=this.value.trim();
    suggestionBox.innerHTML="";
    if(!value) return;

    const filtered=petData.filter(p=>p.name.includes(value)).slice(0,15);

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

/* 검색 실행 (S초기치 생성) */
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

    $("#s-init").text(`S초기치 : ${td.eq(1).text()} / ${td.eq(2).text()} / ${td.eq(3).text()} / ${td.eq(4).text()}`);
}

/* 계산 */
document.getElementById("run-btn").addEventListener("click",async function(){

    const name=searchInput.value;
    if(!name){alert("펫 이름 입력");return;}

    document.getElementById("name").value=name;
    btnName="calculate";

    $("#calculate").trigger("click");

    await waitFor(()=>$("#srank-label").text().length>0,6000);

    const text=$("#srank-label").text();
    const m=text.match(/\((.*?)\)/);

    if(m) $("#excellent-rate").text(m[1]+"%");
    else $("#excellent-rate").text("계산 실패");

    const grow=$("#myPet tbody tr").eq(1).find("td");
    $("#s-grow").text(`S성장률 : ${grow.eq(1).text()} / ${grow.eq(2).text()} / ${grow.eq(3).text()} / ${grow.eq(4).text()}`);

    await waitFor(()=>$("#result tbody tr").length>0,6000);

    const rows=$("#result tbody tr");
    let html="";

    for(let i=0;i<Math.min(10,rows.length);i++){
        html+="<div class='row'>"+$(rows[i]).text()+"</div>";
    }

    $("#top10-list").html(html);
});

/* 대기 함수 */
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
