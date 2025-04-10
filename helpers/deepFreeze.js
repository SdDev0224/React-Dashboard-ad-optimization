/**
 * Recursively freeze an object
 * @see https://github.com/substack/deep-freeze
 *
 * @param obj object to be frozen
 */
export const deepFreeze = obj => {
    Object.freeze(obj)

    Object.getOwnPropertyNames(obj).forEach(prop => {
        if (
            // eslint-disable-next-line
            obj.hasOwnProperty(prop) &&
            obj[prop] !== null &&
            (typeof obj[prop] === 'object' ||
                typeof obj[prop] === 'function') &&
            !Object.isFrozen(obj[prop])
        ) {
            deepFreeze(obj[prop])
        }
    })

    return obj
}
