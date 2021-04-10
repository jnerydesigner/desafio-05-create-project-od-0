import Link from 'next/link';
import { FiHome } from 'react-icons/fi';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <div className={styles.headerContainer}>
      <div>
        <img src="/logo.svg" alt="Logomarca Space travelling" />
        <Link href="/">
          <a>
            <FiHome />
          </a>
        </Link>
      </div>
    </div>
  );
}
