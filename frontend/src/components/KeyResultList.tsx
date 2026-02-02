import type { KeyResult } from '../types/okr_types.ts';
import { useContext } from 'react';
import { KeyResultContext } from '../contexts/KeyResultProvider.tsx';

const KeyResultList = () => {
    const { keyResultList, removeKeyResult, setSelectedKeyResult } =
        useContext(KeyResultContext);
    const handleKeyResultProgressValue = (progress: number) => {
        if (progress > 100) return 100;
        else if (progress < 0) return 0;
        return progress;
    };
    const handleRemoveKeyResult = (keyResultId: string) => {
        removeKeyResult(keyResultId);
    };
    return (
        <ul className={'divide-y divide-gray-500'}>
            {keyResultList.map((keyResult: KeyResult) => (
                <li key={keyResult.id}>
                    <div className={'flex gap-4'}>
                        <div onClick={() => setSelectedKeyResult(keyResult)}>
                            <p>
                                Key Result Description is :{' '}
                                {keyResult.description}
                            </p>
                            <p>
                                Key Result Progress is :{' '}
                                {handleKeyResultProgressValue(
                                    parseInt(keyResult.progress, 10)
                                ) + '%'}
                            </p>
                        </div>
                        <button
                            type="button"
                            className={
                                'ml-auto text-red-500 hover:text-red-700 px-2 py-2'
                            }
                            onClick={() => handleRemoveKeyResult(keyResult.id)}
                        >
                            Remove
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default KeyResultList;
