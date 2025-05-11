(() => {
  // self-exec, no globals
  const root = document.getElementById("tolstoy-gallery");
  if (!root) return;

  const thumbs = root.querySelectorAll("#tg-thumbs img");
  const main = root.querySelector("#tg-main");

  function show(imgEl) {
    const { type, src } = imgEl.dataset;

    // remove existing hero
    main.querySelectorAll("[data-tolstoy-hero]").forEach((n) => n.remove());

    const hero =
      type === "video"
        ? Object.assign(document.createElement("video"), {
            src,
            controls: true,
            playsInline: true,
          })
        : Object.assign(document.createElement("img"), { src });

    hero.dataset.tolstoy = "";
    hero.dataset.tolstoyHero = "";
    main.appendChild(hero);

    thumbs.forEach((t) => t.classList.toggle("active", t === imgEl));
  }

  thumbs.forEach((img) => {
    img.addEventListener("click", () => show(img));
  });

  show(thumbs[0]); // initial hero
})();
