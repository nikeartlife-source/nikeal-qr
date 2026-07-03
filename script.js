document.getElementById("startButton").addEventListener("click", startCamera);

async function startCamera(){
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment"
      }
    });

    const video = document.createElement("video");
    video.setAttribute("autoplay", true);
    video.setAttribute("playsinline", true);
    video.srcObject = stream;

    const reader = document.getElementById("reader");
    reader.innerHTML = "";
    reader.appendChild(video);

  } catch (err) {
    alert("カメラ起動失敗\n\n" + err.name + "\n" + err.message );
  }
}
