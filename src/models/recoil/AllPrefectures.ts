import { atom } from 'recoil';

import RecoilAtomKeys from '../../constants/RecoilAtomKeys';
import { PrefData } from '../prefecture';

const allPrefectures = atom<Array<PrefData>>({
  key: RecoilAtomKeys.ALLL_PREFECTURES,
  default: [],
});

export default allPrefectures;
