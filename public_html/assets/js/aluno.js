import { sendRequest, getSearchParams } from "./utils.js";

const listener = () => {};

const obterInfoAluno = () => {
  const matricula = getMatricula();
  if (matricula) {
    const dados = {
      acao: "Alunos/obterInformacoes",
      aluno: matricula,
    };

    sendRequest(dados)
      .then((response) => {
        apresentarInfoAluno(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const apresentarInfoAluno = (info) => {
  const divAluno = document.querySelector(".info .aluno");
  divAluno.querySelector(".nome").innerHTML = info.aluno.nome;

  divAluno.querySelector(".turma").innerHTML = info.turma.nome;
  divAluno.querySelector(".curso").innerHTML = info.turma.curso;
  divAluno.querySelector(".matricula").innerHTML = info.aluno.matricula;
};

const obterEstatisticaAluno = () => {
  const matricula = getMatricula();

  if (matricula) {
    const dados = {
      acao: "Alunos/obterEstatisticas",
      aluno: matricula,
    };

    sendRequest(dados)
      .then((response) => {
        apresentarEstatisticas(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const apresentarEstatisticas = (estatisticas) => {
  const divEstatisticas = document.querySelector(".estatistica-aluno");
  divEstatisticas.querySelector(".coef-geral .resultado").innerHTML =
    estatisticas.coeficiente_geral;
  divEstatisticas.querySelector(".aprendizado .resultado").innerHTML =
    estatisticas.aprendizados;
  divEstatisticas.querySelector(".medidas .resultado").innerHTML =
    estatisticas.medidas;
};

const obterPrincipaisAvaliacoes = () => {
  const matricula = getMatricula();
  const dados = {
    acao: "Perfis/listarPerfisRelevantesMatricula",
    aluno: matricula,
  };

  sendRequest(dados)
    .then((response) => {
      apresentarPrincipaisAvaliacoes(response);
    })
    .catch((err) => {
      console.error(err);
    });
};

const apresentarPrincipaisAvaliacoes = (dados) => {
  if (dados[0].nome !== undefined) {
    const avaliacoes = document.getElementById("avaliacoes");
    dados.map((perfil) => avaliacoes.appendChild(gerarChip(perfil)));
  } else {
    const avaliacoes = document.getElementById("avaliacoes");
    avaliacoes.innerHTML = "Nenhuma avaliação foi encontrada.";
  }
};

const gerarChip = (perfil) => {
  const chip = document.createElement("span");
  chip.classList.add("chip");

  if (perfil.tipo === "1") {
    chip.classList.add("positivo");
  } else {
    chip.classList.add("negativo");
  }

  chip.innerText = perfil.nome;

  return chip;
};
const getMatricula = () => {
  const aluno = getSearchParams();

  let matricula;
  aluno.map((item) => {
    if ("key" in item && item.key === "matricula") {
      console.log(item);
      matricula = item.value;
    }
  });

  return matricula;
};

const obterMedidasDisciplinares = () => {
  const matricula = getMatricula();

  if (matricula) {
    const dados = {
      acao: "Alunos/obterMedidasDisciplinares",
      aluno: matricula,
    };

    sendRequest(dados)
      .then((response) => {
        apresentarMedidas(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const apresentarMedidas = (medidas) => {
  if (medidas.length > 0) {
    const lista_medidas = document.querySelector(".lista-medidas");
    medidas.map((medida) => {
      lista_medidas.appendChild(gerarMedida(medida));
    });
  } else {
    const lista_medidas = document.querySelector(".lista-medidas");
    let resultado = document.createElement("div");
    resultado.innerText = "Nenhuma medida foi encontrada.";
    resultado.classList.add("nenhum-resultado");
    lista_medidas.appendChild(resultado);
  }
};

const gerarMedida = (medida) => {
  const medidaDiv = document.createElement("div");
  medidaDiv.classList.add("medida");
  medidaDiv.setAttribute("data-cod-medida", medida.cod_medida);

  medidaDiv.addEventListener("click", (element) => abrirMedida(element));
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const data = new Date(medida.data);
  const dataFormatada = `${
    meses[data.getMonth()]
  } ${data.getFullYear().toString().substr(-2)}`;

  const descricao = medida.descricao.split(" ");
  console.log(descricao);

  let descricaoFormatada = descricao[0];
  if (descricao[1] !== undefined) {
    descricaoFormatada += " " + descricao[1];
  }
  const content = `
  <div class="descricao">
    <p class="nome">${descricaoFormatada}</p>
    <p class="data">${dataFormatada}</p>
  </div>
  `;

  medidaDiv.innerHTML = content;

  return medidaDiv;
};

const obterAprendizados = () => {
  const matricula = getMatricula();

  if (matricula) {
    const dados = { acao: "Alunos/obterAprendizados", aluno: matricula };

    sendRequest(dados)
      .then((response) => {
        apresentarAprendizados(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const apresentarAprendizados = (aprendizados) => {
  if (aprendizados.length > 0) {
    const lista_aprendizados = document.getElementById("lista-aprendizados");
    aprendizados.map((aprendizado) => {
      lista_aprendizados.appendChild(gerarAprendizado(aprendizado));
		});
  } else{
		const lista_aprendizados = document.getElementById("lista-aprendizados");
    let resultado = document.createElement("div");
    resultado.innerText = "Nenhuma medida foi encontrada.";
    resultado.classList.add("nenhum-resultado");
    lista_aprendizados.appendChild(resultado);
	}
};

const gerarAprendizado = (aprendizado) => {
	const aprendizadoDiv = document.createElement("div");
	aprendizadoDiv.classList.add("aprendizado");

	const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const data = new Date(medida.data);
  const dataFormatada = `${
    meses[data.getMonth()]
  } ${data.getFullYear().toString().substr(-2)}`;
	let content = `
		<div class="descricao">
			<p class="disciplina">${aprendizado.disciplina.nome}</p>
			<p class="data">${dataFormatada}</p>  
		</div>
	`
}

obterInfoAluno();
obterEstatisticaAluno();
obterPrincipaisAvaliacoes();
obterMedidasDisciplinares();
obterAprendizados();
listener();
