import type { KeyResult } from '../types/okr_types.ts';
import { useContext } from 'react';
import { KeyResultContext } from '../contexts/KeyResultProvider.tsx';

const KeyResultList = () => {
    const { keyResultList } = useContext(KeyResultContext);
    const handleKeyResultProgressValue = (progress: number) => {
        if (progress > 100) return 100;
        else if (progress < 0) return 0;
        return progress;
    };
    return (
        <ul>
            {keyResultList.map((keyResult: KeyResult, index: number) => (
                <li key={index}>
                    <p>Key Result Description is : {keyResult.description}</p>
                    <p>
                        Key Result Progress is :{' '}
                        {handleKeyResultProgressValue(keyResult.progress)}
                    </p>
                </li>
            ))}
        </ul>
    );
};

export default KeyResultList;
