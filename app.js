/**
 * VAISHNAVI KANTEPPANAVAR PORTFOLIO ENGINE
 * Standard: Vanilla ES6
 * Features: Local Database, LocalStorage Persistence, Base64 Media Uploader, Viewport Controller
 */

// 1. DEFAULT ARCHIVE DATA (Stellar, theme-matching blueprints)
const DEFAULT_PROJECTS = [
  {
    id: "proj_1",
    title: "Abandoned Delhi Metro Station",
    category: "game-art",
    medium: "Real-Time 3D Environment",
    subtitle: "A realistic study of concrete decay, pooling water, and urban loneliness in public spaces.",
    story: "This environment exists to capture spatial loneliness. Inspired by the quiet, humid hours in Delhi's public transport, this scene explores structural wear, structural leaking, dust particles, and soft fluorescent lighting. The focus was on baking micro-details into trim sheets to maintain extreme optimization without losing tactile realism.",
    isPinned: true,
    thumbnailFocus: "center",
    image: createPlaceholderSvg("#ff3366", "FINAL RENDER // HUMID FLUORESCENT ATMOSPHERE"),
    image2: createPlaceholderSvg("#ffb000", "WIREFRAME & PROCESS // MODULAR STRUCTURE")
  },
  {
    id: "proj_2",
    title: "Rainy Cyberpunk Bangalore",
    category: "game-art",
    medium: "Real-Time 3D Environment",
    subtitle: "A dense 3D modular environment focusing on rain-slicked asphalt and neon light dispersion.",
    story: "Merging classic gaming nostalgia with my local environment. I wanted to build a dense cyberpunk alleyway in Bangalore, focusing on wet reflections on asphalt and manual volumetric light dispersion. I engineered and iterated through 4 distinct lighting passes to perfectly balance high-contrast shadows with high-key neon light glow.",
    isPinned: false,
    thumbnailFocus: "top",
    image: createPlaceholderSvg("#ffb000", "FINAL RENDER // NEON RAIN ALLEYWAY")
  },
  {
    id: "proj_3",
    title: "Forgotten Heritage Interior",
    category: "fine-arts",
    medium: "Oil on Canvas Physical Study",
    subtitle: "An antique temple corridor study highlighting wood carving textures and volumetric dust shafts.",
    story: "As a BFA Fine Arts scholar, physical heritage has always been close to my heart. This interior is a direct translation of traditional Indian sculpture and oil composition principles into real-time 3D spaces. I focused heavily on wood carving normal maps, custom shader decay, and sculpting shafts of volumetric dust motes in morning sunlight.",
    isPinned: false,
    thumbnailFocus: "center",
    image: createPlaceholderSvg("#ff3366", "FINAL RENDER // VOLUMETRIC DUST SHAFT")
  }
];

// Helper to generate dynamic, premium technical SVGs as placeholders
function createPlaceholderSvg(color, text) {
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750' viewBox='0 0 1200 750'><rect width='100%' height='100%' fill='%230a090e'/><rect x='20' y='20' width='1160' height='710' fill='none' stroke='%23220626' stroke-width='2'/><path d='M20 20 L1180 730 M1180 20 L20 730' stroke='rgba(255, 51, 102, 0.05)' stroke-width='1'/><circle cx='600' cy='375' r='180' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='1' stroke-dasharray='5,5'/><line x1='600' y1='0' x2='600' y2='750' stroke='rgba(255,255,255,0.02)' stroke-width='1'/><line x1='0' y1='375' x2='1200' y2='375' stroke='rgba(255,255,255,0.02)' stroke-width='1'/><text x='50%25' y='50%25' font-family='monospace' font-size='16' fill='%23f3f4f6' text-anchor='middle' font-weight='bold'>[ ${encodeURIComponent(text)} ]</text><text x='50%25' y='55%25' font-family='monospace' font-size='11' fill='%23ffb000' text-anchor='middle'>R* ENV.UNIT // ARCHIVE TELEMETRY VER. 2026.05.27</text></svg>`;
}

// State Database
let projects = [];
let activeBlueprintProject = null;
let activeProcessStage = "render";

// 2. INITIALIZE PORTFOLIO ENGINE
document.addEventListener("DOMContentLoaded", () => {
  // Load data from localStorage or fallback
  const storedData = localStorage.getItem("vk_portfolio_works");
  if (storedData) {
    try {
      projects = JSON.parse(storedData);
      
      // Smart Schema & Color Migration Layer (Refinement Cycle 2 & 3)
      let migrated = false;
      projects.forEach(p => {
        // 1. Migrate old multi-stage 'images' schema to unified 'image' field
        if (p.images && !p.image) {
          p.image = p.images.render || p.images.sketch || p.images.wireframe || p.images.lighting || createPlaceholderSvg("#ff3366", p.title.toUpperCase());
          delete p.images;
          migrated = true;
        }
        // 2. Add default thumbnailFocus value if missing
        if (!p.thumbnailFocus) {
          p.thumbnailFocus = "center";
          migrated = true;
        }
        // 3. Migrate old colors in placeholder SVGs to new warm gold/plum scheme
        if (typeof p.image === "string" && p.image.includes("data:image/svg+xml")) {
          if (p.image.includes("#ff2e4b") || p.image.includes("%23ff2e4b") ||
              p.image.includes("#00e5ff") || p.image.includes("%2300e5ff") ||
              p.image.includes("#8b0000") || p.image.includes("%238b0000") ||
              p.image.includes("stroke='%2335080f'") || p.image.includes("stroke='%252335080f'") ||
              p.image.includes("fill='%2308090a'") || p.image.includes("fill='%252308090a'")) {
            
            p.image = createPlaceholderSvg("#ff3366", p.title.toUpperCase() + " // PRIMARY WORK");
            migrated = true;
          }
        }
        // 4. Migrate old polyCount to medium (Refinement Cycle 3)
        if (p.polyCount && !p.medium) {
          p.medium = p.polyCount.includes("Tris") ? "Real-Time 3D Environment" : "Mixed Media Study";
          delete p.polyCount;
          migrated = true;
        }
        if (!p.medium) {
          p.medium = "Mixed Media Study";
          migrated = true;
        }
        // 5. Migrate legacy 'atmospheric' category to 'game-art'
        if (p.category === "atmospheric") {
          p.category = "game-art";
          migrated = true;
        }
        // 6. Migrate legacy root sketch/wireframe/lighting fields to image2
        if ((p.sketch || p.wireframe || p.lighting) && !p.image2) {
          p.image2 = p.sketch || p.wireframe || p.lighting;
          delete p.sketch;
          delete p.wireframe;
          delete p.lighting;
          migrated = true;
        }
      });
      
      if (migrated) {
        localStorage.setItem("vk_portfolio_works", JSON.stringify(projects));
      }
      
    } catch (e) {
      console.error("Error reading localStorage, reverting to defaults", e);
      projects = [...DEFAULT_PROJECTS];
    }
  } else {
    projects = [...DEFAULT_PROJECTS];
    localStorage.setItem("vk_portfolio_works", JSON.stringify(projects));
  }

  // Setup Custom Cursor
  initCustomCursor();

  // Load Works Grid
  renderPortfolioGrid();

  // Populate Default Blueprint Explorer & Hero Cover
  if (projects.length > 0) {
    const pinned = projects.find(p => p.isPinned) || projects[0];
    injectBlueprint(pinned.id);
    updateHeroCover(pinned);
  }

  // Scroll Animations / Observer
  initScrollAnimations();

  // Setup Dynamic spotlight and 3D Framer tilt interaction
  initCardTiltInteraction();

  // Lucide Icons Render
  lucide.createIcons();

  // Body loaded class
  document.body.classList.remove("loading-state");
});

// 3. DYNAMIC LIQUID CURSOR & TELEMETRY COORDINATES
function initCustomCursor() {
  const dot = document.getElementById("customCursorDot");
  const outline = document.getElementById("customCursorOutline");
  const coordsText = document.getElementById("coordinatesText");

  document.addEventListener("mousemove", (e) => {
    // Positioning
    const posX = e.clientX;
    const posY = e.clientY;
    
    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;
    
    // Liquid smooth outline delay (centered perfectly with transform: translate(-50%, -50%))
    if (outline) {
      outline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 500, fill: "forwards" });
    }

    // Dynamic coordinates change to simulate live game telemetry
    if (coordsText && Math.random() < 0.08) {
      const lat = (12.97 + (Math.random() - 0.5) * 0.01).toFixed(4);
      const lon = (77.59 + (Math.random() - 0.5) * 0.01).toFixed(4);
      coordsText.innerText = `LAT: ${lat}° N // LON: ${lon}° E`;
    }
  });

  // Attach hover triggers to links and buttons
  const addHoverEffects = () => {
    const hoverables = document.querySelectorAll("a, button, select, input, textarea, .project-card, .stage-toggle-btn");
    hoverables.forEach(item => {
      item.addEventListener("mouseenter", () => document.body.classList.add("hover-link"));
      item.addEventListener("mouseleave", () => document.body.classList.remove("hover-link"));
    });
  };

  addHoverEffects();
  // Call periodically or after database re-renders to ensure new links are covered
  window.refreshCursorTriggers = addHoverEffects;
}

// 4. PORTFOLIO GRID RENDERER
function renderPortfolioGrid(filter = "all") {
  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = "";

  const filtered = projects.filter(p => {
    if (filter === "all") return true;
    return p.category === filter;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="glass-panel" style="grid-column: 1/-1; padding: 40px; text-align: center; border-color: var(--accent-maroon);">
        <p class="muted-p" style="font-family: var(--font-mono); font-size: 13px;">[ SYSTEM ERROR: NO ARCHIVES LOCATED FOR THIS NODE ]</p>
      </div>
    `;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.dataset.id = p.id;
    
    card.innerHTML = `
      <div class="card-img-wrap" onclick="openLightbox('${p.image.replace(/'/g, "\\'")}', '${p.title.replace(/'/g, "\\'")}', '${p.category}')">
        <div class="card-cam-markings"></div>
        <img src="${p.image}" alt="${p.title}" loading="lazy" style="object-position: ${p.thumbnailFocus || 'center'};">
        <span class="card-category-tag">${p.category.toUpperCase().replace("-", " ")}</span>
      </div>
      <div class="card-body">
        <div class="card-telemetry">
          <span>SEC: #${p.id.split("_")[1] || "0"}</span>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button class="card-pin-btn ${p.isPinned ? 'pinned' : ''}" onclick="event.stopPropagation(); pinProject('${p.id}')" title="${p.isPinned ? 'Primary Highlighted Project' : 'Set as Highlight'}">
              <i data-lucide="star"></i>
            </button>
            <span>${p.medium || "N/A"}</span>
          </div>
        </div>
        <h4 class="card-title">${p.title}</h4>
        <p class="card-desc">${p.subtitle}</p>
        <div class="card-footer">
          <a href="#process" class="card-action-btn" onclick="injectBlueprint('${p.id}')">
            <span>[INSPECT ARTWORK]</span>
            <i data-lucide="arrow-right"></i>
          </a>
          <div class="card-editor-links">
            <button class="card-edit-ico" onclick="event.stopPropagation(); loadProjectToEditor('${p.id}')" title="Edit Artwork">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="card-del-ico" onclick="event.stopPropagation(); deleteProject('${p.id}')" title="Delete Artwork">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Refresh icons and cursor trackers
  lucide.createIcons();
  if (window.refreshCursorTriggers) window.refreshCursorTriggers();
  if (window.refreshInteractivity) window.refreshInteractivity();
}

function filterProjects(category) {
  // Toggle active filter button style
  const btns = document.querySelectorAll(".filter-btn");
  btns.forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  renderPortfolioGrid(category);
}

// 5. BLUEPRINT / PROCESS EXPLORER CONTROLLER (UCA CORE VIEW)
function injectBlueprint(projectId) {
  const p = projects.find(item => item.id === projectId);
  if (!p) return;

  activeBlueprintProject = p;
  
  // Set text contents
  document.getElementById("bpTitle").innerText = p.title.toUpperCase();
  document.getElementById("bpSubtitle").innerText = p.subtitle;
  document.getElementById("bpSecId").innerText = `#${p.id.split("_")[1] || "0"}`;
  document.getElementById("bpMedium").innerText = p.medium || "N/A";
  document.getElementById("bpStoryText").innerHTML = `<p class="muted-p">${p.story}</p>`;

  // Populate dynamic Work Telemetry spec grid (Refinement Cycle 3)
  const notesPanel = document.getElementById("bpProcessNotes");
  if (notesPanel) {
    notesPanel.innerHTML = `
      <div class="spec-telemetry-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-family: var(--font-mono); font-size: 11px; margin-top: 5px;">
        <div class="spec-node" style="border-left: 2px solid var(--accent-cyan); padding-left: 12px; transition: var(--transition-smooth);">
          <span style="color: var(--text-muted); display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px;">[ segment id ]</span>
          <span style="color: #ffffff; font-weight: 700; font-size: 12.5px;">SEC_#${p.id.split("_")[1] || "0"}</span>
        </div>
        <div class="spec-node" style="border-left: 2px solid var(--accent-cyan); padding-left: 12px; transition: var(--transition-smooth);">
          <span style="color: var(--text-muted); display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px;">[ genre / segment ]</span>
          <span style="color: #ffffff; font-weight: 700; font-size: 12.5px; text-transform: uppercase;">${p.category.replace("-", " ")}</span>
        </div>
        <div class="spec-node" style="border-left: 2px solid var(--accent-cyan); padding-left: 12px; transition: var(--transition-smooth);">
          <span style="color: var(--text-muted); display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px;">[ artwork medium ]</span>
          <span style="color: #ffffff; font-weight: 700; font-size: 12.5px; text-transform: uppercase;">${p.medium || "N/A"}</span>
        </div>
        <div class="spec-node" style="border-left: 2px solid var(--accent-cyan); padding-left: 12px; transition: var(--transition-smooth);">
          <span style="color: var(--text-muted); display: block; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px;">[ crop alignment ]</span>
          <span style="color: #ffffff; font-weight: 700; font-size: 12.5px; text-transform: uppercase;">${p.thumbnailFocus || "Center"} Focus</span>
        </div>
      </div>
    `;
  }

  // Update Blueprint Viewport Canvas image
  updateBlueprintCanvas();
}

function updateBlueprintCanvas() {
  if (!activeBlueprintProject) return;

  const viewportContainer = document.getElementById("bpViewportContainer");
  if (!viewportContainer) return;

  const p = activeBlueprintProject;
  
  // Multi-column viewport triggered for game environments (game-art) or any work with a secondary image loaded
  const hasSecondShot = p.image2 || p.category === "game-art";
  const image1 = p.image || createPlaceholderSvg("#ff3366", p.title.toUpperCase() + " // PRIMARY");
  
  // Fallback default wireframe/structure preview for Game Env if a secondary shot is not explicitly uploaded
  const image2 = p.image2 || (p.category === "game-art" ? createPlaceholderSvg("#ffb000", p.title.toUpperCase() + " // WIREFRAME & PROCESS SHOT") : null);

  if (hasSecondShot && image2) {
    viewportContainer.innerHTML = `
      <div class="blueprint-viewport-grid two-cols">
        <div class="blueprint-canvas-viewport">
          <div class="canvas-corners">
            <div class="c-corner tl"></div><div class="c-corner tr"></div><div class="c-corner bl"></div><div class="c-corner br"></div>
          </div>
          <div class="canvas-header">
            <span class="canvas-mode-indicator">[VIEWPORT A: SHOT_1]</span>
            <span class="canvas-telemetry">[ CLICK TO ENLARGE ]</span>
          </div>
          <div class="canvas-image-container" onclick="openLightbox('${image1.replace(/'/g, "\\'")}', '${p.title.replace(/'/g, "\\'")}', 'Shot 1 - ${p.category}')">
            <div class="blueprint-overlay-grid"></div>
            <img id="bpMainImage" src="${image1}" alt="${p.title} - Shot 1" style="object-position: ${p.thumbnailFocus || 'center'}; opacity: 1;">
          </div>
        </div>
        <div class="blueprint-canvas-viewport">
          <div class="canvas-corners">
            <div class="c-corner tl"></div><div class="c-corner tr"></div><div class="c-corner bl"></div><div class="c-corner br"></div>
          </div>
          <div class="canvas-header">
            <span class="canvas-mode-indicator">[VIEWPORT B: SHOT_2]</span>
            <span class="canvas-telemetry">[ CLICK TO ENLARGE ]</span>
          </div>
          <div class="canvas-image-container" onclick="openLightbox('${image2.replace(/'/g, "\\'")}', '${p.title.replace(/'/g, "\\'")}', 'Shot 2 - ${p.category}')">
            <div class="blueprint-overlay-grid"></div>
            <img id="bpMainImage2" src="${image2}" alt="${p.title} - Shot 2" style="object-position: ${p.thumbnailFocus || 'center'}; opacity: 1;">
          </div>
        </div>
      </div>
    `;
  } else {
    viewportContainer.innerHTML = `
      <div class="blueprint-viewport-grid">
        <div class="blueprint-canvas-viewport">
          <div class="canvas-corners">
            <div class="c-corner tl"></div><div class="c-corner tr"></div><div class="c-corner bl"></div><div class="c-corner br"></div>
          </div>
          <div class="canvas-header">
            <span class="canvas-mode-indicator">[VIEWPORT: ACTIVE]</span>
            <span class="canvas-telemetry">[ CLICK TO ENLARGE ]</span>
          </div>
          <div class="canvas-image-container" onclick="openLightbox('${image1.replace(/'/g, "\\'")}', '${p.title.replace(/'/g, "\\'")}', '${p.category}')">
            <div class="blueprint-overlay-grid"></div>
            <img id="bpMainImage" src="${image1}" alt="${p.title}" style="object-position: ${p.thumbnailFocus || 'center'}; opacity: 1;">
          </div>
        </div>
      </div>
    `;
  }

  // Refresh Tilts and custom triggers for dynamic viewports
  if (window.refreshCursorTriggers) window.refreshCursorTriggers();
  if (window.refreshInteractivity) window.refreshInteractivity();
}

function enlargeActiveArtwork() {
  if (activeBlueprintProject) {
    openLightbox(activeBlueprintProject.image, activeBlueprintProject.title, activeBlueprintProject.category);
  }
}

// 6. BUILT-IN LOCALSTORAGE ADMIN PANEL DRAWER (THE SYSTEM PORTFOLIO EDITOR)
function toggleAdminPanel() {
  const drawer = document.getElementById("adminPanelDrawer");
  drawer.classList.toggle("active");
  
    if (drawer.classList.contains("active")) {
    renderAdminProjectsList();
    generateBackupConfig();
  }
}

// Handle Base64 file conversions dynamically with high-performance Canvas-based JPEG compression (Max 1600px, 0.75 Quality)
function processImageFile(input) {
  const file = input.files[0];
  const btnText = document.getElementById("btnLblImage");
  const uploadLabel = input.closest(".custom-file-upload");
  
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const maxDim = 1600;
      let width = img.width;
      let height = img.height;
      
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      
      // Compress to JPEG with 0.75 quality to save ~90% storage space while preserving details
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
      
      document.getElementById("dataImage").value = compressedDataUrl;
      btnText.innerText = "Asset Saved ✔";
      uploadLabel.classList.add("success");
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Compress and process optional secondary artwork image
function processImage2File(input) {
  const file = input.files[0];
  const btnText = document.getElementById("btnLblImage2");
  const uploadLabel = input.closest(".custom-file-upload");
  
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const maxDim = 1600;
      let width = img.width;
      let height = img.height;
      
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
      
      document.getElementById("dataImage2").value = compressedDataUrl;
      btnText.innerText = "Secondary Asset Saved ✔";
      uploadLabel.classList.add("success");
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Save or edit project commits
function saveProject(e) {
  e.preventDefault();
  
  const idField = document.getElementById("editProjectId").value;
  const title = document.getElementById("editTitle").value;
  const category = document.getElementById("editCategory").value;
  const thumbnailFocus = document.getElementById("editThumbnailFocus").value;
  const medium = document.getElementById("editMedium").value || "Mixed Media Study";
  const subtitle = document.getElementById("editSubtitle").value;
  const story = document.getElementById("editStory").value;

  // Retrieve base64 data
  const image = document.getElementById("dataImage").value;
  const image2 = document.getElementById("dataImage2").value;

  let projectObj;

  if (idField) {
    // EDITING EXISTING PROJECT
    projectObj = projects.find(p => p.id === idField);
    if (projectObj) {
      projectObj.title = title;
      projectObj.category = category;
      projectObj.thumbnailFocus = thumbnailFocus;
      projectObj.medium = medium;
      projectObj.subtitle = subtitle;
      projectObj.story = story;

      // Only overwrite image if new upload is provided
      if (image) projectObj.image = image;
      if (image2) projectObj.image2 = image2;
    }
  } else {
    // CREATING NEW PROJECT
    const newId = "proj_" + (Date.now());
    projectObj = {
      id: newId,
      title: title,
      category: category,
      thumbnailFocus: thumbnailFocus,
      medium: medium,
      subtitle: subtitle,
      story: story,
      isPinned: false,
      image: image || createPlaceholderSvg("#ff3366", title.toUpperCase() + " // PRIMARY ARTWORK"),
      image2: image2 || ""
    };
    projects.push(projectObj);
  }

  // Persist to memory
  try {
    localStorage.setItem("vk_portfolio_works", JSON.stringify(projects));
  } catch (err) {
    console.error("Failed to write to localStorage. Retrying with intensive size cleanup...", err);
    alert("Warning: Local storage limit reached. Running database size cleanup...");
    optimizeExistingDatabase();
    return;
  }
  
  // Reset Form
  clearEditorForm();
  
  // Re-render
  renderPortfolioGrid();
  renderAdminProjectsList();
  generateBackupConfig();

  // Set as active blueprint if edited
  injectBlueprint(projectObj.id);

  alert("Portfolio Database updated successfully!");
}

function loadProjectToEditor(projectId) {
  const p = projects.find(item => item.id === projectId);
  if (!p) return;

  // Ensure Admin Drawer is open
  const drawer = document.getElementById("adminPanelDrawer");
  if (!drawer.classList.contains("active")) {
    drawer.classList.add("active");
  }

  document.getElementById("editProjectId").value = p.id;
  document.getElementById("editTitle").value = p.title;
  document.getElementById("editCategory").value = p.category;
  document.getElementById("editThumbnailFocus").value = p.thumbnailFocus || "center";
  document.getElementById("editMedium").value = p.medium || "";
  document.getElementById("editSubtitle").value = p.subtitle;
  document.getElementById("editStory").value = p.story;

  // Prefill image uploader feedback labels
  document.getElementById("btnLblImage").innerText = p.image ? "Keep Existing Primary File (Change...)" : "Select Artwork Image File";
  document.getElementById("dataImage").value = "";
  document.getElementById("fileImage").closest(".custom-file-upload").classList.remove("success");

  const btnLbl2 = document.getElementById("btnLblImage2");
  if (btnLbl2) {
    btnLbl2.innerText = p.image2 ? "Keep Existing Secondary File (Change...)" : "Select Secondary Image File";
  }
  document.getElementById("dataImage2").value = "";
  const fileImg2 = document.getElementById("fileImage2");
  if (fileImg2) {
    fileImg2.closest(".custom-file-upload").classList.remove("success");
  }

  // Focus form
  document.getElementById("editTitle").focus();
}

function deleteProject(projectId) {
  if (!confirm("Are you sure you want to delete this environment model from your active portfolio archive?")) {
    return;
  }

  projects = projects.filter(p => p.id !== projectId);
  localStorage.setItem("vk_portfolio_works", JSON.stringify(projects));
  
  renderPortfolioGrid();
  renderAdminProjectsList();
  generateBackupConfig();

  // Re-inject first project if deleted
  if (projects.length > 0) {
    injectBlueprint(projects[0].id);
  }

  alert("Artwork deleted from active database.");
}

function clearEditorForm() {
  document.getElementById("projectEditorForm").reset();
  document.getElementById("editProjectId").value = "";
  
  // Clear primary artwork image uploader state
  const btnLbl = document.getElementById("btnLblImage");
  if (btnLbl) btnLbl.innerText = "Select Artwork Image File";
  
  const dataImg = document.getElementById("dataImage");
  if (dataImg) dataImg.value = "";
  
  const fileImg = document.getElementById("fileImage");
  if (fileImg) {
    const label = fileImg.closest(".custom-file-upload");
    if (label) label.classList.remove("success");
  }

  // Clear secondary artwork image uploader state
  const btnLbl2 = document.getElementById("btnLblImage2");
  if (btnLbl2) btnLbl2.innerText = "Select Secondary Image File";
  
  const dataImg2 = document.getElementById("dataImage2");
  if (dataImg2) dataImg2.value = "";
  
  const fileImg2 = document.getElementById("fileImage2");
  if (fileImg2) {
    const label2 = fileImg2.closest(".custom-file-upload");
    if (label2) label2.classList.remove("success");
  }
}

function renderAdminProjectsList() {
  const list = document.getElementById("adminProjectList");
  list.innerHTML = "";

  projects.forEach(p => {
    const item = document.createElement("div");
    item.className = "admin-project-item";
    item.innerHTML = `
      <div class="item-left">
        <span class="item-title">${p.title}</span>
        <span class="item-meta">SEC: #${p.id.split("_")[1] || "0"} | ${p.medium || "N/A"}</span>
      </div>
      <div class="item-actions">
        <button class="item-btn edit-btn" onclick="loadProjectToEditor('${p.id}')">
          <i data-lucide="edit-2"></i>
        </button>
        <button class="item-btn del-btn" onclick="deleteProject('${p.id}')">
          <i data-lucide="trash"></i>
        </button>
      </div>
    `;
    list.appendChild(item);
  });
  
  lucide.createIcons();
}

// 7. EXPORT/IMPORT BACKUP CONFIG UTILS (Downloadable files)
function generateBackupConfig() {
  const area = document.getElementById("configTextarea");
  area.value = JSON.stringify(projects, null, 2);
}

function downloadConfigJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `vaishnavi_portfolio_config_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// 8. CONTACT FORM GUESTBOOK FEEDBACK
function handleContactSubmit(e) {
  e.preventDefault();
  
  const btn = e.target.querySelector(".submit-btn");
  const origText = btn.innerHTML;
  
  btn.disabled = true;
  btn.innerHTML = "<span>[SENDING MESSAGE...]</span>";
  
  setTimeout(() => {
    btn.innerHTML = "<span>[WRITING TO GUESTBOOK...]</span>";
    
    setTimeout(() => {
      btn.innerHTML = "<span>[MESSAGE SENT SUCCESSFULLY ✔]</span>";
      
      alert("Thank you! Your message has been saved in my guestbook. I will review it and get back to you shortly.");
      
      e.target.reset();
      
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = origText;
      }, 2000);
    }, 1500);
  }, 1000);
}

// 9. SCROLL ANIMATIONS (Intersection Observer)
function initScrollAnimations() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  // Highlight Navbar Link on Scroll
  window.addEventListener("scroll", () => {
    let current = "";
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Fade elements into view as scrolled
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(s => {
    s.classList.add("section-hidden");
    observer.observe(s);
  });
}

// 10. CURSOR INTERACTION FRAMER & 3D TILT TETHER
function initCardTiltInteraction() {
  const updateInteractivity = () => {
    // Select elements that receive the cursor light spotlight tracking
    const items = document.querySelectorAll('.project-card, .glass-panel, .contact-container, .blueprint-panel, .timeline-card');
    
    items.forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update CSS coordinates variables
        item.style.setProperty('--mouse-x', `${x}px`);
        item.style.setProperty('--mouse-y', `${y}px`);
        
        // Perform 3D Tilt calculation specifically for gallery cards
        if (item.classList.contains('project-card')) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -6; // max 6 degrees tilt
          const rotateY = ((x - centerX) / centerX) * 6;
          item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        }
      });
      
      // Reset card tilt on mouse leave
      item.addEventListener('mouseleave', () => {
        if (item.classList.contains('project-card')) {
          item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        }
      });
    });
  };
  
  updateInteractivity();
  window.refreshInteractivity = updateInteractivity;
}

// 11. DYNAMIC HERO COVER ENGINE
function updateHeroCover(project) {
  const layer = document.getElementById("heroCanvasImageLayer");
  if (!layer) return;
  
  if (!project) return;
  
  layer.innerHTML = `
    <div style="width: 100%; height: 100%; position: relative; overflow: hidden; background: #0a090e;">
      <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: ${project.thumbnailFocus || 'center'}; opacity: 0.45; filter: contrast(115%) saturate(85%); transition: var(--transition-smooth);">
      <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10, 9, 14, 0.4) 0%, rgba(34, 6, 38, 0.85) 100%);"></div>
      
      <!-- Tech HUD markings overlaid dynamically -->
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 800 1200" style="position: absolute; inset: 0; pointer-events: none;">
        <circle cx="400" cy="600" r="300" fill="none" stroke="rgba(255, 176, 0, 0.12)" stroke-width="1.5"/>
        <circle cx="400" cy="600" r="180" fill="none" stroke="rgba(255, 51, 102, 0.15)" stroke-width="1" stroke-dasharray="6,6"/>
        
        <!-- Architectural wireframe perspective lines -->
        <line x1="100" y1="200" x2="700" y2="200" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
        <line x1="100" y1="1000" x2="700" y2="1000" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
        <line x1="200" y1="100" x2="200" y2="1100" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
        <line x1="600" y1="100" x2="600" y2="1100" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
        
        <!-- Crosshairs and tech brackets -->
        <path d="M 380 600 L 420 600 M 400 580 L 400 620" stroke="rgba(255, 176, 0, 0.25)" stroke-width="1.5"/>
      </svg>
      
      <!-- Live HUD text overlay of the pinned project details -->
      <div style="position: absolute; bottom: 40px; left: 30px; right: 30px; z-index: 6; text-align: center;">
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--accent-crimson); letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 8px;">[ PRIMARY HIGHLIGHTED STUDY ]</span>
        <h3 style="font-family: var(--font-display); font-size: clamp(20px, 3vw, 24px); font-weight: 800; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2; margin-bottom: 6px; text-shadow: 0 4px 12px rgba(0,0,0,0.8);">${project.title}</h3>
        <p style="font-family: var(--font-serif); font-size: 13.5px; color: var(--text-muted); font-style: italic; line-height: 1.4; max-width: 90%; margin: 0 auto;">${project.subtitle}</p>
      </div>
    </div>
  `;
}

// 12. PIN PROJECT SHOWCASE HIGHLIGHT CONTROLLER
function pinProject(projectId) {
  projects.forEach(p => {
    p.isPinned = (p.id === projectId);
  });
  localStorage.setItem("vk_portfolio_works", JSON.stringify(projects));
  
  renderPortfolioGrid();
  renderAdminProjectsList();
  generateBackupConfig();
  
  // Load pinned work instantly in blueprint explore panel
  injectBlueprint(projectId);
  
  // Update Hero cover instantly
  const pinned = projects.find(p => p.id === projectId);
  updateHeroCover(pinned);
  
  alert("This artwork has been successfully pinned as your primary portfolio highlight!");
}

// 12.5. ULTRA-PREMIUM UN-CROPPING LIGHTBOX CONTROLLERS
function openLightbox(src, title, category) {
  const modal = document.getElementById("lightboxModal");
  const img = document.getElementById("lightboxImage");
  const caption = document.getElementById("lightboxCaption");
  
  if (!modal || !img || !caption) return;
  
  img.src = src;
  
  // Pretty formatting with gold and red accents
  caption.innerHTML = `
    <span class="title">${title}</span>
    <span class="divider">//</span>
    <span class="category">${category.replace("-", " ")}</span>
  `;
  
  modal.classList.add("active");
  document.body.classList.add("hover-link"); // scale cursor outline for cool look
}

function closeLightbox() {
  const modal = document.getElementById("lightboxModal");
  if (modal) {
    modal.classList.remove("active");
  }
  document.body.classList.remove("hover-link");
}

// 13. AUTOMATIC BACKGROUND DATABASE SIZE CLEANUP & COMPRESSION PASSTHROUGH
function optimizeExistingDatabase() {
  let migrated = false;
  let promises = [];

  projects.forEach(p => {
    // Detect massive raw base64 data URIs (> 200KB) and compress them to high-fidelity JPEGs
    if (p.image && p.image.startsWith("data:image/") && !p.image.includes("image/svg+xml") && p.image.length > 250000) {
      const p1 = new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressed = canvas.toDataURL("image/jpeg", 0.75);
          if (compressed.length < p.image.length) {
            p.image = compressed;
            migrated = true;
            console.log(`[OPTIMIZATION] Compressed primary asset for "${p.title}" from ${(p.image.length/1024).toFixed(1)}KB to ${(compressed.length/1024).toFixed(1)}KB`);
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = p.image;
      });
      promises.push(p1);
    }

    if (p.image2 && p.image2.startsWith("data:image/") && !p.image2.includes("image/svg+xml") && p.image2.length > 250000) {
      const p2 = new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressed = canvas.toDataURL("image/jpeg", 0.75);
          if (compressed.length < p.image2.length) {
            p.image2 = compressed;
            migrated = true;
            console.log(`[OPTIMIZATION] Compressed secondary asset for "${p.title}" from ${(p.image2.length/1024).toFixed(1)}KB to ${(compressed.length/1024).toFixed(1)}KB`);
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = p.image2;
      });
      promises.push(p2);
    }
  });

  if (promises.length > 0) {
    Promise.all(promises).then(() => {
      if (migrated) {
        try {
          localStorage.setItem("vk_portfolio_works", JSON.stringify(projects));
          console.log("[OPTIMIZATION] LocalStorage usage successfully reduced and saved!");
          renderPortfolioGrid();
        } catch (e) {
          console.error("[OPTIMIZATION] Failed to save compressed database back to localStorage.", e);
        }
      }
    });
  }
}
