// Orbis settlement round 1: theme and the settlement questions.
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
    { id: "ladder", title: "Which rungs of the mining ladder?", why: "Section 01.", multi: true, options: [
      ["Surface extractors", "on exposed seams; gentle; they run out"],
      ["Strip miners", "dig the seam out and the land sinks into an open pit"],
      ["Deep drills", "bore down to rich seams; big yield, big irritation"],
      ["Core taps", "material: a rig over a pit drawing the core's energy"],
    ] },
    { id: "breakin", title: "Can digging break into the Given's tunnels?", why: "Section 01: a deep drill hits a tunnel and a breach opens under it.", options: [
      ["Yes", "deep digging is a gamble"],
      ["Only when the region is angry", "high irritation makes it likely"],
      ["No", "mining is safe from below; the danger is on the surface"],
    ] },
    { id: "terraform", title: "Which terraforming machines?", why: "Section 02.", multi: true, options: [
      ["Engineer vehicles", "flatten, fill, ramps: small jobs near the base"],
      ["Earthmovers", "raise ridges, dig trenches and moats"],
      ["Terraform towers", "material: reshape a whole area around them"],
      ["Planet-shaping at T4", "as in v1: seas, mountains, climate, weather"],
    ] },
    { id: "scars", title: "Do mines and craters stay?", why: "Open pits and blast craters on the map.", options: [
      ["They stay", "the land remembers every mine and battle"],
      ["They heal slowly", "the planet grows over them in time"],
      ["Only the big ones stay", "small ones fade"],
    ] },
    { id: "homes", title: "Where do your people live?", why: "Section 03.", options: [
      ["A: domes", "sealed habitats you place"],
      ["B: a city that grows", "zone it and it fills in by itself"],
      ["C: domes that grow towns", "you place the domes; the town grows around them"],
    ] },
    { id: "air", title: "Can people breathe outside?", why: "It decides whether domes are needed, and what Stabilise changes.", options: [
      ["No", "domes and suits; the air is spores and mist"],
      ["Barely", "short trips outside; a long breach is deadly"],
      ["Yes", "domes are for safety, not air"],
    ] },
    { id: "grow", title: "What do you place, and what grows by itself?", why: "Section 04.", options: [
      ["As written", "you place domes and the big buildings; homes, streets and gardens grow"],
      ["Place everything", "every home and road is yours to place"],
      ["Grow more", "you place districts; even factories fill in"],
    ] },
    { id: "breach", title: "What happens when a dome breaks?", why: "Section 04.", multi: true, options: [
      ["Evacuate along the tubes", "people flee to the next dome"],
      ["People are lost", "a breach costs population"],
      ["The Given take them", "and they may come back in a later wave"],
    ] },
    { id: "paths", title: "Does the settlement change with your path?", why: "Section 05.", multi: true, options: [
      ["Dominate: fortress arcologies", "armoured domes, industry, open pits"],
      ["Stabilise: the domes open", "the air clears; the town spills into the gardens and forest"],
      ["Inherit: the ancients' city", "you move into their colony"],
    ] },
    { id: "people", title: "What do people do in the economy?", why: "Section 06.", multi: true, options: [
      ["Crews", "buildings need people to run"],
      ["Soldiers and scientists", "troops and research come from the population"],
      ["Comfort and growth", "adjacency bonuses make domes grow faster"],
    ] },
  ];

  const state = store.get("rts.settle1", { picks: {}, notes: {}, extra: "" });
  const save = () => {
    store.set("rts.settle1", state);
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
    const lines = ["## Orbis settlement, round 1", ""];
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
