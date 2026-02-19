import { useContext, useEffect, useState } from 'react';
import type { KeyResultState } from '../types/okr_types.ts';
import { KeyResultContext } from '../contexts/KeyResultProvider.tsx';

const KeyResultForm = ({
    objectiveId,
    onAddKeyResult,
}: {
    objectiveId: string | null;
    onAddKeyResult: (keyResult: KeyResultState, objectiveId: string) => void;
}) => {
    const {
        addKeyResult,
        selectedKeyResult,
        setSelectedKeyResult,
        editKeyResult,
    } = useContext(KeyResultContext);

    const defaultKeyResultState = {
        id: '',
        description: '',
        currentValue: 0,
        targetValue: 100,
        metricType: 'Percentage',
        toDelete: false,
    };
    const [keyResult, setKeyResult] = useState<KeyResultState>(
        defaultKeyResultState
    );
    const [isEditable, setIsEditable] = useState(false);
    useEffect(() => {
        if (selectedKeyResult != null) {
            setKeyResult(selectedKeyResult);
            setIsEditable(true);
        } else {
            setKeyResult(defaultKeyResultState);
            setIsEditable(false);
        }
    }, [selectedKeyResult]);
    const isDisabled = keyResult.description === '';

    return (
        <>
            <div className="flex flex-col item-center gap-2">
                <label id="keyResult-label">Add a Key Result</label>
                <input
                    type="text"
                    className={'rounded-md border px-3 py-2 w-full'}
                    id={'keyResult-description'}
                    name="description"
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
                    type="text"
                    className={'rounded-md border px-3 py-2 w-full'}
                    id={'keyResult-metricType'}
                    name="metricType"
                    value={keyResult.metricType}
                    placeholder={'Enter Metric Type'}
                    onChange={(e) => {
                        setKeyResult({
                            ...keyResult,
                            [e.target.name]: e.target.value,
                        });
                    }}
                />
                <div className={'flex flex-row gap-2 w-full'}>
                    <input
                        type="number"
                        className={'rounded-md border px-3 py-2 w-full'}
                        id={'keyResult-currentValue'}
                        name="currentValue"
                        min={0}
                        value={keyResult.currentValue}
                        placeholder={'Enter Current Value'}
                        onChange={(e) => {
                            setKeyResult({
                                ...keyResult,
                                [e.target.name]: e.target.valueAsNumber,
                            });
                        }}
                    />
                    <input
                        type="number"
                        className={'rounded-md border px-3 py-2 w-full'}
                        id={'keyResult-targetValue'}
                        name="targetValue"
                        min={0}
                        value={keyResult.targetValue}
                        placeholder={'Enter Target Value'}
                        onChange={(e) => {
                            setKeyResult({
                                ...keyResult,
                                [e.target.name]: e.target.valueAsNumber,
                            });
                        }}
                    />
                </div>
            </div>

            <div className={'flex flex-col justify-center'}>
                <button
                    className={'ml-auto text-blue-500 hover:text-blue-700'}
                    type="button"
                    onClick={() => {
                        if (!objectiveId) {
                            addKeyResult({
                                ...keyResult,
                                id: `temp_kr_${Date.now()}`,
                            });
                            setKeyResult(defaultKeyResultState);
                        } else {
                            onAddKeyResult(keyResult, objectiveId);
                        }
                    }}
                    disabled={isDisabled}
                >
                    Add new Key Result
                </button>
                {isEditable && (
                    <button
                        className={'ml-auto text-blue-500 hover:text-blue-700'}
                        type="button"
                        onClick={() => {
                            editKeyResult({
                                ...keyResult,
                            });
                            setSelectedKeyResult(null);
                        }}
                        disabled={isDisabled}
                    >
                        Edit Key Result
                    </button>
                )}
            </div>
        </>
    );
};

export default KeyResultForm;
