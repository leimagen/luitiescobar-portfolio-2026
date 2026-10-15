// Fills [data-masonry] containers with placeholder project cards so the
// mockups show realistic mixed proportions (Pinterest-style).
const palettes = {
  design: ["#ffd9a8", "#ffb23c", "#f4efe6", "#1f1f1f", "#ff8a3c", "#fbe7cf"],
  motion: ["#bfefff", "#3a6bff", "#e8eefc", "#0f1a3a", "#00d4ff", "#d6e1ff"],
  ai:     ["#ffd0d9", "#ff2e7a", "#f7ece9", "#2a0f17", "#ff5a3c", "#ffe2d6"],
  three:  ["#e3f9c4", "#3ed23e", "#eef1e8", "#14210f", "#b6f23a", "#d9efd0"],
};
const ratios = ["4/5", "1/1", "3/4", "16/10", "2/3", "4/3", "9/16", "1/1", "5/4", "3/4", "16/9", "4/5"];
const titles = {
  design: ["Nébula Coffee — Branding", "Atlas Fintech Ads", "Verde Market Identity", "Solar Fest Posters", "Mono Studio Web", "Kora Packaging", "Pulse Social Kit", "Andes Rebrand", "Lumen Campaign", "Brisa Web Redesign", "Fold Magazine", "Ritmo Ads"],
  motion: ["Showreel 2026", "Orbit — 3D Loop", "Logo Reveal Pack", "Paper Cut 2.5D", "Explainer: Atlas", "Liquid Type", "Neon Night Spot", "Kinetic Poster", "UI Motion Kit", "Bloom Titles", "Drift — Short", "Isometric City"],
  ai:     ["Synthetic Seasons", "Dream Portraits", "AI Fashion Lookbook", "Latent Landscapes", "Product Shots w/ AI", "Myth Machines", "Gen Video: Tides", "Prompted Interiors", "Hybrid Faces", "Neo Botanica", "Lost Cities", "Frames of Noise"],
  three:  ["Casa Lumbre — Interior", "Aero Chair", "Desk Lamp Concept", "Loft Render", "Speaker Industrial Design", "Pavilion 01", "Glass Bottle", "Kitchen Visual", "Toy Robot Model", "Courtyard House", "Ceramic Set", "Studio Apartment"],
};

function card(cat, i) {
  const p = palettes[cat];
  const a = p[i % p.length], b = p[(i + 2) % p.length];
  const angle = (i * 47) % 360;
  const likes = 12 + ((i * 37) % 180);
  const el = document.createElement("a");
  el.className = "card";
  el.href = "project.html";
  el.innerHTML = `
    <div class="media">
      <div class="ph" style="aspect-ratio:${ratios[i % ratios.length]};background:linear-gradient(${angle}deg, ${a}, ${b})"></div>
    </div>
    <div class="meta">
      <h3>${titles[cat][i % titles[cat].length]}</h3>
      <span class="likes"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 10v11H3V10h4Zm0 0 4-8c1.7 0 3 1.3 3 3v4h5.5a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 18.1 21H7"/></svg>${likes}</span>
    </div>`;
  return el;
}

document.querySelectorAll("[data-masonry]").forEach((box) => {
  const cats = box.dataset.masonry.split(",");
  const n = Number(box.dataset.count || 9);
  for (let i = 0; i < n; i++) box.appendChild(card(cats[i % cats.length], i));
});
