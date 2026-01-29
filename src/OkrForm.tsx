import React from 'react';
import KeyResultForm from './components/KeyResultForm.tsx';
import KeyResultList from './components/KeyResultList.tsx';

export default function OkrForm() {
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        console.log('Objective is: ' + data.get('objective'));
    };

    return (
        <div
            className={
                'flex w-full min-h-screen justify-center items-center border font-mono bg-gray-300'
            }
        >
            <form
                className={
                    'flex flex-col w-125 min-h-[90vh]  max-h-[90vh] gap-5 p-10 border rounded-md shadow-xl bg-gray-100'
                }
                onSubmit={handleSubmit}
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
                        required={true}
                    />
                </div>
                <KeyResultForm />
                <div className={'flex gap-4 justify-center'}>
                    <button
                        className={
                            'border rounded-md px-3 py-1 bg-blue-500 text-white'
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
                    <KeyResultList />
                </div>
            </form>
        </div>
    );
}
