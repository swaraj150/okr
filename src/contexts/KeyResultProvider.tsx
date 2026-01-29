import { createContext, type ReactNode, useState } from 'react';
import type { KeyResult } from '../types/okr_types.ts';

type KeyResultContextType = {
    keyResultList: KeyResult[];
    addKeyResult: (keyResult: KeyResult) => void;
    removeKeyResult: (keyResultId: number) => void;
};

export const KeyResultContext = createContext<KeyResultContextType>({
    keyResultList: [],
    addKeyResult: () => {},
    removeKeyResult: () => {},
});

type KeyResultProviderProps = {
    children: ReactNode;
};

const KeyResultProvider = ({ children }: KeyResultProviderProps) => {
    const [keyResultList, setKeyResultList] = useState<KeyResult[]>([]);
    const addKeyResult = (keyResult: KeyResult) => {
        if (keyResult.description.length > 5) {
            return;
        } else {
            setKeyResultList((keyResultList) => [...keyResultList, keyResult]);
        }
    };
    const removeKeyResult = (keyResultId: number) => {
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
    return (
        <KeyResultContext.Provider
            value={{ keyResultList, addKeyResult, removeKeyResult }}
        >
            {children}
        </KeyResultContext.Provider>
    );
};
export default KeyResultProvider;
