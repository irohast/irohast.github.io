function calc(){
let hp = parseInt(document.getElementById("hp").value);
let atk = parseInt(document.getElementById("atk").value);
let def = parseInt(document.getElementById("def").value);
let agi = parseInt(document.getElementById("agi").value);

```
if(isNaN(hp)||isNaN(atk)||isNaN(def)||isNaN(agi)){
    document.getElementById("result").innerText="값을 모두 입력하세요!";
    return;
}

// 간단한 S급 판단 (초기 버전)
let sum = hp + atk + def + agi;

let grade;
if(sum>=95) grade="S급 가능성 매우 높음 🔥";
else if(sum>=90) grade="가능성 있음 ⭐";
else if(sum>=85) grade="A급 수준";
else grade="S급 어려움";

document.getElementById("result").innerText="판정: "+grade;
```

}
