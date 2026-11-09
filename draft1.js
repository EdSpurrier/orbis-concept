// Orbis concept draft 1: theme and the round 3 questions.
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
    { id: "sides", title: "Is this the right cast?", why: "You picked one deep faction (Q4) and three kinds of side (Q5). Draft 1 combines them (section 03).", options: [
      ["Yes, as drafted", "you: a corporate-funded military expedition; the machines: the ruins' guardians; later a rival corporation"],
      ["Machines are a second landing", "not the lost civilisation's; another faction from off-world"],
      ["No rival corporation", "natives and machines are enough"],
      ["I'd play the machines too", "two playable sides after all"],
    ] },
    { id: "motive", title: "Why are we here?", why: "Section 00. Preselected: you chose the three layers in chat. Change it if you like.", multi: true, options: [
      ["The prize", "something here exists nowhere else; the easy planets have nothing"],
      ["The exodus", "home is failing; this is the only world in reach"],
      ["The claim", "a charter race; hold it when the window closes and it's yours"],
      ["The call", "a signal from the ruins brought you here"],
      ["Layered, as drafted", "the company's prize, the colonists' way out, the truth in the ruins"],
    ] },
    { id: "prize", title: "If there's a prize, what is it?", why: "Preselected: you wanted all four, as one substance seen four ways, with the life studied rather than sold (section 00). Change it if you like.", multi: true, options: [
      ["An exotic material", "a mineral or crystal found nowhere else"],
      ["The lost technology", "the ruins themselves are the treasure"],
      ["Studying the life", "to understand the material, tune weapons, learn what they are"],
      ["Energy from the core", "a power source that feeds the storms and the creatures"],
    ] },
    { id: "ownidea", title: "Your own idea for the base (Q10)", why: "Preselected from chat: crawler bases, terraforming with a cost, and orbital support you earn (section 05).", multi: true, options: [
      ["Underground / tunnels", "bases that dig down"],
      ["Mobile bases", "crawlers or ships that move the base"],
      ["Terraforming the base ground", "raise walls of rock, dig moats"],
      ["Orbital support", "stations above your base"],
    ] },
    { id: "ending", title: "How does the campaign end?", why: "Preselected from chat: three ways to win, not escape (section 04).", multi: true, options: [
      ["Take the whole planet", "Dominate: every region fortified, by strength alone"],
      ["Stabilise the planet", "bond with the planet until it calms (was 'make peace')"],
      ["Wake what was buried", "Inherit: face it, take its power, then purge the natives or hold them back"],
      ["Escape", "build the way off-world before it's too late"],
      ["Several endings", "depending on how you played"],
    ] },
    { id: "natives", title: "What are the natives, really?", why: "This sets the tone of every fight and the planet's story.", options: [
      ["An ecosystem", "animals and plants defending territory, no mind behind it"],
      ["A hive mind", "one intelligence steering the swarms"],
      ["The planet is alive", "the world itself is the organism"],
      ["Made by the lost civilisation", "their bioweapons, still following orders"],
    ] },
    { id: "control", title: "No heroes: how do you steer a big army?", why: "Q9 said the army is the hero.", multi: true, options: [
      ["Formations", "lines, wedges, squares that keep shape"],
      ["Stances", "hold, aggressive, return fire, retreat when hurt"],
      ["Control groups", "number keys for groups, as usual"],
      ["Rally and patrol routes", "set it up once, it runs"],
      ["Squads that act together", "orders by squad, not by unit"],
    ] },
    { id: "megafauna", title: "How do the giant creatures behave?", why: "Your sandworm memory.", multi: true, options: [
      ["Hunters that roam", "they cross regions and hunt noise or vibration"],
      ["Guardians of places", "boss fights at nests and ruins"],
      ["Migrate with the seasons", "predictable, plan around them"],
      ["Can be lured or used", "lead one into your enemy"],
    ] },
    { id: "nights", title: "How long is a day?", why: "Orbis already has a clock; night is when it gets dangerous.", options: [
      ["Short: about 10 minutes", "a night every match"],
      ["Medium: about 20 minutes", "a few per mission"],
      ["Long: about 40 minutes", "nights are events"],
      ["Set by the region", "deserts burn, poles stay dark"],
    ] },
    { id: "reshape", title: "What does planet-shaping mean?", why: "Top of the tech tree (Q7).", multi: true, options: [
      ["Raise and lower land", "build cliffs, cut canyons, fill valleys"],
      ["Control the weather", "send a storm, clear the sky"],
      ["Move the sea", "flood lowlands, drain basins"],
      ["Call the megafauna", "set the worms on someone"],
      ["Change a region's climate", "turn desert to jungle, or freeze it"],
    ] },
    { id: "tone", title: "What's the tone?", why: "Preselected from chat: all four, in order (section 01).", multi: true, options: [
      ["Grim survival", "They Are Billions, against the odds"],
      ["Heroic frontier", "pioneers taming a world"],
      ["Mystery and discovery", "what happened here?"],
      ["Pulpy and bold", "Command & Conquer energy: heavy metal, aggressive building"],
    ] },
    { id: "slice", title: "What goes into the first playable slice?", why: "Survive the swarm (Q15). Tick what must be in it; the rest comes after.", multi: true, options: [
      ["Walls and gates", ""],
      ["Turrets that fire", ""],
      ["Power grid", ""],
      ["Mass and energy flow", ""],
      ["Homes and people", ""],
      ["Announced waves", ""],
      ["Nights that are worse", ""],
      ["One megafauna", ""],
      ["One ruin to dig", ""],
    ] },
    { id: "title", title: "Keep the name Orbis?", why: "It was a working title.", options: [
      ["Keep Orbis", "it fits a planet game"],
      ["Something new", "write ideas below"],
    ] },
  ];

  const state = store.get("rts.draft1", { picks: {}, notes: {}, extra: "" });
  // Answers already given in chat start selected; they can still be changed.
  const given = {
    motive: ["Layered, as drafted"],
    prize: ["An exotic material", "The lost technology", "Studying the life", "Energy from the core"],
    ownidea: ["Mobile bases", "Terraforming the base ground", "Orbital support"],
    ending: ["Take the whole planet", "Stabilise the planet", "Wake what was buried", "Several endings"],
    tone: ["Grim survival", "Heroic frontier", "Mystery and discovery", "Pulpy and bold"],
  };
  if (state.picks.ending) state.picks.ending = state.picks.ending.map((p) => (p === "Make peace with the planet" ? "Stabilise the planet" : p));
  const givenNotes = {
    ownidea:
      "Mobile bases crawl out to a new area and unfold as an outpost to hold it, widen the border, or stay a satellite. " +
      "Terraforming costs enough that you can't go crazy with it. Orbital support only after you clear the ground and " +
      "the mist that blocks orbit; storms cut it off, so you can't rely on it all the time.",
    ending:
      "Each ending has its own tech branch and story line: the material branch (refine it, build weapons) leads to " +
      "Dominate; the wildlife branch (study and capture creatures) leads to Stabilise; the ancients branch (dig up and " +
      "study the lost civilisation) leads to Inherit. Shared trunk; dip into any branch, go deep in one to end the campaign.",
    tone:
      "All four, in order. The opening is C&C energy (not big personalities: heavy metal, aggressive building, pumped) " +
      "and grim survival against the odds, driven by the dream of a heroic frontier. Later it splits by branch: a " +
      "mystery to uncover (ancients), or becoming part of the planet and bonding with it (wildlife), or a louder war " +
      "(material).",
    nights:
      "As tech advances you push back the dark and the mist: floodlights and flares, mist scrubbers, an uplink " +
      "network, orbital mirrors. Each has a catch (section 07).",
  };
  for (const [id, text] of Object.entries(givenNotes)) if (!(id in state.notes)) state.notes[id] = text;
  // "The living planet" was renamed after you reframed it as research.
  if (state.picks.prize) state.picks.prize = state.picks.prize.map((p) => (p === "The living planet" ? "Studying the life" : p));
  for (const [id, picks] of Object.entries(given)) if (!(id in state.picks)) state.picks[id] = [...picks];
  const save = () => {
    store.set("rts.draft1", state);
    const answered = questions.filter((q) => (state.picks[q.id] ?? []).length > 0 || (state.notes[q.id] ?? "").trim()).length;
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
    note.hidden = !(state.picks[q.id] ?? []).includes("My own idea") && !note.value && q.id !== "ownidea" && q.id !== "title";
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
    const lines = ["## Orbis concept, round 3", ""];
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
