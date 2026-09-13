(function () {
  let scale = 1;
  let pan = { x: 0, y: 0 };
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let currentPathPoints = [];
  const enabledTypes = new Set(); // Starts empty (all deselected)

  // DOM Elements
  const mapSvg = document.getElementById("mapSvg");
  const mapViewport = document.getElementById("mapViewport");
  const mapTooltip = document.getElementById("mapTooltip");
  const mapStatus = document.getElementById("mapStatus");
  const mapFilterPills = document.getElementById("mapFilterPills");
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

  // Populate dynamic type filter pills (initially all unchecked)
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

    if (enabledTypes.size === 0) {
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

    // Filter entries chronologically matching enabled types
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

    if (currentPathPoints.length === 0) {
      mapStatus.textContent = "No entries matched the selected filters.";
      mapStatus.classList.remove("hidden");
      mapStatus.style.display = "flex";
      mapViewport.innerHTML = "";
      return;
    }

    // Hide status overlay
    mapStatus.classList.add("hidden");
    mapStatus.style.display = "none";

    renderPath(currentPathPoints);
    fitToViewport(currentPathPoints);
  }

  function renderPath(points) {
    mapViewport.innerHTML = "";

    const linesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    linesGroup.setAttribute("id", "mapTrailLines");

    const nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    nodesGroup.setAttribute("id", "mapTrailNodes");

    const markerRadius = 8;

    // Draw connecting arrows between sequential points
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

    // Draw nodes, order badges, and type tags
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

      node.addEventListener("mouseenter", (e) => {
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

    mapViewport.appendChild(linesGroup);
    mapViewport.appendChild(nodesGroup);
  }

  function fitToViewport(points) {
    if (!points || points.length === 0) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    points.forEach(p => {
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
    if (currentPathPoints.length > 0) fitToViewport(currentPathPoints);
  };

  btnExportSvg.onclick = () => {
    if (currentPathPoints.length === 0) {
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
    if (currentPathPoints.length === 0) {
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

  // Listen for file upload from app.js
  window.addEventListener("saveFileLoaded", generateMap);

  // Initialize filters on script load
  initializeFilters();
})();