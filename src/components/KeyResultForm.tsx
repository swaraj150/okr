import React, { useState } from 'react';
import type { KeyResult } from '../types/okr_types.ts';

type KeyResultFormProps = {
  setKeyResultList: React.Dispatch<React.SetStateAction<KeyResult[]>>;
};

const KeyResultForm = ({ setKeyResultList }: KeyResultFormProps) => {
  const [keyResult, setKeyResult] = useState<KeyResult>({
    description: '',
    progress: '',
  });

  return (
    <div className="flex flex-col item-center gap-2">
      <label id="keyResult-label">Add Key Results</label>
      <input
        type="text"
        className={' rounded-md  border'}
        id={'keyResult-description'}
        name="description"
        required={true}
        value={keyResult.description}
        onChange={(e) => {
          setKeyResult({
            ...keyResult,
            [e.target.name]: e.target.value,
          });
        }}
      />
      <input
        type="text"
        className={'rounded-md  border'}
        id={'keyResult-Progress'}
        name="progress"
        value={keyResult.progress}
        onChange={(e) => {
          setKeyResult({
            ...keyResult,
            [e.target.name]: e.target.value,
          });
        }}
        required={true}
      />
      <button
        className={'border rounded-md px-3 py-1 bg-blue-500 text-white'}
        type="button"
        onClick={() => {
          setKeyResultList((keyResultList: KeyResult[]) => [
            ...keyResultList,
            keyResult,
          ]);
        }}
      >
        Add
      </button>
    </div>
  );
};

export default KeyResultForm;
