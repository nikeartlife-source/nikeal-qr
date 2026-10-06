const GAS_URL = "https://script.google.com/macros/s/AKfycby_VpnfCPFYXOVXNM-34rlEqUwPAQ89iAh_y9a5ku2f3N7UT-xQwWhsHm6lv62p0j2m/exec";
document.addEventListener("DOMContentLoaded", function () {

  const addPointBtn = document.getElementById("addPointBtn");

  const subtractPointBtn = document.getElementById("subtractPointBtn");

  const pointAmount = document.getElementById("pointAmount");

  const operationReason = document.getElementById("operationReason");

  const remainingPoints = document.getElementById("remainingPoints");

  const message = document.getElementById("message");

  // 現在のポイント

let currentPoints = 0;

// URLから会員IDを取得

const params = new URLSearchParams(location.search);

const memberId = params.get("memberId");

if (!memberId) {

  message.textContent = "会員情報が指定されていません。";

} else {

  fetch(GAS_URL, {

    method: "POST",

    mode: "cors",

    body: JSON.stringify({

      action: "getMemberById",

      staffToken: localStorage.getItem("nikeal_staff_token"),

      memberId: memberId

    })

  })

  .then(response => response.json())

  .then(member => {

    if (!member) {

      message.textContent = "会員が見つかりませんでした。";

      return;

    }

    document.getElementById("memberInfo").innerHTML =

      `<h2>${member.name} さん</h2>`;

    currentPoints = Number(member.remainingPoints) || 0;

    remainingPoints.textContent = currentPoints;

  })

  .catch(error => {

    console.error(error);

    message.textContent =

      "通信エラー：" + error.message;

  });

}


  // ＋ポイント

  addPointBtn.addEventListener("click", function () {

    const amount = Number(pointAmount.value);

    if (!amount || amount <= 0) {

      message.textContent = "ポイント数を入力してください。";

      return;

    }

    if (!operationReason.value) {

      message.textContent = "操作理由を選択してください。";

      return;

    }

    currentPoints += amount;

    remainingPoints.textContent = currentPoints;

    message.textContent =

      amount + "ポイント加算しました。";

    pointAmount.value = "";

  });

  // −ポイント

  subtractPointBtn.addEventListener("click", function () {

    const amount = Number(pointAmount.value);

    if (!amount || amount <= 0) {

      message.textContent = "ポイント数を入力してください。";

      return;

    }

    if (!operationReason.value) {

      message.textContent = "操作理由を選択してください。";

      return;

    }

    if (amount > currentPoints) {

      message.textContent =

        "現在の残ポイントを超えて減算することはできません。";

      return;

    }

    currentPoints -= amount;

    remainingPoints.textContent = currentPoints;

    message.textContent =

      amount + "ポイント減算しました。";

    pointAmount.value = "";

  });

});

