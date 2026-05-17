const gasUrl = "https://script.google.com/macros/s/AKfycbxAE7CZbHKhe02W2WTQF4NQxtNsL7w8yr6rb2t7ueyLtRoXbiSoYJRDxCZLweaoTrHc/exec";

const rentButton = document.querySelector(".rent-btn");
const returnButton = document.querySelector(".return-btn");
const message = document.getElementById("message");

// ★「代車1 ミライース...」から「代車1」だけを抜き出す便利な機能
function getShortCarName(fullName) {
  if (!fullName) return "";
  // 半角スペース、全角スペース、または「(」の手前までの文字を切り出します
  const match = fullName.match(/^([^\s（(]+)/);
  return match ? match[1] : fullName;
}

// --- 貸出ボタンの処理 ---
rentButton.addEventListener("click", () => {

  // 全ての「km」入力欄を取得
  const distanceInputs = document.querySelectorAll('input[placeholder*="km"]');
  const rentDistanceVal = distanceInputs[0] ? distanceInputs[0].value : "";

  // 各種入力項目の値を取得
  const rentalCarEl = document.getElementById("rentalCar") || document.querySelector("select");
  const nameEl = document.querySelector('input[placeholder*="氏名"]');
  const telEl = document.querySelector('input[placeholder*="TEL"]');
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

  // 2. 貸出時のチェックボックス確認（上の12個だけ）
  const checks = document.querySelectorAll('.check input[type="checkbox"]');
  for (let i = 0; i < 12; i++) {
    if (checks[i] && !checks[i].checked) {
      message.innerHTML = "※ 確認事項をすべてチェックしてください";
      message.style.color = "red";
      return;
    }
  }

  // 3. 重複保存防止ガード
  if (rentButton.dataset.done === "true") {
    return;
  }

  // 貸出ボタンを即座にグレーアウト
  rentButton.dataset.done = "true";
  rentButton.disabled = true;
  rentButton.style.pointerEvents = "none";
  rentButton.innerHTML = "貸出処理済み";
  rentButton.style.backgroundColor = "gray";

  message.innerHTML = "貸出処理中です。もう一度押さないでください。";
  message.style.color = "orange";

  // ★【最重要】「getShortCarName」を使って「代車1」だけをB列に送信します
  const data = {
    timestamp: "", // A: 日時
    rentalCar: getShortCarName(rentalCarEl.value), // B: 貸出代車（代車1、代車2 のみになるよう自動カット）
    name: nameEl.value, // C: 氏名
    tel: telEl.value, // D: TEL
    address: addressEl ? addressEl.value : "", // E: 住所
    customerCar: customerCarEl.value, // F: 預かり車（車種）
    customerNumber: customerNumberEl.value, // G: 預かり車ナンバー
    reason: reasonEl ? reasonEl.value : "", // H: 預かり理由
    start: document.querySelectorAll('input[type="datetime-local"]')[0] ? document.querySelectorAll('input[type="datetime-local"]')[0].value : "", // I: 貸出日時
    returnDate: document.querySelectorAll('input[type="datetime-local"]')[1] ? document.querySelectorAll('input[type="datetime-local"]')[1].value : "", // J: 返却予定
    distance: rentDistanceVal, // K: 貸出距離
    staff: staffEl.value, // L: 担当者
    sign: signEl.value, // M: 署名
    returnDistance: "", // N: 返却距離
    status: "使用中", // O: 状態
    rentCheck: "貸出確認完了", // P: 貸出確認
    returnCheck: "" // Q: 返却確認
  };

  fetch(gasUrl, {
    method: "POST",
    body: new URLSearchParams(data)
  });

  message.innerHTML = "貸出情報をスプレッドシートへ保存しました";
  message.style.color = "green";

});

// --- 返却ボタンの処理 ---
returnButton.addEventListener("click", () => {

  // 全ての「km」入力欄を取得し、最後（2番目）の欄を返却kmとする
  const distanceInputs = document.querySelectorAll('input[placeholder*="km"]');
  const returnDistanceVal = distanceInputs.length > 0 ? distanceInputs[distanceInputs.length - 1].value : "";

  // 各種入力項目の値を取得
  const rentalCarEl = document.getElementById("rentalCar") || document.querySelector("select");
  const nameEl = document.querySelector('input[placeholder*="氏名"]');
  const telEl = document.querySelector('input[placeholder*="TEL"]');
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

  // 2. 重複保存防止ガード
  if (returnButton.dataset.done === "true") {
    return;
  }

  // 返却ボタンを即座にグレーアウト
  returnButton.dataset.done = "true";
  returnButton.disabled = true;
  returnButton.style.pointerEvents = "none";
  returnButton.innerHTML = "返却処理済み";
  returnButton.classList.add("done");
  returnButton.style.backgroundColor = "gray";

  message.innerHTML = "返却処理中です。もう一度押さないでください。";
  message.style.color = "orange";

  // 返却時も「getShortCarName」を適用して送信
  const data = {
    timestamp: "", // A: 日時
    rentalCar: getShortCarName(rentalCarEl.value), // B: 貸出代車（ここも自動カット）
    name: nameEl.value, // C: 氏名
    tel: telEl ? telEl.value : "", // D: TEL
    address: addressEl ? addressEl.value : "", // E: 住所
    customerCar: customerCarEl ? customerCarEl.value : "", // F: 預かり車
    customerNumber: customerNumberEl ? customerNumberEl.value : "", // G: 預かり車ナンバー
    reason: reasonEl ? reasonEl.value : "", // H: 預かり理由
    start: "", // I: 貸出日時
    returnDate: "", // J: 返却予定
    distance: "", // K: 貸出距離
    staff: staffEl.value, // L: 担当者
    sign: signEl.value, // M: 署名
    returnDistance: returnDistanceVal, // N: 返却距離
    status: "返却済み", // O: 状態
    rentCheck: "", // P: 貸出確認
    returnCheck: "返却確認完了" // Q: 返却確認
  };

  fetch(gasUrl, {
    method: "POST",
    body: new URLSearchParams(data)
  });

  message.innerHTML = "返却情報をスプレッドシートへ保存しました";
  message.style.color = "green";

});