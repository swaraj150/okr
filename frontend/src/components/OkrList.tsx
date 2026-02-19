import type { KeyResultState, ObjectiveState } from '../types/okr_types.ts';
import { KeyResult } from './KeyResult.tsx';
import { ObjectiveMenu } from './ObjectiveMenu.tsx';
import React, { useState } from 'react';
import Modal from './Modal.tsx';
import KeyResultForm from './KeyResultForm.tsx';

interface OkrListProps {
    okrList: ObjectiveState[];
    onEdit: (okr: ObjectiveState) => void;
    onDelete: (okrId: string) => void;
    setFetchOkr: React.Dispatch<React.SetStateAction<boolean>>;
}

const OkrList = ({ okrList, onEdit, onDelete, setFetchOkr }: OkrListProps) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedObjectiveId, setSelectedObjectiveId] = useState<
        string | null
    >(null);

    const onCurrentValueUpdate = (
        keyResultId: string,
        currentValue: number,
        objectiveId: string
    ) => {
        fetch(`${import.meta.env.VITE_BASE_URL}/objective/${objectiveId}/key-result/${keyResultId}/current-value`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentValue: currentValue,
            }),
        }).then(() => {
            setFetchOkr(true);
        });
    };

    const handleAddKeyResult = (
        keyResult: KeyResultState,
        objectiveId: string
    ) => {
        fetch(`${import.meta.env.VITE_BASE_URL}/objective/${objectiveId}/key-result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...keyResult,
                objectiveId,
            }),
        }).then(() => {
            setFetchOkr(true);
        });
    };
    return (
        <div className={'my-5 flex flex-col items-center gap-3 w-full'}>
            {okrList.map((okr) => {
                return (
                    <div
                        key={okr.id}
                        className={
                            'w-full max-w-120 rounded-lg bg-white p-5 border border-gray-200 shadow-sm'
                        }
                    >
                        <div className="flex flex-row justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {okr.title}
                                <span className="ml-2 text-base font-normal text-gray-500">
                                    ({okr.progress}%)
                                </span>
                            </h2>

                            <ObjectiveMenu
                                okr={okr}
                                onAddKeyResult={() => {
                                    setSelectedObjectiveId(okr.id);
                                    setIsAddModalOpen(true);
                                }}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </div>
                        <div className={'mt-3 divide-y divide-gray-200'}>
                            <ul>
                                {okr.keyResults.map((keyResult) => (
                                    <div key={keyResult.id}>
                                        <KeyResult
                                            keyResult={keyResult}
                                            onUpdate={onCurrentValueUpdate}
                                            objectiveId={okr.id}
                                        />
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            })}
            <Modal
                isOpen={isAddModalOpen}
                handleOnClose={() => {
                    setIsAddModalOpen(false);
                }}
            >
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm w-full">
                    <KeyResultForm
                        objectiveId={selectedObjectiveId}
                        onAddKeyResult={handleAddKeyResult}
                    />
                </div>
            </Modal>
        </div>
    );
};
export default OkrList;
