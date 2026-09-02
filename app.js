let savePayload = null;
const ITEM_LABEL_TO_ID = {};
const STEAM_PERSONA_CACHE = {};
const WINDOWS_SAVE_PATH = "%LOCALAPPDATA%Low\\House House\\Big Walk\\user_data\\save_games\\";

// Fallback palette in case database.js hasn't loaded yet
const DEFAULT_CHARACTER_COLORS = [
  { index: 0, name: "Slate Blue", hex: "#577091" },
  { index: 1, name: "Red-Orange", hex: "#E9431C" },
  { index: 2, name: "Bright Yellow", hex: "#FAE945" },
  { index: 3, name: "Muted Teal", hex: "#5EA8AC" },
  { index: 4, name: "Cobalt Blue", hex: "#3A5693" },
  { index: 5, name: "Coral Red", hex: "#EE3B38" },
  { index: 6, name: "Golden Yellow", hex: "#FAC035" },
  { index: 7, name: "Forest Green", hex: "#2E632C" },
  { index: 8, name: "Deep Plum", hex: "#76263E" },
  { index: 9, name: "Espresso Brown", hex: "#463A30" },
  { index: 10, name: "Tangerine Orange", hex: "#FB7A21" },
  { index: 11, name: "Pale Peachy Pink", hex: "#F9DBCE" },
  { index: 12, name: "Pastel Lemon", hex: "#F8F896" },
  { index: 13, name: "Warm Taupe", hex: "#A79689" },
  { index: 14, name: "Crimson", hex: "#C22941" },
  { index: 15, name: "Emerald Green", hex: "#259A58" },
  { index: 16, name: "Russet Brown", hex: "#9A5130" },
  { index: 17, name: "Brick Red", hex: "#BC292C" },
  { index: 18, name: "Warm Cream", hex: "#F9F3D4" },
  { index: 19, name: "Jade/Sea Green", hex: "#22A98E" },
  { index: 20, name: "Warm Tan", hex: "#CAA279" },
  { index: 21, name: "Gold", hex: "#D4AF37" },
  { index: 22, name: "Silver", hex: "#C0C0C0" },
  { index: 23, name: "Bronze", hex: "#CD7F32" }
];

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const btnCopyPath = document.getElementById('btnCopyPath');
const pathHelper = document.getElementById('pathHelper');
const editorContent = document.getElementById('editorContent');
const unlocksContainer = document.getElementById('unlocksContainer');
const gauntletContainer = document.getElementById('gauntletContainer');
const radiosContainer = document.getElementById('radiosContainer');
const orbBeaconsContainer = document.getElementById('orbBeaconsContainer');
const gourdsContainer = document.getElementById('gourdsContainer');
const characterColorsContainer = document.getElementById('characterColorsContainer');
const inventoryContainer = document.getElementById('inventoryContainer');
const availableItemsList = document.getElementById('availableItemsList');
const itemSearch = document.getElementById('itemSearch');
const addItemBtn = document.getElementById('addItemBtn');
const exportBtn = document.getElementById('exportBtn');

// Bulk Button Elements
const btnDisableAllUnlocks = document.getElementById('btnDisableAllUnlocks');
const btnEnableAllUnlocks = document.getElementById('btnEnableAllUnlocks');
const btnDisableAllGauntlet = document.getElementById('btnDisableAllGauntlet');
const btnEnableAllGauntlet = document.getElementById('btnEnableAllGauntlet');
const btnDisableAllRadios = document.getElementById('btnDisableAllRadios');
const btnEnableAllRadios = document.getElementById('btnEnableAllRadios');
const btnAllBeaconsOff = document.getElementById('btnAllBeaconsOff');
const btnAllBeaconsOn = document.getElementById('btnAllBeaconsOn');
const btnAllBeaconsInv = document.getElementById('btnAllBeaconsInv');
const btnAllGourdsUnsolved = document.getElementById('btnAllGourdsUnsolved');
const btnAllGourdsPuzzle = document.getElementById('btnAllGourdsPuzzle');
const btnAllGourdsInventory = document.getElementById('btnAllGourdsInventory');
const btnAllGourdsPlaced = document.getElementById('btnAllGourdsPlaced');
const btnLookupAllSteam = document.getElementById('btnLookupAllSteam');

// Initialize lookup maps and UI datalist using external database.js
function initDatabaseMappings() {
  if (typeof INVENTORY_DATABASE === 'undefined') return;

  for (const [id, label] of Object.entries(INVENTORY_DATABASE)) {
    ITEM_LABEL_TO_ID[label.toLowerCase()] = id;
  }

  Object.values(INVENTORY_DATABASE).sort().forEach(label => {
    const opt = document.createElement('option');
    opt.value = label;
    availableItemsList.appendChild(opt);
  });
}

// Copy save file path to clipboard
function copySavePath(e) {
  if (e) e.stopPropagation();
  navigator.clipboard.writeText(WINDOWS_SAVE_PATH).then(() => {
    btnCopyPath.textContent = "✓ Copied!";
    setTimeout(() => { btnCopyPath.textContent = "📋 Copy"; }, 2000);
  });
}

btnCopyPath.onclick = copySavePath;
pathHelper.onclick = (e) => e.stopPropagation();

// Persistent Player Name Cache (Client-side localStorage)
function getCachedPersona(playerId) {
  if (STEAM_PERSONA_CACHE[playerId]) return STEAM_PERSONA_CACHE[playerId];
  try {
    const saved = localStorage.getItem(`steam_name_${playerId}`);
    if (saved) {
      STEAM_PERSONA_CACHE[playerId] = saved;
      return saved;
    }
  } catch (e) {}
  return null;
}

function setCachedPersona(playerId, name) {
  STEAM_PERSONA_CACHE[playerId] = name;
  try {
    localStorage.setItem(`steam_name_${playerId}`, name);
  } catch (e) {}
}

// Steam persona lookup using PlayerDB (clean CORS JSON API) with AllOrigins fallback
async function fetchSteamPersona(playerId) {
  const cached = getCachedPersona(playerId);
  if (cached) return { success: true, persona: cached };

  const diagnosticErrors = [];

  // Method 1: PlayerDB (CORS-friendly public REST API)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://playerdb.co/api/player/steam/${playerId}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.player && json.data.player.username) {
        const persona = json.data.player.username.trim();
        if (persona) {
          setCachedPersona(playerId, persona);
          return { success: true, persona };
        }
      }
      diagnosticErrors.push(`PlayerDB: ${json.message || 'Player not found'}`);
    } else {
      diagnosticErrors.push(`PlayerDB: HTTP ${res.status}`);
    }
  } catch (err) {
    diagnosticErrors.push(`PlayerDB: ${err.name === 'AbortError' ? 'Timeout (4s)' : (err.message || 'Network error')}`);
  }

  // Method 2: AllOrigins JSON API fallback wrapper around Steam XML
  const steamUrl = `https://steamcommunity.com/profiles/${playerId}/?xml=1`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(steamUrl)}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.contents) {
        const match = json.contents.match(/<steamID>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/steamID>/is);
        if (match && match[1]) {
          const persona = match[1].trim();
          if (persona) {
            setCachedPersona(playerId, persona);
            return { success: true, persona };
          }
        }
        diagnosticErrors.push("AllOrigins: <steamID> missing");
      } else {
        diagnosticErrors.push("AllOrigins: Empty contents");
      }
    } else {
      diagnosticErrors.push(`AllOrigins: HTTP ${res.status}`);
    }
  } catch (err) {
    diagnosticErrors.push(`AllOrigins: ${err.name === 'AbortError' ? 'Timeout (4.5s)' : (err.message || 'Network error')}`);
  }

  return { success: false, errors: diagnosticErrors };
}

// Lookup trigger with diagnostic feedback
async function triggerSteamLookup(playerId) {
  const statusEl = document.getElementById(`status_${playerId}`);
  const btn = document.getElementById(`btn_lookup_${playerId}`);

  if (statusEl) {
    statusEl.innerHTML = `<span class="lookup-status">⏳ Searching...</span>`;
  }
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Looking up...";
  }

  const result = await fetchSteamPersona(playerId);

  if (result.success) {
    if (statusEl) {
      statusEl.innerHTML = ` (<span class="player-persona">${result.persona}</span>)`;
    }
    if (btn) {
      btn.disabled = false;
      btn.textContent = "↻ Refetch";
    }
  } else {
    const errorSummary = result.errors && result.errors.length > 0 ? result.errors.join(' | ') : 'Lookup failed';
    console.warn(`[Steam Lookup Debug] Player ${playerId} failed:`, result.errors);
    if (statusEl) {
      statusEl.innerHTML = ` <span class="lookup-status" style="color: var(--danger);" title="${errorSummary}">(Failed: ${errorSummary})</span>`;
    }
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Retry";
    }
  }
}

// Manual custom rename modal prompt
function promptManualPersona(playerId) {
  const current = getCachedPersona(playerId) || "";
  const customName = prompt(`Enter custom display name for Player ${playerId}:`, current);
  if (customName !== null) {
    const trimmed = customName.trim();
    if (trimmed) {
      setCachedPersona(playerId, trimmed);
      const statusEl = document.getElementById(`status_${playerId}`);
      if (statusEl) {
        statusEl.innerHTML = ` (<span class="player-persona">${trimmed}</span>)`;
      }
    }
  }
}

// File loading
dropZone.onclick = () => fileInput.click();
fileInput.onchange = (e) => loadFile(e.target.files[0]);
dropZone.ondragover = (e) => e.preventDefault();
dropZone.ondrop = (e) => {
  e.preventDefault();
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
};

function loadFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      savePayload = JSON.parse(e.target.result);
      if (!Array.isArray(savePayload.entries)) savePayload.entries = [];
      if (!Array.isArray(savePayload.inventory)) savePayload.inventory = [];
      renderUI();
      dropZone.classList.add('hidden');
      editorContent.classList.remove('hidden');
    } catch (err) {
      alert("Could not parse file. Please upload a valid Big Walk save file.");
    }
  };
  reader.readAsText(file);
}

function isKeyPresent(key) {
  return savePayload.entries.some(item => item && item.key === key);
}

function setKeyPresent(key, isEnabled, defaultValue) {
  const index = savePayload.entries.findIndex(item => item && item.key === key);
  if (isEnabled && index === -1) {
    savePayload.entries.push({ key: key, value: defaultValue });
  } else if (!isEnabled && index !== -1) {
    savePayload.entries.splice(index, 1);
  }
}

function getEntryValue(key) {
  const entry = savePayload.entries.find(item => item && item.key === key);
  return entry ? entry.value : null;
}

// Ending Gate: 0 = Unlocked, 1 = Locked (Inverted state; never deleted)
function getEndingGateUnlocked() {
  const val = getEntryValue("EndingGate");
  return val === 0;
}

function setEndingGateUnlocked(isUnlocked) {
  const targetValue = isUnlocked ? 0 : 1;
  const entry = savePayload.entries.find(item => item && item.key === "EndingGate");
  if (entry) {
    entry.value = targetValue;
  } else {
    savePayload.entries.push({ key: "EndingGate", value: targetValue });
  }
}

function renderToggleGroup(container, definitions) {
  container.innerHTML = '';
  if (!definitions) return;
  definitions.forEach(def => {
    const active = isKeyPresent(def.key);
    const row = document.createElement('div');
    row.className = 'toggle-row';
    row.innerHTML = `
      <span>${def.label}</span>
      <label class="switch">
        <input type="checkbox" ${active ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    `;
    row.querySelector('input').addEventListener('change', (e) => {
      setKeyPresent(def.key, e.target.checked, def.value);
    });
    container.appendChild(row);
  });
}

function renderUnlocks() {
  renderToggleGroup(unlocksContainer, UNLOCK_DEFINITIONS);

  // Append dedicated Ending Gate row
  const isUnlocked = getEndingGateUnlocked();
  const endingRow = document.createElement('div');
  endingRow.className = 'toggle-row';
  endingRow.innerHTML = `
    <span>Ending Gate Unlocked</span>
    <label class="switch">
      <input type="checkbox" ${isUnlocked ? 'checked' : ''}>
      <span class="slider"></span>
    </label>
  `;
  endingRow.querySelector('input').addEventListener('change', (e) => {
    setEndingGateUnlocked(e.target.checked);
  });
  unlocksContainer.appendChild(endingRow);
}

// Orb Beacons State Logic
function getOrbBeaconState(beacon) {
  const hasOrb = savePayload.inventory.includes(beacon.orb_id);
  const lightVal = getEntryValue(beacon.light_id);

  if (hasOrb) {
    return 'inventory';
  }
  if (lightVal === 1 && !hasOrb) {
    return 'on';
  }
  return 'off';
}

function applyOrbBeaconState(beacon, mode) {
  // 1. Remove light entry and orb from inventory
  const entryIdx = savePayload.entries.findIndex(e => e && e.key === beacon.light_id);
  if (entryIdx !== -1) savePayload.entries.splice(entryIdx, 1);

  savePayload.inventory = savePayload.inventory.filter(id => id !== beacon.orb_id);

  // 2. Apply chosen state
  if (mode === 'on') {
    savePayload.entries.push({ key: beacon.light_id, value: 1 });
  } else if (mode === 'inventory') {
    savePayload.entries.push({ key: beacon.light_id, value: 0 });
    savePayload.inventory.push(beacon.orb_id);
  } // 'off' leaves both removed

  renderInventory();
  renderOrbBeacons();
}

function renderOrbBeacons() {
  orbBeaconsContainer.innerHTML = '';
  if (typeof ORB_BEACON_DATABASE === 'undefined') return;

  ORB_BEACON_DATABASE.forEach(beacon => {
    const state = getOrbBeaconState(beacon);
    const row = document.createElement('div');
    row.className = 'toggle-row';
    const radioName = `beacon_${beacon.coordinate_1}_${beacon.coordinate_2}`;
    const coordText = `(${beacon.coordinate_1}, ${beacon.coordinate_2})`;
    const labelContent = beacon.link
      ? `<a href="${beacon.link}" target="_blank" rel="noopener noreferrer" class="item-link">${coordText}</a>`
      : `<span>${coordText}</span>`;

    row.innerHTML = `
      ${labelContent}
      <div class="radio-group">
        <label>
          <input type="radio" name="${radioName}" value="off" ${state === 'off' ? 'checked' : ''}>
          <span>Off</span>
        </label>
        <label>
          <input type="radio" name="${radioName}" value="on" ${state === 'on' ? 'checked' : ''}>
          <span>On</span>
        </label>
        <label>
          <input type="radio" name="${radioName}" value="inventory" ${state === 'inventory' ? 'checked' : ''}>
          <span>Inventory</span>
        </label>
      </div>
    `;

    row.querySelectorAll(`input[name="${radioName}"]`).forEach(radio => {
      radio.addEventListener('change', (e) => {
        applyOrbBeaconState(beacon, e.target.value);
      });
    });

    orbBeaconsContainer.appendChild(row);
  });
}

function getTakenSlots(excludeGourdKey = null) {
  const taken = new Set();
  if (!savePayload || !Array.isArray(savePayload.entries) || typeof GOURD_DEFINITIONS === 'undefined') {
    return taken;
  }

  GOURD_DEFINITIONS.forEach(g => {
    if (g.key === excludeGourdKey) return;
    const entry = savePayload.entries.find(e => e && e.key === g.key);
    const isInventory = g.item_id && savePayload.inventory.includes(g.item_id);
    if (entry && entry.value !== g.solved_value && !isInventory) {
      taken.add(Number(entry.value));
    }
  });

  return taken;
}

function getGourdState(gourd) {
  const canPuzzle = gourd.solved_value != null;
  const canInventory = Boolean(gourd.item_id);
  const isSolved = isKeyPresent(gourd.key);

  let defaultMode = 'placed';
  if (canPuzzle) defaultMode = 'at_puzzle';
  else if (canInventory) defaultMode = 'inventory';

  if (!isSolved) {
    return { solved: false, mode: defaultMode, slotValue: null };
  }

  const inInventory = canInventory && savePayload.inventory.includes(gourd.item_id);
  const currentValue = getEntryValue(gourd.key);

  if (inInventory && canInventory) {
    return { solved: true, mode: 'inventory', slotValue: null };
  }
  if (canPuzzle && currentValue === gourd.solved_value) {
    return { solved: true, mode: 'at_puzzle', slotValue: null };
  }
  return { solved: true, mode: 'placed', slotValue: currentValue };
}

function applyGourdState(gourd, isSolved, mode, slotValue) {
  // 1. Remove existing entry & inventory item
  const entryIdx = savePayload.entries.findIndex(e => e && e.key === gourd.key);
  if (entryIdx !== -1) savePayload.entries.splice(entryIdx, 1);

  if (gourd.item_id) {
    savePayload.inventory = savePayload.inventory.filter(id => id !== gourd.item_id);
  }

  // 2. Apply new state
  if (isSolved) {
    if (mode === 'at_puzzle' && gourd.solved_value != null) {
      savePayload.entries.push({ key: gourd.key, value: gourd.solved_value });
    } else if (mode === 'inventory' && gourd.item_id) {
      if (gourd.solved_value != null) {
        savePayload.entries.push({ key: gourd.key, value: gourd.solved_value });
      }
      savePayload.inventory.push(gourd.item_id);
    } else if (mode === 'placed' && slotValue != null) {
      savePayload.entries.push({ key: gourd.key, value: Number(slotValue) });
    }
  }

  renderInventory();
  renderGourds();
}

function renderGourds() {
  gourdsContainer.innerHTML = '';
  if (typeof GOURD_DEFINITIONS === 'undefined' || typeof GOURD_SLOTS === 'undefined') return;

  // Group gourds by Area
  const areaGroups = {};
  GOURD_DEFINITIONS.forEach(gourd => {
    const area = gourd.area || "Unknown Area";
    if (!areaGroups[area]) areaGroups[area] = [];
    areaGroups[area].push(gourd);
  });

  Object.keys(areaGroups).forEach(area => {
    const groupEl = document.createElement('div');
    groupEl.className = 'area-group';

    const titleEl = document.createElement('div');
    titleEl.className = 'area-title';
    titleEl.textContent = area;
    groupEl.appendChild(titleEl);

    areaGroups[area].forEach(gourd => {
      const canPuzzle = gourd.solved_value != null;
      const canInventory = Boolean(gourd.item_id);
      const state = getGourdState(gourd);
      const takenSlots = getTakenSlots(gourd.key);

      // Filter slots to only those unassigned or currently held by this gourd
      const availableSlots = GOURD_SLOTS.filter(slot => {
        return !takenSlots.has(Number(slot.value)) || Number(slot.value) === Number(state.slotValue);
      });

      // Determine effective slot selection
      let activeSlotValue = state.slotValue;
      if (!availableSlots.some(s => Number(s.value) === Number(activeSlotValue))) {
        activeSlotValue = availableSlots[0]?.value ?? null;
      }

      const slotOptions = availableSlots.length > 0
        ? availableSlots.map(slot => {
            const selected = Number(slot.value) === Number(activeSlotValue) ? 'selected' : '';
            return `<option value="${slot.value}" ${selected}>${slot.area} - Slot ${slot.slot_number}</option>`;
          }).join('')
        : `<option disabled>No Slots Available</option>`;

      const labelContent = gourd.link
        ? `<a href="${gourd.link}" target="_blank" rel="noopener noreferrer" class="item-link"><strong>${gourd.label}</strong></a>`
        : `<strong>${gourd.label}</strong>`;

      const card = document.createElement('div');
      card.className = 'gourd-card';
      card.innerHTML = `
        <div class="gourd-header">
          <span>${labelContent}</span>
          <label class="switch">
            <input type="checkbox" class="gourd-solve-toggle" ${state.solved ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
        <div class="gourd-controls ${state.solved ? '' : 'hidden'}">
          <div class="radio-group">
            <label class="${canPuzzle ? '' : 'disabled'}" ${canPuzzle ? '' : 'title="Requires solved_value in database"'}>
              <input type="radio" name="mode_${gourd.key}" value="at_puzzle" ${state.mode === 'at_puzzle' ? 'checked' : ''} ${canPuzzle ? '' : 'disabled'}>
              <span>At Puzzle</span>
            </label>
            <label class="${canInventory ? '' : 'disabled'}" ${canInventory ? '' : 'title="Requires item_id in database"'}>
              <input type="radio" name="mode_${gourd.key}" value="inventory" ${state.mode === 'inventory' ? 'checked' : ''} ${canInventory ? '' : 'disabled'}>
              <span>Inventory</span>
            </label>
            <label>
              <input type="radio" name="mode_${gourd.key}" value="placed" ${state.mode === 'placed' ? 'checked' : ''}>
              <span>Placed</span>
            </label>
          </div>
          <div class="slot-select-wrapper ${state.mode === 'placed' ? '' : 'hidden'}">
            <select class="slot-select">${slotOptions}</select>
          </div>
        </div>
      `;

      const solveToggle = card.querySelector('.gourd-solve-toggle');
      const radioInputs = card.querySelectorAll(`input[name="mode_${gourd.key}"]`);
      const slotSelect = card.querySelector('.slot-select');

      function triggerUpdate() {
        const solved = solveToggle.checked;
        const fallback = canPuzzle ? 'at_puzzle' : (canInventory ? 'inventory' : 'placed');
        const selectedMode = Array.from(radioInputs).find(r => r.checked)?.value || fallback;
        const selectedSlot = slotSelect.value || activeSlotValue;
        applyGourdState(gourd, solved, selectedMode, selectedSlot);
      }

      solveToggle.addEventListener('change', triggerUpdate);
      radioInputs.forEach(radio => radio.addEventListener('change', triggerUpdate));
      slotSelect.addEventListener('change', triggerUpdate);

      groupEl.appendChild(card);
    });

    gourdsContainer.appendChild(groupEl);
  });
}

// Character Colors State Logic
function renderCharacterColors() {
  characterColorsContainer.innerHTML = '';
  const colors = (typeof CHARACTER_COLORS !== 'undefined') ? CHARACTER_COLORS : DEFAULT_CHARACTER_COLORS;

  // Discover unique player IDs and their current Head/Torso/Legs values
  const playerMap = {};
  if (savePayload && Array.isArray(savePayload.entries)) {
    savePayload.entries.forEach(entry => {
      if (!entry || typeof entry.key !== 'string') return;
      const match = entry.key.match(/^(.+?)(keyLookId(Head|Torso|Legs))$/);
      if (match) {
        const playerId = match[1];
        const slot = match[3]; // 'Head', 'Torso', 'Legs'
        if (!playerMap[playerId]) {
          playerMap[playerId] = { Head: 0, Torso: 0, Legs: 0 };
        }
        playerMap[playerId][slot] = Number(entry.value);
      }
    });
  }

  const playerIds = Object.keys(playerMap);
  if (playerIds.length === 0) {
    characterColorsContainer.innerHTML = '<span class="empty-msg">No character color data found in save file</span>';
    return;
  }

  playerIds.forEach(playerId => {
    const card = document.createElement('div');
    card.className = 'player-card';

    let slotsHtml = '';
    ['Head', 'Torso', 'Legs'].forEach(part => {
      const currentVal = playerMap[playerId][part] ?? 0;
      const currentColor = colors.find(c => c.index === currentVal) || colors[0];

      const optionsHtml = colors.map(c => {
        const selected = c.index === currentVal ? 'selected' : '';
        return `<option value="${c.index}" data-hex="${c.hex}" ${selected}>${c.index} - ${c.name}</option>`;
      }).join('');

      slotsHtml += `
        <div class="color-slot">
          <label>${part}</label>
          <span class="color-swatch" id="swatch_${playerId}_${part}" style="background-color: ${currentColor.hex};"></span>
          <select class="color-picker-select" data-player="${playerId}" data-part="${part}">
            ${optionsHtml}
          </select>
        </div>
      `;
    });

    const isSteamId = playerId.startsWith("7656119");
    const cachedName = getCachedPersona(playerId);
    const initialStatus = cachedName ? ` (<span class="player-persona">${cachedName}</span>)` : '';

    card.innerHTML = `
      <div class="player-header">
        <div class="player-id-wrapper">
          <span class="player-id">
            ${isSteamId ? `<a href="https://steamcommunity.com/profiles/${playerId}" target="_blank" rel="noopener noreferrer" class="item-link" title="Open Steam Profile">Player ID: ${playerId}</a>` : `Player ID: ${playerId}`}
          </span>
          <span id="status_${playerId}">${initialStatus}</span>
        </div>
        <div class="player-actions">
          ${isSteamId ? `<button type="button" class="btn-sm" id="btn_lookup_${playerId}">${cachedName ? '↻ Refetch' : '🔍 Lookup Steam Name'}</button>` : ''}
          <button type="button" class="btn-sm" id="btn_edit_${playerId}" title="Set custom display name">✏️ Rename</button>
        </div>
      </div>
      <div class="color-slots-grid">
        ${slotsHtml}
      </div>
    `;

    if (isSteamId) {
      const lookupBtn = card.querySelector(`#btn_lookup_${playerId}`);
      lookupBtn.addEventListener('click', () => triggerSteamLookup(playerId));
    }

    card.querySelector(`#btn_edit_${playerId}`).addEventListener('click', () => promptManualPersona(playerId));

    card.querySelectorAll('.color-picker-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const pId = e.target.dataset.player;
        const pPart = e.target.dataset.part;
        const newIndex = Number(e.target.value);
        const selectedOpt = e.target.options[e.target.selectedIndex];
        const hex = selectedOpt.dataset.hex;

        // Update swatch
        const swatch = card.querySelector(`#swatch_${pId}_${pPart}`);
        if (swatch) swatch.style.backgroundColor = hex;

        // Update save payload
        const key = `${pId}keyLookId${pPart}`;
        const entry = savePayload.entries.find(item => item && item.key === key);
        if (entry) {
          entry.value = newIndex;
        } else {
          savePayload.entries.push({ key: key, value: newIndex });
        }
      });
    });

    characterColorsContainer.appendChild(card);
  });
}

function renderInventory() {
  inventoryContainer.innerHTML = '';
  
  const visibleItems = savePayload.inventory
    .map((id, index) => ({ id, index, label: INVENTORY_DATABASE[id] }))
    .filter(item => Boolean(item.label));

  if (visibleItems.length === 0) {
    inventoryContainer.innerHTML = '<span class="empty-msg">No tracked items in inventory</span>';
    return;
  }

  visibleItems.forEach(item => {
    const chip = document.createElement('div');
    chip.className = 'item-chip';
    chip.innerHTML = `
      <span>${item.label}</span>
      <button title="Remove item">&times;</button>
    `;
    chip.querySelector('button').onclick = () => {
      savePayload.inventory.splice(item.index, 1);
      renderInventory();
      renderGourds();
      renderOrbBeacons();
    };
    inventoryContainer.appendChild(chip);
  });
}

function renderUI() {
  renderUnlocks();
  renderToggleGroup(gauntletContainer, GAUNTLET_DEFINITIONS);
  renderToggleGroup(radiosContainer, RADIO_DEFINITIONS);
  renderOrbBeacons();
  renderGourds();
  renderCharacterColors();
  renderInventory();
}

function addInventoryItem() {
  const query = itemSearch.value.trim().toLowerCase();
  const targetId = ITEM_LABEL_TO_ID[query];

  if (targetId) {
    savePayload.inventory.push(targetId);
    itemSearch.value = '';
    renderInventory();
    renderGourds();
    renderOrbBeacons();
  } else {
    alert("Please select a valid item from the list.");
  }
}

addItemBtn.onclick = addInventoryItem;
itemSearch.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addInventoryItem();
});

// Bulk Operations Logic
btnDisableAllUnlocks.onclick = () => {
  if (typeof UNLOCK_DEFINITIONS !== 'undefined') {
    UNLOCK_DEFINITIONS.forEach(def => setKeyPresent(def.key, false, def.value));
  }
  setEndingGateUnlocked(false);
  renderUnlocks();
};

btnEnableAllUnlocks.onclick = () => {
  if (typeof UNLOCK_DEFINITIONS !== 'undefined') {
    UNLOCK_DEFINITIONS.forEach(def => setKeyPresent(def.key, true, def.value));
  }
  setEndingGateUnlocked(true);
  renderUnlocks();
};

btnDisableAllGauntlet.onclick = () => {
  if (typeof GAUNTLET_DEFINITIONS !== 'undefined') {
    GAUNTLET_DEFINITIONS.forEach(def => setKeyPresent(def.key, false, def.value));
  }
  renderToggleGroup(gauntletContainer, GAUNTLET_DEFINITIONS);
};

btnEnableAllGauntlet.onclick = () => {
  if (typeof GAUNTLET_DEFINITIONS !== 'undefined') {
    GAUNTLET_DEFINITIONS.forEach(def => setKeyPresent(def.key, true, def.value));
  }
  renderToggleGroup(gauntletContainer, GAUNTLET_DEFINITIONS);
};

btnDisableAllRadios.onclick = () => {
  if (typeof RADIO_DEFINITIONS !== 'undefined') {
    RADIO_DEFINITIONS.forEach(def => setKeyPresent(def.key, false, def.value));
  }
  renderToggleGroup(radiosContainer, RADIO_DEFINITIONS);
};

btnEnableAllRadios.onclick = () => {
  if (typeof RADIO_DEFINITIONS !== 'undefined') {
    RADIO_DEFINITIONS.forEach(def => setKeyPresent(def.key, true, def.value));
  }
  renderToggleGroup(radiosContainer, RADIO_DEFINITIONS);
};

function setAllOrbBeaconsBulk(mode) {
  if (typeof ORB_BEACON_DATABASE === 'undefined') return;
  ORB_BEACON_DATABASE.forEach(beacon => {
    const entryIdx = savePayload.entries.findIndex(e => e && e.key === beacon.light_id);
    if (entryIdx !== -1) savePayload.entries.splice(entryIdx, 1);

    savePayload.inventory = savePayload.inventory.filter(id => id !== beacon.orb_id);

    if (mode === 'on') {
      savePayload.entries.push({ key: beacon.light_id, value: 1 });
    } else if (mode === 'inventory') {
      savePayload.entries.push({ key: beacon.light_id, value: 0 });
      savePayload.inventory.push(beacon.orb_id);
    }
  });
  renderInventory();
  renderOrbBeacons();
}

btnAllBeaconsOff.onclick = () => setAllOrbBeaconsBulk('off');
btnAllBeaconsOn.onclick = () => setAllOrbBeaconsBulk('on');
btnAllBeaconsInv.onclick = () => setAllOrbBeaconsBulk('inventory');

function setAllGourdsBulk(targetMode) {
  if (typeof GOURD_DEFINITIONS === 'undefined' || typeof GOURD_SLOTS === 'undefined') return;

  let slotIdx = 0;
  GOURD_DEFINITIONS.forEach(gourd => {
    const canPuzzle = gourd.solved_value != null;
    const canInventory = Boolean(gourd.item_id);

    const entryIdx = savePayload.entries.findIndex(e => e && e.key === gourd.key);
    if (entryIdx !== -1) savePayload.entries.splice(entryIdx, 1);

    if (gourd.item_id) {
      savePayload.inventory = savePayload.inventory.filter(id => id !== gourd.item_id);
    }

    if (targetMode === 'unsolved') {
      // Leave removed
    } else if (targetMode === 'at_puzzle') {
      if (canPuzzle) {
        savePayload.entries.push({ key: gourd.key, value: gourd.solved_value });
      } else if (canInventory) {
        savePayload.entries.push({ key: gourd.key, value: 1 });
        savePayload.inventory.push(gourd.item_id);
      } else if (GOURD_SLOTS.length > 0) {
        savePayload.entries.push({ key: gourd.key, value: Number(GOURD_SLOTS[0].value) });
      }
    } else if (targetMode === 'inventory') {
      if (canInventory) {
        const val = gourd.solved_value != null ? gourd.solved_value : 1;
        savePayload.entries.push({ key: gourd.key, value: val });
        savePayload.inventory.push(gourd.item_id);
      } else if (canPuzzle) {
        savePayload.entries.push({ key: gourd.key, value: gourd.solved_value });
      } else if (GOURD_SLOTS.length > 0) {
        savePayload.entries.push({ key: gourd.key, value: Number(GOURD_SLOTS[0].value) });
      }
    } else if (targetMode === 'placed') {
      if (slotIdx < GOURD_SLOTS.length) {
        savePayload.entries.push({ key: gourd.key, value: Number(GOURD_SLOTS[slotIdx].value) });
        slotIdx++;
      } else if (GOURD_SLOTS.length > 0) {
        savePayload.entries.push({ key: gourd.key, value: Number(GOURD_SLOTS[0].value) });
      }
    }
  });

  renderInventory();
  renderGourds();
}

btnAllGourdsUnsolved.onclick = () => setAllGourdsBulk('unsolved');
btnAllGourdsPuzzle.onclick = () => setAllGourdsBulk('at_puzzle');
btnAllGourdsInventory.onclick = () => setAllGourdsBulk('inventory');
btnAllGourdsPlaced.onclick = () => setAllGourdsBulk('placed');

// Manual bulk lookup executed sequentially with a safe delay
btnLookupAllSteam.onclick = async () => {
  if (!savePayload || !Array.isArray(savePayload.entries)) return;
  const steamIds = new Set();
  savePayload.entries.forEach(entry => {
    if (!entry || typeof entry.key !== 'string') return;
    const match = entry.key.match(/^(7656119\d+)(keyLookId(Head|Torso|Legs))$/);
    if (match) steamIds.add(match[1]);
  });

  btnLookupAllSteam.disabled = true;
  btnLookupAllSteam.textContent = "Looking up names...";

  for (const id of Array.from(steamIds)) {
    await triggerSteamLookup(id);
    await new Promise(r => setTimeout(r, 450));
  }

  btnLookupAllSteam.disabled = false;
  btnLookupAllSteam.textContent = "Lookup All Steam Names";
};

// Export Modified Save
exportBtn.onclick = () => {
  const dataStr = JSON.stringify(savePayload, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "save_file.sav";
  a.click();
  URL.revokeObjectURL(url);
};

initDatabaseMappings();