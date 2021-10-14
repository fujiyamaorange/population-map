import { atom } from 'recoil';

import allPrefObj from '../../constants/allPrefObj';
import RecoilAtomKeys from '../../constants/RecoilAtomKeys';
import { Prefecture } from '../prefecture';

/**
 * 取得した都道府県のデータを保存する
 */
const populationGraphData = atom<Record<Prefecture, any>>({
  key: RecoilAtomKeys.GRAPH_DATA,
  default: allPrefObj,
});

export default populationGraphData;
