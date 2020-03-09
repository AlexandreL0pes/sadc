-- Estudantes de uma turma
SELECT P.NOME_PESSOA, MATRICULAS.COD_TURMA_ATUAL FROM MATRICULAS
    INNER JOIN ALUNOS A on MATRICULAS.COD_ALUNO = A.COD_ALUNO
    INNER JOIN PESSOAS P on A.COD_PESSOA = P.COD_PESSOA
WHERE COD_TURMA_ATUAL = '20201.03INI10I.3A'
ORDER BY P.NOME_PESSOA;

-- Disciplinas de turma no período atual
select DMC.COD_DISCIPLINA, D.DESC_DISCIPLINA, DMC.N_PERIODO, PERIODO AS 'Período Letivo' from TURMAS
    INNER JOIN DISCIPLINAS_MATRIZES_CURRICULARES DMC on
        TURMAS.COD_MATRIZ_CURRICULAR = DMC.COD_MATRIZ_CURRICULAR
    INNER JOIN DISCIPLINAS D on DMC.COD_DISCIPLINA = D.COD_DISCIPLINA
WHERE TURMAS.COD_TURMA = '20201.03INI10I.3A' and dmc.N_PERIODO = PERIODO
ORDER BY N_PERIODO
;

-- Coeficiente Geral da turma
SELECT  avg(MATRICULAS.COEFICIENTE_RENDIMENTO) as coeficiente_geral from MATRICULAS
    INNER JOIN ALUNOS A on MATRICULAS.COD_ALUNO = A.COD_ALUNO
    INNER JOIN PESSOAS P on A.COD_PESSOA = P.COD_PESSOA
WHERE COD_TURMA_ATUAL = '20201.03INI10I.3A';


-- Turmas dos cursos técnicos integrados ao ensino médio de Ceres
SELECT COD_TURMA, DESC_TURMA, ANO_LET FROM TURMAS
    INNER JOIN CURSOS C on TURMAS.COD_CURSO = C.COD_CURSO
WHERE COD_TIPO_CURSO = 265 AND TURMAS.COD_INSTITUICAO = 3 and ANO_LET = year(getdate()) ;

-- Turmas do ano letivo por curso
SELECT * FROM TURMAS WHERE  COD_CURSO = 851 AND ANO_LET = YEAR(getdate());


-- Código_Tipo_INSTITUICAO - 3 - CERES
-- Código_Tipo_Curso - 265 -  2019 - M - Técnico Integrado Trimestral Médio
-- Cursos Técnicos Integrados ao Ensino Médio de Ceres
SELECT * FROM CURSOS WHERE COD_INSTITUICAO=3 AND COD_TIPO_CURSO = 265;

-- COD_CURSO
-- 80 (AGRO)
-- 851 (INFO)
-- 862 (MA)

-- Nota de avaliações por etapa e matricula
SELECT  AVALIACOES.COD_AVALIACAO, AVALIACOES.DESC_AVALIACAO, PESO, ma.*  FROM AVALIACOES
    inner join MATRICULAS_AVALIACOES MA on AVALIACOES.COD_AVALIACAO = MA.COD_AVALIACAO
WHERE COD_PAUTA = 96777 AND N_ETAPA = 'N1' AND COD_MATRICULA = 87668 and TIPO_AVALIACAO = 0;

