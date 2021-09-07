function hasObjectPrototype(o: any): boolean {
    return Object.prototype.toString.call(o) === '[object Object]'
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/explicit-module-boundary-types
export function isPlainObject(o: any): o is Object {
    if (!hasObjectPrototype(o)) {
        return false
    }

    // If has modified constructor
    const ctor = o.constructor
    if (typeof ctor === 'undefined') {
        return true
    }

    // If has modified prototype
    const prot = ctor.prototype
    if (!hasObjectPrototype(prot)) {
        return false
    }

    // If constructor does not have an Object-specific method
    if (!Object.prototype.hasOwnProperty.call(prot, 'isPrototypeOf')) {
        return false
    }

    // Most likely a plain Object
    return true
}

/**
 * Hashes the value into a stable hash.
 */

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function stableVariablesHash(value: any): string {
    let hash

    try {
        hash = JSON.stringify(value, (_, val) =>
            isPlainObject(val)
                ? Object.keys(val)
                      .sort()
                      .reduce((result, key) => {
                          result[key] = val[key]
                          return result
                      }, {} as any)
                : val
        )
    } catch (e) {
        throw new Error(
            'Could not serialize variables. Make sure that the variables do not contain circular references and can be processed by JSON.stringify.'
        )
    }

    return hash
}
