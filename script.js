document.getElementById("startButton").addEventListener("click", startCamera);

let scanner;

function startCamera(){

    const reader = document.getElementById("reader");
    reader.innerHTML = "";

    scanner = new Html5Qrcode("reader");
  
    scanner.start(
      { facingMode: "environment" },
      { fps: 10,
        qrbox: 250
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
  document.getElementById("result").innerHTML = "読み取り成功!<br><br>" + decodedText;
}
