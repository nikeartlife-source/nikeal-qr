document.getElementById("searchButton").addEventListener("click", function(){

    const keyword = document.getElementById("keyword").value.trim();

    if(!keyword){
        alert("氏名またはフリガナを入力してください");
        return;
    }

    document.getElementById("result").innerHTML =
        "検索しています...";
});

