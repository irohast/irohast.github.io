let petData=[];

/* 펫 로드 */
fetch("pets.json")
.then(r=>r.json())
.then(data=>{
    pet = JSON.parse(JSON.stringify(data));
    petData=data;

    const sel=document.getElementById("pet-name");
    sel.innerHTML="<option value=''>선택</option>";

    data.sort((a,b)=>a.name.localeCompare(b.name,'ko'))
    .forEach(p=>{
        const o=document.createElement("option");
        o.value=p.name;
        o.textContent=p.name;
        sel.appendChild(o);
    });
});

/* ===== S초기치 자동 입력 ===== */
document.getElementById("pet-name").addEventListener("change",async function(){

    const name=this.value;
    if(!name) return;

    document.getElementById("name").value=name;

    btnName="search";

    /* 핵심 : 실제 사용자처럼 클릭 이벤트 발생 */
    $("#search").trigger("click");

    /* 엔진 완료 대기 */
    await waitFor(()=>$("#myPet tbody tr").length>0,3000);

    const td=$("#myPet tbody tr:first td");

    $("#hp").val(parseInt(td.eq(1).text()));
    $("#atk").val(parseInt(td.eq(2).text()));
    $("#def").val(parseInt(td.eq(3).text()));
    $("#agi").val(parseInt(td.eq(4).text()));

    /* S초기치 표시 */
    $("#s-init").text(
        `S초기치 : ${td.eq(1).text()} / ${td.eq(2).text()} / ${td.eq(3).text()} / ${td.eq(4).text()}`
    );
});


/* ===== 계산 ===== */
document.getElementById("run-btn").addEventListener("click",async function(){

    const name=$("#pet-name").val();
    if(!name){alert("펫 선택");return;}

    $("#name").val(name);
    btnName="calculate";

    $("#calculate").trigger("click");

    await waitFor(()=>$("#srank-label").text().length>0,6000);

    /* 우수확률 */
    const text=$("#srank-label").text();
    const m=text.match(/\((.*?)\)/);

    if(m) $("#rate").text("우수확률 : "+m[1]+"%");
    else $("#rate").text("계산 실패");


    /* S성장률 표시 */
    const grow=$("#myPet tbody tr").eq(1).find("td");
    $("#s-grow").text(
        `S성장률 : ${grow.eq(1).text()} / ${grow.eq(2).text()} / ${grow.eq(3).text()} / ${grow.eq(4).text()}`
    );

    /* TOP10 표시 */
    await waitFor(()=>$("#result tbody tr").length>0,6000);

    const rows=$("#result tbody tr");
    let html="";

    for(let i=0;i<Math.min(10,rows.length);i++){
        html+="<div class='row'>"+$(rows[i]).text()+"</div>";
    }

    $("#top10-list").html(html);
});


/* ===== 대기 유틸 ===== */
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
