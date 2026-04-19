const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const imageArea = document.getElementById("imageArea");
const redFrame = document.getElementById("redFrame");
const clearFrameButton = document.getElementById("clearFrameButton");
const screenshotModeButton = document.getElementById("screenshotModeButton");
const statusMessage = document.getElementById("statusMessage");

const screenshotOverlay = document.getElementById("screenshotOverlay");
const closeScreenshotButton = document.getElementById("closeScreenshotButton");
const screenshotImage = document.getElementById("screenshotImage");
const screenshotFrame = document.getElementById("screenshotFrame");

let imageLoaded = false;
let isDragging = false;
let startX = 0;
let startY = 0;

// 画像アップロード
imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const imageUrl = URL.createObjectURL(file);
  previewImage.src = imageUrl;
  previewImage.style.display = "block";

  const placeholder = document.querySelector(".placeholder");
  if (placeholder) placeholder.style.display = "none";

  redFrame.style.display = "none";
  imageLoaded = true;

  clearFrameButton.disabled = false;
  screenshotModeButton.disabled = false;

  statusMessage.textContent = "画像を読み込みました。ドラッグして赤枠を描いてください。";
});

// ドラッグ開始
imageArea.addEventListener("mousedown", (event) => {
  if (!imageLoaded) return;

  const areaRect = imageArea.getBoundingClientRect();
  startX = event.clientX - areaRect.left;
  startY = event.clientY - areaRect.top;

  isDragging = true;

  redFrame.style.display = "block";
  redFrame.style.left = `${startX}px`;
  redFrame.style.top = `${startY}px`;
  redFrame.style.width = "0px";
  redFrame.style.height = "0px";
});

// ドラッグ中
document.addEventListener("mousemove", (event) => {
  if (!isDragging) return;

  const areaRect = imageArea.getBoundingClientRect();
  const currentX = Math.min(Math.max(event.clientX - areaRect.left, 0), areaRect.width);
  const currentY = Math.min(Math.max(event.clientY - areaRect.top, 0), areaRect.height);

  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  redFrame.style.left = `${left}px`;
  redFrame.style.top = `${top}px`;
  redFrame.style.width = `${width}px`;
  redFrame.style.height = `${height}px`;
});

// ドラッグ終了
document.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;

  const width = parseFloat(redFrame.style.width);
  const height = parseFloat(redFrame.style.height);

  if (width < 5 || height < 5) {
    redFrame.style.display = "none";
    statusMessage.textContent = "ドラッグして赤枠を描いてください。";
  } else {
    statusMessage.textContent = "赤枠を描きました。もう一度ドラッグすると描き直せます。";
  }
});

// 赤枠を消す
clearFrameButton.addEventListener("click", () => {
  redFrame.style.display = "none";
  statusMessage.textContent = "赤枠を消しました。ドラッグして描き直せます。";
});

// スクショ用表示
screenshotModeButton.addEventListener("click", () => {
  if (!imageLoaded) {
    statusMessage.textContent = "先に画像を選択してください。";
    return;
  }
  if (redFrame.style.display !== "block") {
    statusMessage.textContent = "先に赤枠を描いてください。";
    return;
  }

  screenshotImage.src = previewImage.src;
  screenshotOverlay.style.display = "flex";

  const imageRect = previewImage.getBoundingClientRect();
  const frameRect = redFrame.getBoundingClientRect();

  const frameLeftRatio = (frameRect.left - imageRect.left) / imageRect.width;
  const frameTopRatio = (frameRect.top - imageRect.top) / imageRect.height;
  const frameWidthRatio = frameRect.width / imageRect.width;
  const frameHeightRatio = frameRect.height / imageRect.height;

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
