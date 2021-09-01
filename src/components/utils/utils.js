export function deepCopyObj(currObj) {
    const newObj = {};
    for(const property in currObj) {
        newObj[property] = {...currObj[property]}
    }
    return newObj;
}