// Orbis lore round 1: theme and the lore questions (the Given).
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
    { id: "core", title: "Is the swarm the ancients' own people, changed?", why: "The idea at the centre of the page (sections 01 and 02).", options: [
      ["Yes, that's the story", "the Given are the core of the lore"],
      ["Yes, but only some kinds", "runners are Given; other kinds are the planet's own"],
      ["A hint, never confirmed", "the player suspects it; the game never says it outright"],
    ] },
    { id: "origin", title: "Where did the ancients come from?", why: "Your note: they came to the planet too (section 02).", options: [
      ["From elsewhere, like you", "colonists before you; their ruins are a colony like yours"],
      ["Born here", "a native people, as first written"],
      ["Never told", "the ruins don't say, and the player decides"],
    ] },
    { id: "division", title: "Two lineages, one per branch?", why: "Section 04: the planet's own life for wildlife and Stabilise; the Given for ancients and Inherit.", options: [
      ["Yes, as drawn", "each kind belongs to one lineage"],
      ["Yes, with crossovers", "some kinds are part beast, part Given"],
      ["No, one lineage", "everything the planet sends is Given"],
    ] },
    { id: "who", title: "Who were the Given?", why: "Who walked down to the heart. It sets the tone of the tithe.", multi: true, options: [
      ["Volunteers, honoured", "a sacred calling; families proud to give"],
      ["The condemned", "criminals and outcasts; justice and sacrifice in one"],
      ["Chosen by lot", "anyone, every year; the terror of the draw"],
      ["A caste bred for it", "a people within the people, raised to be given"],
    ] },
    { id: "why", title: "Why did the ancients give?", why: "What they believed the tithe did.", multi: true, options: [
      ["To end the war", "the beasts drew off and the planet went quiet for a generation (section 02, age 3)"],
      ["A trade for the core", "people in, energy out: the tithe paid for their power"],
      ["Worship", "the heart was a god, and going down was salvation"],
      ["They didn't know at first", "miners deep in the shafts changed first; the tithe was the myth built after"],
    ] },
    { id: "tipped", title: "What tipped them into being overwhelmed?", why: "Section 03, the first fork.", multi: true, options: [
      ["A: they tried to stop", "a generation refused, and the Given came up and took everyone"],
      ["B: the Given outnumbered them", "the tithe grew faster than the colony, and the balance tipped by itself"],
      ["C: the last walked in willingly", "the heart had become a religion"],
    ] },
    { id: "rival", title: "Who comes back for it on the Inherit path?", why: "Section 03, the second fork: v1's 'whatever drove the ancients out'.", options: [
      ["1: whoever sent them", "their home world, woken by the ancients' beacon"],
      ["2: a ship got away", "survivors who refused the tithe and fled"],
      ["3: no one; the Eldest", "the last enemy is at the heart; no second faction to build"],
    ] },
    { id: "remain", title: "How much of the person is left?", why: "Sets how sad versus how monstrous the swarm feels.", options: [
      ["Nothing", "pure monsters now; the tragedy is only in the past"],
      ["Echoes", "most are gone, but a few remember (section 07)"],
      ["By kind", "runners keep a voice, spitters understand defences, the Eldest keep the most"],
    ] },
    { id: "kinds", title: "Which kinds are Given? (The rest are the planet's own.)", why: "The roster in section 04. My picks: runners, spitters and the Eldest.", multi: true, options: [
      ["Runners", "the many, the most changed"],
      ["Brutes", "or an armoured native beast (my pick)"],
      ["Spitters", "bred to outrange the ancients' turrets"],
      ["Burrowers", "or native diggers"],
      ["Flyers", "or native"],
      ["Giants", "or the planet's oldest creatures (my pick)"],
    ] },
    { id: "heart", title: "What is the heart?", why: "Where it all happened, and where the endings meet.", options: [
      ["A place", "the deepest ruin under a pole, where the core's energy pools"],
      ["A being", "one vast organ or creature at the core: the planet's mind"],
      ["The Eldest", "the first Given, merged into one thing that speaks for the planet"],
      ["All three", "a place, where the Eldest became the planet's voice"],
    ] },
    { id: "look", title: "Which visual rules do you like?", why: "Section 06. Your reference mood: gaunt, pale, blind, wet dark, cold teal.", multi: true, options: [
      ["Two postures", "runs on all fours; stands hunched like a gaunt person when it stops"],
      ["The ancients build, stretched", "human-ish, tall (about 2.5 m) and slender; the Given pull it further"],
      ["No eyes", "blind, hunting by sound and vibration"],
      ["The substance shows through", "glowing crystal seams; brighter the deeper they've been"],
      ["Relics", "ancient metal and glyphs on a few of them"],
      ["Wet, fresh from below", "slick skin, steam at night, trails"],
    ] },
    { id: "play", title: "Which gameplay hooks do you want?", why: "Section 07. Each stands on its own.", multi: true, options: [
      ["Calls that are almost words", "the wave you hear first is broken voices"],
      ["Nests are tithe shafts", "killing a nest opens the way into a ruin"],
      ["Stronger at night", "made in the dark; light hurts them but draws them"],
      ["Blind hunters", "noise draws them; quiet bases are attacked less"],
      ["Echoes", "a Given that remembers and leads you somewhere"],
      ["Your dead come back", "colonists lost outside the walls return as Given"],
    ] },
    { id: "pits", title: "Which parts of the pits do you want?", why: "Section 05: the nests are the ancients' tithe shafts.", multi: true, options: [
      ["Nests are pits", "the Given pour out of holes; beasts come from dens"],
      ["Three sizes", "breaches, pits, and great pits down to the heart"],
      ["Connected underground", "seal one and the swarm comes out of the next"],
      ["They grow", "a pit left alone widens and sends bigger waves"],
      ["New breaches open", "high agitation tears new holes, with tremors first"],
      ["Mist rises from them", "the mist that blocks orbit comes out of the pits"],
    ] },
    { id: "pitact", title: "What can you do with a pit?", why: "Section 05, one per branch plus the basic one.", multi: true, options: [
      ["Seal it", "a capped seal that holds while powered and bursts if the power fails"],
      ["Tap it", "material: a core rig for huge energy and an agitation spike"],
      ["Descend", "ancients: an expedition to the ruin in the shaft wall"],
      ["Calm it", "wildlife, late: quiet a pit through the bond"],
    ] },
    { id: "agit", title: "One agitation meter, or regions and the heart?", why: "Section 11.", options: [
      ["Regions and the heart", "each region's irritation, and the heart's agitation built from all of them"],
      ["One meter", "as in v1: the whole planet at once"],
      ["Regions only", "no planet-wide meter; each region on its own"],
    ] },
    { id: "agitparts", title: "Which agitation rules do you like?", why: "Section 11. Pick any.", multi: true, options: [
      ["Regions cool when quiet", "leave a region alone and it calms, down to the heart's level"],
      ["Tunnels spread it", "a boiling region leaks into its neighbours unless you seal the pits"],
      ["The heart never drains", "only the Stabilise path can bring it down"],
      ["Thresholds are the big beats", "new kinds, storms and surges, great breaches, the heart waking"],
      ["Orbit as a heat map", "see where you're needed from space, then fly down to it"],
      ["Branches treat it differently", "material raises it, wildlife lowers it, ancients moves it"],
    ] },
    { id: "guardians", title: "Which kinds of guardian?", why: "Section 12.", multi: true, options: [
      ["Wall guardians", "war machines from the beast war; attack anything in their ruin"],
      ["Shaft keepers", "escorts of the tithe; let the Given pass, stop everything else"],
      ["The heart's guard", "the biggest, at the deepest ruins; the last wall before the Eldest"],
    ] },
    { id: "guardrules", title: "Which guardian rules do you like?", why: "Section 12.", multi: true, options: [
      ["They won't fire on the Given", "they still see them as their own people"],
      ["Waking one is a gamble", "it may fight beside you or turn on you"],
      ["They fight beasts on sight", "the war they were built for"],
      ["They carry the story", "orders, logs and the tithe's schedule in their memory"],
      ["Each branch uses them differently", "salvage, outlast, or rewrite their orders"],
    ] },
    { id: "tithechoice", title: "Should the player be offered the tithe?", why: "Section 13: sending your own people down, before you know what the Given are.", options: [
      ["Yes, before the truth", "it works, and you find out later what you did"],
      ["Yes, after the truth", "you know what it means when you choose"],
      ["No", "the tithe stays in the ancients' past"],
    ] },
    { id: "otherchoices", title: "Which other choices do you like?", why: "Section 13.", multi: true, options: [
      ["Follow or shoot an Echo", "it's leading you somewhere"],
      ["Rewrite or salvage a guardian", "its memory holds the tithe's schedule"],
      ["Study a captured Given", "and hear it say a name"],
      ["The company wants your dead", "for its bio-weapons"],
      ["Tell the colonists, or hide it", "morale against the truth"],
      ["Tap the great pit when losing", "win this war, wake the heart sooner"],
    ] },
    { id: "choiceform", title: "How should choices be presented?", why: "Section 13.", multi: true, options: [
      ["Advisors with advice", "the engineers, scientists and archaeologists, who can be wrong"],
      ["They wait, no pause", "finish the fight, then choose"],
      ["A record of choices", "what you chose and what it led to"],
    ] },
    { id: "endings", title: "Do the endings in section 08 work?", why: "Each branch does something different with the same truth.", multi: true, options: [
      ["Dominate as written", "the company wants the tithe as a weapon"],
      ["Stabilise as written", "a bond without the sacrifice"],
      ["Inherit as written", "purge a people, or restart the tithe with your own"],
      ["Change one", "say which in the note"],
    ] },
    { id: "tone", title: "What should the reveal feel like?", why: "Section 09: monsters, then disturbing, then heartbreaking.", options: [
      ["Tragedy", "they were people, and it's sad"],
      ["Horror", "they were people, and it's horrible"],
      ["Awe", "the planet learned to make people into itself"],
      ["All three, by act", "horror first, tragedy at the end, awe at the heart"],
    ] },
    { id: "names", title: "Names", why: "Section 10. Pick or write your own; the substance can still wait.", multi: true, options: [
      ["The Given", "the ancients' word"],
      ["The Tithe", "what was paid, and what comes to collect"],
      ["The Hollow", "what's left"],
      ["The Kept", "the planet kept them"],
    ] },
  ];

  const state = store.get("rts.lore1", { picks: {}, notes: {}, extra: "" });
  const save = () => {
    store.set("rts.lore1", state);
    const answered = questions.filter((q) => (state.picks[q.id] ?? []).length > 0 || (state.notes[q.id] ?? "").trim()).length;
    $("progress").style.width = `${Math.round((answered / questions.length) * 100)}%`;
  };
  const alwaysNote = new Set(["names"]);
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
    const lines = ["## Orbis lore, round 1", ""];
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
