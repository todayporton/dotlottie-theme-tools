import { setPlaceholder, setText, t } from "./i18n.js";
import { DotLottie } from "@dotlottie/dotlottie-js";

const lottieFileInput = document.getElementById("lottie-file");
const lottieDropzone = lottieFileInput.closest(".dropzone");
const animationIdInput = document.getElementById("animation-id");
const themeIdInput = document.getElementById("theme-id");
const outputNameInput = document.getElementById("animation-name");
const buildButton = document.getElementById("build-btn");
const clearButton = document.getElementById("clear-btn");
const copyLogButton = document.getElementById("copy-log");
const downloadLogButton = document.getElementById("download-log");
const lottieStatus = document.getElementById("lottie-status");
const colorStatus = document.getElementById("color-status");
const colorList = document.getElementById("color-list");
const buildStatus = document.getElementById("build-status");
const runLog = document.getElementById("run-log");
const logPanel = document.querySelector(".log-panel");
const logToggle = document.querySelector(".log-panel__toggle");
const logContent = document.querySelector(".log-panel__content");

let lottieData = null;
let colorEntries = [];
let uniqueColors = [];
let logBuffer = [];
let lottieFileBaseName = "";

const setStatus = (element, key, state = "", params) => {
  setText(element, key, params);
  if (state) {
    element.dataset.state = state;
  } else {
    element.removeAttribute("data-state");
  }
};

const appendLog = (message, details = "") => {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${message}${details ? `\n${details}` : ""}`;
  logBuffer = [line, ...logBuffer].slice(0, 200);
  delete runLog.dataset.i18n;
  runLog.textContent = logBuffer.join("\n\n");
};

const resetLog = () => {
  logBuffer = [];
  setText(runLog, "log.placeholder");
};

resetLog();

const setLogExpanded = (expanded) => {
  if (!logPanel || !logToggle || !logContent) return;
  logPanel.classList.toggle("log-panel--collapsed", !expanded);
  logToggle.setAttribute("aria-expanded", String(expanded));
  logContent.setAttribute("aria-hidden", String(!expanded));
};

logToggle?.addEventListener("click", () => {
  const isExpanded = logToggle.getAttribute("aria-expanded") === "true";
  setLogExpanded(!isExpanded);
});

setLogExpanded(false);

const readJsonFile = async (file) => {
  const text = await file.text();
  return JSON.parse(text);
};

const clamp01 = (value) => Math.max(0, Math.min(1, value));

const rgbaToHex = (rgba) => {
  const [r, g, b] = rgba.slice(0, 3).map((channel) =>
    Math.round(clamp01(channel) * 255)
  );
  return `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
};

const rgbaToAlphaKey = (alpha) =>
  Number.isFinite(alpha) ? alpha.toFixed(3) : "1.000";

const hexToRgba = (hex, alpha = 1) => {
  const normalized = hex.replace("#", "").trim();
  if (normalized.length !== 6) return null;
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  return [clamp01(r), clamp01(g), clamp01(b), clamp01(alpha)];
};

const isColorKey = (key) => ["c", "fc", "sc"].includes(key);

const isColorProperty = (value) => {
  if (!value || typeof value !== "object" || !("k" in value)) return false;
  if (Array.isArray(value.k) && (value.k.length === 3 || value.k.length === 4)) {
    return value.k.every((item) => typeof item === "number");
  }
  if (
    Array.isArray(value.k) &&
    value.k.length > 0 &&
    value.k[0] &&
    typeof value.k[0] === "object" &&
    Array.isArray(value.k[0].s) &&
    (value.k[0].s.length === 3 || value.k[0].s.length === 4)
  ) {
    return value.k[0].s.every((item) => typeof item === "number");
  }
  return false;
};

const getColorFromProperty = (value) => {
  if (Array.isArray(value.k)) {
    if (
      (value.k.length === 3 || value.k.length === 4) &&
      value.k.every((item) => typeof item === "number")
    ) {
      return value.k;
    }
    if (
      value.k.length > 0 &&
      value.k[0] &&
      typeof value.k[0] === "object" &&
      Array.isArray(value.k[0].s)
    ) {
      return value.k[0].s;
    }
  }
  return null;
};

const extractColors = (node, path = []) => {
  if (!node) return;
  if (Array.isArray(node)) {
    node.forEach((item, index) => extractColors(item, [...path, index]));
    return;
  }
  if (typeof node !== "object") return;

  Object.entries(node).forEach(([key, value]) => {
    if (isColorKey(key) && isColorProperty(value)) {
      const rgba = getColorFromProperty(value);
      if (rgba) {
        colorEntries.push({
          path: [...path, key].join("."),
          property: value,
          rgba,
          alpha: rgba[3] ?? 1,
          originalHex: rgbaToHex(rgba),
          sid: "",
          themeHex: rgbaToHex(rgba)
        });
      }
    }
    extractColors(value, [...path, key]);
  });
};

const renderColorList = () => {
  colorList.innerHTML = "";
  if (uniqueColors.length === 0) {
    setStatus(colorStatus, "color.none", "warn");
    return;
  }

  setStatus(colorStatus, "color.found", "ok", { count: uniqueColors.length });

  uniqueColors.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "color-row";

    const swatch = document.createElement("div");
    swatch.className = "color-chip";
    swatch.style.background = entry.originalHex;
    row.appendChild(swatch);

    const original = document.createElement("div");
    original.className = "color-meta";
    setText(original, "color.count", { count: entry.count });
    row.appendChild(original);

    const sidInput = document.createElement("input");
    sidInput.type = "text";
    setPlaceholder(sidInput, "color.sidPlaceholder");
    sidInput.value = entry.sid;
    sidInput.className = "color-input sid-input";
    sidInput.addEventListener("input", (event) => {
      entry.sid = event.target.value.trim();
    });
    row.appendChild(sidInput);

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = entry.themeHex;
    colorInput.className = "color-picker";
    colorInput.addEventListener("input", (event) => {
      entry.themeHex = event.target.value;
      hexInput.value = entry.themeHex;
    });
    row.appendChild(colorInput);

    const hexInput = document.createElement("input");
    hexInput.type = "text";
    hexInput.value = entry.themeHex;
    hexInput.className = "color-input";
    hexInput.placeholder = "#RRGGBB";
    hexInput.addEventListener("input", (event) => {
      const value = event.target.value.trim();
      if (value === "") {
        entry.themeHex = "";
        colorInput.value = entry.originalHex;
        return;
      }
      if (/^#?[0-9a-fA-F]{6}$/.test(value)) {
        entry.themeHex = value.startsWith("#") ? value : `#${value}`;
        colorInput.value = entry.themeHex;
      }
    });
    row.appendChild(hexInput);

    colorList.appendChild(row);
  });
};

const handleLottieFile = async (file) => {
  if (!file) return;
  try {
    lottieData = await readJsonFile(file);
    lottieFileBaseName = file.name.replace(/\.json$/i, "");
    outputNameInput.value = lottieFileBaseName
      ? `${lottieFileBaseName}_themed`
      : "themed-animation";
    setStatus(lottieStatus, "status.loaded", "ok", { name: file.name });
    colorEntries = [];
    uniqueColors = [];
    extractColors(lottieData);
    const grouped = new Map();
    colorEntries.forEach((entry) => {
      const alphaKey = rgbaToAlphaKey(entry.alpha);
      const key = `${entry.originalHex}|${alphaKey}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          originalHex: entry.originalHex,
          alpha: entry.alpha,
          themeHex: entry.originalHex,
          sid: "",
          count: 0,
          items: []
        });
      }
      const bucket = grouped.get(key);
      bucket.count += 1;
      bucket.items.push(entry);
    });
    uniqueColors = Array.from(grouped.values());
    renderColorList();
    appendLog(t("log.lottieLoaded", { name: file.name }));
  } catch (error) {
    lottieData = null;
    setStatus(lottieStatus, "status.lottieLoadFailed", "error");
    colorEntries = [];
    uniqueColors = [];
    colorList.innerHTML = "";
    setStatus(colorStatus, "color.loadFailed", "error");
    appendLog(t("log.lottieFailed"), error?.stack || String(error));
  }
};

lottieFileInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  await handleLottieFile(file);
});

const bindDropzone = (dropzone, handler) => {
  if (!dropzone) return;

  const resetHover = () => dropzone.classList.remove("dropzone--over");

  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("dropzone--over");
  });

  dropzone.addEventListener("dragleave", () => {
    resetHover();
  });

  dropzone.addEventListener("drop", async (event) => {
    event.preventDefault();
    resetHover();
    const file = event.dataTransfer?.files?.[0];
    await handler(file);
  });
};

bindDropzone(lottieDropzone, handleLottieFile);

buildButton.addEventListener("click", async () => {
  if (!lottieData) {
    setStatus(buildStatus, "build.needLottie", "warn");
    return;
  }

  if (colorEntries.length === 0) {
    setStatus(buildStatus, "build.noColors", "warn");
    return;
  }

  const animationId = animationIdInput.value.trim() || "animation_1";
  const themeId = themeIdInput.value.trim() || "theme_1";
  const outputName = outputNameInput.value.trim() || "themed-animation";

  try {
    setStatus(buildStatus, "build.running", "warn");

    const themeData = { rules: [] };
    let assigned = 0;

    uniqueColors.forEach((entry) => {
      if (!entry.sid) return;
      const resolvedHex = entry.themeHex || entry.originalHex;
      const rgba = hexToRgba(resolvedHex, entry.alpha);
      if (!rgba) return;
      entry.items.forEach((item) => {
        item.property.sid = entry.sid;
      });
      themeData.rules.push({
        id: entry.sid,
        type: "Color",
        value: rgba,
        animations: [animationId]
      });
      assigned += 1;
    });

    if (assigned === 0) {
      setStatus(buildStatus, "build.needSid", "warn");
      return;
    }

    const dotlottie = new DotLottie();
    await dotlottie
      .addAnimation({
        id: animationId,
        data: lottieData,
        loop: false,
        autoplay: false
      })
      .addTheme({ id: themeId, data: themeData })
      .scopeTheme({ animationId, themeId })
      .build()
      .then((bundle) => {
        bundle.download(`${outputName}.lottie`);
      });

    setStatus(buildStatus, "build.done", "ok");
    appendLog(t("log.buildDone"), t("log.buildOutput", { name: `${outputName}.lottie` }));
  } catch (error) {
    setStatus(buildStatus, "build.failed", "error");
    appendLog(t("log.buildFailed"), error?.stack || String(error));
  }
});

clearButton.addEventListener("click", () => {
  lottieFileInput.value = "";
  lottieData = null;
  colorEntries = [];
  uniqueColors = [];
  lottieFileBaseName = "";
  colorList.innerHTML = "";
  animationIdInput.value = "animation_1";
  themeIdInput.value = "theme_1";
  outputNameInput.value = "themed-animation";
  setStatus(lottieStatus, "status.notLoaded");
  setStatus(colorStatus, "color.initial");
  setStatus(buildStatus, "build.idle");
  resetLog();
});

copyLogButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(runLog.textContent);
    appendLog(t("log.copied"));
  } catch (error) {
    appendLog(t("log.copyFailed"), error?.stack || String(error));
  }
});

downloadLogButton.addEventListener("click", () => {
  const blob = new Blob([runLog.textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "dotlottie-run-log.txt";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  appendLog(t("log.saved"));
});
