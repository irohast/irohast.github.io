let petData=[];

fetch("pets.json")
.then(r=>r.json())
.then(data=>{
    pet=JSON.parse(JSON.stringify(data));
    petData=data;
});

const searchInput=document.getElementById("pet-search");
const suggestionBox=document.getElementById("suggestions");
const allList=document.getElementById("all-pet-list");
const openBtn=document.getElementById("open-list");

/* 자동완성 */
searchInput.addEventListener("input",function(){

    const value=this.value.trim();
    suggestionBox.innerHTML="";
    allList.style.display="none";

    if(!value) return;

    const filtered=petData
        .filter(p=>p.name.includes(value))
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

/* ▼ 전체 목록 */
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

/* 검색 실행 */
async function startSearch(name){

    document.getElementById("name").value=name;
    btnName="search";

    $("#search").trigger("click");

    await waitFor(()=>$("#myPet tbody tr").length>0,3000);

    const td=$("#myPet tbody tr:first td");

    $("#hp").val(parseFloat(td.eq(1).text()));
    $("#atk").val(parseFloat(td.eq(2).text()));
    $("#def").val(parseFloat(td.eq(3).text()));
    $("#agi").val(parseFloat(td.eq(4).text()));

    $("#s-init").text(
        `S초기치 : ${td.eq(1).text()} / ${td.eq(2).text()} / ${td.eq(3).text()} / ${td.eq(4).text()}`
    );
}

/* 계산 */
document.getElementById("run-btn").addEventListener("click",async function(){

    const name=searchInput.value.trim();
    if(!name){alert("펫 이름 입력");return;}

    document.getElementById("name").value=name;
    btnName="calculate";

    $("#calculate").trigger("click");

    await waitFor(()=>$("#srank-label").text().length>0,6000);

    const text=$("#srank-label").text();
    const m=text.match(/\((.*?)\)/);

    if(m){
        const rate=m[1].replace('%','').trim();
        $("#excellent-rate").text(rate+"%");
        $("#srank-label").text("");
    }else{
        $("#excellent-rate").text("계산 실패");
    }

    const grow=$("#myPet tbody tr").eq(1).find("td");
    $("#s-grow").text(
        `S성장률 : ${grow.eq(1).text()} / ${grow.eq(2).text()} / ${grow.eq(3).text()} / ${grow.eq(4).text()}`
    );

    await waitFor(()=>$("#result tbody tr").length>0,6000);

    const rows=$("#result tbody tr");
    let html="";

    rows.each(function(){

        const tds=$(this).find("td");
        const rank=tds.eq(1).text().trim();
        if(rank!=="8") return;

        let hp=tds.eq(2).text();
        let atk=tds.eq(3).text();
        let def=tds.eq(4).text();
        let agi=tds.eq(5).text();

        hp=hp.replace(/\[\d+\]/g,"").replace(/\(\d+\)/g,"");
        atk=atk.replace(/\[\d+\]/g,"").replace(/\(\d+\)/g,"");
        def=def.replace(/\[\d+\]/g,"").replace(/\(\d+\)/g,"");
        agi=agi.replace(/\[\d+\]/g,"").replace(/\(\d+\)/g,"");

        html+=`<div class="row">${hp} / ${atk} / ${def} / ${agi}</div>`;
    });

    if(html==="") html="<div class='row'>8등급 결과 없음</div>";

    $("#top10-list").html(html);
});

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
