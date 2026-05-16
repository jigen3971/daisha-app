const button = document.querySelector("button");

button.addEventListener("click", () => {

  const checks = document.querySelectorAll('input[type="checkbox"]');

  let allChecked = true;

  checks.forEach((check) => {
    if (!check.checked) {
      allChecked = false;
    }
  });

  let message = document.getElementById("message");

  if (!allChecked) {

    message.innerHTML = "※ 確認事項をすべてチェックしてください";
    message.style.color = "red";

    return;
  }

  message.innerHTML = "代車貸出確認を受付しました";
  message.style.color = "green";
  });

fetch("https://script.google.com/macros/s/AKfycbxAE7CZbHKhe02W2WTQF4NQxtNsL7w8yr6rb2t7ueyLtRoXbiSoYJRDXCZLweaoTrHc/exec")　
