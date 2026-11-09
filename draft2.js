// Orbis concept draft 2: theme and the round 4 questions.
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
    { id: "units", title: "Who fights in the first slice?", why: "Survive the swarm (section 11). How much army, next to the walls and turrets?", options: [
      ["Defences only", "walls and turrets do the fighting; a tower-defence feel"],
      ["Defences and a few troops", "a small squad to plug gaps and finish stragglers"],
      ["Defences and an army", "build troops and tanks, and push out to the nests"],
    ] },
    { id: "swarm", title: "Which swarm types are in the slice?", why: "Each one tests a different part of your defence.", multi: true, options: [
      ["Runners", "fast and weak, come in numbers; test your turret coverage"],
      ["Brutes", "slow and tough, break walls; test your wall lines"],
      ["Spitters", "ranged, outrange basic turrets; make you build further out"],
      ["Burrowers", "go under walls; test the inside of your base"],
      ["Flyers", "go over walls; need anti-air"],
    ] },
    { id: "warning", title: "How are waves announced?", why: "Round 2 said announced first waves. How does the player know?", multi: true, options: [
      ["Countdown and direction", "a timer and an arrow on the map edge"],
      ["You hear it first", "rumbles, calls and the ground shaking before you see anything"],
      ["Sensors you build", "build them to see waves early; without them you're blind"],
      ["The planet's mood", "the agitation meter shows when it's about to answer"],
    ] },
    { id: "win", title: "How do you win the slice?", why: "The campaign has three endings; the slice needs something simpler.", options: [
      ["Survive N waves", "classic: hold for a set number"],
      ["Hold until relief lands", "a timer to the next dropship"],
      ["Destroy the nest", "survive long enough to go and kill the source"],
      ["Endless, for a score", "how long can you last?"],
    ] },
    { id: "lose", title: "How do you lose it?", why: "", options: [
      ["The HQ falls", "simple and clear"],
      ["The power fails", "every generator down and the base goes dark"],
      ["Either one", "the HQ falls, or the power is out too long"],
    ] },
    { id: "where", title: "Where is the slice played?", why: "Orbis has the whole planet; a flat map is quicker to tune.", options: [
      ["One region on the planet", "the real globe, with its day, weather and climate"],
      ["A flat test map first", "tune the fight, then move it onto the planet"],
    ] },
    { id: "look", title: "What does it look like?", why: "Matters for models and effects from here on.", options: [
      ["Realistic and gritty", "Supreme Commander, Tempest Rising"],
      ["Stylised and readable", "bold shapes and colours, readable from far away"],
      ["Between the two", "real materials, exaggerated shapes and colours"],
    ] },
    { id: "plants", title: "Which plant threats do you like?", why: "Your Q8 note: plant life too (section 04).", multi: true, options: [
      ["Creeping forest", "grows toward your walls and swallows them"],
      ["Spore towers", "breathe out the mist that blocks orbit"],
      ["Snare plants", "living walls around the nests"],
      ["Bloom", "a giant flower that heals the swarm"],
    ] },
    { id: "rival", title: "Who is the rival that lands late?", why: "Your Stabilise idea makes your own company the enemy on that path (section 05).", options: [
      ["Depends on your path", "Dominate: a rival corporation; Stabilise: your own company; Inherit: what drove the ancients out"],
      ["Another corporation", "same tech, own doctrine, after the same prize"],
      ["The home government", "comes to take it from the company"],
      ["A cult of the planet", "people who want it to win, or to join it"],
      ["Something from the ancients' past", "whatever drove them out comes back"],
    ] },
    { id: "mixing", title: "How should mixing tech branches be limited?", why: "Section 09, 'Mixing branches'. My pick is the first two and the last two.", multi: true, options: [
      ["Different inputs", "ore, specimens, artefacts: each branch needs its own activity"],
      ["Opposed branches", "material and wildlife clash through agitation and the bond"],
      ["Rising cost", "a second branch costs 50% more, a third 100% more"],
      ["Locked at the top", "starting an ending's T4 closes the other two"],
      ["Hybrid rewards", "pairs unlock hybrid units"],
    ] },
    { id: "substance", title: "What do we call the substance?", why: "The one name for the prize (section 00). Ideas welcome; it can wait.", options: [
      ["Name it later", "keep a working name for now"],
      ["My ideas below", "write them in the note"],
    ] },
  ];

  const state = store.get("rts.draft2", { picks: {}, notes: {}, extra: "" });
  const save = () => {
    store.set("rts.draft2", state);
    const answered = questions.filter((q) => (state.picks[q.id] ?? []).length > 0 || (state.notes[q.id] ?? "").trim()).length;
    $("progress").style.width = `${Math.round((answered / questions.length) * 100)}%`;
  };
  const alwaysNote = new Set(["substance"]);
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
    const lines = ["## Orbis concept, round 4", ""];
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
