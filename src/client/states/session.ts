import { proxy } from "valtio";
import { watch } from "valtio/utils";

export const sessionState = proxy({
    token: localStorage.getItem("rekari_token"),
});

watch(get => {
    const t = get(sessionState).token;
    if (t) {
        localStorage.setItem("rekari_token", t);
    } else {
        localStorage.removeItem("rekari_token");
    }
});