let flame = document.getElementById("flame");

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new AudioContext();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    mic.connect(analyser);

    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);

      let volume = dataArray.reduce((a,b)=>a+b) / dataArray.length;

      if (volume > 60) {
        blowCandle();
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();
  });

function blowCandle() {
// efek padam perlahan
  flame.style.transition = "0.5s ease";
  flame.style.opacity = "0";
  flame.style.transform = "scale(0)";

  document.getElementById("text").innerHTML = "Your wish will come true ✨";

  setTimeout(() => {
    goToNextPage("temp/song.html");
  }, 2000);
}

function goToNextPage(url) {
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = url;
  }, 1200);

}
