// ウェブアプリURL
const gasUrl = "https://script.google.com/macros/s/AKfycbxAE7CZbHKhe02W2WTQF4NQxtNsL7w8yr6rb2t7ueyLtRoXbiSoYJRDxCZLweaoTrHc/exec";

const rentButton = document.querySelector(".rent-btn");
const returnButton = document.querySelector(".return-btn");
const message = document.getElementById("message");

// 「代車1 ミライース...」から「代車1」だけを抜き出す機能
function getShortCarName(fullName) {
  if (!fullName) return "";
  const match = fullName.match(/^([^\s (［[]+)/);
  return match ? match[1] : fullName;
}

// ---- 貸出ボタンの処理 ----
rentButton.addEventListener("click", () => {

  // 「貸出時走行距離」の入力欄を確実に特定して値を取得
  const rentDistanceInput = document.querySelector('input[placeholder*="貸出時"]');
  const rentDistanceVal = rentDistanceInput ? rentDistanceInput.value : "";

  // 各種入力項目を取得
  const rentalCarEl = document.getElementById("rentalCar") || document.querySelector("select");
  const nameEl = document.querySelector('input[placeholder*="氏名"]');
  const telEl = document.querySelector('input[placeholder*="TEL"]') || document.querySelector('input[placeholder*="電話"]');
  const addressEl = document.querySelector('input[placeholder*="住所"]');
  const customerCarEl = document.querySelector('input[placeholder*="預かり車 車種"]') || document.querySelector('input[placeholder*="預かり車"]');
  const customerNumberEl = document.querySelector('input[placeholder*="ナンバー"]') || document.querySelector('input[placeholder*="No"]');
  const reasonEl = document.getElementById("reason");
  const staffEl = document.getElementById("staff") || document.querySelectorAll("select")[1];
  const signEl = document.getElementById("sign") || document.querySelector('input[placeholder*="署名"]') || document.querySelector('input[placeholder*="サイン"]');

  // 1. 貸出時の必須入力チェック
  if (
    !rentalCarEl || !rentalCarEl.value ||
    !nameEl || !nameEl.value ||
    !telEl || !telEl.value ||
    !customerCarEl || !customerCarEl.value ||
    !customerNumberEl || !customerNumberEl.value ||
    !rentDistanceVal ||
    !staffEl || !staffEl.value ||
    !signEl || !signEl.value
  ){
    message.innerHTML = "※ 必須項目（走行距離km等を含む）を入力してください";
    message.style.color = "red";
    return;
  }

  // 2. 貸出時のチェックボックス確認（上の12個）
  const checks = document.querySelectorAll('.check input[type="checkbox"]');
  for (let i = 0; i < 12; i++) {
    if (checks[i] && !checks[i].checked) {
      message.innerHTML = "※ 確認事項をすべてチェックしてください";
      message.style.color = "red";
      return;
    }
  }

  if (rentButton.dataset.done === "true") return;

  rentButton.dataset.done = "true";
  rentButton.disabled = true;
  rentButton.style.pointerEvents = "none";
  rentButton.innerHTML = "貸出処理済み";
  rentButton.style.backgroundColor = "gray";
  message.innerHTML = "貸出処理中です...";
  message.style.color = "orange";

  const data = {
    rentalCar: getShortCarName(rentalCarEl.value),
    name: nameEl.value,
    tel: telEl.value,
    address: addressEl ? addressEl.value : "",
    customerCar: customerCarEl.value,
    customerNumber: customerNumberEl.value,
    reason: reasonEl ? reasonEl.value : "",
    start: document.querySelectorAll('input[type="datetime-local"]')[0] ? document.querySelectorAll('input[type="datetime-local"]')[0].value : "",
    returnDate: document.querySelectorAll('input[type="datetime-local"]')[1] ? document.querySelectorAll('input[type="datetime-local"]')[1].value : "",
    distance: rentDistanceVal,
    staff: staffEl.value,
    sign: signEl.value,
    returnDistance: "",
    status: "使用中",
    rentCheck: "貸出確認完了",
    returnCheck: ""
  };

  const photoInput = document.getElementById("carPhoto");
  const file = photoInput ? photoInput.files[0] : null;

  function sendRentData(data) {
    fetch(gasUrl, {
      method: "POST",
      body: new URLSearchParams(data)
    }).then(() => {
      message.innerHTML = "貸出情報をスプレッドシートへ保存しました";
      message.style.color = "green";
    }).catch(() => {
      message.innerHTML = "送信に失敗しました。再度お試しください。";
      message.style.color = "red";
      rentButton.dataset.done = "";
      rentButton.disabled = false;
      rentButton.style.pointerEvents = "";
      rentButton.innerHTML = "貸出";
      rentButton.style.backgroundColor = "";
    });
  }

  if (file) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement("canvas");
      const maxWidth = 800;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      data.photo = canvas.toDataURL("image/jpeg", 0.7).split(",")[1];
      sendRentData(data);
    };
    img.src = URL.createObjectURL(file);
  } else {
    sendRentData(data);
  }

}); // rentButton.addEventListener の閉じ括弧

// ---- 返却ボタンの処理 ----
returnButton.addEventListener("click", () => {

  // 「返却時走行距離」の入力欄を確実に特定して値を取得
  const returnDistanceInput = document.querySelector('input[placeholder*="返却時"]');
  const returnDistanceVal = returnDistanceInput ? returnDistanceInput.value : "";

  const rentalCarEl = document.getElementById("rentalCar") || document.querySelector("select");
  const nameEl = document.querySelector('input[placeholder*="氏名"]');
  const telEl = document.querySelector('input[placeholder*="TEL"]') || document.querySelector('input[placeholder*="電話"]');
  const addressEl = document.querySelector('input[placeholder*="住所"]');
  const customerCarEl = document.querySelector('input[placeholder*="預かり車 車種"]') || document.querySelector('input[placeholder*="預かり車"]');
  const customerNumberEl = document.querySelector('input[placeholder*="ナンバー"]') || document.querySelector('input[placeholder*="No"]');
  const reasonEl = document.getElementById("reason");
  const staffEl = document.getElementById("staff") || document.querySelectorAll("select")[1];
  const signEl = document.getElementById("sign") || document.querySelector('input[placeholder*="署名"]') || document.querySelector('input[placeholder*="サイン"]');

  // 1. 返却時の必須入力チェック
  if (
    !rentalCarEl || !rentalCarEl.value ||
    !nameEl || !nameEl.value ||
    !returnDistanceVal ||
    !staffEl || !staffEl.value ||
    !signEl || !signEl.value
  ){
    message.innerHTML = "※ 返却に必要な必須項目（氏名・返却km・スタッフ・サイン等）を入力してください";
    message.style.color = "red";
    return;
  }

  // 返却時確認のチェックボックス（下側の6個）の全チェック検証
  const allChecks = document.querySelectorAll('input[type="checkbox"]');
  const startIndex = allChecks.length - 6;
  for (let i = startIndex; i < allChecks.length; i++) {
    if (allChecks[i] && !allChecks[i].checked) {
      message.innerHTML = "※ 返却時確認の項目（燃料・車内汚れ等）をすべてチェックしてください";
      message.style.color = "red";
      return;
    }
  }

  if (returnButton.dataset.done === "true") return;

  returnButton.dataset.done = "true";
  returnButton.disabled = true;
  returnButton.style.pointerEvents = "none";
  returnButton.innerHTML = "返却処理済み";
  returnButton.style.backgroundColor = "gray";
  message.innerHTML = "返却処理中です...";
  message.style.color = "orange";

  const data = {
    rentalCar: getShortCarName(rentalCarEl.value),
    name: nameEl.value,
    tel: telEl ? telEl.value : "",
    address: addressEl ? addressEl.value : "",
    customerCar: customerCarEl ? customerCarEl.value : "",
    customerNumber: customerNumberEl ? customerNumberEl.value : "",
    reason: reasonEl ? reasonEl.value : "",
    start: "",
    returnDate: "",
    distance: "",
    staff: staffEl.value,
    sign: signEl.value,
    returnDistance: returnDistanceVal,
    status: "返却済み",
    rentCheck: "",
    returnCheck: "返却確認完了"
  };

  fetch(gasUrl, {
    method: "POST",
    body: new URLSearchParams(data)
  }).then(() => {
    message.innerHTML = "返却情報をスプレッドシートへ保存しました";
    message.style.color = "green";
  }).catch(() => {
    message.innerHTML = "送信に失敗しました。再度お試しください。";
    message.style.color = "red";
    returnButton.dataset.done = "";
    returnButton.disabled = false;
    returnButton.style.pointerEvents = "";
    returnButton.innerHTML = "返却";
    returnButton.style.backgroundColor = "";
  });

}); // returnButton.addEventListener の閉じ括弧