// Orbis concept: profile bars, the games matrix, fit table and the round 2 questions.
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
        /* storage blocked: the page still works, answers just aren't kept */
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

  // --- theme (shared with the guide) ----------------------------------------------------------------
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

  // --- profile (round 1 answers) ----------------------------------------------------------------------
  const profile = [
    ["Scale", 64, "a few squads", "huge armies"],
    ["Control", 38, "micro every unit", "command the army"],
    ["Pace", 39, "slow, thoughtful", "fast, frantic"],
    ["Economy", 36, "one simple resource", "deep, trade"],
    ["Factions", 72, "mirrored", "very different"],
    ["Base building", 100, "little or none", "big, sprawling"],
    ["How you play", 9, "single-player", "competitive"],
    ["Match length", 50, "15 minutes", "2 hours+"],
    ["Setting", 100, "grounded", "sci-fi, fantasy"],
  ];
  const pBox = $("profileBars");
  for (const [label, v, lo, hi] of profile) {
    const left = v >= 50 ? 50 : v, width = Math.max(Math.abs(v - 50), 1.2);
    const colour = v >= 50 ? "var(--blue)" : "var(--amber)";
    pBox.append(
      el("div", { class: "prow" },
        el("span", { class: "lab" }, label),
        el("div", { class: "ptrack" }, el("i", { style: `left:${left}%;width:${width}%;background:${colour}` })),
        el("span", { class: "val" }, String(v))),
      el("div", { class: "prow", style: "margin-top:-8px" }, el("span", {}), el("div", { class: "pends" }, el("span", {}, lo), el("span", {}, hi)), el("span", {})),
    );
  }

  // --- the games matrix ---------------------------------------------------------------------------
  const cols = ["Base building", "Late escalation", "Hostile world", "Huge scale", "Distinct factions", "Campaign"];
  const rows = [
    ["Dune II", [2, 1, 2, 0, 1, 2]],
    ["Command & Conquer", [2, 2, 1, 0, 2, 2]],
    ["Red Alert", [2, 2, 0, 0, 2, 2]],
    ["Total Annihilation", [2, 2, 0, 2, 1, 2]],
    ["Age of Empires II", [2, 1, 0, 1, 1, 2]],
    ["Warcraft III", [2, 0, 1, 0, 2, 2]],
    ["C&C Generals", [2, 2, 0, 0, 2, 2]],
    ["Supreme Commander", [2, 2, 0, 2, 1, 2]],
    ["Sins of a Solar Empire", [1, 1, 1, 2, 2, 0]],
    ["Planetary Annihilation", [2, 2, 0, 2, 0, 1]],
    ["They Are Billions", [2, 1, 2, 2, 0, 2]],
    ["Tempest Rising", [2, 1, 0, 0, 2, 2]],
  ];
  const disliked = ["Total War series", [0, 0, 0, 2, 1, 2]];
  const table = $("matrix");
  const head = el("tr", {}, el("th", {}, "Game"));
  cols.forEach((c) => head.append(el("th", {}, c)));
  table.append(el("thead", {}, head));
  const body = el("tbody");
  const dot = (v) => el("span", { class: `dot ${v === 2 ? "full" : v === 1 ? "half" : "none"}`, title: ["not really", "there, not the point", "central"][v] });
  for (const [name, vals] of rows) {
    const tr = el("tr", {}, el("td", {}, name));
    vals.forEach((v) => tr.append(el("td", {}, dot(v))));
    body.append(tr);
  }
  const dis = el("tr", { class: "dis" }, el("td", {}, `${disliked[0]} (disliked)`));
  disliked[1].forEach((v) => dis.append(el("td", {}, dot(v))));
  body.append(dis);
  const tot = el("tr", { class: "tot" }, el("td", {}, "Your loved games"));
  cols.forEach((_, c) => {
    const score = rows.reduce((s, [, vals]) => s + (vals[c] === 2 ? 1 : vals[c] === 1 ? 0.5 : 0), 0);
    const pct = Math.round((score / rows.length) * 100);
    tot.append(el("td", {}, el("div", { class: "meter", style: "max-width:80px;margin:0 auto" }, el("i", { style: `width:${pct}%;background:var(--green)` })), el("div", { class: "small muted" }, `${pct}%`)));
  });
  body.append(tot);
  table.append(body);

  // --- the swarm infographic ------------------------------------------------------------------------
  const swarm = $("swarm");
  let seed = 7;
  const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const ns = "http://www.w3.org/2000/svg";
  for (let i = 0; i < 420; ++i) {
    const a = rand() * Math.PI * 2, r = 34 + Math.pow(rand(), 0.7) * 92;
    const x = 120 + Math.cos(a) * r * 1.15, y = 60 + Math.sin(a) * r * 0.62;
    if (x < 4 || x > 236 || y < 4 || y > 116) continue;
    const c = document.createElementNS(ns, "circle");
    c.setAttribute("cx", x.toFixed(1));
    c.setAttribute("cy", y.toFixed(1));
    c.setAttribute("r", (1 + rand() * 1.2).toFixed(1));
    c.setAttribute("opacity", (0.45 + rand() * 0.55).toFixed(2));
    swarm.append(c);
  }

  // --- how each direction fits ----------------------------------------------------------------------
  const traits = [
    ["Builder & bases", [5, 4, 4, 5]],
    ["Safe start", [5, 3, 3, 5]],
    ["Hostile world", [5, 2, 1, 5]],
    ["Escalation", [4, 3, 5, 5]],
    ["Big scale", [5, 4, 4, 5]],
    ["Distinct factions", [2, 5, 3, 4]],
    ["Single-player", [5, 5, 3, 5]],
  ];
  const fit = $("fitTable");
  fit.append(el("span"), el("span", { class: "h" }, "A"), el("span", { class: "h" }, "B"), el("span", { class: "h" }, "C"), el("span", { class: "h rec" }, "A + C + B"));
  for (const [name, scores] of traits) {
    fit.append(el("span", {}, name));
    scores.forEach((s, k) => {
      const bar = el("div", { class: `fitbar${k === 3 ? " rec" : ""}`, title: `${s} of 5` });
      for (let i = 0; i < 5; ++i) bar.append(el("i", { class: i < s ? "on" : "" }));
      fit.append(bar);
    });
  }

  // --- round 2 questions ---------------------------------------------------------------------------
  const questions = [
    { id: "direction", title: "Which direction?", why: "Everything else hangs off this.", options: [
      ["A · The planet is the enemy", "survive and outgrow a hostile world"],
      ["B · A war for one planet", "factions fight for the globe, region by region"],
      ["C · Escalation war", "skirmish up the tiers to superweapons"],
      ["All three in layers", "A at the core, C as the spine, B arrives later (recommended)"],
    ] },
    { id: "enemy", title: "Who is the main enemy?", why: "Native life suits the turtle curve; rival factions bring smarter fights.", options: [
      ["The planet's native life", "swarms and creatures, no politics"],
      ["Rival factions", "other landings, AI commanders"],
      ["Natives first, factions later", "learn the world, then the war"],
      ["Both from the start", "a three-way fight"],
    ] },
    { id: "threats", title: "What does the planet throw at you?", why: "Orbis already has deserts, storms, night and room for 100 000 units.", multi: true, options: [
      ["Swarms of thousands", "They Are Billions on a sphere"],
      ["Giant megafauna", "sandworms and worse"],
      ["Hostile weather", "storms, eruptions, blizzards"],
      ["Dangerous nights", "they come when it's dark"],
      ["Rogue machines", "a dead civilisation's defences instead of life"],
    ] },
    { id: "factions", title: "How many playable factions to start with?", why: "Fewer means each one can be deeper and more different.", options: [
      ["One, deep", "perfect one side first"],
      ["Two, very different", "Red Alert style"],
      ["Three", "Generals style"],
      ["Four or more", "Sins style"],
    ] },
    { id: "flavour", title: "Which factions land on the planet?", why: "The playable sides: the one you play and the rivals who land later (the AI plays them). The planet's natives are separate, in Q3. Pick as many as Q4's count.", multi: true, options: [
      ["Human military", "tanks, artillery, orbital support"],
      ["Corporate colonists", "miners and contractors"],
      ["Alien hive", "grows its base, swarms"],
      ["Machine intelligence", "self-replicating, Total Annihilation feel"],
      ["Psionic or mystic", "strange tech, few powerful units"],
      ["Zealots or a cult", "Nod energy"],
    ] },
    { id: "safety", title: "How should the early game protect you?", why: "Your top complaint was losing to an instant rush.", multi: true, options: [
      ["A landing period", "no attacks for the first minutes"],
      ["Small, announced first waves", "learn where the walls go"],
      ["Cheap, strong early defence", "holding costs less than attacking"],
      ["An HQ that can't be rushed", "shielded until mid-game"],
      ["Difficulty sets the timing", "how soon attacks start"],
    ] },
    { id: "endgame", title: "What sits at the top of the tech tree?", why: "The strike you build up to.", multi: true, options: [
      ["Nukes and missiles", "the classic"],
      ["Orbital strikes", "from space, watched from space"],
      ["Giant experimentals", "Supreme Commander scale"],
      ["Planet-shaping", "move weather, raise land, call the worms"],
      ["Megastructures", "super-turrets, planetary shields"],
    ] },
    { id: "economy", title: "Which economy?", why: "You leaned simple (36/100).", options: [
      ["One harvested resource", "Tiberium or spice, harvesters to protect"],
      ["Mass and energy as a flow", "Total Annihilation / Supreme Commander"],
      ["Two stockpiled resources", "StarCraft style"],
      ["Resources plus upkeep", "big armies cost income"],
    ] },
    { id: "heroes", title: "Units you care about?", why: "How to get micro inside a big army.", options: [
      ["A Commander you must protect", "Total Annihilation"],
      ["Heroes that level up", "Warcraft III"],
      ["Both", "a Commander plus heroes"],
      ["Neither", "the army is the hero"],
    ] },
    { id: "base", title: "What makes a base yours?", why: "Base building was 100/100.", multi: true, options: [
      ["Walls and gates", "They Are Billions, Age of Empires"],
      ["Turret lines and bunkers", "layered defence"],
      ["Adjacency bonuses", "buildings boost their neighbours, so layout matters (Supreme Commander)"],
      ["Territory you claim", "the base spreads over the land"],
      ["A power grid to protect", "Command & Conquer"],
      ["A settlement to keep safe", "colonists live in your base and work it; lose them and you lose (They Are Billions, kept light)"],
    ] },
    { id: "campaign", title: "What shape is the campaign?", why: "You play single-player first (9/100).", options: [
      ["One persistent planet, region by region", "your bases stay; you spread out across the globe one region at a time"],
      ["Region by region on one planet", "Dune II's map, on a globe"],
      ["One long persistent campaign", "your base carries over"],
      ["A planet per chapter", "a new world each act"],
      ["Survival maps first", "campaign once the game works"],
    ] },
    { id: "explore", title: "What does exploring the planet turn up?", why: "Ruins of a lost civilisation, out past your borders.", multi: true, options: [
      ["Lost technology", "ruins unlock tech tiers: exploring is how you climb"],
      ["The planet's story", "what happened here, told through the ruins"],
      ["Sleeping guardians", "old machines that wake when you dig, and fight"],
      ["Caches and rich ground", "resources worth expanding towards"],
      ["Superweapon pieces", "the endgame is assembled from what you find"],
      ["Clues to the natives", "why the planet fights back, and how to calm or anger it"],
    ] },
    { id: "frontier", title: "What happens to regions you've already secured?", why: "A persistent planet can turn into defending ten bases at once. These can combine: pick any, or the combined model.", multi: true, options: [
      ["Combined, by how secure a region is", "frontier is live, held regions get warned raids, fortified ones hold, neglected ones slip back; planet-wide surges at big moments"],
      ["They hold themselves", "once fortified, natives back off; only the frontier is busy"],
      ["Occasional raids", "now and then a secured region is hit and needs help"],
      ["Everything stays live", "every base can be attacked at any time"],
      ["Natives reclaim neglected land", "leave a region weak and the planet takes it back"],
    ] },
    { id: "length", title: "How long is a mission or match?", why: "You sat in the middle (50/100).", options: [
      ["20 to 30 minutes", "a lunch break"],
      ["45 to 60 minutes", "an evening's game"],
      ["90 minutes or more", "a big session"],
      ["Varies by mission", "short ones and epic ones"],
    ] },
    { id: "first", title: "What should we build first?", why: "The first playable slice of the game layer.", options: [
      ["Survive the swarm", "a base, walls, turrets and waves"],
      ["Skirmish against one AI", "a rival that builds and attacks"],
      ["One climb to a superweapon", "four tiers and the strike"],
      ["The worm", "one great creature that hunts the desert"],
    ] },
  ];

  const state = store.get("rts.concept", { picks: {}, notes: {}, extra: "" });
  const save = () => {
    store.set("rts.concept", state);
    const answered = questions.filter((q) => (state.picks[q.id] ?? []).length > 0).length;
    $("progress").style.width = `${Math.round((answered / questions.length) * 100)}%`;
  };
  const qs = $("qs");
  questions.forEach((q, n) => {
    const card = el("div", { class: "card qcard" });
    const title = el("h3", {}, q.title);
    if (q.multi) title.append(el("span", { class: "multi" }, "pick any"));
    card.append(el("div", { class: "qn" }, `Q${n + 1}`), title, el("div", { class: "why" }, q.why));
    const opts = el("div", { class: "opts" });
    const note = el("textarea", { class: "qnote", placeholder: "my own idea, or a note on this one" });
    note.value = state.notes[q.id] ?? "";
    note.hidden = !(state.picks[q.id] ?? []).includes("My own idea") && !note.value;
    note.addEventListener("input", () => {
      state.notes[q.id] = note.value;
      save();
    });
    const all = [...q.options, ["My own idea", "write it below"]];
    const buttons = [];
    for (const [label, desc] of all) {
      const b = el("button", { type: "button", class: `opt${label === "My own idea" ? " mine" : ""}` }, el("b", {}, label), el("span", {}, desc));
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
    const lines = ["## Orbis concept, round 2", ""];
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

  // --- the nav follows the section in view ----------------------------------------------------------
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
