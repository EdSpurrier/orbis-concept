// Orbis weapons round 1: theme and the weapons questions.
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
    { id: "families", title: "Which families are in?", why: "Section 02. Your list of nine.", multi: true, options: [
      ["Projectiles", "bullets, cannon, flak, railguns"],
      ["Explosives", "grenades, rockets, mortars, artillery, nukes"],
      ["Fire", "flamers, napalm, fire bombs, burning ground"],
      ["Lightning", "tesla, arc guns, chain lightning, EMP"],
      ["Lasers", "beams: instant, precise, quiet"],
      ["Plasma", "slow heavy bolts that melt armour"],
      ["The substance's own", "the core's energy fired: strongest, and it angers the planet"],
      ["Natural", "acid, spores, lures, tamed beasts"],
      ["The ancients' tech", "resonance, shields, gravity, woken guardians"],
    ] },
    { id: "plasma", title: "Plasma and lasers: two families or one?", why: "Section 02: a laser is light (instant, precise); plasma is matter (slow, heavy, splash).", options: [
      ["Two families", "as written: lasers in the trunk, plasma in material"],
      ["One energy family", "merge them: beams early, bolts later"],
      ["Drop plasma", "lasers only"],
    ] },
    { id: "counters", title: "How strong are the counters?", why: "Section 00 and the table in section 03.", options: [
      ["Soft counters", "the right weapon does 2-3 times the work; nothing is useless"],
      ["Hard counters", "some weapons barely scratch some targets; you must mix"],
      ["Light touch", "small bonuses; mostly it's about range and rate"],
    ] },
    { id: "targets", title: "Are the six target classes right?", why: "Section 01: swarm, beast, armoured, plant, machine, structure.", options: [
      ["Yes, six", "as written"],
      ["Fewer", "e.g. light, heavy, plant, machine"],
      ["More", "say which in the note (flyers? burrowers?)"],
    ] },
    { id: "costs", title: "Which costs do you like?", why: "Section 04.", multi: true, options: [
      ["Energy weapons draw power per shot", "a big fight can brown out your base"],
      ["Loud weapons raise irritation", "explosives and the substance's weapons anger the region"],
      ["Quiet weapons exist", "lasers and lightning let you fight without raising it"],
      ["The substance draws the Given", "its weapons win fights and bring the next one sooner"],
      ["Natural weapons calm the planet", "the planet doesn't mind its own"],
      ["Ammo as mass only", "no ammo counts; guns and explosives cost mass to build and run"],
    ] },
    { id: "tree", title: "Does the tech tree placement work?", why: "Section 05.", multi: true, options: [
      ["Trunk as written", "guns, explosives, fire at T1; lightning and lasers at T2"],
      ["Material as written", "plasma, then the substance's own, then nukes"],
      ["Wildlife as written", "acid, spores, lures, then tamed beasts, then the megafauna"],
      ["Ancients as written", "resonance and shields, gravity and guardians, then the tithe's call"],
      ["Move something", "say what in the note"],
    ] },
    { id: "world", title: "Which world effects do you want?", why: "Section 06.", multi: true, options: [
      ["Rain puts out fire", "and makes lightning jump further"],
      ["Mist cuts lasers", "the light scatters"],
      ["Fire spreads into forest", "against the megaflora, and a danger to your own outposts"],
      ["Explosives leave craters", "and the biggest reshape the land"],
      ["Light and noise draw the Given", "muzzle flashes and fire at night"],
    ] },
    { id: "friendly", title: "Can your weapons hurt your own side?", why: "Explosives near your walls, fire that spreads, lightning that chains.", options: [
      ["Yes, all area weapons", "place them with care"],
      ["Only fire and big explosives", "the rest is safe"],
      ["No", "your weapons never hurt your units or buildings"],
    ] },
    { id: "resonance", title: "Can the ancients' tech turn the Given?", why: "Section 02: resonance is the tithe's call.", options: [
      ["Stun only", "it freezes them for a moment"],
      ["Turn them for a while", "a group fights for you, then the call fades"],
      ["Command them for good", "only at Inherit's T4"],
    ] },
    { id: "upgrades", title: "How do weapons get better?", why: "How a family grows through a game.", multi: true, options: [
      ["New tiers of turret", "a T2 flamer is a different building from a T1 one"],
      ["Research upgrades", "damage, range, rate, researched once for all"],
      ["Modules on a turret", "fit a turret with what you need: a hardpoint system"],
      ["Veterancy", "turrets and units that survive get better"],
    ] },
    { id: "slice", title: "What should the first slice have?", why: "It has a machine-gun turret and tank cannon today.", multi: true, options: [
      ["A flamer", "fire at the wall against the runners"],
      ["A mortar", "the first explosive, and the first noise"],
      ["A tesla tower", "power per shot; the grid matters"],
      ["Keep it as it is", "guns only until the slice plays well"],
    ] },
  ];

  const state = store.get("rts.weapons1", { picks: {}, notes: {}, extra: "" });
  const save = () => {
    store.set("rts.weapons1", state);
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
    const lines = ["## Orbis weapons, round 1", ""];
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
