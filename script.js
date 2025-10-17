// Dữ liệu mẫu — bạn có thể thay, thêm, hoặc load từ file JSON
const artifacts = [
  {
    id: "a1",
    title: "Chiếc bình gốm cổ",
    category: "Gốm sứ",
    era: "Thế kỷ 18",
    location: "Phòng 1",
    short: "Bình gốm men lam, hoa văn truyền thống miền Trung.",
    desc: "Chiếc bình gốm này được tìm thấy trong di tích ven sông Hàn, thể hiện kỹ thuật tráng men tinh xảo của thợ gốm địa phương.",
    image: "", // để trống sẽ hiện placeholder
    attrs: ["Chất liệu: Gốm", "Kích thước: 32cm", "Tình trạng: Tốt"]
  },
  {
    id: "a2",
    title: "Rìu đồng",
    category: "Cổ vật kim loại",
    era: "Thời đại đồ đồng",
    location: "Phòng 2",
    short: "Rìu đồng cổ, dấu vết gia công bằng tay.",
    desc: "Rìu đồng dùng để canh tác và nghi lễ, tìm thấy trong hố chôn tập thể.",
    image: "",
    attrs: ["Chất liệu: Đồng", "Niên đại: ~2000 TCN"]
  },
  {
    id: "a3",
    title: "Trống đồng mô phỏng",
    category: "Âm nhạc",
    era: "Thế kỷ 1",
    location: "Phòng 3",
    short: "Trống đồng trang trí hoa văn mặt trời.",
    desc: "Phiên bản trưng bày mô phỏng trống đồng Đông Sơn, biểu tượng văn hóa Đông Nam Á.",
    image: "",
    attrs: ["Đường kính: 45cm", "Nguồn: Tái tạo"]
  },
  {
    id: "a4",
    title: "Áo dài truyền thống",
    category: "Trang phục",
    era: "Thế kỷ 20",
    location: "Phòng 4",
    short: "Áo dài may bằng lụa, họa tiết thêu tay.",
    desc: "Áo dài do nghệ nhân Đà Nẵng may cho hội hè địa phương, thể hiện nghệ thuật thêu tay tinh tế.",
    image: "",
    attrs: ["Chất liệu: Lụa", "Tình trạng: Bảo quản tốt"]
  }
];

// Các phần tử DOM
const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const filterEra = document.getElementById("filterEra");
const resetBtn = document.getElementById("resetBtn");
const noResults = document.getElementById("noResults");

// Modal
const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalMeta = document.getElementById("modalMeta");
const modalAttrs = document.getElementById("modalAttrs");
const modalImage = document.getElementById("modalImage");

// Helper: Tạo placeholder SVG (khi không có image)
function createPlaceholder(text){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'>
    <rect width='100%' height='100%' fill='#f1f6ff'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#7a8bb3' font-size='20' font-family='Arial'>${text}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Render danh sách
function renderList(list){
  gallery.innerHTML = "";
  if(list.length === 0){
    noResults.style.display = "block";
    return;
  } else noResults.style.display = "none";

  list.forEach(item => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="thumb"><img src="${ item.image || createPlaceholder(item.title) }" alt="${escapeHtml(item.title)}" style="max-width:100%;height:100%;object-fit:cover;"></div>
      <div>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="muted">${escapeHtml(item.short)}</p>
        <p class="muted" style="margin-top:8px; font-size:13px">${escapeHtml(item.category)} • ${escapeHtml(item.era)}</p>
      </div>
    `;
    card.addEventListener("click", ()=> openModal(item));
    gallery.appendChild(card);
  });
}

// Escape text
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// Build filter options
function populateFilters(){
  const cats = Array.from(new Set(artifacts.map(a => a.category))).sort();
  const eras = Array.from(new Set(artifacts.map(a => a.era))).sort();

  cats.forEach(c => {
    const opt = document.createElement("option"); opt.value = c; opt.textContent = c; filterCategory.appendChild(opt);
  });
  eras.forEach(e => {
    const opt = document.createElement("option"); opt.value = e; opt.textContent = e; filterEra.appendChild(opt);
  });
}

// Search + filter logic
function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const cat = filterCategory.value;
  const era = filterEra.value;

  const filtered = artifacts.filter(a => {
    let ok = true;
    if(cat) ok = ok && a.category === cat;
    if(era) ok = ok && a.era === era;
    if(q){
      const hay = (a.title + " " + a.short + " " + a.desc + " " + a.attrs.join(" ")).toLowerCase();
      ok = ok && hay.includes(q);
    }
    return ok;
  });
  renderList(filtered);
}

// Modal functions
function openModal(item){
  modalTitle.textContent = item.title;
  modalDesc.textContent = item.desc;
  modalMeta.textContent = `${item.category} • ${item.era} • ${item.location || ''}`;
  modalAttrs.innerHTML = "";
  item.attrs.forEach(a => {
    const li = document.createElement("li"); li.textContent = a; modalAttrs.appendChild(li);
  });
  modalImage.innerHTML = `<img src="${ item.image || createPlaceholder(item.title) }" alt="${escapeHtml(item.title)}" style="width:100%;height:100%;object-fit:cover;">`;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Events
searchInput.addEventListener("input", applyFilters);
filterCategory.addEventListener("change", applyFilters);
filterEra.addEventListener("change", applyFilters);
resetBtn.addEventListener("click", ()=>{
  searchInput.value = "";
  filterCategory.value = "";
  filterEra.value = "";
  applyFilters();
});
modalBackdrop.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);
document.addEventListener("keydown", (e)=> { if(e.key === "Escape") closeModal(); });

// Init
populateFilters();
renderList(artifacts);
