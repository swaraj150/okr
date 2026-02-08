import { useContext, useEffect, useState } from 'react';
import type { KeyResultState } from '../types/okr_types.ts';
import { KeyResultContext } from '../contexts/KeyResultProvider.tsx';

const KeyResultForm = () => {
    const {
        addKeyResult,
        selectedKeyResult,
        setSelectedKeyResult,
        editKeyResult,
    } = useContext(KeyResultContext);
    const [keyResult, setKeyResult] = useState<KeyResultState>({
        id: '',
        description: '',
        progress: '',
    });
    const [isEditable, setIsEditable] = useState(false);
    useEffect(() => {
        console.log(selectedKeyResult);
        if (selectedKeyResult != null) {
            setKeyResult(selectedKeyResult);
            setIsEditable(true);
        } else {
            setKeyResult({
                id: '',
                description: '',
                progress: '',
            });
            setIsEditable(false);
        }
    }, [selectedKeyResult]);
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
                />
            </div>

            <div className={'flex flex-col justify-center'}>
                <button
                    className={'ml-auto text-blue-500 hover:text-blue-700'}
                    type="button"
                    onClick={() => {
                        addKeyResult({
                            ...keyResult,
                            id: `temp_kr_${Date.now()}`,
                        });
                        setKeyResult({
                            id: '',
                            description: '',
                            progress: '',
                        });
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
