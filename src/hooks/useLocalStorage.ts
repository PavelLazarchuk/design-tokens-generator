import { useEffect, useState } from 'react';

export function useLocalStorage<T>(
    key: string,
    defaultValue: T,
    validate: (raw: unknown) => T | null
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return defaultValue;
            return validate(JSON.parse(raw)) ?? defaultValue;
        } catch {
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // empty
        }
    }, [key, value]);

    return [value, setValue];
}
