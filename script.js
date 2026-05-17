const gasUrl = "https://script.google.com/macros/s/AKfycbxAE7CZbHKhe02W2WTQF4NQxtNsL7w8yr6rb2t7ueyLtRoXbiSoYJRDxCZLweaoTrHc/exec";

const rentButton = document.querySelector(".rent-btn");
const returnButton = document.querySelector(".return-btn");
const message = document.getElementById("message");

// --- 貸出ボタンの処理 ---
rentButton.addEventListener("click", () => {

  // 全ての「km」入力欄を取得
  const distanceInputs = document.querySelectorAll('input[placeholder*="km"]');
  const rentDistanceVal = distanceInputs[0] ? distanceInputs[0].value : "";

  // 1. 貸出時の必須入力チェック
  if (
    !document.getElementById("rentalCar").value ||
    !document.querySelector('input[placeholder="氏名 ※必須"]').value ||
    !document.querySelector('input[placeholder="TEL ※必須"]').value ||
    !document.querySelector('input[placeholder="預かり車 車種 ※必須"]').value ||
    !document.querySelector('input[placeholder="預かり車 ナンバー ※必須"]').value ||
    !rentDistanceVal || // 貸出時のkmが空ならストップ
    !document.getElementById("staff").value ||
    !document.getElementById("sign").value
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

  // 3. 【復活】重複保存防止ガード（すべて正常な時だけ即座にロック）
  if (rentButton.dataset.done === "true") {
    return;
  }

  // 貸出ボタンを即座にグレーアウト（無効化）
  rentButton.dataset.done = "true";
  rentButton.disabled = true;
  rentButton.style.pointerEvents = "none";
  rentButton.innerHTML = "貸出処理済み";
  rentButton.style.backgroundColor = "gray";

  message.innerHTML = "貸出処理中です。もう一度押さないでください。";
  message.style.color = "orange";

  const data = {
    rentalCar: document.getElementById("rentalCar").value,
    name: document.querySelector('input[placeholder="氏名 ※必須"]').value,
    tel: document.querySelector('input[placeholder="TEL ※必須"]').value,
    address: document.querySelector('input[placeholder="住所"]').value,
    customerCar: document.querySelector('input[placeholder="預かり車 車種 ※必須"]').value,
    customerNumber: document.querySelector('input[placeholder="預かり車 ナンバー ※必須"]').value,
    reason: document.getElementById("reason").value,
    start: document.querySelectorAll('input[type="datetime-local"]')[0].value,
    returnDate: document.querySelectorAll('input[type="datetime-local"]')[1].value,
    distance: rentDistanceVal, // 貸出時のkm
    staff: document.getElementById("staff").value,
    sign: document.getElementById("sign").value,
    returnDistance: "",
    status: "使用中",
    rentCheck: "貸出確認完了",
    returnCheck: ""
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

  // 1. 返却時の必須入力チェック
  if (
    !document.getElementById("rentalCar").value ||
    !document.querySelector('input[placeholder="氏名 ※必須"]').value ||
    !returnDistanceVal || // 返却時のkmが空ならストップ
    !document.getElementById("staff").value ||
    !document.getElementById("sign").value
  ){
    message.innerHTML = "※ 返却に必要な必須項目（氏名・返却km・スタッフ・サイン等）を入力してください";
    message.style.color = "red";
    return; 
  }

  // 2. 重複保存防止ガード（すべて正常な時だけ即座にロック）
  if (returnButton.dataset.done === "true") {
    return;
  }

  // 返却ボタンを即座にグレーアウト（無効化）
  returnButton.dataset.done = "true";
  returnButton.disabled = true;
  returnButton.style.pointerEvents = "none";
  returnButton.innerHTML = "返却処理済み";
  returnButton.classList.add("done");
  returnButton.style.backgroundColor = "gray";

  message.innerHTML = "返却処理中です。もう一度押さないでください。";
  message.style.color = "orange";

  const data = {
    rentalCar: document.getElementById("rentalCar").value,
    name: document.querySelector('input[placeholder="氏名 ※必須"]').value,
    tel: document.querySelector('input[placeholder="TEL ※必須"]').value,
    address: document.querySelector('input[placeholder="住所"]').value,
    customerCar: document.querySelector('input[placeholder="預かり車 車種 ※必須"]').value,
    customerNumber: document.querySelector('input[placeholder="預かり車 ナンバー ※必須"]').value,
    reason: document.getElementById("reason").value,
    start: "",
    returnDate: "",
    distance: "",
    staff: document.getElementById("staff").value,
    sign: document.getElementById("sign").value,
    returnDistance: returnDistanceVal, // 返却時のkm
    status: "返却済み",
    rentCheck: "",
    returnCheck: "返却確認完了"
  };

  fetch(gasUrl, {
    method: "POST",
    body: new URLSearchParams(data)
  });

  message.innerHTML = "返却情報をスプレッドシートへ保存しました";
  message.style.color = "green";

});