import { SAMPLE_RATE } from "$lib/audio/constants";


/**
 * creates a squarewave with 0.5 pulsewidth
 * @param freq 
 * @param seconds 
 * @param waveBuffer 
 */
export const square = (freq: number, seconds: number, waveBuffer: Float32Array): void => {
    const samplePeriod = SAMPLE_RATE / freq;
    const squareHalfWave = samplePeriod / 2;
    let lastHalfWaves = 0;
    let high = true;
    for(let i = 0; i < SAMPLE_RATE * seconds; i++){
        const halfWaves = Math.floor(i / squareHalfWave);
        if(halfWaves === lastHalfWaves + 1) high = !high; //switch level
        lastHalfWaves = halfWaves;  

        waveBuffer[i] = high ? 1 : -1; //sets byreference
    }
}

/**
 * creates a squarewave with a desired pulsewidth
 * @param freq 
 * @param seconds 
 * @param width [0-1] 
 * @param waveBuffer 
 */
export const squarePulseWidth = (freq: number, seconds: number, width: number, waveBuffer: Float32Array): void => {
    const samplePeriod = SAMPLE_RATE / freq;
    const squareFullWaveOffset = samplePeriod * width;
    let high = true;
    for(let i = 0; i < SAMPLE_RATE * seconds; i++){
        const switchHighs = Math.floor(i / samplePeriod);
        const switchLows = Math.floor((i + squareFullWaveOffset) / samplePeriod);
        if(switchHighs < switchLows) high = false;
        if(switchHighs >= switchLows) high = true;

        waveBuffer[i] = high ? 1 : -1; //sets byreference
    }
}

export const squareLerpPW = (freq: number, seconds: number, widthA: number, widthB: number, waveBuffer: Float32Array): void => {
    const samplePeriod = SAMPLE_RATE / freq;
    const samples = SAMPLE_RATE * seconds;
    const offsetA = samplePeriod * widthA;
    const offsetB = samplePeriod * widthB;
    const deltaOffset = offsetB - offsetA;
    const offsetStep = deltaOffset / samples; 
    let high = true;
    for(let i = 0; i < SAMPLE_RATE * seconds; i++){
        const currentOffset = offsetA + (i * offsetStep);
        const switchHighs = Math.floor(i / samplePeriod);
        const switchLows = Math.floor((i + currentOffset) / samplePeriod);
        if(switchHighs < switchLows) high = false;
        if(switchHighs >= switchLows) high = true;

        waveBuffer[i] = high ? 1 : -1; //sets byreference
    }
}