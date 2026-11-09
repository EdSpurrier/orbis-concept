// Orbis environment round 1: theme and the environment questions.
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
        /* storage blocked: answers just aren't kept */
      }
    },
  };
  const $ = (id) => document.getElementById(id);
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") n.className = v;
      else n.setAttribute(k, v);
    }
    for (const k of kids) n.append(k);
    return n;
  };

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

  const questions = [
    { id: "alien", title: "How alien should the planet look?", why: "Section 01: start from real ground, then change the life, the liquids and the light.", options: [
      ["Real ground, strange life", "photo rock and sand; the plants, liquids and light are what's alien"],
      ["Strange all the way", "even the rock and sky look wrong"],
      ["Mostly Earth", "alien only near the poles"],
    ] },
    { id: "substance", title: "Does the substance shape the biomes?", why: "Section 02: a third climate axis, rising toward the poles.", options: [
      ["Yes, rising toward the poles", "the world gets stranger the further you push"],
      ["Yes, in patches", "rich seams anywhere bring glass and teal, no gradient"],
      ["No", "biomes from temperature and moisture only"],
    ] },
    { id: "biomes", title: "Which biomes do you want?", why: "Section 02.", multi: true, options: [
      ["The Mire", "equatorial swamp"],
      ["The Scrub", "rust grass and spore towers: the landing ground"],
      ["The Deep Desert", "dunes, glass storms, the giants"],
      ["The Creeping Forest", "wine-red, and it moves"],
      ["The Pale", "lichen, frost, long nights"],
      ["The Glass", "ice and crystal at the poles"],
      ["The Spines", "high ridges anywhere"],
      ["Goo basins", "the substance as a liquid"],
      ["The Hollows", "round the pits"],
    ] },
    { id: "borders", title: "Do biome borders move?", why: "Section 02: the forest creeps, the desert grows behind a giant, Hollows widen.", options: [
      ["Yes, and you push back", "fire, clearing, draining, terraforming"],
      ["Only the forest", "the creeping forest moves; the rest stays"],
      ["No", "biomes are fixed; only your buildings change the map"],
    ] },
    { id: "swampmove", title: "Which Mire rules?", why: "Section 03.", multi: true, options: [
      ["Heavy vehicles bog down", "tracked 50%, wheeled can't enter; hover and legs fine"],
      ["The Given swim", "deep channels are theirs"],
      ["Reeds hide units", "for both sides"],
      ["Rot gas", "fire sets it off: a sheet of fire on the water"],
      ["Drowners", "snare plants under the water grab infantry"],
      ["Flooded pits", "the Given come up where you can't see a nest"],
    ] },
    { id: "swampbuild", title: "How do you build in the Mire?", why: "Section 03.", multi: true, options: [
      ["On hummocks", "firm islands, normal cost"],
      ["On pilings", "anywhere shallow, +50% cost and time"],
      ["Drain it", "firm ground while a pump runs; lose power and it floods"],
    ] },
    { id: "ocean", title: "Oceans?", why: "Section 04.", options: [
      ["A: no ocean at all", "goo seas, glass rivers, black water"],
      ["B: one small real sea, plus goo", "a familiar landing coast"],
      ["C: as A, with a great goo sea at each pole", "frozen over, round the great pits"],
    ] },
    { id: "goo", title: "Is the goo the substance as a liquid?", why: "Section 04: it rises from the core, flows, and sets into crystal; the seams are old goo.", options: [
      ["Yes, the life cycle", "liquid, then crust, then crystal"],
      ["Something else", "a liquid of its own, tied to the substance some other way"],
      ["No goo", "ordinary liquids only"],
    ] },
    { id: "liquids", title: "Which liquids, and what for?", why: "Section 04.", multi: true, options: [
      ["Goo seas with energy wells", "big power on the shore; pumping raises irritation"],
      ["Glass rivers", "crust infantry can cross and tanks break"],
      ["Black water", "the Mire's water"],
      ["Rust brine", "acid springs: faster refining, wildlife's acid"],
      ["Sap pools", "fuel for fire weapons, and a fuse for forest fires"],
      ["Meltwater", "the only clean water, at the poles"],
    ] },
    { id: "colour", title: "What colour is the native life?", why: "Section 05.", options: [
      ["A: not green", "rust, wine-red, black-violet, teal; your crops are the only green"],
      ["B: green, with alien shapes", "familiar colours, strange shapes and behaviour"],
      ["C: greener at the equator", "turning red, white and glass toward the pole"],
    ] },
    { id: "storms", title: "Which storms?", why: "Section 06.", multi: true, options: [
      ["Glass storms", "desert: grit, crystal dust, ramps of sand against walls"],
      ["Rot squalls", "Mire: rain, gas, lightning on the water"],
      ["Spore season", "Scrub: the towers breathe out; orbit cut"],
      ["Thunderstorms", "forest: lightning starts fires"],
      ["Whiteouts", "Pale: everything slowed, sight gone"],
      ["Aurora storms", "Glass: the grid drains; the Given strongest"],
      ["Lightning crowns", "Spines: strikes your tallest tower"],
    ] },
    { id: "warning", title: "How much warning before a storm?", why: "Section 06: storms should punish bases that weren't ready, not bad luck.", options: [
      ["Plenty", "from orbit, a forecast, and signs on the ground"],
      ["Signs only", "read the sky and the wind; no forecast"],
      ["Little", "storms are meant to surprise you"],
    ] },
    { id: "skybodies", title: "What hangs in Orbis's sky?", why: "Section 07.", multi: true, options: [
      ["A: two moons", "a big slow one (tides, eclipses) and a small fast one (a clock)"],
      ["B: a broken moon's ring", "glittering with the substance; meteors fall from it"],
      ["C: a twin planet", "locked face to face: a near side and a far side"],
      ["D: Orbis is a giant's moon", "a banded giant fills a quarter of the sky"],
      ["One plain moon", "keep the sky close to Earth's"],
    ] },
    { id: "skyevents", title: "What should the sky do in play?", why: "Section 07: the sky is the planet's calendar.", multi: true, options: [
      ["Eclipses", "a few minutes of night at noon; the Given come out"],
      ["Tide nights", "moons in line: the biggest waves, surges if the heart is high"],
      ["Goo tides", "shores flood and drain every day"],
      ["Meteor falls", "fresh crystal where they land; they can hit your base"],
      ["Moonless nights", "true dark, the Given at their strongest"],
      ["Only looks", "the sky is scenery, no rules"],
    ] },
    { id: "suns", title: "How many suns?", why: "Section 07: two real suns mean two shadows, which is engine work.", options: [
      ["One sun", "a touch whiter than ours"],
      ["One sun and a distant second", "a bright star by day, a second dusk"],
      ["Two suns", "double shadows"],
    ] },
    { id: "skycolour", title: "What colour is the day sky?", why: "Section 07.", options: [
      ["Earth blue", "the strangeness is elsewhere"],
      ["Slightly wrong", "pale teal or an amber haze"],
      ["Changes with the region's anger", "it darkens or bruises as irritation rises"],
    ] },
    { id: "skylore", title: "What story does the sky tell?", why: "Section 07: ties to the lore page.", multi: true, options: [
      ["The heart broke a moon", "the ring is what the heart can do; murals show a sky without it"],
      ["Your station is a moving star", "the uplink; storms and mist hide it"],
      ["The rival is a growing light", "a countdown you can see over several missions"],
      ["The ancients' home is a star", "a faint red star the ruins point at"],
    ] },
    { id: "giant", title: "Which desert giant?", why: "Section 08.", options: [
      ["A: Ploughs", "swim under the sand, feed on seams, heave the ground"],
      ["B: Spine-sleepers", "a crystal ridge that wakes and walks off"],
      ["C: Storm-walkers", "stilt-legged giants inside the glass storms"],
    ] },
    { id: "plough", title: "What does the giant do?", why: "Section 08: for whichever giant you pick.", multi: true, options: [
      ["Drawn to seams and noise", "your mine is eating its food"],
      ["Heaves the ground", "buildings topple; a new ridge rises"],
      ["A rich wake", "crystal showing, and a flash bloom that heals the swarm"],
      ["Can be lured", "thumpers pull it away"],
      ["Can be killed", "a giant fight"],
      ["Can be guided", "Stabilise, late"],
    ] },
    { id: "orbit", title: "What should you see from orbit?", why: "Principle 8: every biome has one thing you can see from orbit.", multi: true, options: [
      ["Mist columns over pits", "as on the lore page"],
      ["Goo glowing at night", "teal patches in the dark"],
      ["Giants' wakes", "lines across the desert"],
      ["Storm walls", "glass storms on the move"],
      ["The aurora", "over the poles"],
      ["The ring and the moons", "behind the planet as you climb"],
      ["Your green", "the only green on the planet"],
    ] },
  ];

  const state = store.get("rts.env1", { picks: {}, notes: {}, extra: "" });
  const save = () => {
    store.set("rts.env1", state);
    const answered = questions.filter((q) => (state.picks[q.id] ?? []).length > 0 || (state.notes[q.id] ?? "").trim()).length;
    $("progress").style.width = `${Math.round((answered / questions.length) * 100)}%`;
  };
  const alwaysNote = new Set([]);
  const qs = $("qs");
  questions.forEach((q, n) => {
    const card = el("div", { class: "card qcard" });
    const title = el("h3", {}, q.title);
    if (q.multi) title.append(el("span", { class: "multi" }, "pick any"));
    card.append(el("div", { class: "qn" }, `Q${n + 1}`), title);
    if (q.why) card.append(el("div", { class: "why" }, q.why));
    const opts = el("div", { class: "opts" });
    const note = el("textarea", { class: "qnote", placeholder: "my own idea, or a note on this one" });
    note.value = state.notes[q.id] ?? "";
    note.hidden = !(state.picks[q.id] ?? []).includes("My own idea") && !note.value && !alwaysNote.has(q.id);
    note.addEventListener("input", () => {
      state.notes[q.id] = note.value;
      save();
    });
    const buttons = [];
    for (const [label, desc] of [...q.options, ["My own idea", "write it below"]]) {
      const b = el("button", { type: "button", class: `opt${label === "My own idea" ? " mine" : ""}` }, el("b", {}, label));
      if (desc) b.append(el("span", {}, desc));
      buttons.push([label, b]);
      b.addEventListener("click", () => {
        let picks = state.picks[q.id] ?? [];
        if (q.multi) picks = picks.includes(label) ? picks.filter((p) => p !== label) : [...picks, label];
        else picks = picks[0] === label ? [] : [label];
        state.picks[q.id] = picks;
        paint();
        if (label === "My own idea" && picks.includes(label)) {
          note.hidden = false;
          note.focus();
        }
        save();
      });
      opts.append(b);
    }
    const paint = () => {
      const picks = state.picks[q.id] ?? [];
      for (const [label, b] of buttons) {
        b.classList.toggle("on", picks.includes(label));
        b.setAttribute("aria-pressed", picks.includes(label) ? "true" : "false");
      }
    };
    paint();
    card.append(opts, note);
    qs.append(card);
  });
  const extra = $("extra");
  extra.value = state.extra ?? "";
  extra.addEventListener("input", () => {
    state.extra = extra.value;
    save();
  });
  save();

  const summary = () => {
    const lines = ["## Orbis environment, round 1", ""];
    questions.forEach((q, n) => {
      const picks = state.picks[q.id] ?? [];
      lines.push(`**Q${n + 1}. ${q.title}** ${picks.length ? picks.join("; ") : "(no answer)"}`);
      const note = (state.notes[q.id] ?? "").trim();
      if (note) lines.push(`  note: ${note}`);
    });
    if ((state.extra ?? "").trim()) lines.push("", `Anything else: ${state.extra.trim()}`);
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
    state.picks = {};
    state.notes = {};
    state.extra = "";
    save();
    location.hash = "questions";
    location.reload();
  });

  const links = [...document.querySelectorAll("#nav a[href^='#']")];
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const seen = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((a) => a.classList.remove("on"));
        byId.get(e.target.id)?.classList.add("on");
      }
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  document.querySelectorAll("section[id]").forEach((s) => seen.observe(s));
})();
