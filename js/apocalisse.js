(() => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const boot = $("boot"),
    bar = $("boot-bar"),
    lines = $("boot-lines");
  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    boot.classList.add("dismissed");
    document.body.classList.remove("booting");
    setTimeout(() => boot.remove(), 900);
  }
  $("boot-skip").addEventListener("click", dismiss);
  if (reduced) {
    dismiss();
  } else {
    document.body.classList.add("booting");
    const messages = [
      "> AVVIO PROTOCOLLO AN-03 ...",
      "> CONNESSIONE AL SISTEMA IDRICO ...",
      "> VERIFICA INTEGRITÀ ........ FALLITA",
      "> RISPOSTA UFFICIALE: NESSUN PROBLEMA",
      "> ACCESSO CONCESSO. BUONA FORTUNA.",
    ];
    messages.forEach((msg, i) =>
      setTimeout(
        () => {
          if (dismissed) return;
          const line = document.createElement("div");
          line.textContent = msg;
          if (i === 2 || i === 3) line.className = "error";
          lines.append(line);
          bar.style.width = ((i + 1) / messages.length) * 100 + "%";
        },
        i * 470 + 200,
      ),
    );
    setTimeout(dismiss, 3300);
  }
  const machine = $("hero-machine"),
    meter = $("scroll-meter-bar"),
    manifesto = document.querySelector(".manifesto-line"),
    finale = $("finale-title");
  let ticking = false,
    finaleDone = false;
  function update() {
    const max = document.documentElement.scrollHeight - innerHeight;
    meter.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    if (!reduced) {
      const hero = $("home").getBoundingClientRect(),
        p = Math.max(0, Math.min(1, -hero.top / Math.max(1, hero.height)));
      machine.style.setProperty("--valve-rotation", p * 65 + "deg");
      machine.style.setProperty("--valve-scale", 1 + p * 0.45);
      const m = manifesto.parentElement.getBoundingClientRect();
      if (m.top < innerHeight && m.bottom > 0)
        manifesto.style.setProperty(
          "--manifesto-x",
          ((innerHeight - m.top) / Math.max(1, innerHeight + m.height)) * -75 +
            "px",
        );
    }
    if (!finaleDone && finale.getBoundingClientRect().top < innerHeight * 0.7) {
      finaleDone = true;
      setTimeout(() => {
        finale.classList.add("glitched");
        finale.innerHTML = "CI SCUSIAMO<br><span>PER L’INCONVENIENTE.</span>";
      }, 1300);
    }
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", update);
  update();
  if (!reduced && matchMedia("(pointer:fine)").matches) {
    const glow = $("cursor-glow");
    window.addEventListener(
      "pointermove",
      (e) => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      },
      { passive: true },
    );
  }
})();
