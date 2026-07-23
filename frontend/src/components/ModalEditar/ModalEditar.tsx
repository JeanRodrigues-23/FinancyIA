import { useState, useEffect } from 'react';
import * as api from '../../api/transacaoApi';
import type { Transacao, Categoria, TransacaoPayload } from '../../types';
import { formatarMoeda } from '../../utils/formatadores';
import styles from './ModalEditar.module.css';

interface Props {
  transacao: Transacao | null;
  onFechar: () => void;
  onSucesso: () => void;
}

export function ModalEditar({ transacao, onFechar, onSucesso }: Props) {
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    api.listarCategorias().then(setCategorias).catch(console.error);
  }, []);

  useEffect(() => {
    if (transacao) {
      setValor(formatarMoeda(transacao.valor));
      setDescricao(transacao.descricao);
      setCategoriaId(transacao.categoriaId);
      setErro(null);
    }
  }, [transacao]);

  if (!transacao) return null;

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
    const valorNumerico = parseValor();

    if (valorNumerico <= 0) { setErro('Informe um valor válido.'); return; }
    if (!descricao.trim()) { setErro('A descrição é obrigatória.'); return; }

    setEnviando(true);
    setErro(null);

    const payload: TransacaoPayload = {
      valor: valorNumerico,
      descricao: descricao.trim(),
      tipoTransacao: transacao.tipoTransacao,
      categoriaId,
    };

    try {
      await api.editarTransacao(transacao.id, payload);
      onSucesso();
      onFechar();
    } catch {
      setErro('Erro ao editar transação. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={onFechar} />
      <div className={`${styles.modal} animate-slide-up`} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitulo}>
            {transacao.tipoTransacao === 'Ganho' ? '📈' : '📉'} Editar {transacao.tipoTransacao}
          </h3>
          <button id="btn-fechar-modal" className={styles.btnFechar} onClick={onFechar} aria-label="Fechar">✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.campo}>
            <label htmlFor="modal-valor" className={styles.label}>Valor</label>
            <input
              id="modal-valor"
              className={styles.input}
              type="text"
              value={valor}
              onChange={handleValorInput}
              required
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="modal-descricao" className={styles.label}>Descrição</label>
            <input
              id="modal-descricao"
              className={styles.input}
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              maxLength={255}
              required
            />
          </div>

          <div className={styles.campo}>
            <label htmlFor="modal-categoria" className={styles.label}>Categoria</label>
            <select
              id="modal-categoria"
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

          {erro && <p className={styles.erro}>{erro}</p>}

          <div className={styles.acoes}>
            <button
              id="modal-btn-confirmar"
              type="submit"
              className={`${styles.btnAcao} ${styles.btnConfirmar}`}
              disabled={enviando}
            >
              {enviando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button
              id="modal-btn-cancelar"
              type="button"
              className={`${styles.btnAcao} ${styles.btnCancelar}`}
              onClick={onFechar}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
