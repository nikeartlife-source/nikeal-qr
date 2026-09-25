const GAS_URL = "https://script.google.com/macros/s/AKfycby_VpnfCPFYXOVXNM-34rlEqUwPAQ89iAh_y9a5ku2f3N7UT-xQwWhsHm6lv62p0j2m/exec";

loadHistory();

function loadHistory() {

    document.getElementById("result").innerHTML =

        "履歴を取得しています...";

    fetch(GAS_URL, {

        method: "POST",

        mode: "cors",

        body: JSON.stringify({

            action: "getLessonHistoryList"

        })

    })

    .then(response => response.json())

    .then(history => {

        if(!history || history.length === 0){

            document.getElementById("result").innerHTML =

                "<p>レッスン履歴はありません。</p>";

            return;

        }

        let html = "";

        history.forEach(function(record){

            html += `

                <div>

                    <hr>

                    <p>日付：${record.date}</p>

                    <p>会員：${record.memberName}</p>

                    <p>レッスン：${record.lessonName}</p>

                    <p>担当：${record.teacher}</p>

                    <p>支払い方法：${record.paymentMethod}</p>

                    <p>ポイント：${record.pointCost}pt</p>

                    <p>現金：${record.cashPrice}円</p>

                </div>

            `;

        });

        document.getElementById("result").innerHTML = html;

    })

    .catch(error => {

        console.error(error);

        document.getElementById("result").innerHTML =

            "通信エラー：" + error.message;

    });

}



