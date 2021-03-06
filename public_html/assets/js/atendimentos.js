import { sendRequest, showMessage } from "./utils.js";
/**
 * Listener para botão novo encaminhamento
 */
const addEncaminhamento = document.getElementById("add-encaminhamento");
addEncaminhamento.addEventListener("click", (e) => {
  abrirNovoEncaminhamento();
});

/**
 * Listener para cards de encaminhamentos
 */
const cardsEncaminhamentos = document.querySelectorAll(".card-encaminhamento");
cardsEncaminhamentos.forEach((card) => {
  card.addEventListener("click", (event) => abrirEncaminhamento(event));
});

/**
 * Listener para salvar Encaminhamento
 */
const btnSalvarEncaminhamento = document.querySelector(
  ".salvar-encaminhamento"
);
btnSalvarEncaminhamento.addEventListener("click", (e) =>
  salvarEncaminhamento(e)
);

const btnExcluirEncaminhamento = document.querySelector(
  ".excluir-encaminhamento"
);
btnExcluirEncaminhamento.addEventListener("click", (e) =>
  excluirEncaminhamento(e)
);

/**
 * Abre o modal para a vizualização
 * @param {DOM Element} element
 */
const abrirEncaminhamento = (element) => {
  let encaminhamento = element.currentTarget.getAttribute(
    "data-encaminhamento"
  );

  console.log(encaminhamento);

  const modalEncaminhamento = document.getElementById("encaminhamento");

  if (encaminhamento) {
    localStorage.setItem("encaminhamento", encaminhamento);
    modalEncaminhamento.classList.toggle("is-active");

    const dados = {
      acao: "Atendimentos/selecionarAtendimento",
      atendimento: encaminhamento,
    };
    sendRequest(dados)
      .then((response) => {
        console.log(response);
        preencherEncaminhamento(response);
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    showMessage(
      "Houve um erro!",
      "Não foi possível abrir o encaminhamento.",
      "warning",
      5000
    );
  }
};

/**
 * Efetua o preenchimento do modal com os parâmetros
 * @param {JSON} dados Dados sobre o encaminhamento
 */
const preencherEncaminhamento = (dados) => {
  dados.professores.map((professor) => {
    addChip(professor.nome, professor.id);
  });
  const estudante = document.querySelector("#aluno");
  estudante.value = dados.estudante.nome;
  estudante.setAttribute("data-aluno", dados.estudante.matricula);

  document.getElementById("queixa").value = dados.queixa;
  document.getElementById("intervencao").value = dados.intervencao;
};

/**
 * Esconde o modal, remove o aluno do modal atual e apaga os perfis selecionados
 * @param {DOM Element} modal Modal de Avaliação Diagnóstica
 */
const fecharAvaliacao = (modal) => {
  modal.classList.toggle("is-active");
  if (localStorage.getItem("encaminhamento")) {
    localStorage.removeItem("encaminhamento");
  }
  document.querySelector(".professores-selecionados").textContent = "";

  const estudante = document.querySelector("#aluno");
  estudante.setAttribute("data-aluno", "");
  estudante.value = "";
  document.getElementById("queixa").value = "";
  document.getElementById("intervencao").value;
};

/**
 * Adiciona a classe is-active para o modal selecionado
 */
const abrirNovoEncaminhamento = (e) => {
  const modalEncaminhamento = document.querySelector("#encaminhamento");
  modalEncaminhamento.classList.toggle("is-active");
};

/**
 * Listener para o fechamento do modal
 * @param {*} params
 */
const closeModal = (params) => {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    const closeBtn = modal.querySelector(".modal-close-btn");
    closeBtn.addEventListener("click", (evnt) => {
      fecharAvaliacao(modal);
    });
    const bgModal = modal.querySelector(".modal-background");
    bgModal.addEventListener("click", (evnt) => {
      fecharAvaliacao(modal);
    });
  });
};

/**
 * Exibe a quantidade de encaminhamentos
 */
const atualizarEncaminhamentos = () => {
  const cards = document.querySelectorAll(".card-encaminhamento");
  const qtdAvaliacoes = document.querySelector("#qtdEncaminhamentos");

  if (cards.length == 0) {
    qtdAvaliacoes.innerHTML = "Nenhum encaminhamento foi cadastrado";
  } else {
    qtdAvaliacoes.innerHTML =
      "Existem " + cards.length + " encaminhamentos salvos";
  }
};

/**
 * Adiciona auscultador nos chips de professor
 * @params {} null
 */
const deleteProfessor = () => {
  const chips = document.querySelectorAll(
    ".professores-selecionados > .chip > .chip-close"
  );

  chips.forEach((chip) => {
    chip.addEventListener("click", (event) => delChip(event));
  });
};

/**
 * Efetua a remoção de um elemento do DOM
 * @param {string} event DOM Element
 */
const delChip = (event) => {
  console.log("> Removendo o elemento!");
  event.target.parentElement.remove();
};

let autocompleteAluno = () => {
  // Quando tiver fazendo request pro server, utilizar essa função
  var api = function (inputValue) {
    const turma = localStorage.getItem("turmaAtual") || null;
    let dados = { acao: "Turmas/listarEstudantes", turma: turma };

    return sendRequest(dados)
      .then((estudantes) => {
        return estudantes.filter((estudante) => {
          return estudante.nome
            .toLowerCase()
            .startsWith(inputValue.toLowerCase());
        });
      })
      .then((filtrado) => {
        return filtrado.map((estudante) => {
          return { label: estudante.nome, value: estudante.matricula };
        });
      })
      .then((transformado) => {
        return transformado.slice(0, 5);
      });
  };

  var onSelect = function (state) {
    console.log("> O brabo tem nome");
    console.log(state);

    const input = document.querySelector("#aluno");
    input.setAttribute("data-aluno", state.value);
  };

  bulmahead("aluno", "aluno-menu", api, onSelect, 200);
};

let autocompleteProfessor = () => {
  let api = (inputValue) => {
    const turma = localStorage.getItem("turmaAtual");
    let dados = { acao: "Turmas/listarProfessoresAtuais", turma: turma };

    return sendRequest(dados)
      .then((professores) => {
        return professores.filter((professor) => {
          return professor.nome
            .toLowerCase()
            .startsWith(inputValue.toLowerCase());
        });
      })
      .then((filtrado) => {
        return filtrado.map((professor) => {
          return { label: professor.nome, value: professor.id };
        });
      })
      .then((transformado) => {
        return transformado.slice(0, 5);
      });
  };

  var onSelect = function (state) {
    console.log("> O brabo tem nome");
    console.log(state);

    addChip(state.label, state.value);

    const input = document.querySelector("#professores");
    input.value = "";
  };

  bulmahead("professores", "professores-menu", api, onSelect, 200);
};

/**
 *
 * @param {string} nome Texto adicionado ao elemento
 * @param {string} id Identificação do elemento
 */
const addChip = (nome, id) => {
  let chip = document.createElement("div");
  chip.classList.add("chip");
  chip.setAttribute("data-professor-id", id);

  chip.innerHTML += `
    <span class="chip-text">${nome}</span>
    <span class="chip-close">&times;</span>
  `;
  chip.addEventListener("click", (event) => delChip(event));

  const professoresSelecionados = document.querySelector(
    ".chips.professores-selecionados"
  );
  professoresSelecionados.insertAdjacentElement("afterbegin", chip);
};

/**
 *  Dispara a requisição para salvar o encaminhamento
 * @param {*} e
 */
const salvarEncaminhamento = (e) => {
  console.log("> Apertou");

  let dados = pegarDados();
  if (
    dados.estudante != "" &&
    dados.estudante != null &&
    dados.professores.length > 0 &&
    dados.queixa != "" &&
    dados.intervencao != "" &&
    dados.reuniao != ""
  ) {
    console.log(dados);

    sendRequest(dados)
      .then((response) => {
        console.log(response);
        fecharAvaliacao(document.getElementById("encaminhamento"));
        listarEncaminhamentos();
        showMessage(
          "Deu certo!",
          "O encaminhamento já foi salvo.",
          "success",
          4000
        );
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    showMessage(
      "Confira seus dados!",
      "Existe algum erro nos dados informados.",
      "warning",
      5000
    );
  }
};

/**
 * Obtem todos os dados para cadastro de encaminhamento
 */
const pegarDados = () => {
  const estudante = document.querySelector("#aluno").getAttribute("data-aluno");
  const professoresChips = document.querySelectorAll(
    ".professores-selecionados > div.chip"
  );
  console.log(estudante);
  let professores = [];
  professoresChips.forEach((professorChip) => {
    professores.push(professorChip.getAttribute("data-professor-id"));
  });

  const queixa = document.getElementById("queixa").value;
  const intervencao = document.getElementById("intervencao").value;

  const reuniao = localStorage.getItem("conselhoAtual") || "";

  const encaminhamento = localStorage.getItem("encaminhamento") || "";

  let dados = {
    acao: "Atendimentos/cadastrar",
    reuniao: reuniao,
    estudante: estudante,
    professores: professores,
    queixa: queixa,
    intervencao: intervencao,
  };

  if (encaminhamento !== "") {
    (dados.acao = "Atendimentos/alterar"), (dados.atendimento = encaminhamento);
  }

  return dados;
};

/**
 * Faz a requisição dos encaminhamento do conselho atual
 * @param {} params
 */
const listarEncaminhamentos = (params) => {
  document.querySelector(".encaminhamentos").innerHTML = "";
  atualizarEncaminhamentos();
  const reuniao = localStorage.getItem("conselhoAtual") || "";
  const dados = {
    acao: "Atendimentos/listarAtendimentosReuniao",
    reuniao: reuniao,
  };

  sendRequest(dados)
    .then((response) => {
      if (!response.message) {
        response.forEach((encaminhamento) =>
          addEncaminhamentoCard(encaminhamento)
        );
        atualizarEncaminhamentos();
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

/**
 * Gera os cards de encaminhamento
 * @param {JSON} dados Json contendo os dados necessários para gerar o card encaminhamento
 */
const addEncaminhamentoCard = (dados) => {
  let card = document.createElement("div");

  let classIntervencao = "";
  if (dados.intervencao === "Conversar com Responsável") {
    classIntervencao = "intervencao-resp";
  } else if (dados.intervencao === "Conversar com Aluno") {
    classIntervencao = "intervencao-aluno";
  } else if (dados.intervencao === "Conversar com Psicólogo") {
    classIntervencao = "intervencao-psi";
  } else {
    classIntervencao = "intervencao";
  }

  card.classList.add("cardbox", "card-encaminhamento", classIntervencao);
  card.setAttribute("data-encaminhamento", dados.encaminhamento);

  card.innerHTML += `
    <p class="subtitulo is-6">${dados.aluno.nome}</p>
    <p class="gray-text subtitulo is-6">${dados.intervencao}</p>
  `;
  card.addEventListener("click", (event) => abrirEncaminhamento(event));

  const encaminhamentos = document.querySelector(".encaminhamentos");

  encaminhamentos.appendChild(card);
};

/**
 * Requisita as ações de intervenção salvas no BD
 */
const listarAcoes = (params) => {
  sendRequest({ acao: "Acoes/listarAcoes" })
    .then((response) => {
      preencherAcoes(response);
    })
    .catch((err) => {
      console.error(err);
    });
};

/**
 * Preenche o select com os dados informados
 * @param {*} dados Acoes de Intervenção
 */
const preencherAcoes = (dados) => {
  const selectIntervencao = document.querySelector("select#intervencao");
  dados.forEach((acao) => {
    let option = document.createElement("option");
    option.setAttribute("value", acao.idAcao);
    option.appendChild(document.createTextNode(acao.nome));
    selectIntervencao.appendChild(option);
  });
};

const excluirEncaminhamento = (params) => {
  const encaminhamento = localStorage.getItem("encaminhamento") || "";

  if (encaminhamento) {
    const dados = {
      acao: "Atendimentos/excluirAtendimento",
      atendimento: encaminhamento,
    };

    sendRequest(dados)
      .then((response) => {
        showMessage(
          "Deu tudo certo!",
          "O encaminhamento foi excluído com sucesso.",
          "success",
          5000
        );
        fecharAvaliacao(document.querySelector("#encaminhamento"));
        listarEncaminhamentos();
        console.log(response);
      })
      .catch((err) => {
        showMessage(
          "Algo deu errado!",
          "Infelizmente não conseguimos excluir o encaminhamento.",
          "error",
          5000
        );
      });
  } else {
    showMessage(
      "Quase lá",
      "Verifique todos os dados, parece existir um erro neles.",
      "warning",
      5000
    );
  }
};

const obterInformacoesTurma = () => {
  const turma = localStorage.getItem("turmaAtual") || null;

  if (turma !== null) {
    const dados = { acao: "Turmas/informacoesTurma", turma: turma };

    sendRequest(dados)
      .then((response) => {
        console.log(response);
        apresentarInformacoesTurma(response);
      })
      .catch((err) => {
        console.error(err);
        showMessage(
          "Houve um erro!",
          "Não foi possível acessar as informações da turma.",
          "error",
          4000
        );
      });
  }
};

const apresentarInformacoesTurma = (dados) => {
  const cardInfoTurma = document.querySelector(".turma-info");

  cardInfoTurma.querySelector("#nome").innerHTML = dados.nome;
  cardInfoTurma.querySelector("#curso").innerHTML = dados.curso;
  cardInfoTurma.querySelector("#codigo").innerHTML = dados.codigo;
};

obterInformacoesTurma();
listarAcoes();
listarEncaminhamentos();
autocompleteAluno();
autocompleteProfessor();
deleteProfessor();
atualizarEncaminhamentos();

closeModal();
