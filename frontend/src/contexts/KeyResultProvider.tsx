import React, { createContext, type ReactNode, useState } from 'react';
import type { KeyResultState } from '../types/okr_types.ts';

type KeyResultContextType = {
    keyResultList: KeyResultState[];
    setKeyResultList: (keyResultList: KeyResultState[]) => void;
    selectedKeyResult: KeyResultState | null;
    setSelectedKeyResult: React.Dispatch<
        React.SetStateAction<KeyResultState | null>
    >;
    addKeyResult: (keyResult: KeyResultState) => void;
    removeKeyResult: (keyResultId: string, mode: string) => void;
    editKeyResult: (keyResult: KeyResultState) => void;
};

export const KeyResultContext = createContext<KeyResultContextType>({
    keyResultList: [],
    setKeyResultList: () => {},
    selectedKeyResult: null,
    setSelectedKeyResult: () => {},
    editKeyResult: () => {},
    addKeyResult: () => {},
    removeKeyResult: () => {},
});

type KeyResultProviderProps = {
    children: ReactNode;
};

const KeyResultProvider = ({ children }: KeyResultProviderProps) => {
    const [keyResultList, setKeyResultList] = useState<KeyResultState[]>([]);
    const [selectedKeyResult, setSelectedKeyResult] =
        useState<KeyResultState | null>(null);

    const addKeyResult = (keyResult: KeyResultState) => {
        setKeyResultList((keyResultList) => [...keyResultList, keyResult]);
    };
    const removeKeyResult = (keyResultId: string, mode: string) => {
        if (keyResultList.length === 0) {
            return;
        } else {
            if (mode === 'create') {
                setKeyResultList((keyResultList) => {
                    return keyResultList.filter(
                        (keyResult) => keyResult.id != keyResultId
                    );
                });
            } else if (mode === 'edit') {
                setKeyResultList((keyResultList) => {
                    return keyResultList.map((kr) => {
                        if (kr.id === keyResultId) {
                            return { ...kr, toDelete: true };
                        }
                        return kr;
                    });
                });
            }
        }
    };
    const editKeyResult = (updatedKeyResult: KeyResultState) => {
        setKeyResultList((prev) =>
            prev.map((kr) =>
                kr.id === updatedKeyResult.id ? updatedKeyResult : kr
            )
        );
        return keyResultList;
    };

    return (
        <KeyResultContext.Provider
            value={{
                keyResultList,
                addKeyResult,
                editKeyResult,
                removeKeyResult,
                setKeyResultList,
                selectedKeyResult,
                setSelectedKeyResult,
            }}
        >
            {children}
        </KeyResultContext.Provider>
    );
};
export default KeyResultProvider;
