let flame = document.getElementById("flame");
let blown = false;
const smoke = document.createElement("div");
smoke.className = "smoke";
flame.parentElement.appendChild(smoke);

const sparkleContainer = document.querySelector(".sparkles");

for (let i = 0; i < 30; i++) {
  const s = document.createElement("span");
  s.style.left = Math.random() * 100 + "vw";
  s.style.animationDuration = (4 + Math.random() * 6) + "s";
  s.style.animationDelay = Math.random() * 5 + "s";
  sparkleContainer.appendChild(s);
}

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new AudioContext();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    mic.connect(analyser);

    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {

      if (blown) return;

      analyser.getByteFrequencyData(dataArray);
      let volume = dataArray.reduce((a,b)=>a+b) / dataArray.length;

      if (volume > 60) {
        blown = true;
        blowCandle();
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();
  });

function blowCandle() {

  flame.style.transition = "0.5s ease";
  flame.style.opacity = "0";
  flame.style.transform = "scale(0)";

  const glow = document.querySelector(".glow");
  if (glow) glow.style.opacity = "0";

  // activate smoke
  smoke.classList.add("active");

  document.querySelector(".wish-text").innerHTML =
    "Your wish will come true ✨";

  // burst sparkles
  createSparkleBurst();

  setTimeout(() => {
    document.dispatchEvent(new Event("candleOff"));
  }, 2000);
}

function createSparkleBurst() {
  for (let i = 0; i < 40; i++) {
    const sparkle = document.createElement("div");
    sparkle.style.position = "absolute";
    sparkle.style.width = "6px";
    sparkle.style.height = "6px";
    sparkle.style.background = "gold";
    sparkle.style.borderRadius = "50%";
    sparkle.style.left = "50%";
    sparkle.style.top = "50%";
    sparkle.style.boxShadow = "0 0 15px gold";

    document.body.appendChild(sparkle);

    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 300;

    sparkle.animate([
      { transform: "translate(0,0)", opacity: 1 },
      {
        transform: `translate(${Math.cos(angle)*radius}px, ${Math.sin(angle)*radius}px)`,
        opacity: 0
      }
    ], {
      duration: 1500,
      easing: "ease-out"
    });

    setTimeout(() => sparkle.remove(), 1500);
  }
}