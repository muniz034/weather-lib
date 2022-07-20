// deno-lint-ignore-file no-explicit-any
function isExclusion(options: any): boolean {
    return Object.values(options).indexOf(1) === -1;
}

function parseDate(dt: number, offset: number): Date {
    return new Date(dt * 1e3 + offset * 1e3);
}

function projectObject(obj: any, options: any): any {
    let filteredObj: any = {};

    if(isExclusion(options)){
        for(const option in options) if(options[option] === 0) delete obj[option];
        filteredObj = { ...obj };
    } else {
        for(const option in options) if(options[option]) filteredObj[option] = obj[option];
    }

    return filteredObj;
}

export { projectObject, parseDate };