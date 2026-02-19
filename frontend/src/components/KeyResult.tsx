import type { KeyResultState } from '../types/okr_types.ts';
import { useState } from 'react';

export const KeyResult = ({
    keyResult,
    onUpdate,
    objectiveId,
}: {
    keyResult: KeyResultState;
    onUpdate: (
        keyResultId: string,
        currentValue: number,
        objectiveId: string
    ) => void;
    objectiveId: string;
}) => {
    const progress = Math.min(
        (keyResult.currentValue / keyResult.targetValue) * 100,
        100
    );
    const formatValue = (value: number, metricType: string) => {
        switch (metricType) {
            case '%':
                return `${value} %`;
            case 'ms':
                return `${value} ms`;
            case 'count':
                return value.toLocaleString();
            case 'currency':
                return `₹${value.toLocaleString()}`;
            default:
                return `${value} ${metricType}`;
        }
    };
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(keyResult.currentValue);
    const isCompleted = keyResult.currentValue >= keyResult.targetValue;

    const handleSave = () => {
        onUpdate(keyResult.id, currentValue, objectiveId);
        setIsEditing(false);
    };

    return (
        <li className="py-3 list-none ">
            <div className="flex items-center justify-between gap-4 ">
                <div className="flex items-center gap-2 flex-1">
                    {isCompleted && <span className="text-green-600">✔</span>}

                    <span
                        className={`text-m ${
                            isCompleted
                                ? 'text-gray-500 line-through'
                                : 'text-gray-900'
                        }`}
                    >
                        {keyResult.description}
                    </span>
                </div>

                {!isEditing && (
                    <span className="text-m font-medium text-green-600 whitespace-nowrap">
                        {isCompleted ? (
                            formatValue(
                                keyResult.targetValue,
                                keyResult.metricType
                            )
                        ) : (
                            <>
                                {keyResult.currentValue}
                                <span className="mx-1 text-gray-400">→</span>
                                {formatValue(
                                    keyResult.targetValue,
                                    keyResult.metricType
                                )}
                            </>
                        )}
                    </span>
                )}
            </div>

            <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded">
                    <div
                        className={`h-2 rounded ${
                            isCompleted ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="mt-1 text-s text-gray-500">
                    {Math.round(progress)}% complete
                </div>
            </div>

            {isEditing && (
                <div className="mt-3 flex items-center gap-3">
                    <input
                        type="range"
                        min={0}
                        max={keyResult.targetValue}
                        value={currentValue}
                        onChange={(e) =>
                            setCurrentValue(Number(e.target.value))
                        }
                        className="flex-1"
                    />

                    <input
                        type="number"
                        value={currentValue}
                        onChange={(e) =>
                            setCurrentValue(Number(e.target.value))
                        }
                        className="w-20 border rounded px-2 py-1 text-sm"
                    />

                    <button
                        onClick={handleSave}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Save
                    </button>

                    <button
                        onClick={() => {
                            setCurrentValue(keyResult.currentValue);
                            setIsEditing(false);
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {!isEditing && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                    Update progress
                </button>
            )}
        </li>
    );
};
