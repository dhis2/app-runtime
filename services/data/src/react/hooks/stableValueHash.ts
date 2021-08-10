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
export function stableValueHash(value: any): string {
    return JSON.stringify(value, (_, val) =>
        isPlainObject(val)
            ? Object.keys(val)
                  .sort()
                  .reduce((result, key) => {
                      result[key] = val[key]
                      return result
                  }, {} as any)
            : val
    )
}
