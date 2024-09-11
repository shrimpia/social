import rndstr from "rndstr";

export const generateRandomString = (length: number) => {
    return rndstr({
        chars: 'a-zA-Z0-9',
        length,
    });
};