<?php


namespace core\controller;

use core\model\Aluno;
use core\model\Professor;
use core\model\Turma;

class Turmas
{
    public function informacoesTurma($dados)
    {
        $codigoTurma = $dados['turma'];

        $campos = Turma::COL_ID . ", " .
            Turma::COL_DESC_TURMA . ", " .
            Turma::COL_CURSO;

        $busca = [Turma::COL_ID => $codigoTurma];

        $turma = new Turma();
        $retornoTurma = ($turma->listar($campos, $busca, null, 1))[0];

        if (!empty($retornoTurma)) {
            $nomeTurma = $this->processarNome($retornoTurma[Turma::COL_ID]);
            $cursoTurma = $this->processarCurso($retornoTurma[Turma::COL_DESC_TURMA]);


            $turmaJson = [
                'codigo' => $codigoTurma,
                'nome' => $nomeTurma,
                'curso' => $cursoTurma,
                'codigo_curso' => $retornoTurma[Turma::COL_CURSO]
            ];

            http_response_code(200);
            return json_encode($turmaJson);
        } else {
            http_response_code(500);
            return json_encode(array('message' => 'Nenhuma turma foi encontrada!'));
        }
    }

    public function processarNome($codigoTurma = null)
    {
        if ($codigoTurma == null) {
            return "";
        }

        $ano_turma = (explode(".", $codigoTurma))[2];

        $numeroTurma = substr($ano_turma, 0, 1);
        $letraTurma = substr($ano_turma, 1, 1);

        $nome = $numeroTurma . "° " . $letraTurma;
        return $nome;
    }

    public function processarCurso($descricaoTurma = null)
    {
        if ($descricaoTurma == null) {
            return "";
        }

        $tecnico_removido = (explode('Técnico em ', $descricaoTurma))[1];
        $curso = (explode(" Integrado", $tecnico_removido))[0];

        return $curso;
    }

    public function listarEstudantes($dados)
    {
        $turma = $dados['turma'];

        $aluno = new Aluno();
        $campos = "MATRICULAS.MATRICULA as matricula, " .
            "{fn CONCAT(SUBSTRING(PESSOAS.NOME_PESSOA, 1, CHARINDEX(' ', PESSOAS.NOME_PESSOA) - 1), {fn CONCAT(' ', REVERSE(SUBSTRING(REVERSE(PESSOAS.NOME_PESSOA), 1, CHARINDEX(' ', REVERSE(PESSOAS.NOME_PESSOA)) - 1)))})} as nome";

        $busca = [Aluno::COL_COD_TURMA_ATUAL => $turma];
        $alunos = $aluno->listar($campos, $busca, null, null);

        $retorno = [];


        if (count($alunos) > 0) {
            $retorno = $alunos;
        }

        http_response_code(200);
        return json_encode($retorno);
    }

    public function verificarTurmaCurso($codTurma, $codCurso)
    {
        $campos = Turma::COL_ID . ", " .
            Turma::COL_CURSO;
        $busca = [Turma::COL_ID => $codTurma];

        $turma = new Turma();
        $retornoTurma = ($turma->listar($campos, $busca, null, 1))[0];

        if ($retornoTurma[Turma::COL_CURSO] == $codCurso) {
            return true;
        }
        return false;
    }


    /**
     * Retorna uma lista das turmas que nunca participaram do conselho
     * @param array $turmasAvaliadas Lista com todas as turmas atuais que já participaram de um conselho
     */
    public function turmasForaReuniao($turmasAvaliadas = [])
    {
        $turma = new Turma();

        $campos = Turma::COL_ID;

        $turmas = implode("', '", $turmasAvaliadas);
        $turmas = "'" . $turmas . "'";

        $busca = ['avaliadas' => $turmas, 'ano' => 'atual'];
        $retorno = $turma->listar($campos, $busca, null, 10000);

        $retorno = array_map(function ($id) {
            return $id[Turma::COL_ID];
        }, $retorno);

        return $retorno;
    }

    public function informacoesTurmas($dados)
    {
        $turmas = $dados['turmas'];

        $t = new Turma();

        $informacoesCompletas = [];
        foreach ($turmas as $turma) {
            $campos = Turma::COL_ID . ", " .
                Turma::COL_DESC_TURMA . ", " .
                Turma::COL_CURSO;

            $busca = [Turma::COL_ID => $turma];

            $retorno = ($t->listar($campos, $busca, null, 1))[0];

            if (!empty($retorno)) {
                $nomeTurma = $this->processarNome($retorno[Turma::COL_ID]);
                $cursoTurma = $this->processarCurso($retorno[Turma::COL_DESC_TURMA]);

                $informacaoCompleta = [
                    'codigo' => $turma,
                    'nome' => $nomeTurma,
                    'curso' => $cursoTurma,
                    'codigo_curso' => $retorno[Turma::COL_CURSO]
                ];

                array_push($informacoesCompletas, $informacaoCompleta);
            }
        }

        http_response_code(200);
        return json_encode($informacoesCompletas);
    }


    //Lista todas as turmas atuais com seus líderes
    public function listarTurmasLideres()
    {
        $campos = Turma::COL_ID . ", " .
            Turma::COL_DESC_TURMA . ", " .
            Turma::COL_CURSO;

        $busca = ['ano' => 'atual'];

        $t = new Turma();
        $r = new Representantes();
        $retornoTurmas = $t->listar($campos, $busca, null, null);

        $c = new Conselheiros();
        // print_r($retornoTurmas);

        $turmas = [];
        if (count($retornoTurmas) > 0 && !empty($retornoTurmas[0])) {

            foreach ($retornoTurmas as $retornoTurma) {
                $nome = $this->processarNome($retornoTurma[Turma::COL_ID]);

                $curso = $this->processarCurso($retornoTurma[Turma::COL_DESC_TURMA]);

                $representantes = $r->obterRepresentantes($retornoTurma[Turma::COL_ID]);
                $representantes = json_decode($representantes, true);

                $conselheiro = $c->obterConselheiro($retornoTurma[Turma::COL_ID]);
                $conselheiro = json_decode($conselheiro, true);

                $turma = [
                    'codigo' => $retornoTurma[Turma::COL_ID],
                    'nome' => $nome,
                    'curso' => $curso,
                    'codigo_curso' => $retornoTurma[Turma::COL_CURSO],
                    'representantes' => $representantes,
                    'conselheiro' => $conselheiro
                ];

                array_push($turmas, $turma);
            }
        }

        http_response_code(200);
        return json_encode($turmas);
    }

    public function listarProfessoresAtuais($dados = [])
    {

        $turma = $dados['turma'];

        $p = new Professores();
        $pessoas = $p->professoresAtuaisTurma($turma);


        $professores = [];

        if (!empty($pessoas)) {
            foreach ($pessoas as $pessoa) {
                $professor = $p->selecionar($pessoa);
                array_push($professores, $professor);
            }
        }

        return json_encode($professores);
    }

    public function listarTurmasConselheiros($dados = [])
    {
        // Várias paradas
        $campos = Turma::COL_ID . ", " .
            Turma::COL_DESC_TURMA . ", " .
            Turma::COL_CURSO;

        $busca = ['ano' => 'atual'];
        $t = new Turma();
        $r = new Representantes();

        $retornoTurmas = $t->listar($campos, $busca, null, null);

        $c = new Conselheiros();

        $turmas = [];

        if (count($retornoTurmas) > 0 && !empty($retornoTurmas[0])) {
            foreach ($retornoTurmas as $retornoTurma) {
                $nome = $this->processarNome($retornoTurma[Turma::COL_ID]);
                $curso = $this->processarCurso($retornoTurma[Turma::COL_DESC_TURMA]);

                $conselheiro = $c->obterConselheiro($retornoTurma[Turma::COL_ID]);
                $conselheiro = json_decode($conselheiro, true);

                $turma = [
                    'codigo' => $retornoTurma[Turma::COL_ID],
                    'nome' => $nome,
                    'curso' => $curso,
                    'codigo_curso' => $retornoTurma[Turma::COL_CURSO],
                    'conselheiro' => $conselheiro
                ];

                array_push($turmas, $turma);
            }
        }

        http_response_code(200);
        return json_encode($turmas);
    }
}
