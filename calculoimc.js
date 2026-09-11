// calculoimc.js - Two D for Life (TDFL)
// Calcula o IMC, classifica o resultado e guarda um pequeno histórico local.

const CHAVE_HISTORICO = "tdfl-historico-imc";

function calcularIMC() {
	const nome = document.getElementById("p1").value.trim();
	const dataNascimento = document.getElementById("p3").value;
	const alturaCm = parseFloat(document.getElementById("p4").value);
	const pesoKg = parseFloat(document.getElementById("p5").value);

	if (!nome || !dataNascimento || isNaN(alturaCm) || isNaN(pesoKg) || alturaCm <= 0 || pesoKg <= 0) {
		alert("Por favor, preencha todos os campos corretamente (nome, data de nascimento, altura e peso).");
		return;
	}

	// === Calcular idade ===
	const hoje = new Date();
	const nascimento = new Date(dataNascimento);

	if (nascimento > hoje) {
		alert("A data de nascimento não pode ser no futuro.");
		return;
	}

	let idade = hoje.getFullYear() - nascimento.getFullYear();
	const mes = hoje.getMonth() - nascimento.getMonth();
	if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
		idade--;
	}

	// === Calcular IMC ===
	const alturaM = alturaCm / 100;
	const imc = pesoKg / (alturaM * alturaM);

	// === Classificação do IMC ===
	const classificacao = classificarIMC(imc);

	// === Atualizar texto no resultado ===
	const resultado = document.getElementById("resultado");
	resultado.innerHTML = `
		<p>${escapeHTML(nome)}, você tem <strong>${idade} anos</strong>.</p>
		<p>Seu IMC é <strong>${imc.toFixed(2)}</strong>.</p>
		<p>Classificação: <strong>${classificacao}</strong></p>
		${idade < 18 ? "<p style='color:#8a1c1c'><strong>Atenção:</strong> o IMC pode não ser o melhor indicador para menores de idade.</p>" : ""}
	`;

	// === Mover marcador na barra de escala ===
	moverMarcador(imc);

	// === Salvar no histórico local (localStorage) ===
	salvarNoHistorico({ nome, idade, imc: imc.toFixed(2), classificacao, data: hoje.toLocaleDateString("pt-BR") });
}

function classificarIMC(imc) {
	if (imc < 18.5) return "Abaixo do peso";
	if (imc < 25) return "Peso normal";
	if (imc < 30) return "Excesso de peso";
	if (imc < 35) return "Obesidade grau 1";
	if (imc < 40) return "Obesidade grau 2";
	return "Obesidade grau 3 (mórbida)";
}

// Move o marcador ao longo da barra colorida, de acordo com o IMC.
// Faixa considerada: de 12 (bem abaixo do peso) até 45 (bem acima), limitada a 0-100%.
function moverMarcador(imc) {
	const area = document.getElementById("area-escala");
	const marcador = document.getElementById("marcador-imc");
	if (!area || !marcador) return;

	const IMC_MIN = 12;
	const IMC_MAX = 45;
	let percentual = ((imc - IMC_MIN) / (IMC_MAX - IMC_MIN)) * 100;
	percentual = Math.max(0, Math.min(100, percentual));

	area.classList.add("mostrar");
	marcador.style.left = percentual + "%";
}

function limparFormulario() {
	document.getElementById("formIMC").reset();
	document.getElementById("resultado").innerHTML = "";
	document.getElementById("area-escala").classList.remove("mostrar");
}

// === Histórico local (funciona offline, guardado no próprio navegador) ===
function salvarNoHistorico(registro) {
	const historico = obterHistorico();
	historico.unshift(registro);
	const limitado = historico.slice(0, 5); // guarda só os 5 últimos

	try {
		localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(limitado));
	} catch (erro) {
		console.warn("Não foi possível salvar o histórico localmente:", erro);
	}

	renderizarHistorico();
}

function obterHistorico() {
	try {
		const dados = localStorage.getItem(CHAVE_HISTORICO);
		return dados ? JSON.parse(dados) : [];
	} catch (erro) {
		return [];
	}
}

function renderizarHistorico() {
	const historico = obterHistorico();
	const secao = document.getElementById("historico-secao");
	const lista = document.getElementById("lista-historico");
	if (!secao || !lista) return;

	if (historico.length === 0) {
		secao.hidden = true;
		return;
	}

	secao.hidden = false;
	lista.innerHTML = historico
		.map(
			(item) =>
				`<li>${item.data} — ${escapeHTML(item.nome)}: IMC ${item.imc} (${item.classificacao})</li>`
		)
		.join("");
}

function limparHistorico() {
	localStorage.removeItem(CHAVE_HISTORICO);
	renderizarHistorico();
}

// Evita que texto digitado pelo usuário quebre o HTML do resultado/histórico
function escapeHTML(texto) {
	const div = document.createElement("div");
	div.textContent = texto;
	return div.innerHTML;
}

// === Formulário de feedback (sem back-end: apenas confirma o envio) ===
document.addEventListener("DOMContentLoaded", () => {
	renderizarHistorico();

	const formFeedback = document.getElementById("formFeedback");
	if (formFeedback) {
		formFeedback.addEventListener("submit", (evento) => {
			evento.preventDefault();
			alert("Obrigado pelo seu feedback! (Este formulário é apenas uma demonstração e ainda não envia dados a um servidor.)");
			formFeedback.reset();
		});
	}
});
