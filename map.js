(function () {
  let scale = 1;
  let pan = { x: 0, y: 0 };
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let currentPathPoints = [];
  let currentGourdPlacements = [];
  const enabledTypes = new Set(); // Starts empty (all deselected)

  // DOM Elements
  const mapSvg = document.getElementById("mapSvg");
  const mapViewport = document.getElementById("mapViewport");
  const mapTooltip = document.getElementById("mapTooltip");
  const mapStatus = document.getElementById("mapStatus");
  const mapFilterPills = document.getElementById("mapFilterPills");
  const chkShowGourdPlacements = document.getElementById("chkShowGourdPlacements");
  const btnZoomIn = document.getElementById("btnZoomIn");
  const btnZoomOut = document.getElementById("btnZoomOut");
  const btnFitMap = document.getElementById("btnFitMap");
  const btnExportSvg = document.getElementById("btnExportSvg");
  const btnExportPng = document.getElementById("btnExportPng");
  const btnFilterAll = document.getElementById("btnFilterAll");
  const btnFilterNone = document.getElementById("btnFilterNone");

  function updateTransform() {
    if (mapViewport) {
      mapViewport.setAttribute("transform", `translate(${pan.x}, ${pan.y}) scale(${scale})`);
    }
  }

  // Populate dynamic type filter pills (initially unchecked)
  function initializeFilters() {
    if (!mapFilterPills || typeof COORDINATES_DATABASE === "undefined") return;

    mapFilterPills.innerHTML = "";
    const types = new Set();
    COORDINATES_DATABASE.forEach(c => {
      if (c.type) types.add(c.type);
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
    if (!window.rawSavePayload || !Array.isArray(window.rawSavePayload.entries)) {
      mapStatus.textContent = "Upload a save file to view route";
      mapStatus.classList.remove("hidden");
      mapStatus.style.display = "flex";
      mapViewport.innerHTML = "";
      return;
    }

    const showPlacements = chkShowGourdPlacements && chkShowGourdPlacements.checked;

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

    const coordLookup = new Map(COORDINATES_DATABASE.map(item => [item.key, item]));
    currentPathPoints = [];
    currentGourdPlacements = [];

    // 1. Process Sequential Route Points
    window.rawSavePayload.entries.forEach(entry => {
      if (entry && entry.key && coordLookup.has(entry.key)) {
        const meta = coordLookup.get(entry.key);
        const itemType = meta.type || "Default";

        if (enabledTypes.has(itemType)) {
          currentPathPoints.push({
            key: entry.key,
            x: Number(meta.x),
            y: Number(meta.y),
            type: itemType,
            label: meta.label || entry.key,
            value: entry.value,
            order: currentPathPoints.length + 1
          });
        }
      }
    });

    // 2. Process Gourd Placement Lines
    if (showPlacements && typeof getGourdSlotLocation === "function") {
      window.rawSavePayload.entries.forEach(entry => {
        if (!entry || !entry.key) return;
        const meta = coordLookup.get(entry.key);
        // Only inspect items registered as Gourds
        if (meta && meta.type === "Gourd") {
          const pedestal = getGourdSlotLocation(entry.value);
          if (pedestal) {
            currentGourdPlacements.push({
              gourdKey: entry.key,
              gourdLabel: meta.label || entry.key,
              originX: Number(meta.x),
              originY: Number(meta.y),
              targetX: Number(pedestal.x),
              targetY: Number(pedestal.y),
              pedestalName: pedestal.area,
              slotValue: entry.value
            });
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

    // Hide status overlay
    mapStatus.classList.add("hidden");
    mapStatus.style.display = "none";

    renderMap(currentPathPoints, currentGourdPlacements);
    fitToViewport(currentPathPoints, currentGourdPlacements);
  }

  function renderMap(points, placements) {
    mapViewport.innerHTML = "";

    const markerRadius = 8;

    // --- Layer 1: Gourd Placement Lines (Orange, Dense Dots) ---
    if (placements.length > 0) {
      const placementsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      placementsGroup.setAttribute("id", "mapGourdPlacements");

      placements.forEach(plc => {
        const dx = plc.targetX - plc.originX;
        const dy = plc.targetY - plc.originY;
        const dist = Math.hypot(dx, dy);

        if (dist > markerRadius * 2) {
          const offsetStart = markerRadius + 2;
          const offsetEnd = markerRadius + 6;

          const x1 = plc.originX + (dx / dist) * offsetStart;
          const y1 = plc.originY + (dy / dist) * offsetStart;
          const x2 = plc.targetX - (dx / dist) * offsetEnd;
          const y2 = plc.targetY - (dy / dist) * offsetEnd;

          const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttribute("x1", x1);
          line.setAttribute("y1", y1);
          line.setAttribute("x2", x2);
          line.setAttribute("y2", y2);
          line.setAttribute("stroke", "#f97316"); // Vibrant Orange
          line.setAttribute("stroke-width", "2");
          line.setAttribute("stroke-dasharray", "2 3"); // Fine dotted line
          line.setAttribute("marker-end", "url(#mapArrowheadGourd)");
          line.style.cursor = "pointer";

          line.addEventListener("mouseenter", () => {
            line.setAttribute("stroke-width", "3.5");
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
            line.setAttribute("stroke-width", "2");
            mapTooltip.classList.add("hidden");
            mapTooltip.style.display = "none";
          });

          placementsGroup.appendChild(line);
        }

        // Draw small pedestal marker at destination
        const destCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        destCircle.setAttribute("cx", plc.targetX);
        destCircle.setAttribute("cy", plc.targetY);
        destCircle.setAttribute("r", 6);
        destCircle.setAttribute("fill", "#f97316");
        destCircle.setAttribute("stroke", "#ffffff");
        destCircle.setAttribute("stroke-width", "1.5");
        destCircle.style.cursor = "pointer";

        destCircle.addEventListener("mouseenter", () => {
          destCircle.setAttribute("r", 9);
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
          destCircle.setAttribute("r", 6);
          mapTooltip.classList.add("hidden");
          mapTooltip.style.display = "none";
        });

        placementsGroup.appendChild(destCircle);
      });

      mapViewport.appendChild(placementsGroup);
    }

    // --- Layer 2: Sequential Route Arrows (Emerald Green, Dashed) ---
    const linesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    linesGroup.setAttribute("id", "mapTrailLines");

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy);

      if (dist > markerRadius * 2) {
        const offsetStart = markerRadius + 2;
        const offsetEnd = markerRadius + 6;

        const x1 = p1.x + (dx / dist) * offsetStart;
        const y1 = p1.y + (dy / dist) * offsetStart;
        const x2 = p2.x - (dx / dist) * offsetEnd;
        const y2 = p2.y - (dy / dist) * offsetEnd;

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "#10b981");
        line.setAttribute("stroke-width", "2.5");
        line.setAttribute("stroke-dasharray", "5 3");
        line.setAttribute("marker-end", "url(#mapArrowhead)");
        linesGroup.appendChild(line);
      }
    }
    mapViewport.appendChild(linesGroup);

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

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", pt.x);
      circle.setAttribute("cy", pt.y);
      circle.setAttribute("r", markerRadius);
      circle.setAttribute("fill", typeCfg.color);
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", "2");

      const orderText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      orderText.setAttribute("x", pt.x);
      orderText.setAttribute("y", pt.y + 3);
      orderText.setAttribute("text-anchor", "middle");
      orderText.setAttribute("font-size", "7.5px");
      orderText.setAttribute("font-weight", "bold");
      orderText.setAttribute("fill", "#000000");
      orderText.textContent = pt.order;

      const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      labelText.setAttribute("x", pt.x + markerRadius + 4);
      labelText.setAttribute("y", pt.y + 3.5);
      labelText.setAttribute("font-size", "9px");
      labelText.setAttribute("font-family", "monospace");
      labelText.setAttribute("font-weight", "600");
      labelText.setAttribute("fill", typeCfg.color);
      labelText.textContent = `[${pt.type}]`;

      node.appendChild(circle);
      node.appendChild(orderText);
      node.appendChild(labelText);

      node.addEventListener("mouseenter", () => {
        circle.setAttribute("r", markerRadius + 3);
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
        circle.setAttribute("r", markerRadius);
        mapTooltip.classList.add("hidden");
        mapTooltip.style.display = "none";
      });

      nodesGroup.appendChild(node);
    });

    mapViewport.appendChild(nodesGroup);
  }

  // Calculate bounding box across both active route waypoints and gourd placement targets
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

    const padding = 60;
    const boxW = Math.max(maxX - minX, 100) + padding * 2;
    const boxH = Math.max(maxY - minY, 100) + padding * 2;

    const svgRect = mapSvg.getBoundingClientRect();
    const viewW = svgRect.width || 800;
    const viewH = svgRect.height || 550;

    scale = Math.min(viewW / boxW, viewH / boxH, 2.5);

    pan.x = (viewW - (minX + maxX) * scale) / 2;
    pan.y = (viewH - (minY + maxY) * scale) / 2;

    updateTransform();
  }

  // Pan & Drag Handlers
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
      canvas.width = svgRect.width * 2;
      canvas.height = svgRect.height * 2;
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