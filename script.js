const gasUrl = "https://script.google.com/macros/s/AKfycbxAE7CZbHKhe02W2WTQF4NQxtNsL7w8yr6rb2t7ueyLtRoXbiSoYJRDxCZLweaoTrHc/exec";

const rentButton = document.querySelector(".rent-btn");
const returnButton = document.querySelector(".return-btn");
const message = document.getElementById("message");

// --- 貸出ボタンの処理 ---
rentButton.addEventListener("click", () => {

  if (
    !document.getElementById("rentalCar").value ||
    !document.querySelector('input[placeholder="氏名 ※必須"]').value ||
    !document.querySelector('input[placeholder="TEL ※必須"]').value ||
    !document.querySelector('input[placeholder="預かり車 車種 ※必須"]').value ||
    !document.querySelector('input[placeholder="預かり車 ナンバー ※必須"]').value ||
    !document.getElementById("staff").value ||
    !document.getElementById("sign").value
  ){
    message.innerHTML = "※ 必須項目を入力してください";
    message.style.color = "red";
    return;
  }

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
    distance: document.querySelector('input[placeholder="km"]').value,
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

  // 【最重要の変更点】
  // 画面内のすべての「km」がついた入力欄（input）を取得し、その中から「最後に存在するkm欄」を確実に返却kmとして特定します。
  const distanceInputs = document.querySelectorAll('input[placeholder="km"]');
  const returnDistanceVal = distanceInputs.length > 0 ? distanceInputs[distanceInputs.length - 1].value : "";

  // 返却時の必須入力チェック
  if (
    !document.getElementById("rentalCar").value ||
    !document.querySelector('input[placeholder="氏名 ※必須"]').value ||
    !returnDistanceVal || // 特定した返却kmが空欄でないか厳格にチェック
    !document.getElementById("staff").value ||
    !document.getElementById("sign").value
  ){
    message.innerHTML = "※ 返却に必要な必須項目（氏名・返却km・スタッフ・サイン等）を入力してください";
    message.style.color = "red";
    return; // 入力漏れがあればここで止まり、ボタンは押せる状態を維持します
  }

  // 重複保存防止ガード（すべて正常に入力されていれば、ここを通過して即座にロック）
  if (returnButton.dataset.done === "true") {
    return;
  }

  // ボタンを即座にグレーアウト（無効化）して連打を防止します
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
    returnDistance: returnDistanceVal,
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