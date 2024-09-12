import { proxy } from "valtio";

export const uiState = proxy({
    sidebar: {
        isOpen: false,
    },
});