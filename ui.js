let petList = [];

function loadPetData(){
    return $.getJSON('./pets.json?v=' + new Date().getTime())
        .done(data => petList = data);
}

$(document).ready(function(){

    loadPetData();

    // 자동완성
    $("#name").on("input", function(){
        const keyword = $(this).val().trim();
        const ul = $("#pet-suggestions");
        ul.empty();

        if(keyword.length < 1){
            ul.hide();
            return;
        }

        const matches = petList.filter(p=>p.name.includes(keyword)).slice(0,20);

        matches.forEach(p=>{
            ul.append(`<li>${p.name}</li>`);
        });

        ul.show();
    });

    // 선택 시 자동 계산
    $(document).on("click","#pet-suggestions li",function(){
        const name=$(this).text();
        $("#name").val(name);
        $("#pet-suggestions").hide();
        $("#search").click();
    });

});
