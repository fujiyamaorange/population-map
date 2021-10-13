import React from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import initialGraphData from '../constants/initialGraphData';
import getPrefData from '../utils/api/getPrefData';
import { PrefData } from '../models/prefecture';
import { GraphData } from '../models/GraphData';
import getAllPrefs from '../utils/api/getAllPrefs';
import allPrefKanji from '../constants/allPrefKanji';
import getRandomHexColor from '../utils/getRandomHexColor';

function App(): JSX.Element {
  const [prefectures, setPrefectures] = React.useState<PrefData[]>([]);
  const [selected, setSelected] = React.useState<
    { name: string; color: string }[]
  >([]);
  const [graphData, setGraphData] = React.useState<any>(initialGraphData);

  const [buttonDisable, setButtonDisable] = React.useState<boolean>(false);

  const getPrefectures = async () => {
    setButtonDisable(true);
    const data = await getAllPrefs();
    if (data === 'error') {
      // エラー処理
      alert('都道府県一覧の取得に失敗しました');
      setButtonDisable(false);
      return;
    }
    setPrefectures(data.result as PrefData[]);
    setButtonDisable(false);
  };

  const addGraphData = (data: GraphData[]) => {
    const temp = graphData;
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
    // 総人口のデータ
    const population = data.result.data[0];
    const giveData: GraphData[] = population.data.map(
      (info: { year: number; value: number }) => ({
        year: info.year,
        value: info.value,
        pref: prefectures[prefCode - 1],
      }),
    );
    addGraphData(giveData);
    setButtonDisable(false);
    console.log(giveData);
  };

  const isClicked = (prefCode: number) => {
    const result = selected.some((e) => e.name === allPrefKanji[prefCode - 1]);
    return result;
  };

  return (
    <>
      <div>
        <main>
          {prefectures.length === 0 && (
            <button type="button" onClick={getPrefectures}>
              都道府県情報を取得
            </button>
          )}

          {prefectures.map((prefecture: PrefData) => (
            <button
              key={prefecture.prefCode}
              type="button"
              onClick={() => checkPrefData(prefecture.prefCode)}
            >
              <label htmlFor="scales">
                <input
                  type="checkbox"
                  id="scales"
                  name="scales"
                  readOnly
                  checked={isClicked(prefecture.prefCode)}
                  disabled={buttonDisable}
                />
                {allPrefKanji[prefecture.prefCode - 1]}
              </label>
            </button>
          ))}

          <LineChart
            width={730}
            height={250}
            data={graphData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
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
        </main>
      </div>
    </>
  );
}

export default App;
