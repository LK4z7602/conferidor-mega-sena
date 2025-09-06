import { initOTP } from "./services/otp.js";
import { getResultado } from "./services/resultado.js";

let otp;
let resultData = "";

document.addEventListener("DOMContentLoaded", () => {
  otp = initOTP("otp", () => {
    mostrarNaTela();
  });

  document.getElementById("search").addEventListener("click", () => {
    mostrarNaTela();
  });
});

function validarDezenas(dezenas) {
  return dezenas.every((d) => d !== "");
}

function formatarDezenas(dezenas) {
  return dezenas
    .slice()
    .sort((a, b) => a - b)
    .join(", ");
}

function gerarHTMLResultado(obj) {
  const acertosFormatado = obj.acertos.length
    ? formatarDezenas(obj.acertos)
    : "Nenhum acerto";

  let html = `
    <p><i class="fa-solid fa-ticket"></i> <strong>Concurso:</strong> ${
      obj.concurso
    }</p>
    <p><i class="fa-solid fa-bowling-ball"></i> <strong>Dezenas do Usuário:</strong> ${formatarDezenas(
      obj.dezenasDoUsuario
    )}</p>
    <p><i class="fa-solid fa-award"></i> <strong>Dezenas Sorteadas:</strong> ${formatarDezenas(
      obj.dezenasSorteadas
    )}</p>
    <p><i class="fa-solid fa-bullseye"></i> <strong>Acertos:</strong> ${acertosFormatado}</p>
  `;

  if (obj.acertos.length >= 4) {
    const indicePremio = { 4: 2, 5: 1, 6: 0 };
    const indice = indicePremio[obj.acertos.length];

    html +=
      `<p class="ganhou">Parabéns! Você acertou ${obj.acertos.length} dezenas e ganhou <strong>R$${obj.premiacoes[indice].valorPremio}</strong>` +
      `<p class="acumulado">Esse concurso (${obj.concurso}) ${
        obj.acumulou ? "acumulou, então não houve ganhadores de 6 dezenas" : ""
      }.</p></p>` +
      `<span>Procure uma casa lotérica para retirar seu prêmio.</span>`;
  }
  return html;
}

async function compararDezenas() {
  try {
    const resultadoMegasena = await getResultado();
    const dezenasSorteadas = resultadoMegasena.dezenas;
    const dezenasDoUsuario = otp.getCode();
    const acertos = [
      ...new Set(dezenasDoUsuario.filter((d) => dezenasSorteadas.includes(d))),
    ];
    return {
      concurso: resultadoMegasena.concurso,
      acertos,
      acumulou: resultadoMegasena.acumulou,
      dezenasSorteadas,
      dezenasDoUsuario,
      premiacoes: resultadoMegasena.premiacoes,
      valorProximoConcurso: resultadoMegasena.valorEstimadoProximoConcurso,
    };
  } catch (error) {
    alert("Erro ao buscar resultado. Tente novamente.");
    throw new Error(error);
    return null;
  }
}

async function mostrarNaTela() {
  const objetoResposta = await compararDezenas();

  if (!objetoResposta) return;

  if (!validarDezenas(objetoResposta.dezenasDoUsuario)) {
    alert("Por favor, preencha todas as dezenas com duas casas. (ex. 1 -> 01)");
    return;
  }

  resultData = gerarHTMLResultado(objetoResposta);

  atualizarTela();
}

const atualizarTela = () => {
  document.querySelector(".result-data").innerHTML = resultData;
};
