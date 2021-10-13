/**
 *
 * @param prefCode 都道府県コード
 * 都道府県コードから人口データを取得する
 */
const getPrefData = async (prefCode: number): Promise<any> => {
  try {
    const url = `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}&cityCode=-`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': `${process.env.REACT_APP_API_KEY}`,
      },
    });
    if (!res.ok) {
      return 'error';
    }
    return res.json();
  } catch (e) {
    return 'error';
  }
};

export default getPrefData;
