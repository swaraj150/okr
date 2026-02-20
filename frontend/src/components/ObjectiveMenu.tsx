import { useState, useRef, useEffect } from 'react';

export const ObjectiveMenu = ({
    okr,
    onAddKeyResult,
    onEdit,
    onDelete,
}: any) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="
                    px-2 py-1
                    text-gray-500
                    hover:text-gray-700
                    text-xl
                "
                aria-label="Objective actions"
            >
                ⋮
            </button>

            {open && (
                <div
                    className="
                        absolute right-0 mt-2 w-40
                        bg-white border border-gray-200
                        rounded-md shadow-lg
                        z-10
                    "
                >
                    <button
                        onClick={() => {
                            onAddKeyResult(okr.id);
                            setOpen(false);
                        }}
                        className="
                            w-full text-left px-4 py-2 text-sm
                            hover:bg-gray-100
                        "
                    >
                        Add a key result
                    </button>

                    <button
                        onClick={() => {
                            onEdit(okr);
                            setOpen(false);
                        }}
                        className="
                            w-full text-left px-4 py-2 text-sm
                            hover:bg-gray-100
                        "
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => {
                            onDelete(okr.id);

                            setOpen(false);
                        }}
                        className="
                            w-full text-left px-4 py-2 text-sm
                            text-red-600 hover:bg-red-50
                        "
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};
