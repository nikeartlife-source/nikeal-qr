document.addEventListener("DOMContentLoaded", function () {

  const addPointBtn = document.getElementById("addPointBtn");

  const subtractPointBtn = document.getElementById("subtractPointBtn");

  const pointAmount = document.getElementById("pointAmount");

  const operationReason = document.getElementById("operationReason");

  const remainingPoints = document.getElementById("remainingPoints");

  const message = document.getElementById("message");

  // 仮の現在ポイント

  let currentPoints = 100;

  // 画面に現在ポイントを表示

  remainingPoints.textContent = currentPoints;

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

