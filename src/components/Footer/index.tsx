import styles from './footer.module.scss';

export default function Header(): JSX.Element {
  return (
    <footer className={styles.footerContainer}>
      <div>
        <img src="/logo.svg" alt="Logomarca Space travelling" />
      </div>
    </footer>
  );
}
