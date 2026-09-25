const GAS_URL = "https://script.google.com/macros/s/AKfycby_VpnfCPFYXOVXNM-34rlEqUwPAQ89iAh_y9a5ku2f3N7UT-xQwWhsHm6lv62p0j2m/exec";

document.getElementById("searchButton").addEventListener("click", function(){
    const keyword = document.getElementById("keyword").value.trim();

    if(!keyword){
        alert("氏名またはフリガナを入力してください");
        return;
    }
    
    document.getElementById("result").innerHTML = "検索しています...";
    fetch(GAS_URL, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
            action: "searchMembers",
            keyword: keyword
        })
    })

    .then(response => response.json())
    .then(members => {

        if(members.length === 0){
            document.getElementById("result").innerHTML =
                "<p>該当する会員が見つかりませんでした。</p>";
            return;
        }

        let html = `
            <h2>検索結果</h2>
        `;

        members.forEach(function(member){
            html += `

                <div
                    class="memberResult"
                    data-member-id="${member.memberId}"
                    style="cursor:pointer;"
                >

                    <hr>
                    <h3>${member.name} さん</h3>
                    <p>フリガナ：${member.kana}</p>
                    <p>会員種別：${member.memberType}</p>
                    <p>入会日：${member.joinDate}</p>
                    <p>現在の残りポイント：${member.remainingPoints}pt</p>
                </div>
            `;
        });

        document.getElementById("result").innerHTML = html;
        document.querySelectorAll(".memberResult").forEach(function(element){
            element.addEventListener("click", function(){

                const memberId = this.dataset.memberId;

                alert(
                    "会員を選択しました\n\n会員ID：" + memberId
                );
            });
        });
    })

    .catch(error => {
        console.error(error);
        document.getElementById("result").innerHTML =
            "通信エラー：" + error.message;
    });
});

