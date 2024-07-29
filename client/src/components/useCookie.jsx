import { useEffect, useState } from "react";
import cookies from 'js-cookie';

function getSavedValue(key, initialValue) {
    let savedValue;
    if (cookies.get(key))
        savedValue = JSON.parse(cookies.get(key))
    if (savedValue)
        return savedValue;
    if (initialValue instanceof Function)
        return initialValue();
    return initialValue;
}

export default function useCookie(key, initialValue) {

    const [value, setValue] = useState(() => {
        return getSavedValue(key, initialValue)
    });

    useEffect(() => {
        cookies.set(key, JSON.stringify(value))
    }, [value])
    return [value, setValue]
}
