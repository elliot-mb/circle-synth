// conversion-to-wav related functions go here 

import { BYTES_IN_16b, BYTES_IN_INT, CHAR_SIZE, NIBB_SIZE, NUM_OUT_CHANS, WAV_HEADER_CHUNK, WAV_HEADER_DATA, WAV_HEADER_FMT, WAV_HEADER_RIFF, WAV_HEADER_WAVE, WAV_HEADERSIZE } from "$lib/audio/constants";

/**
 * neatened up version of the conversion function found at 
 * https://russellgood.com/how-to-convert-audiobuffer-to-audio-file/
 * with considerably less magic numbers
 * @param soundBuff 
 * @param len number of samples in the buffer (i.e. its length)
 * @returns blob of type wav
 */
export const bufferToWav = (soundBuff: AudioBuffer, len: number): Blob => {
    const fileSize: number = len * NUM_OUT_CHANS * 2 + WAV_HEADERSIZE;
    const file: ArrayBuffer = new ArrayBuffer(fileSize);
    const view: DataView = new DataView(file);
    
    let offset = 0; 
    let pos = 0;

    const write32b = (data: number): void => {
        view.setUint32(pos, data, true);
        pos += BYTES_IN_INT;
    }
    const write16b = (data: number): void => {
        view.setUint16(pos, data, true);
        pos += BYTES_IN_16b;
    }

    write32b(WAV_HEADER_RIFF);
    write32b(fileSize - CHAR_SIZE);
    write32b(WAV_HEADER_WAVE);
    
    write32b(WAV_HEADER_FMT);
    write32b(WAV_HEADER_CHUNK);
    write16b(1);
    write16b(NUM_OUT_CHANS);
    write32b(soundBuff.sampleRate);
    write32b(soundBuff.sampleRate * 2 * NUM_OUT_CHANS);
    write16b(NUM_OUT_CHANS * 2);
    write16b(WAV_HEADER_CHUNK);

    write32b(WAV_HEADER_DATA);
    write32b(fileSize - pos - NIBB_SIZE);

    const wavData: Float32Array = soundBuff.getChannelData(0);

    while(pos < fileSize){
        for(let i = 0; i < NUM_OUT_CHANS; i++){
            const sample = wavData[offset];
            const scaled = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // |0 truncates into an integer by bitwise or 
            view.setInt16(pos, scaled, true);
            pos += 2;
        }
        offset++;
    }

    return new Blob([file], {type: "audio/wav"});
}