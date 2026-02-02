import React, { createContext, type ReactNode, useState } from 'react';
import type { KeyResult } from '../types/okr_types.ts';

type KeyResultContextType = {
    keyResultList: KeyResult[];
    selectedKeyResult: KeyResult | null;
    setSelectedKeyResult: React.Dispatch<
        React.SetStateAction<KeyResult | null>
    >;
    addKeyResult: (keyResult: KeyResult) => void;
    removeKeyResult: (keyResultId: string) => void;
    editKeyResult: (keyResult: KeyResult) => void;
    setKeyResultList: (keyResultList: KeyResult[]) => void;
};

export const KeyResultContext = createContext<KeyResultContextType>({
    keyResultList: [],
    selectedKeyResult: null,
    setSelectedKeyResult: () => {},
    editKeyResult: () => {},
    addKeyResult: () => {},
    removeKeyResult: () => {},
    setKeyResultList: () => {},
});

type KeyResultProviderProps = {
    children: ReactNode;
};

const KeyResultProvider = ({ children }: KeyResultProviderProps) => {
    const [keyResultList, setKeyResultList] = useState<KeyResult[]>([]);
    const [selectedKeyResult, setSelectedKeyResult] =
        useState<KeyResult | null>(null);
    const addKeyResult = (keyResult: KeyResult) => {
        if (keyResult.description.length > 5) {
            return;
        } else {
            setKeyResultList((keyResultList) => [...keyResultList, keyResult]);
        }
    };
    const removeKeyResult = (keyResultId: string) => {
        if (keyResultList.length === 0) {
            return;
        } else {
            setKeyResultList((keyResultList) => {
                return keyResultList.filter(
                    (keyResult) => keyResult.id != keyResultId
                );
            });
        }
    };
    const editKeyResult = (updatedKeyResult: KeyResult) => {
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
