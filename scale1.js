// Orbis unit scale study: theme, the one-screen calculator and the dots of the "same strength" diagram.
(() => {
  const $ = (id) => document.getElementById(id);
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  };
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* storage blocked: the theme just isn't kept */
      }
    },
  };

  // Theme: the site's shared auto / light / dark switch.
  const themes = ["auto", "light", "dark"];
  let theme = store.get("rts.theme", "auto");
  const applyTheme = () => {
    if (theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", theme);
    $("theme").textContent = `Theme: ${theme}`;
  };
  $("theme").addEventListener("click", () => {
    theme = themes[(themes.indexOf(theme) + 1) % themes.length];
    store.set("rts.theme", theme);
    applyTheme();
  });
  applyTheme();

  // The calculator. Orbis's camera: fovY 0.8 rad (rts_camera.h); units' lengths from unit_models.cpp kUnitLength.
  const FOV = 0.8;
  const UNITS = {
    tank: { len: 3.0, wide: 0.6, tris: 620, name: "tank", side: "f-blue" },
    runner: { len: 1.6, wide: 0.5, tris: 548, name: "runner", side: "f-red" },
    brute: { len: 3.2, wide: 0.6, tris: 9926, name: "brute", side: "f-red" },
  };
  const state = { res: 1440, unit: "tank", space: 6 };
  const fmt = (n) => (n >= 100 ? Math.round(n).toLocaleString("en-GB") : n >= 10 ? n.toFixed(0) : n.toFixed(1));
  const distance = () => 20 * Math.pow(100, Number($("dist").value) / 1000); // 20 m to 2 km, log
  const needed = (px, tris) => {
    if (px >= 64) return `${Math.min(tris, 600)} (full)`;
    if (px >= 24) return "~200";
    if (px >= 10) return "~50";
    if (px >= 4) return "~12";
    return "an icon";
  };

  const view = $("screenview");
  const pattern = svgEl("pattern", { id: "unitpat", patternUnits: "userSpaceOnUse", width: 10, height: 10 });
  const patUnit = svgEl("rect", { x: 0, y: 0, width: 4, height: 2, rx: 0.5 });
  pattern.append(patUnit);
  const defs = svgEl("defs", {});
  defs.append(pattern);
  view.append(defs);
  view.append(svgEl("rect", { x: 0, y: 0, width: 480, height: 270, rx: 8, class: "f-greensoft" }));
  const field = svgEl("rect", { x: 0, y: 0, width: 480, height: 270, rx: 8, fill: "url(#unitpat)" });
  view.append(field);
  view.append(svgEl("rect", { x: 1, y: 1, width: 478, height: 268, rx: 8, fill: "none", class: "s-line", "stroke-width": 2 }));
  const label = svgEl("text", { x: 12, y: 256, "font-size": 13, "font-weight": 700 });
  const labelBg = svgEl("rect", { x: 4, y: 238, width: 10, height: 26, rx: 6, class: "f-surface" });
  view.append(labelBg, label);

  const update = () => {
    const d = distance();
    const u = UNITS[state.unit];
    const H = state.res;
    const viewH = 2 * d * Math.tan(FOV / 2); // metres of ground the screen's height covers
    const viewW = viewH * (16 / 9);
    const px = (u.len / viewH) * H;
    const fit = Math.floor((viewW * viewH) / (state.space * state.space));
    const area = Math.max(px * px * u.wide, 0.25);
    const tpp = u.tris / area;

    $("distv").textContent = `${fmt(d)} m`;
    $("o-px").textContent = `${fmt(px)} px`;
    $("o-fit").textContent = fit.toLocaleString("en-GB");
    $("o-tpp").textContent = tpp >= 0.1 ? fmt(tpp) : tpp.toFixed(2);
    $("o-need").textContent = needed(px, u.tris);

    let verdict;
    if (px >= 64) verdict = `Close up: the ${u.name} is ${fmt(px)} pixels long and every triangle shows. About ${fit.toLocaleString("en-GB")} would fill the screen.`;
    else if (px >= 24) verdict = `A normal RTS view: you can tell units apart and pick them. Small parts (tracks, the gun's detail) stop showing.`;
    else if (px >= 10) verdict = `Zoomed out over a front: units read as shapes and colours. A ~50 triangle version looks the same as the full one.`;
    else if (px >= 4) verdict = `${fit.toLocaleString("en-GB")} fit, but each is ${fmt(px)} pixels: a dot with a direction. Nobody is picking these one by one.`;
    else verdict = `From this far the units are under 4 pixels: the strategic icons do the job better than any model.`;
    $("o-verdict").textContent = verdict;

    // The little screen, drawn at the same scale: one pattern tile per unit's spot.
    const mini = 270 / viewH; // mini-screen pixels per metre
    const sp = Math.max(state.space * mini, 0.9);
    const ml = Math.max(u.len * mini, 0.5);
    pattern.setAttribute("width", sp);
    pattern.setAttribute("height", sp);
    patUnit.setAttribute("width", Math.min(ml, sp * 0.9));
    patUnit.setAttribute("height", Math.min(ml * u.wide, sp * 0.9));
    patUnit.setAttribute("class", u.side);
    label.textContent = `${fit.toLocaleString("en-GB")} ${u.name}s · ${fmt(px)} px each at ${H}p`;
    labelBg.setAttribute("width", Math.min(label.getComputedTextLength() + 16, 472));
  };

  const seg = (id, key, parse) => {
    const box = $(id);
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      for (const x of box.querySelectorAll("button")) x.classList.toggle("on", x === b);
      state[key] = parse(b.dataset.v);
      update();
    });
  };
  seg("res", "res", Number);
  seg("unit", "unit", String);
  seg("space", "space", Number);
  $("dist").addEventListener("input", update);
  update();

  // 300 runners for "the same strength, two ways": a loose crowd, placed the same way every time.
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const dots = $("dots");
  for (let i = 0; i < 300; ++i) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand());
    dots.append(svgEl("circle", { cx: (520 + Math.cos(a) * r * 185).toFixed(1), cy: (88 + Math.sin(a) * r * 48).toFixed(1), r: 3 }));
  }
})();
