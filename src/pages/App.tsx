import React from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
} from 'recharts';

import getPrefData from '../utils/api/getPrefData';
import { PrefData } from '../models/prefecture';
import { GraphData } from '../models/GraphData';
import getAllPrefs from '../utils/api/getAllPrefs';
import allPrefKanji from '../constants/allPrefKanji';
import getRandomHexColor from '../utils/getRandomHexColor';
import generalStyles from '../style/App.module.css';
import buttonStyles from '../style/Button.module.css';
import classNames from '../utils/classNames';
import CheckBox from '../components/CheckBox';

function App(): JSX.Element {
  const [prefectures, setPrefectures] = React.useState<PrefData[]>([]);
  const [selected, setSelected] = React.useState<
    { name: string; color: string }[]
  >([]);
  const [graphData, setGraphData] = React.useState<Array<any>>([]);
  const [buttonDisable, setButtonDisable] = React.useState<boolean>(false);

  const getPrefectures = async () => {
    setButtonDisable(true);
    const data = await getAllPrefs();
    if (data === 'error') {
      alert('都道府県一覧の取得に失敗しました');
      setButtonDisable(false);
      return;
    }
    setPrefectures(data.result as PrefData[]);
    setButtonDisable(false);
  };

  const addGraphData = (data: GraphData[], initial: Array<any>) => {
    let temp: Array<any> = [];
    if (graphData.length === 0) temp = initial;
    else temp = graphData;

    data.forEach((graph, index) => {
      const pref = allPrefKanji[graph.pref.prefCode - 1];
      temp[index].year = graph.year;
      temp[index][pref] = graph.value;
    });
    setGraphData(temp);
    setSelected([
      ...selected,
      {
        name: allPrefKanji[data[0].pref.prefCode - 1],
        color: getRandomHexColor(),
      },
    ]);
  };

  const checkPrefData = async (prefCode: number) => {
    setButtonDisable(true);
    if (selected.some((e) => e.name === allPrefKanji[prefCode - 1])) {
      // 削除
      setSelected(
        selected.filter((e) => e.name !== allPrefKanji[prefCode - 1]),
      );
      setButtonDisable(false);
      return;
    }

    const data = await getPrefData(prefCode);
    if (data === 'error') {
      alert('都道府県情報の取得に失敗しました');
      setButtonDisable(false);
      return;
    }

    let initial = [];
    const population = data.result.data[0]; // 総人口
    if (graphData.length === 0) {
      initial = population.data.map(
        (info: { year: number; value: number }) => ({
          year: info.year,
        }),
      );
    }

    const giveData: GraphData[] = population.data.map(
      (info: { year: number; value: number }) => ({
        year: info.year,
        value: info.value,
        pref: prefectures[prefCode - 1],
      }),
    );
    addGraphData(giveData, initial);
    setButtonDisable(false);
  };

  const isClicked = (prefCode: number) => {
    const result = selected.some((e) => e.name === allPrefKanji[prefCode - 1]);
    return result;
  };

  return (
    <>
      <main>
        <h1 className={generalStyles.titleText}>人口構成グラフ</h1>

        {prefectures.length === 0 && (
          <div className={generalStyles.prefectureButtonDiv}>
            <button
              className={generalStyles.prefectureButton}
              type="button"
              onClick={getPrefectures}
            >
              都道府県情報を取得
            </button>
          </div>
        )}

        {prefectures.length > 0 && (
          <h3 className={generalStyles.titleText}>
            都道府県を選択してください
          </h3>
        )}

        <div className={generalStyles.checkBoxDiv}>
          {prefectures.map((prefecture: PrefData) => (
            <CheckBox
              type="button"
              key={prefecture.prefCode}
              id={prefecture.prefName}
              className={classNames(
                isClicked(prefecture.prefCode) && `${buttonStyles.checked}`,
              )}
              onClick={() => checkPrefData(prefecture.prefCode)}
              disabled={buttonDisable}
            >
              {allPrefKanji[prefecture.prefCode - 1]}
            </CheckBox>
          ))}
        </div>

        {prefectures.length > 0 && selected.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={graphData}
              margin={{
                top: 10,
                right: 40,
                left: 40,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year">
                <Label value="年" offset={0} position="insideBottomRight" />
              </XAxis>
              <YAxis>
                <Label value="人口" offset={0} position="left" angle={-90} />
              </YAxis>
              <Tooltip />
              <Legend />
              {selected.map((data) => (
                <Line
                  key={data.name}
                  type="monotone"
                  dataKey={data.name}
                  stroke={data.color}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </main>
    </>
  );
}

export default App;
