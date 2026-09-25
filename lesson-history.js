const GAS_URL = "https://script.google.com/macros/s/AKfycby_VpnfCPFYXOVXNM-34rlEqUwPAQ89iAh_y9a5ku2f3N7UT-xQwWhsHm6lv62p0j2m/exec";

const params = new URLSearchParams(location.search);

const memberId = params.get("memberId");

if(!memberId){

    document.getElementById("result").innerHTML =

        "<p>会員情報が指定されていません。</p>";

}else{

    fetch(GAS_URL, {

        method: "POST",

        mode: "cors",

        body: JSON.stringify({

            action: "getLessonHistory",

            memberId: memberId

        })

    })

    .then(response => response.json())

    .then(data => {

        document.getElementById("result").innerHTML = `

            <h2>${data.memberName} さん</h2>

            <h3>レッスン履歴</h3>

        `;

        if(data.history.length === 0){

            document.getElementById("result").innerHTML +=

                "<p>レッスン履歴はありません。</p>";

            return;

        }

        let html = "";

        data.history.forEach(function(record){

            html += `

                <div>

                    <hr>

                    <p>日付：${record.date}</p>

                    <p>レッスン：${record.lessonName}</p>

                    <p>担当：${record.teacher}</p>

                    <p>支払い方法：${record.paymentMethod}</p>

                    <p>${record.paymentDisplay}</p>

                </div>

            `;

        });

        document.getElementById("result").innerHTML += html;

    })

    .catch(error => {

        console.error(error);

        document.getElementById("result").innerHTML =

            "通信エラー：" + error.message;

    });

}

document.getElementById("backButton").addEventListener("click", function(){

    if(memberId){

        location.href =

            "member-detail.html?memberId=" +

            encodeURIComponent(memberId);

    }else{

        location.href = "search.html";

    }

});



