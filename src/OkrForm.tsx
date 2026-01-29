import React, { useState } from 'react';
import KeyResultForm from './components/KeyResultForm.tsx';
import type { KeyResult } from './types/okr_types.ts';
import KeyResultList from './components/KeyResultList.tsx';

export default function OkrForm() {
  const [keyResultList, setKeyResultList] = useState<KeyResult[]>([]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log('Objective is: ' + data.get('objective'));
    console.log('Key Result is: ' + data.get('keyResult'));
  };
  return (
    <>
      <div
        className={
          'flex w-full min-h-screen justify-center items-center border  font-mono bg-gray-300 '
        }
      >
        <div className={'absolute top-20  text-2xl font-bold'}>
          <p className={'font-bold text-5xl'}>OKR Form</p>
        </div>
        <form
          className={
            'flex flex-col w-100 h-auto gap-5 p-10 border rounded-md shadow-xl bg-gray-100'
          }
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col item-center justify-center  gap-2">
            <label id="objective-label">Add an Objective</label>
            <input
              type="text"
              className={' rounded-md  border'}
              id={'objective-input'}
              name="objective"
              required={true}
            />
          </div>
          <KeyResultForm setKeyResultList={setKeyResultList} />
          <div className={'flex gap-4 justify-center'}>
            <button
              className={'border rounded-md px-3 py-1 bg-blue-500 text-white'}
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
          <KeyResultList keyResultList={keyResultList} />
        </form>
      </div>
    </>
  );
}
