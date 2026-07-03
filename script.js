const GAS_URL = "https://script.google.com/macros/s/AKfycby_VpnfCPFYXOVXNM-34rlEqUwPAQ89iAh_y9a5ku2f3N7UT-xQwWhsHm6lv62p0j2m/exec";
document.getElementById("startButton").addEventListener("click", startCamera);

let scanner;

function startCamera() {

    const reader = document.getElementById("reader");
    reader.innerHTML = "";

    scanner = new Html5Qrcode("reader");
  
    scanner.start(
      { facingMode: "environment" },
      { fps: 15,
        qrbox: {width: 200, height:200}
      },
      onScanSuccess,
      function(error){
        //読み取り中は何もしない
      }
    ).catch (function(err) {
    alert("カメラ起動失敗\n\n" + err );
  });
}

function onScanSuccess(decodedText){
  scanner.stop();
  document.getElementById("result").innerHTML = "会員を検索しています...";

  fetch(GAS_URL, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          action: "findMemberByQr",
          qrId: decodedText
      })
  })
  .then(response => response.json())
  .then(member => {

      if(!member) {
          document.getElementById("result").innerHTML = "❌ 会員が見つかりません";
          return;
      }

      showMemberMenu(member);
  })
  .catch(error => {
      document.getElementById("result").innerHTML = error;
  });
}

function showMemberMenu(member) {
    document.getElementById("result").innerHTML = `
        <h2>ようこそ!</h2>
        <p>${member.name} さん</p>

        <button id="lessonButton">レッスン登録</button>
        <button id="pointButton">ポイント購入</button>
    `;
}

