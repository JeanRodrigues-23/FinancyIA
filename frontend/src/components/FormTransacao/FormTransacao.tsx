import { useState, useEffect } from 'react';
import * as api from '../../api/transacaoApi';
import type { Categoria, TransacaoPayload } from '../../types';
import styles from './FormTransacao.module.css';

interface Props {
  onSucesso: () => void;
}

export function FormTransacao({ onSucesso }: Props) {
  const [tipoAtivo, setTipoAtivo] = useState<'Ganho' | 'Gasto' | null>(null);
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  useEffect(() => {
    api.listarCategorias().then(setCategorias).catch(console.error);
  }, []);

  // Formata valor como moeda BR enquanto digita
  const handleValorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    const numero = Number(raw) / 100;
    setValor(
      numero.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
      })
    );
  };

  const parseValor = (): number => {
    const limpo = valor.replace(/[R$\s.]/g, '').replace(',', '.');
    return parseFloat(limpo) || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipoAtivo) return;

    const valorNumerico = parseValor();
    if (valorNumerico <= 0) {
      setMensagem({ tipo: 'erro', texto: 'Informe um valor válido.' });
      return;
    }
    if (!descricao.trim()) {
      setMensagem({ tipo: 'erro', texto: 'A descrição é obrigatória.' });
      return;
    }

    setEnviando(true);
    setMensagem(null);

    const payload: TransacaoPayload = {
      valor: valorNumerico,
      descricao: descricao.trim(),
      tipoTransacao: tipoAtivo,
      categoriaId,
    };

    try {
      await api.criarTransacao(payload);
      setMensagem({ tipo: 'sucesso', texto: `${tipoAtivo} registrado com sucesso! 🎉` });
      setValor('');
      setDescricao('');
      setCategoriaId(null);
      onSucesso();
      setTimeout(() => setMensagem(null), 3000);
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Erro ao registrar transação. Tente novamente.' });
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelar = () => {
    setTipoAtivo(null);
    setValor('');
    setDescricao('');
    setCategoriaId(null);
    setMensagem(null);
  };

  return (
    <section className={styles.section}>
      {/* Botões de escolha */}
      <div className={styles.botoes}>
        <button
          id="btn-ganho"
          className={`${styles.btn} ${styles.btnGanho} ${tipoAtivo === 'Ganho' ? styles.ativo : ''}`}
          onClick={() => setTipoAtivo('Ganho')}
          type="button"
        >
          <span>📈</span>
          <span>Adicionar Ganho</span>
        </button>
        <button
          id="btn-gasto"
          className={`${styles.btn} ${styles.btnGasto} ${tipoAtivo === 'Gasto' ? styles.ativo : ''}`}
          onClick={() => setTipoAtivo('Gasto')}
          type="button"
        >
          <span>📉</span>
          <span>Adicionar Gasto</span>
        </button>
      </div>

      {/* Formulário */}
      {tipoAtivo && (
        <form className={`${styles.form} animate-slide-up`} onSubmit={handleSubmit}>
          <h3 className={`${styles.formTitulo} ${tipoAtivo === 'Ganho' ? styles.tituloGanho : styles.tituloGasto}`}>
            {tipoAtivo === 'Ganho' ? '📈 Novo Ganho' : '📉 Novo Gasto'}
          </h3>

          <div className={styles.campos}>
            <div className={styles.campo}>
              <label htmlFor="form-valor" className={styles.label}>Valor</label>
              <input
                id="form-valor"
                className={styles.input}
                type="text"
                placeholder="R$ 0,00"
                value={valor}
                onChange={handleValorInput}
                required
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="form-descricao" className={styles.label}>Descrição</label>
              <input
                id="form-descricao"
                className={styles.input}
                type="text"
                placeholder="Ex: Salário, Aluguel, Supermercado..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                maxLength={255}
                required
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="form-categoria" className={styles.label}>
                Categoria <span className={styles.opcional}>(opcional)</span>
              </label>
              <select
                id="form-categoria"
                className={styles.select}
                value={categoriaId ?? ''}
                onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">— Sem categoria —</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {mensagem && (
            <div className={`${styles.mensagem} ${styles[`mensagem--${mensagem.tipo}`]}`}>
              {mensagem.texto}
            </div>
          )}

          <div className={styles.acoes}>
            <button
              id="btn-confirmar"
              type="submit"
              className={`${styles.btnAcao} ${styles.btnConfirmar}`}
              disabled={enviando}
            >
              {enviando ? 'Registrando...' : 'Confirmar'}
            </button>
            <button
              id="btn-cancelar"
              type="button"
              className={`${styles.btnAcao} ${styles.btnCancelar}`}
              onClick={handleCancelar}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
