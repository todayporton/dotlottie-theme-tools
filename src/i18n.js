// The initial locale is resolved by partials/i18n-head.html before first paint,
// which reads the same storage key.
const STORAGE_KEY = "dotlottie-theme-tools:locale";

const messages = {
  ja: {
    "builder.title": "テーマ付きdotLottieをローカルで生成",
    "builder.lede":
      "AEから書き出したLottie JSONにテーマを付与し、.lottieとしてビルドします。ファイルはブラウザ内で処理され、外部送信しません。",
    "builder.lottie.desc": "テーマを埋め込みたいLottie JSONを選択",
    "builder.lottie.select": "ファイルを選択",
    "builder.lottie.hint": ".json / After Effects書き出し",
    "builder.theme.title": "2. Theme設定",
    "builder.theme.desc": "同じ色ごとにSIDとテーマ色を割り当てます",
    "builder.build.desc": "テーマを紐づけてdotLottieを生成",
    "builder.build.outputName": "出力名 (.lottie)",
    "builder.build.submit": ".lottie を生成",
    "builder.build.reset": "リセット",
    "builder.note.label": "注意:",
    "builder.note.body":
      "SIDはテーマ適用のキーになります。未入力の行はテーマに含まれません。",

    "status.notLoaded": "未読み込み",
    "status.loaded": ({ name }) => `読み込み完了: ${name}`,
    "status.lottieLoadFailed": "Lottie JSONの読み込みに失敗しました。",

    "color.initial": "Lottieを読み込むと色が一覧化されます。",
    "color.none": "抽出できる色が見つかりませんでした。",
    "color.found": ({ count }) => `${count}色を検出しました。`,
    "color.loadFailed": "Lottieの読み込みに失敗しました。",
    "color.count": ({ count }) => `${count} 件`,
    "color.sidPlaceholder": "sid (例: primary_fill)",

    "build.idle": "準備中",
    "build.needLottie": "Lottie JSONを読み込んでください。",
    "build.noColors": "色の抽出ができていません。",
    "build.running": "dotLottieを生成中...",
    "build.needSid": "SIDを1つ以上設定してください。",
    "build.done": "完了: .lottieをダウンロードしました。",
    "build.failed": "生成に失敗しました。ログを確認してください。",

    "log.title": "実行ログ",
    "log.copy": "コピー",
    "log.save": "保存",
    "log.placeholder": "ログはここに表示されます。",
    "log.lottieLoaded": ({ name }) => `Lottie読み込み成功: ${name}`,
    "log.lottieFailed": "Lottie読み込み失敗",
    "log.buildDone": "dotLottie生成成功",
    "log.buildOutput": ({ name }) => `出力: ${name}`,
    "log.buildFailed": "dotLottie生成失敗",
    "log.copied": "ログをコピーしました。",
    "log.copyFailed": "ログのコピーに失敗しました。",
    "log.saved": "ログを保存しました。",

    "preview.title": "テーマ付きdotLottieをプレビュー",
    "preview.lede": ".lottieファイルを読み込み、テーマを切り替えて確認できます。",
    "preview.file.desc": ".lottieファイルをアップロード",
    "preview.file.select": ".lottie を選択",
    "preview.file.hint": "ドラッグ&ドロップ対応",
    "preview.file.loading": ({ name }) => `読み込み中: ${name}`,
    "preview.file.failed": ({ error }) => `読み込み失敗: ${error}`,
    "preview.theme.desc": "manifestに含まれるテーマを選択",
    "preview.theme.initial": ".lottieを読み込むと一覧が出ます。",
    "preview.theme.none": "テーマが見つかりませんでした。",
    "preview.theme.found": ({ count }) => `${count}件のテーマを検出しました。`,
    "preview.theme.parsing": "テーマを解析中...",
    "preview.theme.failed": "テーマ取得に失敗しました。",
    "preview.canvas.desc": "アニメーション表示",
    "preview.canvas.background": "背景色",
    "preview.canvas.dark": "黒背景"
  },
  en: {
    "builder.title": "Build themed dotLottie files locally",
    "builder.lede":
      "Add themes to Lottie JSON exported from After Effects and build a .lottie file. Files are processed in your browser and are never uploaded.",
    "builder.lottie.desc": "Choose the Lottie JSON to add themes to",
    "builder.lottie.select": "Choose a file",
    "builder.lottie.hint": ".json / After Effects export",
    "builder.theme.title": "2. Theme settings",
    "builder.theme.desc": "Assign a SID and theme color to each unique color",
    "builder.build.desc": "Attach the theme and generate a dotLottie file",
    "builder.build.outputName": "Output name (.lottie)",
    "builder.build.submit": "Generate .lottie",
    "builder.build.reset": "Reset",
    "builder.note.label": "Note:",
    "builder.note.body":
      "SIDs are the keys used to apply a theme. Rows without a SID are left out of the theme.",

    "status.notLoaded": "No file loaded",
    "status.loaded": ({ name }) => `Loaded: ${name}`,
    "status.lottieLoadFailed": "Could not load the Lottie JSON.",

    "color.initial": "Colors will be listed once a Lottie file is loaded.",
    "color.none": "No colors could be extracted.",
    "color.found": ({ count }) =>
      `Found ${count} ${count === 1 ? "color" : "colors"}.`,
    "color.loadFailed": "Could not load the Lottie file.",
    "color.count": ({ count }) => `${count} ${count === 1 ? "use" : "uses"}`,
    "color.sidPlaceholder": "sid (e.g. primary_fill)",

    "build.idle": "Not built yet",
    "build.needLottie": "Load a Lottie JSON file first.",
    "build.noColors": "No colors have been extracted.",
    "build.running": "Generating dotLottie...",
    "build.needSid": "Set at least one SID.",
    "build.done": "Done: the .lottie file has been downloaded.",
    "build.failed": "Generation failed. Check the log for details.",

    "log.title": "Run log",
    "log.copy": "Copy",
    "log.save": "Save",
    "log.placeholder": "Log entries will appear here.",
    "log.lottieLoaded": ({ name }) => `Lottie loaded: ${name}`,
    "log.lottieFailed": "Lottie load failed",
    "log.buildDone": "dotLottie generated",
    "log.buildOutput": ({ name }) => `Output: ${name}`,
    "log.buildFailed": "dotLottie generation failed",
    "log.copied": "Log copied.",
    "log.copyFailed": "Could not copy the log.",
    "log.saved": "Log saved.",

    "preview.title": "Preview themed dotLottie files",
    "preview.lede": "Load a .lottie file and switch between its themes.",
    "preview.file.desc": "Upload a .lottie file",
    "preview.file.select": "Choose a .lottie file",
    "preview.file.hint": "Drag and drop supported",
    "preview.file.loading": ({ name }) => `Loading: ${name}`,
    "preview.file.failed": ({ error }) => `Load failed: ${error}`,
    "preview.theme.desc": "Choose a theme from the manifest",
    "preview.theme.initial": "Themes will be listed once a .lottie file is loaded.",
    "preview.theme.none": "No themes were found.",
    "preview.theme.found": ({ count }) =>
      `Found ${count} ${count === 1 ? "theme" : "themes"}.`,
    "preview.theme.parsing": "Reading themes...",
    "preview.theme.failed": "Could not read the themes.",
    "preview.canvas.desc": "Animation preview",
    "preview.canvas.background": "Background",
    "preview.canvas.dark": "Black background"
  }
};

let locale = document.documentElement.lang === "ja" ? "ja" : "en";

export const t = (key, params = {}) => {
  const message = messages[locale][key];
  if (message === undefined) return key;
  return typeof message === "function" ? message(params) : message;
};

// Records the key on the element so the text follows later language changes.
export const setText = (element, key, params) => {
  element.dataset.i18n = key;
  if (params) {
    element.dataset.i18nParams = JSON.stringify(params);
  } else {
    delete element.dataset.i18nParams;
  }
  element.textContent = t(key, params);
};

export const setPlaceholder = (element, key) => {
  element.dataset.i18nPlaceholder = key;
  element.placeholder = t(key);
};

const applyTranslations = () => {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const { i18n: key, i18nParams: params } = element.dataset;
    element.textContent = t(key, params ? JSON.parse(params) : undefined);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-locale]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.locale === locale));
  });
};

const setLocale = (nextLocale) => {
  locale = nextLocale;
  document.documentElement.lang = nextLocale;
  try {
    localStorage.setItem(STORAGE_KEY, nextLocale);
  } catch {
    // Storage may be blocked; the choice then lasts for this page only.
  }
  applyTranslations();
};

document.querySelectorAll("[data-locale]").forEach((button) => {
  button.addEventListener("click", () => setLocale(button.dataset.locale));
});

applyTranslations();
document.documentElement.classList.remove("i18n-pending");
