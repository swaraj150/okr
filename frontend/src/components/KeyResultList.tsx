import type { KeyResultState } from '../types/okr_types.ts';
import { useContext, useMemo } from 'react';
import { KeyResultContext } from '../contexts/KeyResultProvider.tsx';

const KeyResultList = ({ mode }: { mode: string }) => {
    const { keyResultList, removeKeyResult, setSelectedKeyResult } =
        useContext(KeyResultContext);

    const handleRemoveKeyResult = (keyResultId: string) => {
        removeKeyResult(keyResultId, mode);
    };
    const visibleKeyResults = useMemo(
        () => keyResultList.filter((kr) => !kr.toDelete),
        [keyResultList]
    );
    return (
        <ul className="divide-y divide-gray-200">
            {visibleKeyResults.length === 0 ? (
                <li className="py-4 text-gray-500 text-center">
                    No key results yet
                </li>
            ) : (
                visibleKeyResults.map((keyResult: KeyResultState) => {
                    return (
                        <li
                            key={keyResult.id}
                            className="py-2 hover:bg-gray-50 transition cursor-pointer"
                            onClick={() => setSelectedKeyResult(keyResult)}
                        >
                            <div className="flex gap-4 items-start">
                                <div className="flex-1 space-y-2">
                                    <p className={'font-medium text-gray-900'}>
                                        {keyResult.description}
                                    </p>
                                    <p className={'text-sm text-gray-500'}>
                                        {keyResult.currentValue} /{' '}
                                        {keyResult.targetValue}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Metric: {keyResult.metricType}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700 px-2 py-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveKeyResult(keyResult.id);
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    );
                })
            )}
        </ul>
    );
};

export default KeyResultList;
