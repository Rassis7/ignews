import Head from 'next/head';
import styles from './styes.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="/#">
            <time>12 de abril de 1993</time>
            <strong>okaos oaosk oakso</strong>
            <p>oakdokaosdo kaoksdoka okasodkasodk ok o</p>
          </a>
          <a href="/#">
            <time>12 de abril de 1993</time>
            <strong>okaos oaosk oakso</strong>
            <p>oakdokaosdo kaoksdoka okasodkasodk ok o</p>
          </a>
          <a href="/#">
            <time>12 de abril de 1993</time>
            <strong>okaos oaosk oakso</strong>
            <p>oakdokaosdo kaoksdoka okasodkasodk ok o</p>
          </a>
        </div>
      </main>
    </>
  );
}
