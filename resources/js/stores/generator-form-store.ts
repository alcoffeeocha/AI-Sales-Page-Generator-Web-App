import { create } from 'zustand';

type State = {
    isOpen: boolean;
};

type Action = {
    setIsOpen: (isOpen: State['isOpen']) => void;
};

export const useGeneratorFormStore = create<State & Action>((set) => ({
    isOpen: false,

    setIsOpen(newOpen) {
        set((_) => ({ isOpen: newOpen }));
    },
}));
