import React, { useContext, useEffect, useState } from 'react';
import KeyResultForm from './KeyResultForm.tsx';
import KeyResultList from './KeyResultList.tsx';
import { KeyResultContext } from '../contexts/KeyResultProvider.tsx';
import type { ObjectiveState } from '../types/okr_types.ts';

export default function OkrForm({
    setFetchOkr,
    mode,
    selectedOkr,
}: {
    setFetchOkr: React.Dispatch<React.SetStateAction<boolean>>;
    mode: string;
    selectedOkr: ObjectiveState | null;
}) {
    const [objective, setObjective] = useState<string>('');

    const { keyResultList, setKeyResultList } = useContext(KeyResultContext);
    const BASE_URL: string = import.meta.env.VITE_OBJECTIVE_BASE_URL;
    useEffect(() => {
        if (selectedOkr != null) {
            setObjective(selectedOkr.title);
            setKeyResultList(selectedOkr.keyResults);
        }
    }, []);
    const handleSubmit = (
        e: React.SubmitEvent<HTMLFormElement>,
        mode: string
    ) => {
        e.preventDefault();
        if (mode === 'create' || selectedOkr === null) {
            const objective = new FormData(e.currentTarget).get('objective');
            if (!objective || !keyResultList) {
                return;
            }
            if (keyResultList.length == 0) {
                alert('Please add Key Results');
                return;
            }
            const okr: ObjectiveState = {
                id: `temp_okr_${Date.now()}`,
                title: objective.toString(),
                progress: '0',
                keyResults: keyResultList,
            };
            fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(okr),
            }).then(() => {
                setFetchOkr(true);
                alert('Okr added');
            });
        } else if (mode == 'edit' && selectedOkr != null) {
            setObjective(objective);
            const keyResultsToSend = keyResultList.map((kr) => {
                if (kr.id.startsWith('temp_kr')) {
                    return { ...kr, toCreate: true };
                }
                return kr;
            });
            const okr: ObjectiveState = {
                id: selectedOkr.id,
                title: objective,
                progress: '0',
                keyResults: keyResultsToSend,
            };
            fetch(BASE_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(okr),
            }).then(() => {
                setFetchOkr(true);
                alert('Okr edited');
            });
        } else return;
    };

    return (
        <div className={'flex w-full justify-center items-center font-mono'}>
            <form
                className={
                    'flex flex-col w-125 min-h-[90vh] max-h-[90vh] gap-4 p-10 rounded-md shadow-xl bg-gray-100'
                }
                onSubmit={(e) => handleSubmit(e, mode)}
            >
                <p className={'font-bold text-5xl'}>OKR Form</p>
                <div className="flex flex-col item-center justify-center gap-2">
                    <label id="objective-label">Add an Objective</label>
                    <input
                        type="text"
                        className={'rounded-md  border px-3 py-2'}
                        id={'objective-input'}
                        name="objective"
                        placeholder={'Enter an Objective'}
                        value={objective}
                        onChange={(e) => {
                            setObjective(e.target.value);
                        }}
                        required={true}
                    />
                </div>
                <KeyResultForm objectiveId={null} onAddKeyResult={() => {}} />
                <div className={'flex gap-4 justify-center'}>
                    <button
                        className={
                            'border rounded-md px-3 py-1.5 bg-gray-700 text-white'
                        }
                    >
                        Submit
                    </button>
                    <button
                        type="reset"
                        className={'border rounded-md px-3 py-1 bg-gray-300'}
                    >
                        Clear
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto border rounded-md px-3 py-2 bg-white">
                    <KeyResultList mode={mode} />
                </div>
            </form>
        </div>
    );
}
