import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>💰</span>
          <span className={styles.logoText}>
            Financy<span className={styles.logoIA}>IA</span>
          </span>
        </div>
        <p className={styles.tagline}>Controle financeiro inteligente</p>
      </div>
    </header>
  );
}
