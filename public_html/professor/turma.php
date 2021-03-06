<?php

use core\sistema\Autenticacao;

require_once '../../vendor/autoload.php';
require_once '../../config.php';

if (!isset($_COOKIE['token'])) {
  header("Location: ../login.php");
}

if (!Autenticacao::isProfessor($_COOKIE['token']) && !Autenticacao::isConselheiro($_COOKIE['token'])) {
  header("Location: ../login.php?erro=2");
}

?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Turma</title>
    <link rel="stylesheet" href="../assets/css/index.css" />
    <link rel="stylesheet" href="../assets/css/turma.css" />
    <link rel="stylesheet" href="../assets/css/modals.css" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;500;600&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="../assets/css/bulma.min.css" />

    <style></style>
  </head>
  <body>
    <div class="grid-container">
      <!-- Hamburg Icon -->
      <div class="menu-icon">
        <i class="fas fa-bars header__menu"></i>
      </div>
      <!-- Hamburg Icon -->

      <!-- Header -->
      <header class="header">
        <div class="dropdown is-right is-small no-border" id="dropdown-user">
        <div class="dropdown-trigger">
            <button
              class="button"
              aria-haspopup="true"
              aria-controls="dropdown-menu6"
            >
              <span>Professor</span>
              <span class="icon is-small">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div class="dropdown-menu" id="dropdown-menu6" role="menu">
            <div class="dropdown-content">
              <div class="dropdown-item">
                <a href="../coordenador/index.php" class="dropdown-item">
                  Coordenador
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      <!-- Header -->

     <!-- Sidebar -->
    <aside class="sidenav">
      <ul class="sidenav__list">
        <li class="sidenav__list-item first-item">
          <img src="../assets/images/logo_sadc.svg" alt="" class="logo-icon" />
        </li>
        <li class="sidenav__list-item turmas">
          <img src="../assets/images/grupo.svg" alt="" class="icone" />
        </li>
        <li class="sidenav__list-item reunioes">
          <img class="icone" src="../assets/images/reunion.svg" alt="" />
        </li>
        <!-- <li class="sidenav__list-item config">
          <img class="icone" src="../assets/images/config.svg" alt="" />
        </li> -->
      </ul>
      <div class="item-sair">
        <img src="../assets/images/logout.svg" alt="" class="sair-icone" />
      </div>
    </aside>
    <!-- Sidebar -->

    <!-- Sidebar Mobile -->
    <aside class="sidenav-mobile">
      <div class="sidenav__close-icon-mobile">
        <i class="fas fa-times sidenav__brand-close"></i>
      </div>
      <ul class="sidenav__list-mobile">
        <li class="sidenav__list-item-mobile turmas">
          <img src="../assets/images/grupo.svg" alt="" class="icone" />
          <p class="sidenav-item-text">Turmas</p>
        </li>
        <li class="sidenav__list-item-mobile reunioes">
          <img src="../assets/images/reunion.svg" alt="" class="icone" />
          <p class="sidenav-item-text">Conselhos Anteriores</p>
        </li>
        <!-- <li class="sidenav__list-item-mobile config">
          <img src="../assets/images/config.svg" alt="" class="icone" />
          <p class="sidenav-item-text">Configurações</p>
        </li> -->
      </ul>
      <div class="item-sair">
        <img src="../assets/images/logout.svg" alt="" class="sair-icone" />
        <p class="text">
          Sair
        </p>
      </div>
    </aside>
    <!-- Sidebar Mobile -->

      <main class="main">
        <section class="head">
          <div class="detalhes">
            <p class="principal">
              Visão Geral - Turma
            </p>
            <p class="descricao">
              Bem-vindo de volta!
            </p>
          </div>
        </section>
        <section class="overview">
          <div class="info">
            <div class="turma-info">
              <div>
                <span name="turma" id="nome">3° B</span> -
                <span name="curso" id="curso">Informática</span>
              </div>
              <span class="cod-turma" id="codigo">20141.03INF10I.3B</span>
              <span class="separator"></span>
              <span class="conselheiro"></span>
              <span class="representante"></span>
              <span class="vice-representante"></span>
            </div>
          </div>

          <div class="estatistica-turma" id="estatistica-turma">
            <div class="card-info coef-geral">
              <p class="descricao">Coeficiente Geral</p>
              <p class="resultado">0,0</p>
            </div>
            <div class="card-info experiencia">
              <p class="descricao">Experiências</p>
              <p class="resultado">0</p>
            </div>
            <div class="card-info aprendizado">
              <p class="descricao">Ensino-Aprendizado</p>
              <p class="resultado">0</p>
            </div>
            <div class="card-info medidas">
              <p class="descricao">Medidas Disciplinares</p>
              <p class="resultado">0</p>
            </div>
          </div>
          <div class="chart">
            <h1 class="chart-title">Coeficiente Geral</h1>
            <div class="canvas-chart">
              <canvas id="coef-geral"></canvas>
            </div>
            <div class="legenda">
              <div class="alto">
                <span class="cor"></span>
                <span class="text">Alto</span>
              </div>
              <div class="medio">
                <span class="cor"></span>
                <span class="text">Médio</span>
              </div>
              <div class="baixo">
                <span class="cor"></span>
                <span class="text">Baixo</span>
              </div>
            </div>
          </div>
        </section>
        <section class="medidas-avaliacao">
          <div class="medidas">
            <div class="titulo-medidas">
              <h1>Medidas Disciplinares</h1>
              <a class="mostrar-tudo"
                >Mostrar mais
                <i class="fas fa-angle-down" aria-hidden="true"></i
              ></a>
            </div>
            <div class="lista-medidas">
              <!-- <div class="mostrar-mais">
                <span>+5</span>
              </div> -->
            </div>
          </div>
          <div class="avaliacoes-diagnostica">
            <h1>Principais Avaliações</h1>
            <div class="avaliacoes" id="avaliacoes">
            </div>
          </div>
        </section>
        <section class="alunos">
          <h1 class="principal">Estudantes</h1>
          <div class="pesquisa">
            <div class="field has-addons tipos">
              <p class="control">
                <button class="button is-small" id="filtrarAlto">
                  <span>Alto</span>
                </button>
              </p>
              <p class="control">
                <button class="button is-small align-center" id="filtrarMedio">
                  <span>Médio</span>
                </button>
              </p>
              <p class="control">
                <button class="button is-small align-center" id="filtrarBaixo">
                  <span>Baixo</span>
                </button>
              </p>
              <p class="control">
                <button class="button is-small align-center" id="removerFiltro">
                  <span>Todos</span>
                </button>
              </p>
            </div>
          </div>
          <div class="overview-alunos"></div>
          <div class="lista-estudantes" id="lista-estudantes">
            <!-- <div class="cardbox card-turma alto" data-aluno="2017103202030090">
              <p class="subtitulo is-6">Alexandre Lopes</p>
              <p class="subtitulo is-8 gray-text">2017103202030090</p>
              <p class="subtitulo is-7">9,0</p>
            </div> -->
          </div>
        </section>
      </main>

      <footer class="footer">
        <div class="footer_nepeti">
          <img
            class="logo_nepeti"
            src="../assets/images/logo_nepeti.png"
            alt=""
          />
          <p class="text-nepeti">
            &copy; 2020 - Núcleo de Estudos e Pesquisa em Tecnologia da
            Informação
          </p>
        </div>
      </footer>
      <div class="modal visualizar" id="visualizar-medida">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <div class="modal-card-title">Medida Disciplinar</div>
            <div class="modal-close-btn">
              <i class="fas fa-times sidenav__brand-close"></i>
            </div>
          </header>
          <section class="modal-card-body">
            <div class="modal-medida">
              <div class="info-m">
                <div class="info-aluno">
                  <p class="nome">Alexandre Lopes</p>
                  <p class="matricula">2017103202030090</p>
                  <p class="data">10 Jan 2020</p>
                </div>
              </div>
              <div class="info-medida">
                <div class="tipo-medida">
                  <p>Ocorrência Leve</p>
                </div>
                <p class="observacao">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Error quo quasi doloribus placeat quaerat, laboriosam beatae
                  libero optio hic! Quaerat quidem eum soluta distinctio
                  laudantium quo aperiam reprehenderit vitae laborum!
                </p>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot"></footer>
        </div>
      </div>
    </div>
    <div class="toasts" id="toasts"></div>
  </body>
  <script src="../assets/js/index.js" type="module"></script>
  <script src="../assets/js/turma.js" type="module"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>

  <!-- <script src="../assets/js/atendimentos.js" type="module"></script> -->
</html>
