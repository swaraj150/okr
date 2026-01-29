import { useContext, useState } from 'react';
import type { KeyResult } from '../types/okr_types.ts';
import { KeyResultContext } from '../contexts/KeyResultProvider.tsx';

const KeyResultForm = () => {
    const { setKeyResultList } = useContext(KeyResultContext);
    const [keyResult, setKeyResult] = useState<KeyResult>({
        description: '',
        progress: 0,
    });

    const isDisabled = keyResult.description === '';

    return (
        <div className="flex flex-col item-center gap-2">
            <label id="keyResult-label">Add Key Results</label>
            <input
                type="text"
                className={'rounded-md border'}
                id={'keyResult-description'}
                name="description"
                required={true}
                value={keyResult.description}
                placeholder={'Enter Description'}
                onChange={(e) => {
                    setKeyResult({
                        ...keyResult,
                        [e.target.name]: e.target.value,
                    });
                }}
            />
            <input
                type="number"
                className={'rounded-md border'}
                id={'keyResult-Progress'}
                name="progress"
                min={0}
                max={100}
                value={keyResult.progress}
                placeholder={'Enter Progress'}
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
                disabled={isDisabled}
            >
                Add
            </button>
        </div>
    );
};

export default KeyResultForm;
