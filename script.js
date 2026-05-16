const gasUrl = "https://script.google.com/macros/s/AKfycbxAE7CZbHKhe02W2WTQF4NQxtNsL7w8yr6rb2t7ueyLtRoXbiSoYJRDxCZLweaoTrHc/exec";

const rentButton = document.querySelector(".rent-btn");
const returnButton = document.querySelector(".return-btn");
const message = document.getElementById("message");

rentButton.addEventListener("click", () => {

  const data = {
    rentalCar: document.getElementById("rentalCar").value,
    name: document.querySelector('input[placeholder="氏名"]').value,
    tel: document.querySelector('input[placeholder="TEL"]').value,
    address: document.querySelector('input[placeholder="住所"]').value,
    customerCar: document.querySelector('input[placeholder="預かり車 車種"]').value,
    customerNumber: document.querySelector('input[placeholder="預かり車 ナンバー"]').value,
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

returnButton.addEventListener("click", () => {

  if(returnButton.disabled){
    return;
  }

  returnButton.disabled = true;
  returnButton.innerHTML = "返却処理済み";
  returnButton.classList.add("done");
  message.innerHTML = "返却処理中です。もう一度押さないでください。";
message.style.color = "orange";

  const distanceInputs = document.querySelectorAll('input[placeholder="km"]');

  const data = {
    rentalCar: document.getElementById("rentalCar").value,
    name: document.querySelector('input[placeholder="氏名"]').value,
    tel: document.querySelector('input[placeholder="TEL"]').value,
    address: document.querySelector('input[placeholder="住所"]').value,
    customerCar: document.querySelector('input[placeholder="預かり車 車種"]').value,
    customerNumber: document.querySelector('input[placeholder="預かり車 ナンバー"]').value,
    reason: document.getElementById("reason").value,
    start: "",
    returnDate: "",
    distance: "",
    staff: document.getElementById("staff").value,
    sign: document.getElementById("sign").value,
    returnDistance: distanceInputs[1].value,
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