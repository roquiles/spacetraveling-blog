import Image from 'next/image';
import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <Image src="/logo.svg" width={230} height={50} alt="logo" />
        </Link>
      </div>
    </header>
  );
}
