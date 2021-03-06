<?php

namespace core\model;

use core\CRUD;


class EstudanteAprendizado extends CRUD
{
    const TABELA = "EstudanteAprendizado";
    const COL_ID = "id";
    const COL_MATRICULA = "COD_MATRICULA";
    const COL_ID_APRENDIZADO = "idAprendizado";


    public function adicionar($dados)
    {
        try {
            $retorno = $this->create(self::TABELA, $dados);
        } catch (\Throwable $th) {
            echo "Mensagem: " . $th->getMessage() . "\n Local: " . $th->getTraceAsString();
            return false;
        }

        return $retorno;
    }

    public function alterar($dados)
    {
        if (isset($dados[self::COL_ID])) {
            throw new \Exception("É necessário informar o id do EstudanteAvaliacao");
        }

        $where_condicao = self::COL_ID . " = ? ";
        $where_valor[] = $dados[self::COL_ID];

        try {
            $this->update(self::TABELA, $dados, $where_condicao, $where_valor);
        } catch (\Throwable $th) {
            echo "Mensagem: " . $th->getMessage() . "\n Local: " . $th->getTraceAsString();
            return false;
        }

        return $dados[self::COL_ID];
    }

    public function listar($campos = null, $busca = [], $ordem = null, $limite = null)
    {
        $campos = $campos != null ? $campos :  " * ";
        $ordem = $ordem != null ? $ordem : self::COL_ID . " ASC ";
        $limite = $limite != null ? $limite : 100;

        $where_condicao = " 1 = 1 ";
        $where_valor = [];

        if ($busca && count($busca) > 0) {
            if (isset($busca[self::COL_ID]) && !empty($busca[self::COL_ID])) {
                $where_condicao .= " AND " . self::COL_ID . " = ? ";
                $where_valor[] = $busca[self::COL_ID];
            }
            if (isset($busca[self::COL_ID_APRENDIZADO]) && !empty($busca[self::COL_ID_APRENDIZADO])) {
                $where_condicao .= " AND " . self::COL_ID_APRENDIZADO . " = ? ";
                $where_valor[] = $busca[self::COL_ID_APRENDIZADO];
            }
        }

        $retorno = [];

        try {
            $retorno = $this->read(null, self::TABELA, $campos, $where_condicao, $where_valor, null, $ordem, $limite);
        } catch (\Throwable $th) {
            echo "Mensagem: " . $th->getMessage() . "\n Local: " . $th->getTraceAsString();
            return false;
        }

        return $retorno;
    }

    public function excluir($condicao = [])
    {
        $where_condicao = " 1 = 1 ";
        $where_valor = [];

        if ($condicao && count($condicao) > 0) {
            if (isset($condicao[self::COL_ID]) && !empty($condicao[self::COL_ID])) {
                $where_condicao .= " AND " . self::COL_ID . " = ? ";
                $where_valor[] = $condicao[self::COL_ID];
            }
            if (isset($condicao[self::COL_ID_APRENDIZADO]) && !empty($condicao[self::COL_ID_APRENDIZADO])) {
                $where_condicao .= " AND " . self::COL_ID_APRENDIZADO . " = ? ";
                $where_valor[] = $condicao[self::COL_ID_APRENDIZADO];
            }
        }

        try {
            $this->delete(self::TABELA, $where_condicao, $where_valor);
        } catch (\Throwable $th) {
            echo "Mensagem: " . $th->getMessage() . "\n Local: " . $th->getTraceAsString();
            return false;
        }

        return true;
    }
}
