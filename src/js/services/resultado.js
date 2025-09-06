async function getResultado(concurso = "latest") {
  try {
    const response = await fetch(
      `https://loteriascaixa-api.herokuapp.com/api/megasena/${concurso}`
    );

    return await response.json();
  } catch (error) {
    console.log("Houve um erro ao buscar na API:", error);
    throw new Error("Não foi possível obter o resultado da Mega-Sena.");
  }
}

export { getResultado };
