import { DotLottie } from "@lottiefiles/dotlottie-web";

const fileInput = document.getElementById("preview-file");
const dropzone = fileInput.closest(".dropzone");
const statusEl = document.getElementById("preview-status");
const themeStatus = document.getElementById("theme-status");
const themeSelect = document.getElementById("theme-select");
const canvas = document.getElementById("preview-canvas");
const bgToggle = document.getElementById("bg-toggle");
const previewWrap = document.querySelector(".preview-canvas-wrap");

let player = null;
let currentUrl = null;

const setStatus = (element, message, state = "") => {
  element.textContent = message;
  if (state) {
    element.dataset.state = state;
  } else {
    element.removeAttribute("data-state");
  }
};

const resizeCanvas = () => {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  if (player) {
    player.resize();
  }
};

const resetThemeOptions = () => {
  themeSelect.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "default";
  themeSelect.appendChild(defaultOption);
};

const updateThemeOptions = () => {
  resetThemeOptions();
  const manifest = player?.manifest;
  const ids = new Set();

  manifest?.themes?.forEach((theme) => ids.add(theme.id));
  manifest?.animations?.forEach((anim) => {
    anim.themes?.forEach((themeId) => ids.add(themeId));
    if (anim.initialTheme) {
      ids.add(anim.initialTheme);
    }
  });

  ids.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = id;
    themeSelect.appendChild(option);
  });

  if (ids.size === 0) {
    setStatus(themeStatus, "テーマが見つかりませんでした。", "warn");
  } else {
    setStatus(themeStatus, `${ids.size}件のテーマを検出しました。`, "ok");
  }
};

const handleThemeChange = () => {
  if (!player) return;
  const value = themeSelect.value;
  if (!value) {
    player.resetTheme();
    return;
  }
  player.setTheme(value);
};

themeSelect.addEventListener("change", handleThemeChange);

const handleBackgroundToggle = () => {
  if (!previewWrap) return;
  if (bgToggle.checked) {
    previewWrap.classList.add("is-dark");
  } else {
    previewWrap.classList.remove("is-dark");
  }
};

bgToggle.addEventListener("change", handleBackgroundToggle);

const handleFile = async (file) => {
  if (!file) return;
  if (currentUrl) {
    URL.revokeObjectURL(currentUrl);
  }
  currentUrl = URL.createObjectURL(file);

  setStatus(statusEl, `読み込み中: ${file.name}`, "warn");
  resetThemeOptions();
  setStatus(themeStatus, "テーマを解析中...", "warn");

  if (!player) {
    player = new DotLottie({
      canvas,
      src: currentUrl,
      autoplay: true,
      loop: true,
      renderConfig: {
        autoResize: true,
        devicePixelRatio: window.devicePixelRatio || 1
      }
    });
    player.addEventListener("load", () => {
      setStatus(statusEl, `読み込み完了: ${file.name}`, "ok");
      resizeCanvas();
      updateThemeOptions();
      handleThemeChange();
    });
    player.addEventListener("loadError", (event) => {
      setStatus(
        statusEl,
        `読み込み失敗: ${event?.error || "unknown"}`,
        "error"
      );
      setStatus(themeStatus, "テーマ取得に失敗しました。", "error");
    });
  } else {
    player.load({
      src: currentUrl,
      autoplay: true,
      loop: true
    });
  }
};

fileInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  handleFile(file);
});

const bindDropzone = () => {
  if (!dropzone) return;
  const resetHover = () => dropzone.classList.remove("dropzone--over");

  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("dropzone--over");
  });

  dropzone.addEventListener("dragleave", resetHover);

  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    resetHover();
    const file = event.dataTransfer?.files?.[0];
    handleFile(file);
  });
};

bindDropzone();
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
resetThemeOptions();
handleBackgroundToggle();
