-- ============================================================
-- FinancyIA - Dados iniciais das categorias
-- Executado automaticamente na primeira inicialização do app
-- ============================================================

-- Inserção segura: só insere se a categoria não existir
INSERT INTO categoria (nome, cor)
SELECT 'Alimentação', '#F97316'
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Alimentação');

INSERT INTO categoria (nome, cor)
SELECT 'Moradia', '#3B82F6'
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Moradia');

INSERT INTO categoria (nome, cor)
SELECT 'Transporte', '#8B5CF6'
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Transporte');

INSERT INTO categoria (nome, cor)
SELECT 'Saúde', '#EF4444'
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Saúde');

INSERT INTO categoria (nome, cor)
SELECT 'Lazer', '#10B981'
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Lazer');

INSERT INTO categoria (nome, cor)
SELECT 'Educação', '#6366F1'
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Educação');

INSERT INTO categoria (nome, cor)
SELECT 'Salário', '#22C55E'
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Salário');

INSERT INTO categoria (nome, cor)
SELECT 'Investimento', '#EAB308'
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Investimento');

INSERT INTO categoria (nome, cor)
SELECT 'Outros', '#6B7280'
WHERE NOT EXISTS (SELECT 1 FROM categoria WHERE nome = 'Outros');

-- Atualiza possíveis nomes corrompidos criados antes da correção do encoding
UPDATE categoria SET nome = 'Alimentação' WHERE nome LIKE 'Alimenta%' AND nome != 'Alimentação';
UPDATE categoria SET nome = 'Saúde' WHERE nome LIKE 'Sa%de' AND nome != 'Saúde';
UPDATE categoria SET nome = 'Educação' WHERE nome LIKE 'Educa%' AND nome != 'Educação';
UPDATE categoria SET nome = 'Salário' WHERE nome LIKE 'Sal%rio' AND nome != 'Salário';
