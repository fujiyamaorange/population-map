/**
 * 都道府県データを取得する
 */
const getAllPrefs = async (): Promise<any> => {
  const url = 'https://opendata.resas-portal.go.jp/api/v1/prefectures';
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
};

export default getAllPrefs;
