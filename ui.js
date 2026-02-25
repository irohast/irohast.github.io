var pet = [];
let btnName = "";
const result = [];

/* 펫 데이터 로드 */
function loadPetData(){
    $.getJSON('./pets.json?v=' + new Date().getTime(), function(data){
        pet = data;
    });
}

/* 자동완성 */
$("#name").on("input", function(){
    let val=$(this).val().toLowerCase();
    let list=$("#pet-suggestions");
    list.empty();

    if(!val) return;

    pet.filter(p=>p.name.toLowerCase().includes(val))
       .slice(0,15)
       .forEach(p=>{
           list.append(`<li>${p.name}</li>`);
       });
});

/* 선택 즉시 자동 계산 (중요) */
$(document).on("click","#pet-suggestions li",function(){

    const name=$(this).text();
    $("#name").val(name);
    $("#pet-suggestions").empty();

    const foundPet = pet.find(p => p.name === name);
    if(!foundPet) return;

    btnName="search";

    $("#myPet").show();
    $("#result-master-container").show();

    const copiedPet = JSON.parse(JSON.stringify(foundPet));

    /* 원본 엔진 그대로 호출 */
    setSRank(copiedPet);
    setBase(foundPet);
});

/* 수동 계산 버튼 */
$("#calculate").on("click",function(){

    const name=$("#name").val();
    const foundPet = pet.find(p => p.name === name);
    if(!foundPet){
        alert("페트를 먼저 선택하세요.");
        return;
    }

    btnName="calculate";

    $("#myPet").show();
    $("#result-master-container").show();

    setBase(foundPet);
});

/* 시작 */
$(document).ready(function(){
    loadPetData();
});