export const SAMPLE_RATE = 192000; //44.1KHz
export const A_4 = 440; //Hz (A above middle C, C_4)
export const NUM_OUT_CHANS = 2;
export const WAV_HEADERSIZE = 44;
export const WAV_HEADER_RIFF = 0x46464952;
export const WAV_HEADER_WAVE = 0x45564157;
export const WAV_HEADER_FMT = 0x20746d66;
export const WAV_HEADER_DATA = 0x61746164;
export const NIBB_SIZE = 4;
export const CHAR_SIZE = 8;
export const WAV_HEADER_CHUNK = 16;
export const BYTES_IN_INT = 4;
export const BYTES_IN_16b = 2;
export const SEMITONE_SPACING = Math.pow(2, 1 / 12);
export const NOTES = Array.from(Array(9).keys()).map((x, i) => 55 * Math.pow(2, i)); //frequencies of A_1 to A_9
export const ALL_NOTES = NOTES.map(f => Array.from(Array(12).keys()).map((x, i) => f * Math.pow(SEMITONE_SPACING, i)));
console.log(ALL_NOTES);