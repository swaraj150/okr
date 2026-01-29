import { useContext, useState } from 'react';
import type { KeyResult } from '../types/okr_types.ts';
import { KeyResultContext } from '../contexts/KeyResultProvider.tsx';

const KeyResultForm = () => {
    const { keyResultList, addKeyResult } = useContext(KeyResultContext);
    const [keyResult, setKeyResult] = useState<KeyResult>({
        id: 0,
        description: '',
        progress: 0,
    });

    const isDisabled = keyResult.description === '';

    return (
        <>
            <div className="flex flex-col item-center gap-2">
                <label id="keyResult-label">Add Key Results</label>
                <input
                    type="text"
                    className={'rounded-md border px-3 py-2'}
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
                    className={'rounded-md border px-3 py-2'}
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
            </div>

            <button
                className={
                    'border rounded-md px-3 py-1 bg-blue-500 text-white transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2  disabled:bg-blue-300 disabled:cursor-not-allowed'
                }
                type="button"
                onClick={() => {
                    addKeyResult({
                        ...keyResult,
                        id:
                            keyResultList.length > 0
                                ? keyResultList[keyResultList.length - 1].id + 1
                                : 0,
                    });
                    setKeyResult({
                        id: 0,
                        description: '',
                        progress: 0,
                    });
                }}
                disabled={isDisabled}
            >
                Add a Key Result
            </button>
        </>
    );
};

export default KeyResultForm;
