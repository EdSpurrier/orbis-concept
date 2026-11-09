// What makes a good RTS: theme, small data-driven diagrams, the taste form.
(() => {
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
        /* private window or blocked storage: the page still works */
      }
    },
  };
  const $ = (id) => document.getElementById(id);
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") n.className = v;
      else if (k === "style") n.style.cssText = v;
      else n.setAttribute(k, v);
    }
    for (const k of kids) n.append(k);
    return n;
  };

  // --- theme: auto, light, dark ---------------------------------------------------------------------------
  const themes = ["auto", "light", "dark"];
  let theme = store.get("rts.theme", "auto");
  const applyTheme = () => {
    if (theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", theme);
    $("theme").textContent = { auto: "Theme: auto", light: "Theme: light", dark: "Theme: dark" }[theme];
  };
  $("theme").addEventListener("click", () => {
    theme = themes[(themes.indexOf(theme) + 1) % themes.length];
    store.set("rts.theme", theme);
    applyTheme();
  });
  applyTheme();

  // --- unit identity bars --------------------------------------------------------------------------------
  const ident = [
    ["Range", 25, 95],
    ["Speed", 90, 15],
    ["Size", 30, 80],
    ["Armour", 25, 60],
    ["Damage", 35, 90],
    ["Cost & time", 30, 85],
  ];
  const identBox = $("ident");
  for (const [name, a, b] of ident) {
    identBox.append(
      el("span", {}, name),
      el("div", { class: "meter" }, el("i", { style: `width:${a}%;background:var(--blue)` })),
      el("div", { class: "meter" }, el("i", { style: `width:${b}%;background:var(--red)` })),
    );
  }

  // --- resource counts --------------------------------------------------------------------------------------
  const res = [
    [1, "Command & Conquer", "Tiberium", "var(--muted)"],
    [2, "StarCraft", "minerals, gas", "var(--green)"],
    [4, "Age of Empires", "food, wood, gold, stone", "var(--green)"],
    [13, "Offworld Trading Co.", "a whole market", "var(--amber)"],
  ];
  const resBox = $("resScale");
  for (const [n, game, what, colour] of res) {
    const h = 26 + Math.log2(n + 1) * 26;
    resBox.append(
      el(
        "div",
        { class: "col" },
        el("div", { style: "font-weight:800;font-size:22px" }, String(n)),
        el("div", { class: "barv", style: `height:${h}px;background:${colour}` }),
        el("div", { style: "font-weight:600" }, game),
        el("div", { class: "muted", style: "font-size:12px" }, what),
      ),
    );
  }

  // --- the taste form ---------------------------------------------------------------------------------------
  const sliders = [
    ["scale", "Scale", "a few squads", "huge armies"],
    ["control", "Control", "micro every unit", "command the whole army"],
    ["pace", "Pace", "slow and thoughtful", "fast and frantic"],
    ["economy", "Economy", "one simple resource", "deep, many resources, trade"],
    ["factions", "Factions", "mirrored sides", "very different sides"],
    ["bases", "Base building", "little or none", "big sprawling bases"],
    ["mode", "How I play", "single-player campaign", "competitive multiplayer"],
    ["length", "Match length", "15 minutes", "2 hours or more"],
    ["setting", "Setting", "grounded, realistic", "sci-fi or fantasy"],
  ];
  const games = [
    ["Dune II", 1992], ["Command & Conquer", 1995], ["Red Alert", 1996], ["Total Annihilation", 1997],
    ["StarCraft", 1998], ["Homeworld", 1999], ["Age of Empires II", 1999], ["Total War series", 2000],
    ["Cossacks", 2001], ["Empire Earth", 2001], ["Warcraft III", 2002], ["Age of Mythology", 2002],
    ["Rise of Nations", 2003], ["C&C Generals", 2003], ["Dawn of War", 2004], ["Company of Heroes", 2006],
    ["Supreme Commander", 2007], ["Sins of a Solar Empire", 2008], ["Men of War", 2009], ["Halo Wars", 2009],
    ["StarCraft II", 2010], ["Planetary Annihilation", 2014], ["Grey Goo", 2015], ["Ashes of the Singularity", 2016],
    ["Offworld Trading Co.", 2016], ["They Are Billions", 2017], ["Northgard", 2018], ["Age of Empires IV", 2021],
    ["Beyond All Reason", null], ["Stormgate", 2024], ["Tempest Rising", 2025],
  ];
  const state = store.get("rts.taste", { sliders: {}, games: {}, love: "", hate: "", moment: "" });
  const save = () => store.set("rts.taste", state);

  const sliderBox = $("sliders");
  sliderBox.append(el("h3", {}, "What I like"));
  for (const [key, label, lo, hi] of sliders) {
    const input = el("input", { type: "range", min: "0", max: "100", value: String(state.sliders[key] ?? 50), id: `s-${key}` });
    input.addEventListener("input", () => {
      state.sliders[key] = Number(input.value);
      save();
    });
    sliderBox.append(
      el("div", { class: "slider" }, el("label", { for: `s-${key}` }, label), input, el("div", { class: "ends" }, el("span", {}, lo), el("span", {}, hi))),
    );
  }

  const gameBox = $("games");
  const cycle = { undefined: "loved", loved: "disliked", disliked: undefined };
  for (const [name, year] of games) {
    const tile = el("button", { type: "button", class: "game" }, el("span", {}, name), el("span", { class: "yr" }, year ? String(year) : "open beta"));
    const paint = () => {
      tile.classList.toggle("loved", state.games[name] === "loved");
      tile.classList.toggle("disliked", state.games[name] === "disliked");
      tile.setAttribute("aria-pressed", state.games[name] ? "true" : "false");
      tile.title = state.games[name] ?? "not marked";
    };
    tile.addEventListener("click", () => {
      const next = cycle[state.games[name]];
      if (next) state.games[name] = next;
      else delete state.games[name];
      save();
      paint();
    });
    paint();
    gameBox.append(tile);
  }

  for (const key of ["love", "hate", "moment"]) {
    const area = $(key);
    area.value = state[key] ?? "";
    area.addEventListener("input", () => {
      state[key] = area.value;
      save();
    });
  }

  const summary = () => {
    const lines = ["## My RTS taste", ""];
    for (const [key, label, lo, hi] of sliders) {
      const v = state.sliders[key] ?? 50;
      const lean = v < 40 ? `leans to ${lo}` : v > 60 ? `leans to ${hi}` : "in the middle";
      lines.push(`- ${label}: ${v}/100 (${lo} ↔ ${hi}), ${lean}`);
    }
    const loved = games.filter(([n]) => state.games[n] === "loved").map(([n]) => n);
    const disliked = games.filter(([n]) => state.games[n] === "disliked").map(([n]) => n);
    lines.push("", `Loved: ${loved.length ? loved.join(", ") : "none marked"}`);
    lines.push(`Disliked: ${disliked.length ? disliked.join(", ") : "none marked"}`);
    if (state.love?.trim()) lines.push("", `What I love: ${state.love.trim()}`);
    if (state.hate?.trim()) lines.push("", `What I can't stand: ${state.hate.trim()}`);
    if (state.moment?.trim()) lines.push("", `A moment I remember: ${state.moment.trim()}`);
    return lines.join("\n");
  };

  $("copy").addEventListener("click", async () => {
    const text = summary();
    const out = $("out");
    out.hidden = false;
    out.textContent = text;
    try {
      await navigator.clipboard.writeText(text);
      $("copied").textContent = "Copied. Paste it into the chat.";
    } catch {
      $("copied").textContent = "Select the text below and copy it.";
    }
  });
  $("clear").addEventListener("click", () => {
    state.sliders = {};
    state.games = {};
    state.love = state.hate = state.moment = "";
    save();
    location.hash = "taste";
    location.reload();
  });

  // --- the nav follows the section in view ----------------------------------------------------------------
  const links = [...document.querySelectorAll("#nav a")];
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const seen = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => a.classList.remove("on"));
        const a = byId.get(e.target.id);
        if (a) {
          a.classList.add("on");
          a.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
      }
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  document.querySelectorAll("section[id]").forEach((s) => seen.observe(s));
})();
