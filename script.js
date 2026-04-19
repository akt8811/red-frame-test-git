const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const imageArea = document.getElementById("imageArea");
const redFrame = document.getElementById("redFrame");
const showFrameButton = document.getElementById("showFrameButton");
const hideFrameButton = document.getElementById("hideFrameButton");
const screenshotModeButton = document.getElementById("screenshotModeButton");
const statusMessage = document.getElementById("statusMessage");

const screenshotOverlay = document.getElementById("screenshotOverlay");
const closeScreenshotButton = document.getElementById("closeScreenshotButton");
const screenshotImage = document.getElementById("screenshotImage");
const screenshotFrame = document.getElementById("screenshotFrame");

let imageLoaded = false;

// 画像アップロード
imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const imageUrl = URL.createObjectURL(file);

  previewImage.src = imageUrl;
  previewImage.style.display = "block";

  const placeholder = document.querySelector(".placeholder");
  if (placeholder) {
    placeholder.style.display = "none";
  }

  redFrame.style.display = "none";
  imageLoaded = true;

  showFrameButton.disabled = false;
  hideFrameButton.disabled = true;
  screenshotModeButton.disabled = false;

  statusMessage.textContent = "画像を読み込みました。赤枠を表示できます。";
});

// 赤枠を表示
showFrameButton.addEventListener("click", () => {
  if (!imageLoaded) {
    return;
  }

  redFrame.style.display = "block";

  const areaRect = imageArea.getBoundingClientRect();

  const frameWidth = redFrame.offsetWidth;
  const frameHeight = redFrame.offsetHeight;

  const left = (areaRect.width - frameWidth) / 2;
  const top = (areaRect.height - frameHeight) / 2;

  redFrame.style.left = `${left}px`;
  redFrame.style.top = `${top}px`;

  hideFrameButton.disabled = false;

  statusMessage.textContent = "赤枠を表示しました。画像をクリックすると赤枠が移動します。";
});

// 赤枠を非表示
hideFrameButton.addEventListener("click", () => {
  redFrame.style.display = "none";
  hideFrameButton.disabled = true;

  statusMessage.textContent = "赤枠を非表示にしました。";
});

// 画像をクリックした位置に赤枠を移動
imageArea.addEventListener("click", (event) => {
  if (!imageLoaded || redFrame.style.display !== "block") {
    return;
  }

  const areaRect = imageArea.getBoundingClientRect();

  const clickX = event.clientX - areaRect.left;
  const clickY = event.clientY - areaRect.top;

  const frameWidth = redFrame.offsetWidth;
  const frameHeight = redFrame.offsetHeight;

  // クリック位置が赤枠の中心になるように調整
  let left = clickX - frameWidth / 2;
  let top = clickY - frameHeight / 2;

  // 画像エリアの外にはみ出しすぎないように調整
  left = Math.max(0, Math.min(left, areaRect.width - frameWidth));
  top = Math.max(0, Math.min(top, areaRect.height - frameHeight));

  redFrame.style.left = `${left}px`;
  redFrame.style.top = `${top}px`;

  statusMessage.textContent = `赤枠を移動しました。位置：X ${Math.round(clickX)} / Y ${Math.round(clickY)}`;
});

// スクショ用表示
screenshotModeButton.addEventListener("click", () => {
  if (!imageLoaded) {
    statusMessage.textContent = "先に画像を選択してください。";
    return;
  }

  if (redFrame.style.display !== "block") {
    statusMessage.textContent = "先に赤枠を表示してください。";
    return;
  }

  screenshotImage.src = previewImage.src;
  screenshotOverlay.style.display = "flex";

  // 元の表示画像と赤枠の位置を取得
  const imageRect = previewImage.getBoundingClientRect();
  const frameRect = redFrame.getBoundingClientRect();

  // 画像に対する赤枠の位置・サイズを割合で計算
  const frameLeftRatio = (frameRect.left - imageRect.left) / imageRect.width;
  const frameTopRatio = (frameRect.top - imageRect.top) / imageRect.height;
  const frameWidthRatio = frameRect.width / imageRect.width;
  const frameHeightRatio = frameRect.height / imageRect.height;

  // スクショ用画像の読み込み後に赤枠位置を反映
  screenshotImage.onload = () => {
    const previewRect = screenshotImage.getBoundingClientRect();

    screenshotFrame.style.left = `${previewRect.width * frameLeftRatio}px`;
    screenshotFrame.style.top = `${previewRect.height * frameTopRatio}px`;
    screenshotFrame.style.width = `${previewRect.width * frameWidthRatio}px`;
    screenshotFrame.style.height = `${previewRect.height * frameHeightRatio}px`;
  };
});

// スクショ用表示を閉じる
closeScreenshotButton.addEventListener("click", () => {
  screenshotOverlay.style.display = "none";
});