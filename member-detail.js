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

            action: "getMemberById",

            memberId: memberId

        })

    })

    .then(response => response.json())

    .then(member => {

        if(!member){

            document.getElementById("result").innerHTML =

                "<p>会員が見つかりませんでした。</p>";

            return;

        }

        document.getElementById("result").innerHTML = `

            <h2>${member.name} さん</h2>

            <p>フリガナ：${member.kana}</p>

            <p>会員種別：${member.memberType}</p>

            <p>入会日：${member.joinDate}</p>

            <p>現在の残りポイント：${member.remainingPoints}pt</p>

            <hr>

            <h3>会員QRコード</h3>

            <div id="qrcode"></div>

            <br>

            <button id="pointHistoryButton">

                💰 ポイント購入履歴

            </button>

            <button id="lessonHistoryButton">

                📖 レッスン履歴

            </button>

        `;

        new QRCode(

            document.getElementById("qrcode"),

            {

                text: member.qrId,

                width: 250,

                height: 250

            }

        );

        document

            .getElementById("pointHistoryButton")

            .addEventListener("click", function(){

                location.href =

                    "point-history.html?memberId=" +

                    encodeURIComponent(member.memberId);

            });

        document

            .getElementById("lessonHistoryButton")

            .addEventListener("click", function(){

                location.href =

                    "lesson-history.html?memberId=" +

                    encodeURIComponent(member.memberId);

            });

    })

    .catch(error => {

        console.error(error);

        document.getElementById("result").innerHTML =

            "通信エラー：" + error.message;

    });

}



