const rentButton = document.querySelector(".rent-btn");

rentButton.addEventListener("click", () => {

  const message = document.getElementById("message");

  const data = {
    name: document.querySelector('input[placeholder="氏名"]').value,
    tel: document.querySelector('input[placeholder="TEL"]').value,
    address: document.querySelector('input[placeholder="住所"]').value,
    car: document.querySelector('input[placeholder="車種"]').value,
    number: document.querySelector('input[placeholder="ナンバー"]').value,
    color: document.querySelector('input[placeholder="色"]').value,
    reason: document.querySelector("select").value,
    start: document.querySelectorAll('input[type="datetime-local"]')[0].value,
    returnDate: document.querySelectorAll('input[type="datetime-local"]')[1].value,
    distance: document.querySelector('input[placeholder="km"]').value,
    staff: document.getElementById("staff").value,
    sign: document.getElementById("sign").value,
    returnDistance: "",
    rentCheck: "貸出確認完了",
    returnCheck: ""
  };

fetch("https://script.google.com/macros/s/AKfycbxAE7CZbHKhe02W2WTQF4NQxtNsL7w8yr6rb2t7ueyLtRoXbiSoYJRDxCZLweaoTrHc/exec", {
  method: "POST",
  body: new URLSearchParams(data)
});
  message.innerHTML = "貸出確認をスプレッドシートへ保存しました";
  message.style.color = "green";

});