import OkrList from './OkrList.tsx';
import Modal from './Modal.tsx';

import OkrForm from './OkrForm.tsx';
import { useEffect, useState } from 'react';
import type { Okr } from '../types/okr_types.ts';
import KeyResultProvider from '../contexts/KeyResultProvider.tsx';

const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fetchOkr, setFetchOkr] = useState<boolean>(true);
    const [okrList, setOkrList] = useState([]);
    const [selectedOkr, setSelectedOkr] = useState<Okr | null>(null);
    useEffect(() => {
        if (fetchOkr) {
            const fetchData = async () => {
                const res = await fetch('http://localhost:3000/okr');
                return await res.json();
            };
            fetchData().then((r) => setOkrList(r));
            setFetchOkr(false);
        }
    }, [fetchOkr]);
    return (
        <div className={'container relative font-mono bg-white'}>
            <div className={'flex justify-between '}>
                <h1 className={' right-1/2 m-3 text-4xl z-20'}>Northstar</h1>
                <button
                    className={
                        'mx-3 my-3 right-0 p-1 border rounded-md bg-gray-700 text-white'
                    }
                    onClick={() => {
                        setIsModalOpen(true);
                        setSelectedOkr(null);
                    }}
                >
                    Add Okr
                </button>
            </div>
            <hr className="mx-3 border-gray-500" />

            <Modal
                isOpen={isModalOpen}
                handleOnClose={() => {
                    setIsModalOpen(false);
                }}
            >
                <KeyResultProvider>
                    <OkrForm
                        setFetchOkr={setFetchOkr}
                        mode={selectedOkr ? 'edit' : 'create'}
                        selectedOkr={selectedOkr}
                    />
                </KeyResultProvider>
            </Modal>
            <OkrList
                okrList={okrList}
                onEdit={(okr) => {
                    setSelectedOkr(okr);
                    setIsModalOpen(true);
                }}
                onDelete={(okrId: string) => {
                    setOkrList((prev) =>
                        prev.filter((okr: Okr) => okr.id != okrId)
                    );
                }}
            />
        </div>
    );
};
export default Home;
