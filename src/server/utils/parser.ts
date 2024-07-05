const fillWithEightZeros = (t: string) => t.padStart(8, "0")
const toBinary = (t: string) => fillWithEightZeros(t.toString())
const fromBinaryToDecimal = (t: string) => parseInt(toBinary(t), 2)
const getCharFromBinary = (t: string) => String.fromCharCode(fromBinaryToDecimal(t));