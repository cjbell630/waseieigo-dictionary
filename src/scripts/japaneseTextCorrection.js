const hiraStart = 0x3041;
const hiraEnd = 0x3096;
const kataStart = 0x30A1;
const hiraKataDiff = 0x60; //kataStart-hiraStart
const fwStart = 0xFF00;
const fwEnd = 0xFFEF;
const latinStart = 0x0020;
const fwLatinDiff = 0xFEE0;

function isHiragana(charCode) {
    return hiraStart <= charCode && charCode <= hiraEnd;
}

function convertToKatakana(charCode) {
    return String.fromCharCode(charCode + hiraKataDiff);
}


function isFullWidth(charCode) {
    return fwStart <= charCode && charCode <= fwEnd;
}

function convertFwToLatin(charCode) {
    return String.fromCharCode(charCode - fwLatinDiff);
}

export function convertHiraganaInString(string) {
    return string.split('')
        .map(char => {
            let charCode = char.charCodeAt(0);
            return isHiragana(charCode) ? convertToKatakana(charCode) : isFullWidth(charCode) ? convertFwToLatin(charCode) : char
        })
        .join('');
}

export function removeFinalConsonants(string) {
    return string.replace(/[^aeiou\W\d_]+$/i, '');
}