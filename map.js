(function () {
  let scale = 1;
  let pan = { x: 0, y: 0 };
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let currentPathPoints = [];
  let currentGourdPlacements = [];
  const enabledTypes = new Set(); // Starts empty (all deselected)

  // Size Constraints
  const BASE_RADIUS = 8;
  const PEDESTAL_RADIUS = 6;
  const MAX_SCREEN_RADIUS = 12; // Maximum on-screen pixel size
  let lastScale = null;

  // DOM Elements
  const mapSvg = document.getElementById("mapSvg");
  const mapViewport = document.getElementById("mapViewport");
  const mapTooltip = document.getElementById("mapTooltip");
  const mapStatus = document.getElementById("mapStatus");
  const mapFilterPills = document.getElementById("mapFilterPills");
  const chkShowRouteArrows = document.getElementById("chkShowRouteArrows");
  const chkShowGourdPlacements = document.getElementById("chkShowGourdPlacements");
  const btnZoomIn = document.getElementById("btnZoomIn");
  const btnZoomOut = document.getElementById("btnZoomOut");
  const btnFitMap = document.getElementById("btnFitMap");
  const btnExportSvg = document.getElementById("btnExportSvg");
  const btnExportPng = document.getElementById("btnExportPng");
  const btnFilterAll = document.getElementById("btnFilterAll");
  const btnFilterNone = document.getElementById("btnFilterNone");

  // Robust payload resolver that works whether app.js uses window.rawSavePayload or local savePayload
  function getSavePayload() {
    if (window.rawSavePayload && Array.isArray(window.rawSavePayload.entries)) {
      return window.rawSavePayload;
    }
    if (window.savePayload && Array.isArray(window.savePayload.entries)) {
      return window.savePayload;
    }
    try {
      if (typeof savePayload !== 'undefined' && savePayload && Array.isArray(savePayload.entries)) {
        return savePayload;
      }
    } catch (e) {}
    return null;
  }

  // Safe coordinate parser supporting (x, y), (coordinate_2, coordinate_1), and positive normalization
  function extractCoords(meta) {
    if (!meta) return null;
    const rawX = meta.x !== undefined ? meta.x : meta.coordinate_2;
    const rawY = meta.y !== undefined ? meta.y : meta.coordinate_1;
    if (rawX === undefined || rawY === undefined) return null;

    const x = Number(rawX);
    const y = Number(rawY);
    if (!isFinite(x) || !isFinite(y)) return null;

    return { x: Math.abs(x), y: Math.abs(y) };
  }

  function getNodeScale() {
    if (!scale || scale <= 0) return 1;
    return Math.min(1, MAX_SCREEN_RADIUS / (BASE_RADIUS * scale));
  }

  function updateElementScales() {
    const s = getNodeScale();
    if (!isFinite(s) || s <= 0) return;

    // 1. Scale route nodes & gourd pedestals around their centers
    mapViewport.querySelectorAll('.map-node, .map-pedestal').forEach(el => {
      const x = el.getAttribute('data-x');
      const y = el.getAttribute('data-y');
      el.setAttribute('transform', `translate(${x}, ${y}) scale(${s})`);
    });

    // 2. Adjust route line endpoints, stroke width, and dash spacing
    mapViewport.querySelectorAll('.map-route-line').forEach(line => {
      const p1x = Number(line.getAttribute('data-p1x'));
      const p1y = Number(line.getAttribute('data-p1y'));
      const p2x = Number(line.getAttribute('data-p2x'));
      const p2y = Number(line.getAttribute('data-p2y'));
      const dist = Number(line.getAttribute('data-dist'));
      if (!dist) return;

      const dx = (p2x - p1x) / dist;
      const dy = (p2y - p1y) / dist;
      const offStart = (BASE_RADIUS + 1) * s;
      const offEnd = (BASE_RADIUS + 5) * s;

      line.setAttribute('x1', p1x + dx * offStart);
      line.setAttribute('y1', p1y + dy * offStart);
      line.setAttribute('x2', p2x - dx * offEnd);
      line.setAttribute('y2', p2y - dy * offEnd);
      line.setAttribute('stroke-width', 2.5 * s);
      line.setAttribute('stroke-dasharray', `${5 * s} ${3 * s}`);
    });

    // 3. Adjust gourd placement line endpoints, stroke width, and dash spacing
    mapViewport.querySelectorAll('.map-gourd-line').forEach(line => {
      const p1x = Number(line.getAttribute('data-p1x'));
      const p1y = Number(line.getAttribute('data-p1y'));
      const p2x = Number(line.getAttribute('data-p2x'));
      const p2y = Number(line.getAttribute('data-p2y'));
      const dist = Number(line.getAttribute('data-dist'));
      if (!dist) return;

      const dx = (p2x - p1x) / dist;
      const dy = (p2y - p1y) / dist;
      const offStart = (BASE_RADIUS + 1) * s;
      const offEnd = (PEDESTAL_RADIUS + 5) * s;

      line.setAttribute('x1', p1x + dx * offStart);
      line.setAttribute('y1', p1y + dy * offStart);
      line.setAttribute('x2', p2x - dx * offEnd);
      line.setAttribute('y2', p2y - dy * offEnd);
      line.setAttribute('stroke-width', 2 * s);
      line.setAttribute('stroke-dasharray', `${2 * s} ${3 * s}`);
    });
  }

  function updateTransform() {
    if (mapViewport) {
      mapViewport.setAttribute("transform", `translate(${pan.x}, ${pan.y}) scale(${scale})`);
    }
    if (scale !== lastScale) {
      lastScale = scale;
      updateElementScales();
    }
  }

  // Populate dynamic type filter pills (initially unchecked)
  function initializeFilters() {
    if (!mapFilterPills || typeof COORDINATES_DATABASE === "undefined" || !Array.isArray(COORDINATES_DATABASE)) return;

    mapFilterPills.innerHTML = "";
    const types = new Set();
    COORDINATES_DATABASE.forEach(c => {
      if (c && c.type) types.add(c.type);
    });

    types.forEach(type => {
      const typeCfg = (typeof MAP_TYPE_CONFIG !== "undefined" && MAP_TYPE_CONFIG[type])
        ? MAP_TYPE_CONFIG[type]
        : { color: "#10b981" };

      const pill = document.createElement("label");
      pill.className = "filter-pill";
      pill.innerHTML = `
        <input type="checkbox" value="${type}">
        <span class="filter-pill-dot" style="background-color: ${typeCfg.color};"></span>
        <span>${type}</span>
      `;

      pill.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) {
          enabledTypes.add(type);
        } else {
          enabledTypes.delete(type);
        }
        generateMap();
      });

      mapFilterPills.appendChild(pill);
    });
  }

  if (chkShowRouteArrows) {
    chkShowRouteArrows.addEventListener("change", generateMap);
  }

  if (chkShowGourdPlacements) {
    chkShowGourdPlacements.addEventListener("change", generateMap);
  }

  // Filter Bulk Actions
  if (btnFilterAll) {
    btnFilterAll.onclick = () => {
      mapFilterPills.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.checked = true;
        enabledTypes.add(cb.value);
      });
      generateMap();
    };
  }

  if (btnFilterNone) {
    btnFilterNone.onclick = () => {
      mapFilterPills.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.checked = false;
        enabledTypes.delete(cb.value);
      });
      generateMap();
    };
  }

  // Reactive Map Generation
  function generateMap() {
    const payload = getSavePayload();

    if (!payload || !Array.isArray(payload.entries)) {
      mapStatus.textContent = "Upload a save file to view route";
      mapStatus.classList.remove("hidden");
      mapStatus.style.display = "flex";
      mapViewport.innerHTML = "";
      return;
    }

    const showPlacements = chkShowGourdPlacements && chkShowGourdPlacements.checked;
    const showArrows = chkShowRouteArrows && chkShowRouteArrows.checked;

    if (enabledTypes.size === 0 && !showPlacements) {
      mapStatus.textContent = "Select filters above to display route points";
      mapStatus.classList.remove("hidden");
      mapStatus.style.display = "flex";
      mapViewport.innerHTML = "";
      return;
    }

    if (typeof COORDINATES_DATABASE === "undefined" || !Array.isArray(COORDINATES_DATABASE)) {
      mapStatus.textContent = "COORDINATES_DATABASE missing";
      mapStatus.classList.remove("hidden");
      mapStatus.style.display = "flex";
      return;
    }

    const coordLookup = new Map();
    COORDINATES_DATABASE.forEach(item => {
      if (item && item.key) coordLookup.set(item.key, item);
    });

    currentPathPoints = [];
    currentGourdPlacements = [];

    // 1. Process Sequential Route Points
    payload.entries.forEach(entry => {
      if (entry && entry.key && coordLookup.has(entry.key)) {
        const meta = coordLookup.get(entry.key);
        const itemType = meta.type || "Default";

        if (enabledTypes.has(itemType)) {
          const coords = extractCoords(meta);
          if (coords) {
            currentPathPoints.push({
              key: entry.key,
              x: coords.x,
              y: coords.y,
              type: itemType,
              label: meta.label || entry.key,
              value: entry.value,
              order: currentPathPoints.length + 1
            });
          }
        }
      }
    });

    // 2. Process Gourd Placement Lines
    if (showPlacements && typeof getGourdSlotLocation === "function") {
      payload.entries.forEach(entry => {
        if (!entry || !entry.key) return;
        const meta = coordLookup.get(entry.key);
        if (meta && meta.type === "Gourd") {
          const pedestal = getGourdSlotLocation(entry.value);
          if (pedestal) {
            const originCoords = extractCoords(meta);
            const targetCoords = extractCoords(pedestal);
            if (originCoords && targetCoords) {
              currentGourdPlacements.push({
                gourdKey: entry.key,
                gourdLabel: meta.label || entry.key,
                originX: originCoords.x,
                originY: originCoords.y,
                targetX: targetCoords.x,
                targetY: targetCoords.y,
                pedestalName: pedestal.area || "Pedestal",
                slotValue: entry.value
              });
            }
          }
        }
      });
    }

    if (currentPathPoints.length === 0 && currentGourdPlacements.length === 0) {
      mapStatus.textContent = "No entries matched the selected filters.";
      mapStatus.classList.remove("hidden");
      mapStatus.style.display = "flex";
      mapViewport.innerHTML = "";
      return;
    }

    mapStatus.classList.add("hidden");
    mapStatus.style.display = "none";

    renderMap(currentPathPoints, currentGourdPlacements, showArrows);
    fitToViewport(currentPathPoints, currentGourdPlacements);
  }

  function renderMap(points, placements, showArrows) {
    mapViewport.innerHTML = "";
    const s = getNodeScale();

    // --- Layer 1: Gourd Placement Lines (Orange) ---
    if (placements.length > 0) {
      const placementsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      placementsGroup.setAttribute("id", "mapGourdPlacements");

      placements.forEach(plc => {
        const dx = plc.targetX - plc.originX;
        const dy = plc.targetY - plc.originY;
        const dist = Math.hypot(dx, dy);

        if (dist > (BASE_RADIUS + PEDESTAL_RADIUS) * s) {
          const offStart = (BASE_RADIUS + 1) * s;
          const offEnd = (PEDESTAL_RADIUS + 5) * s;

          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("class", "map-gourd-line");
          line.setAttribute("data-p1x", plc.originX);
          line.setAttribute("data-p1y", plc.originY);
          line.setAttribute("data-p2x", plc.targetX);
          line.setAttribute("data-p2y", plc.targetY);
          line.setAttribute("data-dist", dist);

          line.setAttribute("x1", plc.originX + (dx / dist) * offStart);
          line.setAttribute("y1", plc.originY + (dy / dist) * offStart);
          line.setAttribute("x2", plc.targetX - (dx / dist) * offEnd);
          line.setAttribute("y2", plc.targetY - (dy / dist) * offEnd);
          line.setAttribute("stroke", "#f97316");
          line.setAttribute("stroke-width", 2 * s);
          line.setAttribute("stroke-dasharray", `${2 * s} ${3 * s}`);
          line.setAttribute("marker-end", "url(#mapArrowheadGourd)");
          line.style.cursor = "pointer";

          line.addEventListener("mouseenter", () => {
            line.setAttribute("stroke-width", 3.5 * getNodeScale());
            mapTooltip.innerHTML = `
              <strong style="color: #f97316;">📦 Gourd Placement</strong><br>
              ${plc.gourdLabel}<br>
              <span style="color: var(--text-muted);">Placed at:</span> ${plc.pedestalName} (Slot ${plc.slotValue})
            `;
            mapTooltip.classList.remove("hidden");
            mapTooltip.style.display = "block";
          });

          line.addEventListener("mousemove", (e) => {
            const rect = mapSvg.getBoundingClientRect();
            mapTooltip.style.left = `${e.clientX - rect.left + 14}px`;
            mapTooltip.style.top = `${e.clientY - rect.top + 14}px`;
          });

          line.addEventListener("mouseleave", () => {
            line.setAttribute("stroke-width", 2 * getNodeScale());
            mapTooltip.classList.add("hidden");
            mapTooltip.style.display = "none";
          });

          placementsGroup.appendChild(line);
        }

        // Draw counter-scaled pedestal group at destination
        const pedestalGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        pedestalGroup.setAttribute("class", "map-pedestal");
        pedestalGroup.setAttribute("data-x", plc.targetX);
        pedestalGroup.setAttribute("data-y", plc.targetY);
        pedestalGroup.setAttribute("transform", `translate(${plc.targetX}, ${plc.targetY}) scale(${s})`);

        const destCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        destCircle.setAttribute("cx", 0);
        destCircle.setAttribute("cy", 0);
        destCircle.setAttribute("r", PEDESTAL_RADIUS);
        destCircle.setAttribute("fill", "#f97316");
        destCircle.setAttribute("stroke", "#ffffff");
        destCircle.setAttribute("stroke-width", "1.5");
        destCircle.style.cursor = "pointer";

        destCircle.addEventListener("mouseenter", () => {
          destCircle.setAttribute("r", PEDESTAL_RADIUS + 2.5);
          mapTooltip.innerHTML = `
            <strong style="color: #f97316;">Pedestal: ${plc.pedestalName}</strong><br>
            Holds: ${plc.gourdLabel} (Slot ${plc.slotValue})
          `;
          mapTooltip.classList.remove("hidden");
          mapTooltip.style.display = "block";
        });

        destCircle.addEventListener("mousemove", (e) => {
          const rect = mapSvg.getBoundingClientRect();
          mapTooltip.style.left = `${e.clientX - rect.left + 14}px`;
          mapTooltip.style.top = `${e.clientY - rect.top + 14}px`;
        });

        destCircle.addEventListener("mouseleave", () => {
          destCircle.setAttribute("r", PEDESTAL_RADIUS);
          mapTooltip.classList.add("hidden");
          mapTooltip.style.display = "none";
        });

        pedestalGroup.appendChild(destCircle);
        placementsGroup.appendChild(pedestalGroup);
      });

      mapViewport.appendChild(placementsGroup);
    }

    // --- Layer 2: Sequential Route Arrows (Emerald Green) ---
    if (showArrows && points.length > 1) {
      const linesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      linesGroup.setAttribute("id", "mapTrailLines");

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.hypot(dx, dy);

        if (dist > (BASE_RADIUS * 2) * s) {
          const offStart = (BASE_RADIUS + 1) * s;
          const offEnd = (BASE_RADIUS + 5) * s;

          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("class", "map-route-line");
          line.setAttribute("data-p1x", p1.x);
          line.setAttribute("data-p1y", p1.y);
          line.setAttribute("data-p2x", p2.x);
          line.setAttribute("data-p2y", p2.y);
          line.setAttribute("data-dist", dist);

          line.setAttribute("x1", p1.x + (dx / dist) * offStart);
          line.setAttribute("y1", p1.y + (dy / dist) * offStart);
          line.setAttribute("x2", p2.x - (dx / dist) * offEnd);
          line.setAttribute("y2", p2.y - (dy / dist) * offEnd);
          line.setAttribute("stroke", "#10b981");
          line.setAttribute("stroke-width", 2.5 * s);
          line.setAttribute("stroke-dasharray", `${5 * s} ${3 * s}`);
          line.setAttribute("marker-end", "url(#mapArrowhead)");
          linesGroup.appendChild(line);
        }
      }
      mapViewport.appendChild(linesGroup);
    }

    // --- Layer 3: Sequential Route Nodes ---
    const nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    nodesGroup.setAttribute("id", "mapTrailNodes");

    points.forEach((pt) => {
      const typeCfg = (typeof MAP_TYPE_CONFIG !== "undefined" && MAP_TYPE_CONFIG[pt.type])
        ? MAP_TYPE_CONFIG[pt.type]
        : { color: "#10b981", badge: pt.type };

      const node = document.createElementNS("http://www.w3.org/2000/svg", "g");
      node.setAttribute("class", "map-node");
      node.setAttribute("data-order", pt.order);
      node.setAttribute("data-x", pt.x);
      node.setAttribute("data-y", pt.y);
      node.setAttribute("transform", `translate(${pt.x}, ${pt.y}) scale(${s})`);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", 0);
      circle.setAttribute("cy", 0);
      circle.setAttribute("r", BASE_RADIUS);
      circle.setAttribute("fill", typeCfg.color);
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", "2");

      const orderText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      orderText.setAttribute("x", 0);
      orderText.setAttribute("y", 3);
      orderText.setAttribute("text-anchor", "middle");
      orderText.setAttribute("font-size", "7.5px");
      orderText.setAttribute("font-weight", "bold");
      orderText.setAttribute("fill", "#000000");
      orderText.textContent = pt.order;

      const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      labelText.setAttribute("x", BASE_RADIUS + 4);
      labelText.setAttribute("y", 3.5);
      labelText.setAttribute("font-size", "9px");
      labelText.setAttribute("font-family", "monospace");
      labelText.setAttribute("font-weight", "600");
      labelText.setAttribute("fill", typeCfg.color);
      labelText.textContent = `[${pt.type}]`;

      node.appendChild(circle);
      node.appendChild(orderText);
      node.appendChild(labelText);

      node.addEventListener("mouseenter", () => {
        circle.setAttribute("r", BASE_RADIUS + 3);
        mapTooltip.innerHTML = `
          <strong>#${pt.order}: ${pt.label}</strong><br>
          <span style="color: ${typeCfg.color};">Type: ${pt.type}</span><br>
          <span style="color: var(--text-muted);">Coords: (${pt.x}, ${pt.y})</span><br>
          <span style="color: var(--text-muted); font-size: 0.75rem;">Key: ${pt.key}</span>
        `;
        mapTooltip.classList.remove("hidden");
        mapTooltip.style.display = "block";
      });

      node.addEventListener("mousemove", (e) => {
        const rect = mapSvg.getBoundingClientRect();
        mapTooltip.style.left = `${e.clientX - rect.left + 14}px`;
        mapTooltip.style.top = `${e.clientY - rect.top + 14}px`;
      });

      node.addEventListener("mouseleave", () => {
        circle.setAttribute("r", BASE_RADIUS);
        mapTooltip.classList.add("hidden");
        mapTooltip.style.display = "none";
      });

      nodesGroup.appendChild(node);
    });

    mapViewport.appendChild(nodesGroup);
  }

  function fitToViewport(points, placements) {
    const allCoords = [];
    points.forEach(p => allCoords.push({ x: p.x, y: p.y }));
    placements.forEach(plc => {
      allCoords.push({ x: plc.originX, y: plc.originY });
      allCoords.push({ x: plc.targetX, y: plc.targetY });
    });

    if (allCoords.length === 0) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    allCoords.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    if (!isFinite(minX) || !isFinite(maxX) || !isFinite(minY) || !isFinite(maxY)) return;

    const padding = 60;
    const boxW = Math.max(maxX - minX, 100) + padding * 2;
    const boxH = Math.max(maxY - minY, 100) + padding * 2;

    const svgRect = mapSvg.getBoundingClientRect();
    const viewW = svgRect.width > 0 ? svgRect.width : 800;
    const viewH = svgRect.height > 0 ? svgRect.height : 550;

    scale = Math.min(viewW / boxW, viewH / boxH, 2.5);
    if (!isFinite(scale) || scale <= 0) scale = 1;

    pan.x = (viewW - (minX + maxX) * scale) / 2;
    pan.y = (viewH - (minY + maxY) * scale) / 2;
    if (!isFinite(pan.x)) pan.x = 0;
    if (!isFinite(pan.y)) pan.y = 0;

    updateTransform();
  }

  // Mouse Drag & Pan Handlers
  mapSvg.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    isDragging = true;
    dragStart = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    mapSvg.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    pan.x = e.clientX - dragStart.x;
    pan.y = e.clientY - dragStart.y;
    updateTransform();
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      mapSvg.style.cursor = "grab";
    }
  });

  // Cursor-centered Wheel Zoom
  mapSvg.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = mapSvg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.05), 20);

    pan.x = mouseX - (mouseX - pan.x) * (newScale / scale);
    pan.y = mouseY - (mouseY - pan.y) * (newScale / scale);
    scale = newScale;

    updateTransform();
  }, { passive: false });

  btnZoomIn.onclick = () => {
    const rect = mapSvg.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const newScale = Math.min(scale * 1.25, 20);
    pan.x = cx - (cx - pan.x) * (newScale / scale);
    pan.y = cy - (cy - pan.y) * (newScale / scale);
    scale = newScale;
    updateTransform();
  };

  btnZoomOut.onclick = () => {
    const rect = mapSvg.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const newScale = Math.max(scale * 0.8, 0.05);
    pan.x = cx - (cx - pan.x) * (newScale / scale);
    pan.y = cy - (cy - pan.y) * (newScale / scale);
    scale = newScale;
    updateTransform();
  };

  btnFitMap.onclick = () => {
    if (currentPathPoints.length > 0 || currentGourdPlacements.length > 0) {
      fitToViewport(currentPathPoints, currentGourdPlacements);
    }
  };

  btnExportSvg.onclick = () => {
    if (currentPathPoints.length === 0 && currentGourdPlacements.length === 0) {
      alert("No route points to export. Please select filters first.");
      return;
    }
    const svgClone = mapSvg.cloneNode(true);
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "big_walk_route.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  btnExportPng.onclick = () => {
    if (currentPathPoints.length === 0 && currentGourdPlacements.length === 0) {
      alert("No route points to export. Please select filters first.");
      return;
    }
    const svgRect = mapSvg.getBoundingClientRect();
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(mapSvg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const URLObject = window.URL || window.webkitURL || window;
    const blobURL = URLObject.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = (svgRect.width || 800) * 2;
      canvas.height = (svgRect.height || 550) * 2;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#141417";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "big_walk_route.png";
        a.click();
        URLObject.revokeObjectURL(blobURL);
      });
    };
    image.src = blobURL;
  };

  window.addEventListener("saveFileLoaded", generateMap);
  initializeFilters();
})();