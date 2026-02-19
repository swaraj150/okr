import React from 'react';

interface ModalProps {
    children: React.ReactElement;
    isOpen: boolean;
    handleOnClose: () => void;
}
const Modal = ({ children, isOpen, handleOnClose }: ModalProps) => {
    return (
        isOpen && (
            <div
                className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-gray-950/40
            "
                onClick={handleOnClose}
            >
                <div
                    className={'relative'}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <button
                        className={`absolute top-3 right-3 text-red-500 hover:text-red-800`}
                        onClick={handleOnClose}
                    >
                        Close
                    </button>
                    {children}
                </div>
            </div>
        )
    );
};
export default Modal;
