const GAS_URL = "https://script.google.com/macros/s/AKfycby_VpnfCPFYXOVXNM-34rlEqUwPAQ89iAh_y9a5ku2f3N7UT-xQwWhsHm6lv62p0j2m/exec";

const params = new URLSearchParams(location.search);

const memberId = params.get("memberId");

document.getElementById("homeButton").addEventListener("click", function(){

    location.href = "index.html";

});

if(!memberId){

    document.getElementById("result").innerHTML =

        "会員情報がありません。QR受付から開いてください。";

}else{

    loadMember(memberId);

}

function loadMember(memberId) {

    document.getElementById("result").innerHTML =

        "会員情報を取得しています...";

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

                "❌ 会員が見つかりません";

            return;

        }

        showPointPlans(member);

    })

    .catch(error => {

        console.error(error);

        document.getElementById("result").innerHTML =

            "通信エラー：" + error.message;

    });

}

function showPointPlans(member) {

    document.getElementById("result").innerHTML = `

        <h2>${member.name} さん</h2>

        <p>現在の残りポイント：${member.remainingPoints}pt</p>

        <p>購入するポイントを選んでください</p>

        <div id="plans">

            ポイントプランを取得しています...

        </div>

        <br>

        <button id="backButton">

            戻る

        </button>

    `;

    loadPointPlans(member);

}

function loadPointPlans(member) {

    fetch(GAS_URL, {

        method: "POST",

        mode: "cors",

        body: JSON.stringify({

            action: "getPointPlans"

        })

    })

    .then(response => response.json())

    .then(plans => {

        let html = "";

        plans.forEach(function(plan){

            html += `

                <button class="pointPlanButton"

                    data-id="${plan.planId}">

                    ${plan.points}pt

                    <br>

                    ${plan.price}円

                </button>

                <br><br>

            `;

        });

        document.getElementById("plans").innerHTML = html;

        document.querySelectorAll(".pointPlanButton")

            .forEach(function(button){

                button.addEventListener("click", function(){

                    const plan = plans.find(function(p){

                        return p.planId === button.dataset.id;

                    });

                    showPurchaseConfirm(member, plan);

                });

            });

    })

    .catch(error => {

        console.error(error);

        document.getElementById("plans").innerHTML =

            "ポイントプランの取得に失敗しました";

    });

    document.getElementById("backButton")

        .addEventListener("click", function(){

            location.href = "reception.html";

        });

}

function showPurchaseConfirm(member, plan) {

    document.getElementById("result").innerHTML = `

        <h2>購入確認</h2>

        <p>${member.name} さん</p>

        <p>

            ${plan.points}ポイント

        </p>

        <p>

            ${plan.price}円

        </p>

        <h3>支払い方法</h3>

        <label>

            <input

                type="radio"

                name="paymentMethod"

                value="現金"

                checked

            >

            現金

        </label>

        <br>

        <label>

            <input

                type="radio"

                name="paymentMethod"

                value="振込"

            >

            振込

        </label>

        <br><br>

        <button id="purchaseButton">

            購入を登録する

        </button>

        <button id="backButton">

            戻る

        </button>

    `;

    document.getElementById("backButton")

        .addEventListener("click", function(){

            showPointPlans(member);

        });

    document.getElementById("purchaseButton")

        .addEventListener("click", function(){

            const paymentMethod =

                document.querySelector(

                    'input[name="paymentMethod"]:checked'

                ).value;

            fetch(GAS_URL, {

                method: "POST",

                mode: "cors",

                body: JSON.stringify({

                    action: "purchasePoints",

                    record: {

                        memberId: member.memberId,

                        memberName: member.name,

                        planId: plan.planId,

                        points: plan.points,

                        price: plan.price,

                        paymentMethod: paymentMethod

                    }

                })

            })

            .then(response => response.json())

            .then(result => {

                if(result.success){

                    document.getElementById("result").innerHTML = `

                        <h2>購入完了！</h2>

                        <p>${member.name} さん</p>

                        <p>

                            ${result.points}ポイント

                        </p>

                        <p>

                            ${result.price}円

                        </p>

                        <p>

                            支払い方法：${paymentMethod}

                        </p>

                        <p>

                            現在の残りポイント：

                            ${result.remainingPoints}pt

                        </p>

                        <br>

                        <button id="homeButton">

                            ホームに戻る

                        </button>

                    `;

                    document.getElementById("homeButton")

                        .addEventListener("click", function(){

                            location.href = "index.html";

                        });

                }else{

                    alert(

                        result.message ||

                        "購入登録に失敗しました"

                    );

                }

            })

            .catch(error => {

                console.error(error);

                alert(

                    "通信エラー：" +

                    error.message

                );

            });

        });

}



