import type { KeyResult } from '../types/okr_types.ts';
type KeyResultListProps = {
  keyResultList: KeyResult[];
};

const KeyResultList = ({ keyResultList }: KeyResultListProps) => {
  return keyResultList.map((keyResult: KeyResult, index: number) => (
    <p key={index}>{keyResult.description}</p>
  ));
};

export default KeyResultList;
