// @ts-ignore
import * as alfy from 'alfy'

export const get = async <T>(
    key: string,
    compute: () => Promise<T>,
    maxAge: number | undefined = undefined,
): Promise<T> => {
    const value = alfy.cache.get(key)

    if (!value) {
        const newValue = await compute()
        alfy.cache.set(key, newValue, {maxAge})
        return newValue
    }

    return value
}
