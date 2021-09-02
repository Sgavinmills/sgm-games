export function deepCopyObj(currObj) {
    const newObj = {};
    for(const property in currObj) {
        newObj[property] = {...currObj[property]}
    }
    return newObj;
}
//2021-02-05T11:27:26.563Z
export function convertTime(timeStr) {
    const arr = timeStr.split('T');
    const dmy = arr[0].split('-'); //extractss day month year (dmy) from timeStr
    const smh = arr[1].split('.')[0].split(':'); //extracts seconds minutes hours from timeStr
    let timeStamp = `${dmy[2]}/${dmy[1]}/${dmy[0]} - ${smh[0]}:${smh[1]}`
    return timeStamp
}