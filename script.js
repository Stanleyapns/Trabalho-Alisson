// Base de dados pronta
const dadosPesquisa = {
  mediaNacionalDiaria: 4, // Média de horas que o brasileiro passa nas redes
  alertaSaude: 6,         // Limite recomendado por especialistas
  sugestoes: [
    { limite: 2, mensagem: "Parabéns! Seu uso está equilibrado. Você tem mais tempo livre para hobbies e descanso." },
    { limite: 5, mensagem: "Atenção. Você está na média nacional, mas já gasta quase um dia inteiro da sua semana olhando para a tela." },
    { limite: 24, mensagem: "Cuidado! Seu uso é considerado muito alto. Isso pode afetar seu sono, foco e saúde mental. Que tal um detox digital?" }
  ]
};

const campoHoras = document.getElementById("horas");
const botao = document.getElementById("botao");
const itens = document.getElementById("itens");
const selo = document.getElementById("selo");
const resultado = document.getElementById("resultado");

// Formata número: 1 casa decimal no máximo e vírgula brasileira
function formatar(numero) {
  return String(Math.round(numero * 10) / 10).replace(".", ",");
}

// Cria uma linha da nota: "Descrição ........ valor"
function criarItem(descricao, valor, atraso, classeExtra) {
  const linha = document.createElement("div");
  linha.className = "item " + (classeExtra || "");
  linha.style.animationDelay = atraso + "s";

  const nome = document.createElement("span");
  nome.innerText = descricao;

  const pontos = document.createElement("span");
  pontos.className = "pontos";

  const numero = document.createElement("span");
  numero.className = "valor";
  numero.innerText = valor;

  linha.appendChild(nome);
  linha.appendChild(pontos);
  linha.appendChild(numero);
  itens.appendChild(linha);
}

// 1. Capturar o clique (e o Enter)
botao.addEventListener("click", calcular);
campoHoras.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") calcular();
});

function calcular() {
  // 2. Pegar o valor digitado
  const horasDia = parseFloat(campoHoras.value);

  // limpar a nota anterior
  itens.innerHTML = "";
  selo.innerHTML = "";
  resultado.className = "";

  // Validação
  if (isNaN(horasDia) || horasDia < 0 || horasDia > 24) {
    resultado.classList.add("erro");
    resultado.innerText = "Erro de emissão: digite um número de horas entre 0 e 24.";
    return;
  }

  // 3. Contas simples
  const horasSemana = horasDia * 7;
  const horasMes = horasDia * 30;
  const horasAno = horasDia * 365;
  const diasInteirosAno = horasAno / 24;

  // 4. Condicionais: comparar com a média nacional
  let comparacao;
  if (horasDia > dadosPesquisa.mediaNacionalDiaria) {
    comparacao = "Isso é mais do que a média nacional de " + dadosPesquisa.mediaNacionalDiaria + " horas por dia.";
  } else if (horasDia < dadosPesquisa.mediaNacionalDiaria) {
    comparacao = "Isso é menos do que a média nacional de " + dadosPesquisa.mediaNacionalDiaria + " horas por dia.";
  } else {
    comparacao = "Isso é exatamente a média nacional de " + dadosPesquisa.mediaNacionalDiaria + " horas por dia.";
  }

  // Mensagem da base de dados: primeira faixa cujo limite cobre o valor
  let mensagem = "";
  for (let i = 0; i < dadosPesquisa.sugestoes.length; i++) {
    if (horasDia <= dadosPesquisa.sugestoes[i].limite) {
      mensagem = dadosPesquisa.sugestoes[i].mensagem;
      break;
    }
  }

  let extra = "";
  if (horasDia >= dadosPesquisa.alertaSaude) {
    extra = " Você passou do limite de " + dadosPesquisa.alertaSaude + " horas recomendado por especialistas.";
  }

  // Carimbo conforme a faixa
  let textoCarimbo = "EQUILIBRADO";
  let classeCarimbo = "ok";
  if (horasDia > 5) {
    textoCarimbo = "USO ALTO";
    classeCarimbo = "alto";
  } else if (horasDia > 2) {
    textoCarimbo = "NA MÉDIA";
    classeCarimbo = "medio";
  }

  // 5. Exibir na tela (a nota "imprime" linha por linha)
  criarItem("Por dia", formatar(horasDia) + " h", 0);
  criarItem("Por semana (x7)", formatar(horasSemana) + " h", 0.15);
  criarItem("Por mês (x30)", formatar(horasMes) + " h", 0.3);
  criarItem("Por ano (x365)", formatar(horasAno) + " h", 0.45);
  criarItem("TOTAL EM DIAS/ANO", formatar(diasInteirosAno) + " dias", 0.6, "total");

  const carimbo = document.createElement("div");
  carimbo.className = "carimbo " + classeCarimbo;
  carimbo.innerText = textoCarimbo;
  selo.appendChild(carimbo);

  resultado.innerText =
    "Você passa " + formatar(horasSemana) + " horas por semana nas redes sociais. " +
    comparacao + " " + mensagem + extra;
}
