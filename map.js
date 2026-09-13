(function () {
  let scale = 1;
  let pan = { x: 0, y: 0 };
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let currentPathPoints = [];

  // DOM Elements
  const mapSvg = document.getElementById("mapSvg");
  const mapViewport = document.getElementById("mapViewport");
  const mapTooltip = document.getElementById("mapTooltip");
  const mapStatus = document.getElementById("mapStatus");
  const btnGenerateMap = document.getElementById("btnGenerateMap");
  const btnZoomIn = document.getElementById("btnZoomIn");
  const btnZoomOut = document.getElementById("btnZoomOut");
  const btnFitMap = document.getElementById("btnFitMap");
  const btnExportSvg = document.getElementById("btnExportSvg");
  const btnExportPng = document.getElementById("btnExportPng");

  function updateTransform() {
    if (mapViewport) {
      mapViewport.setAttribute("transform", `translate(${pan.x}, ${pan.y}) scale(${scale})`);
    }
  }

  // Generate Map directly from the unmodified uploaded save file
  function generateMap() {
    if (!window.rawSavePayload || !Array.isArray(window.rawSavePayload.entries)) {
      alert("Please load a save file in the uploader above first.");
      return;
    }

    if (typeof COORDINATES_DATABASE === "undefined" || !Array.isArray(COORDINATES_DATABASE)) {
      alert("COORDINATES_DATABASE not found in coordinates.js.");
      return;
    }

    // Build O(1) coordinate lookup
    const coordLookup = new Map(COORDINATES_DATABASE.map(item => [item.key, item]));
    currentPathPoints = [];

    // Filter and collect entries strictly in chronological order
    window.rawSavePayload.entries.forEach(entry => {
      if (entry && entry.key && coordLookup.has(entry.key)) {
        const meta = coordLookup.get(entry.key);
        currentPathPoints.push({
          key: entry.key,
          x: Number(meta.x),
          y: Number(meta.y),
          type: meta.type || "Default",
          label: meta.label || entry.key,
          value: entry.value,
          order: currentPathPoints.length + 1
        });
      }
    });

    if (currentPathPoints.length === 0) {
      mapStatus.textContent = "No entries in this save file matched any coordinates.";
      mapStatus.classList.remove("hidden");
      mapViewport.innerHTML = "";
      return;
    }

    mapStatus.classList.add("hidden");
    renderPath(currentPathPoints);
    fitToViewport(currentPathPoints);
  }

  function renderPath(points) {
    mapViewport.innerHTML = "";

    // Group for connecting line segments and arrows
    const linesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    linesGroup.setAttribute("id", "mapTrailLines");

    // Group for markers and labels
    const nodesGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    nodesGroup.setAttribute("id", "mapTrailNodes");

    const markerRadius = 8;

    // 1. Draw connecting arrows between sequential points
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy);

      if (dist > markerRadius * 2) {
        // Offset arrow endpoints slightly so arrowheads touch the marker edges cleanly
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

    // 2. Draw nodes, order badges, and type tags
    points.forEach((pt) => {
      const typeCfg = (typeof MAP_TYPE_CONFIG !== "undefined" && MAP_TYPE_CONFIG[pt.type])
        ? MAP_TYPE_CONFIG[pt.type]
        : { color: "#10b981", badge: pt.type };

      const node = document.createElementNS("http://www.w3.org/2000/svg", "g");
      node.setAttribute("class", "map-node");
      node.setAttribute("data-order", pt.order);

      // Node base circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", pt.x);
      circle.setAttribute("cy", pt.y);
      circle.setAttribute("r", markerRadius);
      circle.setAttribute("fill", typeCfg.color);
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", "2");

      // Number badge inside marker
      const orderText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      orderText.setAttribute("x", pt.x);
      orderText.setAttribute("y", pt.y + 3);
      orderText.setAttribute("text-anchor", "middle");
      orderText.setAttribute("font-size", "7.5px");
      orderText.setAttribute("font-weight", "bold");
      orderText.setAttribute("fill", "#000000");
      orderText.textContent = pt.order;

      // Small type badge pill next to marker
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

      // Interactive hover tooltip
      node.addEventListener("mouseenter", (e) => {
        circle.setAttribute("r", markerRadius + 3);
        mapTooltip.innerHTML = `
          <strong>#${pt.order}: ${pt.label}</strong><br>
          <span style="color: ${typeCfg.color};">Type: ${pt.type}</span><br>
          <span style="color: var(--text-muted);">Coords: (${pt.x}, ${pt.y})</span><br>
          <span style="color: var(--text-muted); font-size: 0.75rem;">Key: ${pt.key}</span>
        `;
        mapTooltip.classList.remove("hidden");
      });

      node.addEventListener("mousemove", (e) => {
        const rect = mapSvg.getBoundingClientRect();
        mapTooltip.style.left = `${e.clientX - rect.left + 14}px`;
        mapTooltip.style.top = `${e.clientY - rect.top + 14}px`;
      });

      node.addEventListener("mouseleave", () => {
        circle.setAttribute("r", markerRadius);
        mapTooltip.classList.add("hidden");
      });

      nodesGroup.appendChild(node);
    });

    mapViewport.appendChild(linesGroup);
    mapViewport.appendChild(nodesGroup);
  }

  // Calculate bounding box and fit to view
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

  // Mouse Drag & Pan Handlers
  mapSvg.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return; // Left click only
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

  // Zoom Toolbar Buttons
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

  // Export Standalone SVG
  btnExportSvg.onclick = () => {
    if (currentPathPoints.length === 0) {
      alert("Please generate a map first.");
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

  // Export PNG via Canvas
  btnExportPng.onclick = () => {
    if (currentPathPoints.length === 0) {
      alert("Please generate a map first.");
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
      canvas.width = svgRect.width * 2; // 2x resolution for sharpness
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

  btnGenerateMap.onclick = generateMap;
})();