const GAS_URL = "https://script.google.com/macros/s/AKfycby_VpnfCPFYXOVXNM-34rlEqUwPAQ89iAh_y9a5ku2f3N7UT-xQwWhsHm6lv62p0j2m/exec";

document.getElementById("registerButton").addEventListener("click", function(){

    const name = document.getElementById("name").value.trim();
    const kana = document.getElementById("kana").value.trim();
    const joinDate = document.getElementById("joinDate").value;
    const memberType = document.getElementById("memberType").value;
    const birthday = document.getElementById("birthday").value;
    const guardianName = document.getElementById("guardianName").value.trim();
    const memo = document.getElementById("memo").value.trim();

    if(!name){
        alert("氏名を入力してください");
        return;
    }

    if(!kana){
        alert("フリガナを入力してください");
        return;
    }

    if(!joinDate){
        alert("入会日を入力してください");
        return;
    }

    document.getElementById("result").innerHTML =
        "会員登録しています...";
    fetch(GAS_URL, {

        method: "POST",
        mode: "cors",
        body: JSON.stringify({

            action: "registerMember",

            member: {
                name: name,
                kana: kana,
                joinDate: joinDate,
                memberType: memberType,
                birthday: birthday,
                guardianName: guardianName,
                memo: memo
            }
        })
    })

    .then(response => response.json())
    .then(result => {

        if(result.success){
            document.getElementById("result").innerHTML = `
                <h2>会員登録完了！</h2>
                <p>${result.name} さん</p>
                <p>会員ID：${result.memberId}</p>
                <p>QR ID：${result.qrId}</p>
            `;
            document.getElementById("memberForm").style.display = "none";
        }else{
            alert(result.message || "会員登録に失敗しました");
        }
    })

    .catch(error => {
        console.error(error);
        alert("通信エラー：" + error.message);

    });
});
