// Alternar a barra lateral de navegação
function toggleMenu() {
  const sidebar = document.getElementById("sidebarPesquisa");
  const overlay = document.getElementById("overlayMenu");
  
  sidebar.classList.toggle("ativo");
  overlay.classList.toggle("ativo");
}

// Função de cálculo do IMC
function calcularIMC() {
  const nome = document.getElementById("p1").value;
  const alturaCm = parseFloat(document.getElementById("p4").value);
  const peso = parseFloat(document.getElementById("p5").value);
  const divResultado = document.getElementById("resultado");
  const areaEscala = document.getElementById("area-escala");
  const marcador = document.getElementById("marcador-imc");

  if (!nome || isNaN(alturaCm) || isNaN(peso) || alturaCm <= 0 || peso <= 0) {
    divResultado.innerText = "Por favor, preencha todos os campos corretamente.";
    divResultado.style.display = "block";
    return;
  }

  const alturaM = alturaCm / 100;
  const imc = (peso / (alturaM * alturaM)).toFixed(2);

  let classificacao = "";
  let percentualEscala = 0;

  if (imc < 18.5) {
    classificacao = "Abaixo do peso";
    percentualEscala = 10;
  } else if (imc >= 18.5 && imc <= 24.9) {
    classificacao = "Peso normal";
    percentualEscala = 35;
  } else if (imc >= 25 && imc <= 29.9) {
    classificacao = "Excesso de peso";
    percentualEscala = 60;
  } else if (imc >= 30 && imc <= 34.9) {
    classificacao = "Obesidade Grau 1";
    percentualEscala = 80;
  } else if (imc >= 35 && imc <= 39.9) {
    classificacao = "Obesidade Grau 2";
    percentualEscala = 90;
  } else {
    classificacao = "Obesidade Grau 3";
    percentualEscala = 98;
  }

  divResultado.innerHTML = `Olá, <strong>${nome}</strong>! Seu IMC é <strong>${imc}</strong> (${classificacao}).`;
  divResultado.style.display = "block";

  areaEscala.classList.add("mostrar");
  marcador.style.left = `${percentualEscala}%`;

  salvarHistorico(nome, imc, classificacao);
}

function limparFormulario() {
  document.getElementById("formIMC").reset();
  document.getElementById("resultado").innerText = "";
  document.getElementById("resultado").style.display = "none";
  document.getElementById("area-escala").classList.remove("mostrar");
}

function salvarHistorico(nome, imc, classificacao) {
  const historicoSecao = document.getElementById("historico-secao");
  const listaHistorico = document.getElementById("lista-historico");

  historicoSecao.hidden = false;

  const li = document.createElement("li");
  li.innerText = `${nome}: IMC ${imc} (${classificacao})`;
  listaHistorico.appendChild(li);
}

function limparHistorico() {
  const listaHistorico = document.getElementById("lista-historico");
  const historicoSecao = document.getElementById("historico-secao");

  listaHistorico.innerHTML = "";
  historicoSecao.hidden = true;
}
