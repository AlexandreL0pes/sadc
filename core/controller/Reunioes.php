<?php

namespace core\controller;

use core\model\Reuniao;
use core\model\Turma;
use core\sistema\Autenticacao;

class Reunioes
{

	private $reuniao_id = null;
	private $turma_cod = null;
	private $data = null;
	private $etapaConselho = null;
	private $finalizado = null;
	private $memoria = null;


	public function __set($atributo, $valor)
	{
		$this->$atributo = $valor;
	}

	public function __get($atributo)
	{
		return $this->$atributo;
	}

	public function cadastrar($dados)
	{
		$turmas = $dados['turmas'];

		$dataAtual = date('Y-m-d');
		$etapaAtual = 1;

		$reuniao = new Reuniao();

		foreach ($turmas as $turma) {
			$resultado = $reuniao->adicionar(
				[
					Reuniao::COL_COD_TURMA => $turma,
					Reuniao::COL_DATA => $dataAtual,
					Reuniao::COL_ETAPA_CONSELHO => $etapaAtual
				]
			);
		}

		if ($resultado > 0) {
			http_response_code(200);
			return json_encode(array('message' => 'As reuniões foram iniciadas!'));
		} else {
			http_response_code(500);
			return json_encode(array('message' => 'Não foi possível iniciar as reuniões!'));
		}
	}

	/**
	 * Finaliza a reunião especificada
	 *
	 * @param  mixed $dados['reuniao']
	 * @return void
	 */
	public function finalizarReuniao($dados)
	{
		$reuniao = $dados['reuniao'];

		$r = new Reuniao();

		$resultado = $r->alterar([
			Reuniao::COL_ID => $reuniao,
			Reuniao::COL_FINALIZADO => 1
		]);

		if ($resultado > 0) {
			http_response_code(200);
			return json_encode(array('message' => 'A reunião foi finalizada!'));
		} else {
			http_response_code(500);
			return json_encode(array('message' => 'Não foi possível finalizar as reuniões'));
		}
	}

	/**
	 * Finaliza todas as reuniões passadas
	 *
	 * @param  array $dados['reunioes']
	 * @return void
	 */
	public function finalizarReunioes($dados)
	{
		$reunioes = $dados['reunioes'];

		$reuniao = new Reuniao();

		$erros = array();
		foreach ($reunioes as $r) {
			$resultado = $reuniao->alterar(
				[
					Reuniao::COL_ID => $r,
					Reuniao::COL_FINALIZADO => 1
				]
			);
			if (!($resultado > 0)) {
				array_push($erros, $r);
			}
		}
		if (sizeof($erros) == 0) {
			http_response_code(200);
			return json_encode(array('message'  => 'As reuniões foram finalizadas!'));
		} else {
			http_response_code(500);
			return json_encode(array('message' => 'Não foi possível finalizar as reuniões!'));
		}
	}

	public function salvarMemoria($dados)
	{
		$reuniao_id = $dados['reuniao'];
		$memoria = $dados['memoria'];

		$reuniao = new Reuniao();
		$memoriaReuniao = [Reuniao::COL_ID => $reuniao_id, Reuniao::COL_MEMORIA => $memoria];
		$resultado = $reuniao->alterar($memoriaReuniao);

		if ($resultado && $resultado > 0) {
			http_response_code(200);
			return json_encode(array('message' => 'A memória da reunião foi salva!'));
		} else {
			http_response_code(500);
			return json_encode(array('message' => 'Não foi possível salvar a memória solicitada!'));
		}
	}

	public function selecionarMemoria($dados)
	{
		$reuniao_id = $dados['reuniao'];

		$reuniao = new Reuniao();

		$campos = Reuniao::COL_MEMORIA;
		$busca = [Reuniao::COL_ID => $reuniao_id];
		$memoriaReuniao = ($reuniao->listar($campos, $busca, null, 1))[0];

		if (count($memoriaReuniao) > 0) {
			http_response_code(200);
			return json_encode($memoriaReuniao);
		} else {
			http_response_code(500);
			return json_encode(array('message' => 'Não foi possível obter a memória da reunião solicitada!'));
		}
	}


	/**
	 * Lista as reuniões não finalizadas
	 */
	public function listarReunioesAndamento($dados = [])
	{

		$reuniao = new Reuniao();


		$campos = Reuniao::COL_ID . ", " .
			Reuniao::COL_COD_TURMA;

		$busca = [Reuniao::COL_FINALIZADO => '0'];
		$reunioes = $reuniao->listar($campos, $busca, null, 1000);


		$turmas = new Turmas();

		$reunioesFiltradas = [];

		// Caso o curso seja passado, lista apenas as reuniões do curso
		// Caso não exista curso, todas as reuniões serão retornadas

		// Verifica se existem reuniões retornadas 
		if (count($reunioes) > 0 && !empty($reunioes[0])) {

			// Verifica se existe curso especificado
			if (isset($dados['curso']) && !empty($dados['curso'])) {

				foreach ($reunioes as $reuniao) {
					if ($turmas->verificarTurmaCurso($reuniao[Turma::COL_ID], $dados['curso'])) {
						$turma = $turmas->informacoesTurma(['turma' => $reuniao[Turma::COL_ID]]);

						$turma = json_decode($turma, true);
						$turma['reuniao'] = $reuniao[Reuniao::COL_ID];

						array_push($reunioesFiltradas, $turma);
					}
				}
			} else {

				foreach ($reunioes as $reuniao) {
					$turma = $turmas->informacoesTurma(['turma' => $reuniao[Turma::COL_ID]]);

					$turma = json_decode($turma, true);
					$turma['reuniao'] = $reuniao[Reuniao::COL_ID];

					array_push($reunioesFiltradas, $turma);
				}
			}
		}


		http_response_code(200);
		return json_encode($reunioesFiltradas);
	}

	public function listarTurmasEmReuniao($dados = [])
	{
		$reunioes = $this->listarReunioesAndamento($dados);
		$reunioes = json_decode($reunioes, true);

		$turmas = [];

		if (count($reunioes) > 0 && !empty($reunioes[0])) {
			$turmas = array_map(function ($turma) {
				return $turma['codigo'];
			}, $reunioes);
		}

		return $turmas;
	}
	public function reunioesNaoIniciadas($dados)
	{

		//  Retorna uma lista contendo os COD_TURMA de turmas que não participam do conselho a mais de 30 dias
		$turmasForaReuniaoAtual = $this->turmasReunioesFinalizadas();

		// Retorna uma lista de turmas que já participaram de uma reunião
		$turmasParticipantesReunioesPassadas = $this->turmasAvaliadasReuniao();

		$turmas = new Turmas();

		// Retorna uma lista das turmas que nunca participaram do conselho
		$turmasForaReuniao = $turmas->turmasForaReuniao($turmasParticipantesReunioesPassadas);

		$curso = (isset($dados['curso']) && !empty($dados['curso'])) ? $dados['curso'] : null;
		$turmasCompletas = [];

		foreach ($turmasForaReuniaoAtual as $t) {
			$retorno = $turmas->informacoesTurma(['turma' => $t]);

			$retorno = json_decode($retorno, true);

			if ($curso != null) {
				if ($retorno['codigo_curso'] == $curso) {
					unset($retorno['codigo_curso']);
					array_push($turmasCompletas, $retorno);
				}
			} else {
				unset($retorno['codigo_curso']);
				array_push($turmasCompletas, $retorno);
			}
		}

		foreach ($turmasForaReuniao as $t) {
			$retorno = $turmas->informacoesTurma(['turma' => $t]);

			$retorno = json_decode($retorno, true);

			if ($curso != null) {
				if ($retorno['codigo_curso'] == $curso) {
					unset($retorno['codigo_curso']);
					array_push($turmasCompletas, $retorno);
				}
			} else {
				unset($retorno['codigo_curso']);
				array_push($turmasCompletas, $retorno);
			}
		}

		// print_r($turmasCompletas);

		http_response_code(200);
		return json_encode($turmasCompletas);
	}

	/**
	 * Retorna uma lista contendo os COD_TURMA de turmas que não participam do conselho a mais de 30 dias
	 */
	public function turmasReunioesFinalizadas()
	{
		$reuniao = new Reuniao();

		$campos = Reuniao::COL_COD_TURMA;

		$busca = [Reuniao::COL_FINALIZADO => '1', 'periodo' => 30, 'ano' => 'atual'];

		$retorno = $reuniao->listar($campos, $busca, null, 1000);

		$turmasIds = [];
		if (count($retorno) > 0 && !empty($retorno[0])) {
			$turmasIds = array_map(function ($id) {
				return $id[Reuniao::COL_COD_TURMA];
			}, $retorno);
		}

		return $turmasIds;
	}

	/**
	 * Retorna uma lista de turmas que já participaram de uma reunião
	 */
	public function turmasAvaliadasReuniao()
	{
		$reuniao = new Reuniao();

		$campos = " DISTINCT " . Reuniao::COL_COD_TURMA;

		$busca = ['ano' => 'atual'];

		$retorno = $reuniao->listar($campos, $busca, null, 1000);

		$turmasIds = [];
		if (count($retorno) > 0 && !empty($retorno[0])) {
			$turmasIds = array_map(function ($id) {
				return $id[Reuniao::COL_COD_TURMA];
			}, $retorno);
		}


		return $turmasIds;
	}

	/**
	 * Verifica se a turma contida na token possui está em algum conselho
	 *
	 * @param  mixed $dados
	 * @return void
	 */
	public function verificarTurmaReuniao($dados)
	{
		$token = $dados['token'];

		$cod_turma = Autenticacao::obterTurma($token);


		if ($cod_turma) {

			$turmas_em_reuniao = $this->listarReunioesAndamento();
			$turmas_em_reuniao = json_decode($turmas_em_reuniao, true);


			$reuniao = null;
			foreach ($turmas_em_reuniao as $turma_em_reuniao) {
				if ($turma_em_reuniao['codigo'] === $cod_turma) {
					$reuniao = $turma_em_reuniao['reuniao'];
				}
			}

			if ($reuniao !== null) {
				http_response_code(200);
				return json_encode(array('message' => 'A turma possui uma reunião em andamento!', 'reuniao' => $reuniao));
			} else {
				http_response_code(500);
				return json_encode(array('message' => 'A turma não possui algum conselho em andamento!'));
			}
		} else {
			http_response_code(400);
			return json_encode(array('message' => 'A turma especificada não foi encontrada!'));
		}
	}
	
	/**
	 * Verifica se a turma está em reunião com base no token
	 *
	 * @param  mixed $token
	 * @return void
	 */
	public function turma_em_reuniao($token)
	{
		$cod_turma = Autenticacao::obterTurma($token);


		if ($cod_turma) {

			$turmas_em_reuniao = $this->listarReunioesAndamento();
			$turmas_em_reuniao = json_decode($turmas_em_reuniao, true);


			$reuniao = null;
			foreach ($turmas_em_reuniao as $turma_em_reuniao) {
				if ($turma_em_reuniao['codigo'] === $cod_turma) {
					$reuniao = $turma_em_reuniao['reuniao'];
				}
			}

			if ($reuniao !== null) {
				return true;
			}
		}

		return false;
	}
}
