// Orbis concept v1 (signed off): the theme switch and the nav that follows the section in view. Nothing else.
(() => {
  const get = () => { try { return localStorage.getItem("rts.theme"); } catch { return null; } };
  const set = (v) => { try { localStorage.setItem("rts.theme", v); } catch { /* blocked */ } };
  const themes = ["auto", "light", "dark"];
  let theme = (JSON.parse(get() ?? '"auto"') || "auto");
  const btn = document.getElementById("theme");
  const apply = () => {
    if (theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", theme);
    if (btn) btn.textContent = `Theme: ${theme}`;
  };
  btn?.addEventListener("click", () => {
    theme = themes[(themes.indexOf(theme) + 1) % themes.length];
    set(JSON.stringify(theme));
    apply();
  });
  apply();
  const links = [...document.querySelectorAll("#nav a[href^='#']")];
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const seen = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach((a) => a.classList.remove("on"));
      byId.get(e.target.id)?.classList.add("on");
    }
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("section[id]").forEach((s) => seen.observe(s));
})();
