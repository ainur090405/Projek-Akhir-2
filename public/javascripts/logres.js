// logres.js

document.addEventListener("DOMContentLoaded", function () {
  const text = "Selamat Datang!";
  const typingTarget = document.getElementById("typing-text");
  const fadeText = document.getElementById("fade-text");
  let i = 0;

  // Efek mengetik
  function typeEffect() {
    if (i < text.length) {
      typingTarget.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeEffect, 100);
    }
  }

  // Jalankan saat halaman dimuat
  typingTarget.innerHTML = "";
  typeEffect();

  // Fade in teks
  if (fadeText) {
    fadeText.style.opacity = 0;
    fadeText.style.transition = "opacity 2s ease-in-out";
    setTimeout(() => {
      fadeText.style.opacity = 1;
    }, 1500);
  }
});
