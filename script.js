const gasUrl = "https://script.google.com/macros/s/AKfycbxAE7CZbHKhe02W2WTQF4NQxtNsL7w8yr6rb2t7ueyLtRoXbiSoYJRDxCZLweaoTrHc/exec";

const rentButton = document.querySelector(".rent-btn");
const returnButton = document.querySelector(".return-btn");
const message = document.getElementById("message");

// --- 貸出ボタンの処理 ---
rentButton.addEventListener("click", () => {

  // 1. 貸出時の必須入力チェック
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

  // ★【最重要の修正】
  // 下の「返却時確認」を無視して、上の「確認事項【1】〜【12】」のチェックボックスだけを狙い撃ちで判定します。
  // HTML構造上の「確認事項」エリア（h2の次のブロック等）にあるチェックボックスのみを取得
  const checkSection = document.querySelector('h2:nth-of-type(4)').nextElementSibling; 
  // もし上記でうまくいかない場合の安全策として、「画面内の上から12個のチェックボックス」だけをループ判定します
  const checks = document.querySelectorAll('.check input[type="checkbox"]');
  
  // 上の12個の確認事項だけをチェック（返却用の下の6個は完全にスルーします）
  for (let i = 0; i < 12; i++) {
    if (checks[i] && !checks[i].checked) {
      message.innerHTML = "※ 確認事項をすべてチェックしてください";
      message.style.color = "red";
      return;
    }
  }

  // 3. 重複保存防止
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

  // 1. 返却時の必須入力チェック
  const distanceInputs = document.querySelectorAll('input[placeholder="km"]');
  const returnDistanceVal = distanceInputs[1] ? distanceInputs[1].value : "";

  if (
    !document.getElementById("rentalCar").value ||
    !document.querySelector('input[placeholder="氏名 ※必須"]').value ||
    !returnDistanceVal || 
    !document.getElementById("staff").value ||
    !document.getElementById("sign").value
  ){
    message.innerHTML = "※ 返却に必要な必須項目（氏名・返却km・スタッフ・サイン等）を入力してください";
    message.style.color = "red";
    return; 
  }

  // 2. 重複保存防止ガード
  if (returnButton.dataset.done === "true") {
    return;
  }

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