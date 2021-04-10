import { AppProps } from 'next/app';
import '../styles/globals.scss';
import Header from '../components/Header';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <div className="containerGeral">
        <Header />
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
