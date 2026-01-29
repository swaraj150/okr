import { createContext, type ReactNode, useState } from 'react';
import type { KeyResult } from '../types/okr_types.ts';

type KeyResultContextType = {
    keyResultList: KeyResult[];
    addKeyResult: (keyResult: KeyResult) => void;
};

export const KeyResultContext = createContext<KeyResultContextType>({
    keyResultList: [],
    addKeyResult: () => {},
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
    return (
        <KeyResultContext.Provider value={{ keyResultList, addKeyResult }}>
            {children}
        </KeyResultContext.Provider>
    );
};
export default KeyResultProvider;
