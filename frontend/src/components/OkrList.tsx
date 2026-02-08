import type { KeyResultState, OkrState } from '../types/okr_types.ts';

interface OkrListProps {
    okrList: OkrState[];
    onEdit: (okr: OkrState) => void;
    onDelete: (okrId: string) => void;
}

const KeyResults = ({ keyResults }: { keyResults: KeyResultState[] }) => {
    return (
        <div
            className="
                mt-3
                max-h-36
                overflow-y-auto
                space-y-2
                pr-1

            "
        >
            {keyResults.map((keyResult) => (
                <div
                    key={keyResult.id}
                    className="
                        flex items-center gap-3
                        rounded-md
                        bg-white
                        px-3 py-2
                        shadow-sm
                        border
                    "
                >
                    <input
                        type="checkbox"
                        className="h-4 w-4 accent-blue-600"
                    />

                    <span className="flex-1 text-m text-gray-800">
                        {keyResult.description}
                    </span>

                    <span className="text-m font-medium text-gray-600">
                        {keyResult.progress}%
                    </span>
                </div>
            ))}
        </div>
    );
};

const OkrList = ({ okrList, onEdit, onDelete }: OkrListProps) => {
    const BASE_URL: string = import.meta.env.VITE_BASE_URL;

    return (
        <div className={'my-5 flex flex-col items-center gap-3 w-full'}>
            {okrList.map((okr) => {
                return (
                    <div
                        key={okr.id}
                        className="
                            w-full
                            max-w-120
                            rounded-lg
                            bg-gray-50
                            p-5
                            shadow-md
                        "
                    >
                        <div className="flex flex-row justify-between ">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {okr.title}
                            </h2>
                            <div className="flex gap-3 text-m text-gray-600 ">
                                <button onClick={() => onEdit(okr)}>
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete(okr.id);
                                        fetch(`${BASE_URL}${okr.id}`, {
                                            method: 'DELETE',
                                            headers: {
                                                'Content-Type':
                                                    'application/json',
                                            },
                                        }).then(() => {
                                            alert('Okr Deleted');
                                        });
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div>
                            <KeyResults keyResults={okr.keyResults} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
export default OkrList;
