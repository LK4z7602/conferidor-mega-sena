import { initOTP } from "./otp.js";

let otp;

document.addEventListener("DOMContentLoaded", () => {
  otp = initOTP("otp", () => {});

  document.getElementById("search").addEventListener("click", () => {
    mostrarNaTela();
  });
});

async function getResultado(concurso = "latest") {
  let response = await fetch(
    `https://loteriascaixa-api.herokuapp.com/api/megasena/${concurso}`
  );

  return await response.json();
}

async function compararDezenas() {
  const resultadoMegasena = await getResultado();
  const dezenasSorteadas = resultadoMegasena.dezenas;
  const dezenasDoUsuario = otp.getCode();

  let acertos =
    [
      ...new Set(
        dezenasDoUsuario.filter((dezena) => dezenasSorteadas.includes(dezena))
      ),
    ].length > 0
      ? [
          ...new Set(
            dezenasDoUsuario.filter((dezena) =>
              dezenasSorteadas.includes(dezena)
            )
          ),
        ]
      : null;

  return {
    concurso: resultadoMegasena.concurso,
    acertos: acertos,
    dezenasSorteadas: dezenasSorteadas,
    dezenasDoUsuario: dezenasDoUsuario,
    premiacoes: resultadoMegasena.premiacoes,
    acumulou: resultadoMegasena.acumulou,
    valorProximoConcurso: resultadoMegasena.valorEstimadoProximoConcurso,
  };
}

async function mostrarNaTela() {
  const objetoResposta = await compararDezenas();

  if (objetoResposta.dezenasDoUsuario.includes("")) {
    alert("Por favor, preencha todas as dezenas.");
    return;
  }

  let resultData = "";

  resultData = `
    <p><strong>Concurso:</strong> ${objetoResposta.concurso}</p>
    <p><strong>Dezenas do Usuário:</strong> ${objetoResposta.dezenasDoUsuario.join(
      ", "
    )}</p>
    <p><strong>Dezenas Sorteadas:</strong> ${objetoResposta.dezenasSorteadas.join(
      ", "
    )}</p>
    <p><strong>Acertos:</strong> ${
      objetoResposta.acertos
        ? objetoResposta.acertos.join(", ")
        : "Nenhum acerto"
    }</p>
  `;

  if (objetoResposta.acertos.length >= 4) {
    const indicePremio = {
      4: 2,
      5: 1,
      6: 0,
    };

    const quantosAcertos = objetoResposta.acertos.length;
    const indice = indicePremio[quantosAcertos];

    resultData += `<p class="ganhou">Parabéns! Você acertou ${quantosAcertos} dezenas e ganhou R$${objetoResposta.premiacoes[indice].valorPremio}</p>
    <span>Procure uma casa lotérica para retirar seu prêmio.</span>`;

    console.log(objetoResposta.premiacoes);
  }

  let atualizarTela = () => {
    document.querySelector(".result-data").innerHTML = resultData;
  };

  atualizarTela();
}

/* o que fizemos 
  atté o sistema de mostrar na tela, faltando alguns ajustes para que o sistema nao de erro por conta:
  index.js:77 Uncaught (in promise) TypeError: Cannot read properties of null (reading 'length')
    at mostrarNaTela (index.js:77:30)

    é isso primeiro commit ez win

*/