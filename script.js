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
    document.getElementById("lessonButton").addEventListener("click", function(){
        loadLessons(member);
    });
    document.getElementById("pointButton").addEventListener("click", function(){
        alert("ポイント購入はこれから作ります");
    });
}

function loadLessons(member){
    document.getElementById("result").innerHTML = "レッスンを取得しています...";

    fetch(GAS_URL, {
        method:"POST",
        body:JSON.stringify({
            action:"getLessons"
        })
    })
    .then(response => response.json())
    .then(lessons => {
        showLessonList(member, lessons);
    })
    .catch(error => {
        alert(error);
        document.getElementById("result").innerHTML = error;
    });
}

function showLessonList(member, lessons) {

    let html = `
        <h2>${member.name} さん</h2>
        <p>レッスンを選んでください</p>
    `;

    lessons.forEach(function(lesson){
        html += `
            <button class="lessonButton"
                data-id="${lesson.lessonId}">
                ${lesson.lessonName}<br>
                ${lesson.teacher}
            </button><br><br>
        `;
    });

    html += `
        <button id="backButton">戻る</button>
    `;

    document.getElementById("result").innerHTML = html;
    document.querySelectorAll(".lessonButton").forEach(function(button){
        button.addEventListener("click", function(){

            const lesson = lessons.find(function(l){
                return l.lessonId === button.dataset.id;
        });
        showConfirm(member, lesson);
    });
    });

    document.getElementById("backButton").addEventListener("click", function(){
        showMemberMenu(member);
    });
}

function showConfirm(member, lesson){

    document.getElementById("result").innerHTML = `
        <h2>登録確認</h2>
        <p>${member.name} さん</p>
        <p>${lesson.lessonName}</p>
        <p>${lesson.teacher}</p>
        <p>消費ポイント: ${lesson.pointCost}pt</p>
        <button id="registerButton">登録する</button>
        <button id="backButton">戻る</button>
    `;

    document.getElementById("backButton").addEventListener("click", function(){
        loadLessons(member);
    });

    document.getElementById("registerButton").addEventListener("click", function(){

        fetch(GAS_URL, {
            method:"POST",
            body:JSON.stringify({
                action:"registerLesson",
                record:{
                    memberId: member.memberId,
                    lessonId: lesson.lessonId,
                    teacher: lesson.teacher,
                    pointCost: lesson.pointCost,
                    cashPrice: lesson.cashPrice,
                    paymentMethod:"ポイント"
                }
            })
        })
        .then(response => response.json())
        .then(result => {

            if(result.success){
                document.getElementById("result").innerHTML = `
                    <h2>受付完了!</h2>
                    <p>${member.name} さん</p>
                    <p>${lesson.lessonName}</p>
                `;
            }else{
                alert(result.message);
            }
        })
        .catch(error=>{
            alert(error);
        });
    });
}
