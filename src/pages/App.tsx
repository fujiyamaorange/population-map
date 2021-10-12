import React from 'react';
import logo from '../assets/logo.svg';
import styles from '../style/App.module.css';

function App(): JSX.Element {
  const buttonClick = async () => {
    console.log('ボタンを押しました');

    const url = 'https://opendata.resas-portal.go.jp/api/v1/prefectures';
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': `${process.env.REACT_APP_API_KEY}`,
      },
    });
    const data = await res.json();
    console.table(res.status);
    console.table(res.ok);
    console.table(data.result);
  };

  const getTokyo = async () => {
    // fetchでデータを取得
    // eslint-disable-next-line operator-linebreak
    const url =
      'https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=13&cityCode=-';
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': `${process.env.REACT_APP_API_KEY}`,
      },
    });
    const data = await res.json();
    console.table(res.status);
    console.table(res.ok);
    console.table(data);
    // 総人口のデータ
    console.table(data.result.data[0].data);
  };

  return (
    <>
      <div className={styles.App}>
        <header className={styles.AppHeader}>
          <img src={logo} className={styles.AppLogo} alt="logo" />
          <a
            className={styles.AppLink}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button type="button" onClick={buttonClick}>
            都道府県情報を取得
          </button>
          <button type="button" onClick={getTokyo}>
            東京都の人口情報を取得
          </button>
        </header>
      </div>
    </>
  );
}

export default App;
