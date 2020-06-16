import { sendRequest, showMessage } from "./utils.js";

// const addCoordenador = document.getElementById("add-coordenador");
// addCoordenador.addEventListener("click", (e) => abrirNovoCoordenador());

// const abrirNovoCoordenador = (e) => {
//   const modalCoordenador = document.getElementById("modal-coordenador");
//   modalCoordenador.classList.toggle("is-active");
// };

const btnSalvarCoordenador = document.querySelector(".salvar-coordenador");
btnSalvarCoordenador.addEventListener("click", (e) => salvarCoordenador(e));

const btnSalvarConselheiro = document.querySelector(".salvar-conselheiro");
btnSalvarConselheiro.addEventListener("click", (e) => salvarConselheiro(e));

const btnSalvarRepresentante = document.querySelector(".salvar-representante");
btnSalvarRepresentante.addEventListener("click", (e) => salvarRepresentante(e));

const btnSalvarViceRepresentante = document.querySelector(
  ".salvar-vice-representante"
);
btnSalvarViceRepresentante.addEventListener("click", (e) =>
  salvarViceRepresentante(e)
);

/**
 * Abre o modal com as informações do coordenador
 * @param {DOM element} element Card de coordenador clicado
 */
const abrirCoordenador = (element) => {
  let curso = element.currentTarget.getAttribute("data-curso");
  let coordenadorAtual = element.currentTarget.getAttribute("data-coordenador");

  localStorage.setItem("cursoAtual", curso);
  localStorage.setItem("coordenadorAtual", coordenadorAtual);

  console.log("Abrindo Coordenador!");

  const modalCoordenador = document.getElementById("modal-coordenador");
  modalCoordenador.classList.toggle("is-active");

  const dados = {
    acao: "Coordenadores/selecionarCoordenador",
    curso: curso,
  };

  sendRequest(dados)
    .then((response) => {
      console.log(response);
      preencherCoordenador(response.coordenador, response.curso);
    })
    .catch((err) => {
      console.error(err);
    });
};

const fecharCoordenador = () => {
  console.log("> Fechando Coordenador");
  const modal = document.getElementById("modal-coordenador");
  modal.classList.toggle("is-active");

  localStorage.removeItem("cursoAtual");
  localStorage.removeItem("coordenadorAtual");

  const coordenadorInput = document.getElementById("coordenador");
  coordenadorInput.value = "";
  coordenadorInput.setAttribute("data-coordenador", "");

  document.getElementById("email-coordenador").value = "";
  document.getElementById("coordenacao-curso").innerHTML = "";
  document.getElementById("senha-coordenador").value = "";
};

const preencherCoordenador = (coordenador, curso) => {
  if (coordenador.length != 0) {
    const coordenadorInput = document.getElementById("coordenador");
    coordenadorInput.value = coordenador.nome;
    coordenadorInput.setAttribute("data-coordenador", coordenador.pessoa);

    document.getElementById("email-coordenador").value = coordenador.login;
  }
  document.getElementById("coordenacao-curso").innerHTML = curso.nome;
};

/**
 * Abre o modal com as informações do conselheiro
 * @param {DOM element} element Card de conselheiro clicado
 */
const abrirConselheiro = (element) => {
  console.log("> Abrindo conselheiro!");
  const modalConselheiro = document.getElementById("modal-conselheiro");
  modalConselheiro.classList.toggle("is-active");

  let turmaAtual = element.currentTarget.getAttribute("data-turma");
  localStorage.setItem("turmaAtual", turmaAtual);

  let conselheiroAtual = element.currentTarget.getAttribute("data-conselheiro");
  localStorage.setItem("conselheiroAtual", conselheiroAtual);
  console.log(turmaAtual);

  const dados = {
    acao: "Conselheiros/selecionarConselheiro",
    turma: turmaAtual,
  };

  sendRequest(dados)
    .then((response) => {
      console.log(response);
      preencherConselheiro(response.conselheiro, response.turma);
    })
    .catch((err) => {
      console.error(err);
    });
};

const fecharConselheiro = () => {
  console.log("> Fechando conselheiro");
  const modal = document.getElementById("modal-conselheiro");
  modal.classList.toggle("is-active");

  localStorage.removeItem("turmaAtual");

  const conselheiroInput = document.getElementById("conselheiro");
  conselheiroInput.value = "";
  conselheiroInput.setAttribute("data-conselheiro", "");

  document.getElementById("email-conselheiro").value = "";

  document.getElementById("conselheiro-turma").innerHTML = "";
  document.getElementById("conselheiro-curso").innerHTML = "";
};

const preencherConselheiro = (conselheiro, turma) => {
  if (conselheiro.length != 0) {
    const conselheiroInput = document.getElementById("conselheiro");
    conselheiroInput.value = conselheiro.nome;
    conselheiroInput.setAttribute("data-conselheiro", conselheiro.pessoa);

    document.getElementById("email-conselheiro").value = conselheiro.login;
  }
  document.getElementById("conselheiro-turma").innerHTML = turma.nome;
  document.getElementById("conselheiro-curso").innerHTML = turma.curso;
};

/**
 * Listener para o fechamento do modal
 * @param {*} params
 */
const closeModal = (params) => {
  const modalCoordenador = document.getElementById("modal-coordenador");
  const modalConselheiro = document.getElementById("modal-conselheiro");
  const modalRepresentante = document.getElementById("modal-representante");

  let closeBtn = modalCoordenador.querySelector(".modal-close-btn");
  closeBtn.addEventListener("click", (event) => fecharCoordenador());
  let bgModal = modalCoordenador.querySelector(".modal-background");
  bgModal.addEventListener("click", (event) => fecharCoordenador());

  closeBtn = modalConselheiro.querySelector(".modal-close-btn");
  closeBtn.addEventListener("click", (event) => fecharConselheiro());
  bgModal = modalConselheiro.querySelector(".modal-background");
  bgModal.addEventListener("click", (event) => fecharConselheiro());

  closeBtn = modalRepresentante.querySelector(".modal-close-btn");
  closeBtn.addEventListener("click", (event) => fecharRepresentante());
  bgModal = modalRepresentante.querySelector(".modal-background");
  bgModal.addEventListener("click", (event) => fecharRepresentante());
};

/**
 * Listener para listar as sugestões de coordenadores
 */
let autocompleteCoordenador = () => {
  var api = function (inputValue) {
    const dados = { acao: "Servidores/listarServidores" };

    return sendRequest(dados)
      .then((servidores) => {
        return servidores.filter((servidor) => {
          return servidor.nome
            .toLowerCase()
            .startsWith(inputValue.toLowerCase());
        });
      })
      .then((filtrado) => {
        return filtrado.map((servidor) => {
          return { label: servidor.nome, value: servidor.codigo };
        });
      })
      .then((transformado) => {
        return transformado.slice(0, 5);
      });
  };

  var onSelect = function (state) {
    console.log("> O brabo tem nome");
    console.log(state);

    const input = document.querySelector("#coordenador");
    input.setAttribute("data-coordenador", state.value);
    document.getElementById("email-coordenador").value = "";
  };

  bulmahead("coordenador", "coordenador-menu", api, onSelect, 200);
};

const autocompleteConselheiro = () => {
  var api = function (inputValue) {
    const dados = { acao: "Servidores/listarServidores" };

    return sendRequest(dados)
      .then((servidores) => {
        return servidores.filter((servidor) => {
          return servidor.nome
            .toLowerCase()
            .startsWith(inputValue.toLowerCase());
        });
      })
      .then((filtrado) => {
        return filtrado.map((servidor) => {
          return { label: servidor.nome, value: servidor.codigo };
        });
      })
      .then((transformado) => {
        return transformado.slice(0, 5);
      });
  };

  var onSelect = function (state) {
    console.log("> O brabo tem nome");
    console.log(state);

    const input = document.querySelector("#conselheiro");
    input.setAttribute("data-conselheiro", state.value);
    document.getElementById("email-conselheiro").value = "";
  };

  bulmahead("conselheiro", "conselheiro-menu", api, onSelect, 200);
};

const autocompleteRepresentante = () => {
  var api = function (inputValue) {
    const turma = localStorage.getItem("turmaAtual");

    if (turma) {
      const dados = { acao: "Turmas/listarEstudantes", turma: turma };
      return sendRequest(dados)
        .then((alunos) => {
          return alunos.filter((aluno) => {
            return aluno.nome
              .toLowerCase()
              .startsWith(inputValue.toLowerCase());
          });
        })
        .then((filtrado) => {
          return filtrado.map((aluno) => {
            return { label: aluno.nome, value: aluno.matricula };
          });
        })
        .then((transformado) => {
          return transformado.slice(0, 5);
        });
    }
  };

  var onSelect = function (state) {
    console.log("> O brabo tem nome");
    console.log(state);

    const input = document.querySelector("#representante");
    input.setAttribute("data-representante", state.value);
  };

  const onSelectVice = (state) => {
    console.log("> O brabo tem nome vice");
    console.log(state);

    const input = document.querySelector("#vice-representante");
    input.setAttribute("data-vice-representante", state.value);
  };
  bulmahead("representante", "representante-menu", api, onSelect, 200);
  bulmahead(
    "vice-representante",
    "vice-representante-menu",
    api,
    onSelectVice,
    200
  );
};

/**
 * Dispara a requisição para salvar o coordenador
 * @param {*} e
 */
const salvarCoordenador = (e) => {
  console.log("> Salvando Coordenador");

  let dados = pegarDados();

  console.log(dados);

  if (
    dados.coordenador == null &&
    dados.acao !== "Coordenadores/alterarSenha"
  ) {
    showMessage(
      "Confira seus dados!",
      "É necessário informar o novo coordenador",
      "warning",
      4000
    );
    // return false;
  }

  sendRequest(dados)
    .then((response) => {
      console.log("Deu certo hein!");
      console.log(response);
      showMessage(
        "Deu certo!",
        "As alterações foram realizadas com sucesso!",
        "success",
        4000
      );
      solicitarCursos();
      fecharCoordenador();
    })
    .catch((err) => {
      console.error(err);
      showMessage(
        "Houve um erro",
        "Não foi possível salvar as alterações, verifique os dados.",
        "warning",
        4000
      );
    });
};

/**
 * Função para obtenção dos dados do coordenador
 */
const pegarDados = () => {
  const coordenadorNovo = document
    .getElementById("coordenador")
    .getAttribute("data-coordenador");
  const senha = document.getElementById("senha-coordenador").value;
  const curso = localStorage.getItem("cursoAtual");
  const email = document.getElementById("email-coordenador").value;

  const coordenadorAtual = localStorage.getItem("coordenadorAtual") || "";

  let dados = {
    codigo: coordenadorAtual,
    email: email,
    senha: senha,
  };

  // Caso de trocar a senha
  dados.acao = "Coordenadores/alterarSenha";

  console.log(coordenadorAtual);
  // Caso não exista coordenador atual
  if (coordenadorAtual === "") {
    dados = {
      curso: curso,
      coordenador: coordenadorNovo,
      email: email,
      senha: senha,
    };
    dados.acao = "Coordenadores/cadastrar";
  }

  // Caso o novo id seja diferente do antigo
  console.log("CN", coordenadorNovo);
  console.log("CA", coordenadorAtual);

  if (coordenadorNovo !== coordenadorAtual && coordenadorAtual !== "") {
    dados = {
      curso: curso,
      coordenador: coordenadorNovo,
      email: email,
      senha: senha,
    };
    dados.acao = "Coordenadores/atualizarCoordenador";
  }
  return dados;
};

const salvarConselheiro = () => {
  console.log("> Salvando Conselheiro");

  let dados = pegarDadosConselheiro();

  console.log(dados);

  if (dados.pessoa == null && dados.acao !== "Conselheiros/alterarSenha") {
    showMessage(
      "Confira seus dados!",
      "É necessário informar o novo coordenador",
      "warning",
      4000
    );
  }

  sendRequest(dados)
    .then((response) => {
      console.log(response);
      showMessage(
        "Deu certo!",
        "As alterações foram realizadas com sucesso!",
        "success",
        4000
      );
      solicitarConselheiros();
      fecharConselheiro();
    })
    .catch((err) => {
      console.error(err);
      showMessage(
        "Houve um erro",
        "Não foi possível salvar as alterações, verifique os dados,",
        "warning",
        4000
      );
    });
};

const pegarDadosConselheiro = (params) => {
  const conselheiroNovo = document
    .getElementById("conselheiro")
    .getAttribute("data-conselheiro");
  const senha = document.getElementById("senha-conselheiro").value;
  const turma = localStorage.getItem("turmaAtual");
  const email = document.getElementById("email-conselheiro").value;

  const conselheiroAtual = localStorage.getItem("conselheiroAtual") || "";

  let dados = {
    codigo: conselheiroAtual,
    email: email,
    senha: senha,
  };

  dados.acao = "Conselheiros/alterarSenha";

  if (conselheiroAtual === "") {
    dados = {
      turma: turma,
      pessoa: conselheiroNovo,
      email: email,
      senha: senha,
    };
    dados.acao = "Conselheiros/cadastrar";
  }

  console.log("CN", conselheiroNovo);
  console.log("CA", conselheiroAtual);
  if (conselheiroNovo !== conselheiroAtual && conselheiroAtual !== "") {
    dados = {
      turma: turma,
      pessoa: conselheiroNovo,
      email: email,
      senha: senha,
    };
    dados.acao = "Conselheiros/atualizarConselheiro";
  }

  return dados;
};

/**
 * Adiciona um card de curso na tela
 * @param {JSON} curso
 */
const addCursoCard = (curso) => {
  let card = document.createElement("div");

  let classCurso = "";
  if (curso.nome === "Informática para Internet") {
    classCurso = "is-info";
  } else if (curso.nome === "Meio Ambiente") {
    classCurso = "is-amb";
  } else {
    classCurso = "is-agro";
  }

  card.classList.add("cardbox", "card-coordenador", classCurso);
  card.setAttribute("data-curso", curso.codigo);

  let texto = curso.coordenador.nome || "";
  let codigoCoordenador = curso.coordenador.pessoa || "";

  card.setAttribute("data-coordenador", codigoCoordenador);

  card.innerHTML += `
    <p class="gray-text">${curso.nome}</p>
    <p class="nome">${texto}</p>
  `;

  card.addEventListener("click", (e) => abrirCoordenador(e));

  const coordenadoresDiv = document.getElementById("coordenadores");
  coordenadoresDiv.appendChild(card);
};

/**
 * Requisição para obter os cursos
 */
const solicitarCursos = () => {
  const dados = { acao: "Cursos/listarCursos" };
  sendRequest(dados)
    .then((response) => {
      if (response.length > 0) {
        document.getElementById("coordenadores").innerHTML = "";
        response.map((curso) => addCursoCard(curso));
      } else {
        const coordenadoresDiv = documet.getElementById("coordenadores");
        const msg = document.createElement("div");
        msg.classList.add("nenhum-resultado");
        msg.innerHTML = "Nenhum curso foi encontrado!";

        coordenadoresDiv.append(msg);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

/**
 * Adiciona um card de turma na tela
 * @param {JSON} turma
 */
const addTurmaCard = (turma) => {
  let card = document.createElement("div");

  let classCurso = "";
  if (turma.curso === "Informática para Internet") {
    classCurso = "is-info";
  } else if (turma.curso === "Meio Ambiente") {
    classCurso = "is-amb";
  } else {
    classCurso = "is-agro";
  }

  let classCard = "";
  let evento = null;
  let divCards = "";
  let content = `
  <p class="subtitulo is-7 gray-text">${turma.curso}</p>
  <p class="subtitulo is-6">${turma.nome}</p>
`;
  if ("representantes" in turma) {
    classCard = "card-representantes";
    evento = abrirRepresentante;
    divCards = "representantes";
  }

  if ("conselheiro" in turma) {
    classCard = "card-conselheiro";
    evento = abrirConselheiro;
    divCards = "conselheiros";
    let conselheiro = turma.conselheiro.nome || "";
    content = `
      <p class="subtitulo is-8 gray-text">${turma.curso}</p>
      <p class="subtitulo is-7">${conselheiro}</p>
      <p class="subtitulo is-8 gray-text">${turma.nome}</p>
    `;

    conselheiro = turma.conselheiro.pessoa || "";
    card.setAttribute("data-conselheiro", conselheiro);
  }

  card.classList.add("cardbox", classCard, classCurso);
  card.setAttribute("data-turma", turma.codigo);

  card.innerHTML = content;

  card.addEventListener("click", (e) => evento(e));
  divCards = document.getElementById(divCards);
  divCards.appendChild(card);
};

/**
 * Requisição para obter os representantes
 */
const solicitarRepresentantes = () => {
  const dados = { acao: "Turmas/listarTurmasLideres" };

  sendRequest(dados)
    .then((response) => {
      if (response.length > 0) {
        document.getElementById("representantes").innerHTML = "";
        response.map((turma) => addTurmaCard(turma));
      } else {
        const representantesDiv = document.getElementById("representantes");
        const msg = document.createElement("div");
        msg.classList.add("nenhum-resultado");
        msg.innerHTML = "Nenhum curso foi encontrado!";

        representantesDiv.append(msg);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

/**
 * Requisição para obter os conselheiros
 */
const solicitarConselheiros = () => {
  const dados = { acao: "Turmas/listarTurmasConselheiros" };

  sendRequest(dados)
    .then((response) => {
      if (response.length > 0) {
        document.getElementById("conselheiros").innerHTML = "";
        response.map((conselheiro) => addTurmaCard(conselheiro));
      } else {
        const conselheirosDiv = document.getElementById("conselheiros");
        const msg = document.createElement("div");
        msg.classList.add("nenhum-resultado");
        msg.innerHTML = "Nenhum conselheiro foi encontrado!";

        conselheirosDiv.appendChild(msg);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

// Representantes

/**
 * Abre o modal com as informações do representante
 * @param {DOM element} element Card de representante clicado
 */
const abrirRepresentante = (element) => {
  const modalRepresentante = document.getElementById("modal-representante");
  modalRepresentante.classList.toggle("is-active");

  let turmaAtual = element.currentTarget.getAttribute("data-turma");

  localStorage.setItem("turmaAtual", turmaAtual);

  if (turmaAtual) {
    const dados = {
      acao: "Turmas/selecionarRepresentantes",
      turma: turmaAtual,
    };

    sendRequest(dados)
      .then((response) => {
        console.log(response);
        preencherRepresentante(response.representante);
        preencherViceRepresentante(response.vice_representante);
        preencherTurma(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const fecharRepresentante = () => {
  console.log("> Fechando Coordenador");
  const modal = document.getElementById("modal-representante");
  modal.classList.toggle("is-active");

  localStorage.removeItem("turmaAtual");

  const representanteInput = document.getElementById("representante");
  const viceInput = document.getElementById("vice-representante");

  representanteInput.value = "";
  representanteInput.setAttribute("data-representante", "");
  document.getElementById("senha-representante").value = "";

  viceInput.value = "";
  viceInput.setAttribute("data-vice-representante", "");
  document.getElementById("senha-vice-representante").value = "";
};

const preencherRepresentante = (representante) => {
  console.log("> Preenchendo Representante");
  localStorage.setItem("representanteAtual", "");

  if (representante.length != 0) {
    const representanteInput = document.getElementById("representante");
    representanteInput.value = representante.nome;
    representanteInput.setAttribute("data-representante", representante.codigo);
    console.log(representante);
    localStorage.setItem("representanteAtual", representante.codigo);
  }
};

const preencherViceRepresentante = (vice) => {
  localStorage.setItem("viceAtual", "");
  if (vice.length != 0) {
    const viceInput = document.getElementById("vice-representante");
    viceInput.value = vice.nome;
    viceInput.setAttribute("data-vice-representante", vice.codigo);

    localStorage.setItem("viceAtual", vice.codigo);
  }
};

const preencherTurma = (turma) => {
  const titulo = document.querySelector(
    "#modal-representante .modal-card-title"
  );
  titulo.innerHTML = turma.nome + " - " + turma.curso;
};

const salvarRepresentante = () => {
  console.log("> Salvando Representante");
  let dados = pegarDadosRepresentante();

  console.log(dados);

  if (dados.senha === "") {
    showMessage(
      "Confira seus dados",
      "É necessário informar uma nova senha",
      "warning",
      4000
    );
  }else{
    sendRequest(dados)
      .then((response) => {
        console.log("Deu certo hein!");
        console.log(response);
        showMessage(
          "Deu certo!",
          "As alterações foram realizadas com sucesso!",
          "success",
          4000
        );
        solicitarRepresentantes();
      })
      .catch((err) => {
        console.error(err);
        showMessage(
          "Houve um erro!",
          "Não foi possível efetuar as alterações.",
          "error",
          5000
        );
      });
  }

};

const pegarDadosRepresentante = () => {
  const representanteNovo = document
    .getElementById("representante")
    .getAttribute("data-representante");
  const senha = document.getElementById("senha-representante").value;
  const turma = localStorage.getItem("turmaAtual");

  const representanteAtual = localStorage.getItem("representanteAtual") || "";

  let dados = {
    matricula: representanteAtual,
    turma: turma,
    senha: senha,
  };

  dados.acao = "Representantes/alterarSenha";

  if (representanteAtual === "") {
    dados = {
      turma: turma,
      matricula: representanteNovo,
      senha: senha,
    };

    dados.acao = "Representantes/cadastrar";
  }

  console.log("RN", representanteNovo);
  console.log("RA", representanteAtual);

  if (representanteNovo !== representanteAtual && representanteAtual !== "") {
    dados = {
      matricula: representanteNovo,
      turma: turma,
      senha: senha,
    };
    dados.acao = "Representantes/atualizarRepresentante";
  }

  return dados;
};
// Representantes

// Vice

const salvarViceRepresentante = () => {
  console.log("> Salvando ViceRepresentante");
  let dados = pegarDadosViceRepresentante();

  console.log(dados);

  if (dados.senha === "") {
    showMessage(
      "Confira seus dados!",
      "É necessário informar um nova senha.",
      "warning",
      4000
    );
  } else {
    sendRequest(dados)
      .then((response) => {
        console.log("Deu certo hein!");
        console.log(response);
        showMessage(
          "Deu certo!",
          "As alterações foram realizadas com sucesso!",
          "success",
          4000
        );
        solicitarRepresentantes();
      })
      .catch((err) => {
        console.error(err);
        showMessage(
          "Houve um erro!",
          "Não foi possível efetuar as alterações.",
          "error",
          5000
        );
      });
  }
};

const pegarDadosViceRepresentante = () => {
  const viceNovo = document
    .getElementById("vice-representante")
    .getAttribute("data-vice-representante");

  const senha = document.getElementById("senha-vice-representante").value;

  const turma = localStorage.getItem("turmaAtual");

  const viceAtual = localStorage.getItem("viceAtual") || "";

  let dados = {
    matricula: viceAtual,
    turma: turma,
    senha: senha,
  };
  dados.acao = "ViceRepresentantes/alterarSenha";

  if (viceAtual === "") {
    dados = {
      matricula: viceNovo,
      turma: turma,
      senha: senha,
    };

    dados.acao = "ViceRepresentantes/cadastrar";
  }

  console.log("VN", viceNovo);
  console.log("VA", viceAtual);
  if (viceNovo !== viceAtual && viceAtual !== "") {
    dados = {
      matricula: viceNovo,
      turma: turma,
      senha: senha,
    };
    dados.acao = "ViceRepresentantes/atualizarViceRepresentante";
  }

  return dados;
};
// Vice
solicitarCursos();
solicitarConselheiros();
solicitarRepresentantes();
autocompleteCoordenador();
autocompleteConselheiro();
autocompleteRepresentante();
closeModal();
