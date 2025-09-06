export function initOTP(containerId, onComplete) {
  const container = document.getElementById(containerId);
  const inputs = Array.from(container.querySelectorAll("#otp-input"));

  if (!container || inputs.length === 0) return;

  inputs[0].focus();

  function getOTP() {
    return inputs.map(i => i.value)
  }

  function onlyDigit(char) {
    return /^[0-9]{1,2}$/.test(char);
  }

  inputs.forEach((input, idx) => {
    input.addEventListener("input", (e) => {
      const v = e.target.value.replace(/\D/g, "").slice(0, 2);
      e.target.value = v;

      if (v.length === 2 && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
        inputs[idx + 1].select();
      }

      const code = getOTP();
      if (code.length === inputs.length && !code.includes("")) {
        onComplete?.(code); 
      }
    });

    input.addEventListener("keydown", (e) => {
      const key = e.key;
      if (key === "Backspace") {
        if (!input.value && idx > 0) {
          inputs[idx - 1].focus();
          inputs[idx - 1].value = "";
        } else {
          input.value = "";
        }
        e.preventDefault();
        return;
      }

      if (key === "ArrowLeft" && idx > 0) {
        inputs[idx - 1].focus();
        e.preventDefault();
      }
      if (key === "ArrowRight" && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
        e.preventDefault();
      }

      const allow = ["Tab","ArrowLeft","ArrowRight","Delete","Backspace","Home","End"];
      if (!allow.includes(key) && !onlyDigit(key)) e.preventDefault();
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
      if (!text) return;
      let j = idx;
      for (const ch of text.slice(0, inputs.length - idx)) {
        inputs[j].value = ch;
        j++;
      }
      const nextEmpty = inputs.findIndex(i => i.value === "");
      if (nextEmpty !== -1) inputs[nextEmpty].focus();
      else inputs[inputs.length - 1].focus();
    });

    // Adiciona evento Enter apenas no último input
    if (idx === inputs.length - 1) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const code = getOTP();
          // Só permite se o último campo tiver 2 dígitos e todos preenchidos
          if (input.value.length === 2 && code.length === inputs.length && !code.includes("")) {
            onComplete?.(code);
          }
        }
      });
    }
  });

  return {
    getCode: getOTP,
    clear: () => inputs.forEach(i => i.value = "")
  };
}
