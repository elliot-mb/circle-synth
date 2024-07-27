<script lang='ts'>
    import {SAMPLE_RATE, A_4, ALL_FREQS, NOTE_NAMES, WAV_HEADER_CHUNK, BYTES_IN_16b, NUM_OUT_CHANS} from "$lib/audio/constants";
    import { bufferToWav } from "$lib/audio/converter";
    import { square, squareLerpPW, squarePulseWidth } from "$lib/audio/oscillator";
    import InfoGrid from "$lib/components/InfoGrid.svelte";
    import { onMount } from 'svelte';
    import LineDisplay from "$lib/components/LineDisplay.svelte";

    const seconds: number = 1;
    const playButton = () => {
        return playing ? 'Stop' : 'Play';
    }
    let waveBuffer: Float32Array;
    let soundBuffer: AudioBuffer;
    let audioCtx: AudioContext;
    let source: AudioBufferSourceNode;
    let blobLink: string = 'none';
    let downloader: HTMLAnchorElement;
    let canDownload: boolean = false;
    let sampleRate: number = 0;
    let blobSizeKB: number = 0;
    let fundamental: number;
    let downloadName: string;
    let noteNumber: number = 48;
    let playing: boolean = false;
    let playButtonText: string = playButton();
    let elapsedSeconds: number = 0;

    let drawBuffer: number[] = [];

    onMount(() => {
        const AudioContext = window.AudioContext;

        audioCtx = new AudioContext({sampleRate: SAMPLE_RATE});
        soundBuffer = audioCtx.createBuffer(
            1, //1 is mono
            audioCtx.sampleRate * seconds,
            audioCtx.sampleRate
        );

        waveBuffer = soundBuffer.getChannelData(0);
        sampleRate = audioCtx.sampleRate;
        source = audioCtx.createBufferSource();

        const maybeDownloader = document.getElementById('downloader');
        if(maybeDownloader !== null) {
            downloader = <HTMLAnchorElement> maybeDownloader;
            canDownload = true;
        } 
    });

    const resetWaveBuffer = () => {
        waveBuffer = soundBuffer.getChannelData(0);
    }

    $: {
        if(waveBuffer !== undefined){
            resetWaveBuffer();
            //generate wave
            squareLerpPW(fundamental, seconds, 0.9, 0.5, waveBuffer);
            drawBuffer = [];
            for(let i = 0; i < waveBuffer.length; i++){
                drawBuffer.push(waveBuffer[i]);
            }
        }
    }

    const queryElapsedTime = () => {
        const maybeElapsed = audioCtx.getOutputTimestamp().contextTime;
        elapsedSeconds = maybeElapsed === undefined ? 0 : maybeElapsed;
        if(playing) requestAnimationFrame(queryElapsedTime);
    }

    const playOnRepeat = () => {
        queryElapsedTime();
        source.onended = () => {
            if(playing) playOnRepeat();
        }
        source.start();
    }

    const handleButtonPress = () => {
        playing = !playing;
        playButtonText = playButton();
        if(playing) {
            source = audioCtx.createBufferSource();
            source.buffer = soundBuffer;
            source.connect(audioCtx.destination);
            playOnRepeat();
        }
        if(!playing) source.stop();
    }

    const saveWav = () => {
        const wav: Blob = bufferToWav(soundBuffer, audioCtx.sampleRate * seconds);
        const url = window.URL.createObjectURL(wav);
        downloader.href = url;
        downloader.download = `${downloadName}.wav`;
        downloader.click();
        window.URL.revokeObjectURL(url);
    }

    const displayFreq = (freq: number) => {
        return Math.round(freq * 100)/100;
    }

    $: {
        fundamental = ALL_FREQS[noteNumber];
        downloadName = NOTE_NAMES[noteNumber];
    }

    // const setFundamental = (freq: number, noteName: string) => {
    //     fundamental = freq;
    //     downloadName = noteName;
    // }

    $: blobSizeKB = audioCtx === undefined 
        ? 0 
        : (audioCtx.sampleRate * seconds * BYTES_IN_16b * NUM_OUT_CHANS)/1000;
</script>

<svelte:window/>

<InfoGrid columns={1}>
    <p>Synthesizer Status</p>
</InfoGrid>
<InfoGrid>
    <InfoGrid columns={1}>
        <InfoGrid>
            <p>Sample Rate</p>
            <p>{sampleRate}Hz</p>
            <p>Current Note</p>
            <div class="dropdown ">
                <select name="notes" class="btn btn-secondary" bind:value={noteNumber}>
                    {#each ALL_FREQS as freq, i}
                        {#if freq === A_4}
                            <option value={i} selected>{NOTE_NAMES[i]}</option>
                        {:else}
                            <option value={i} >{NOTE_NAMES[i]}</option>
                        {/if}
                    {/each}
                </select>
            </div>
            <p>{displayFreq(fundamental)}Hz</p>
            <button class='btn-primary' type='button' on:click={handleButtonPress}>{playButtonText}</button>

        </InfoGrid>
        <button type='button' class='btn-primary' style='display: {canDownload ? 'block' : 'none'};' on:click={saveWav}>Download Sample ({blobSizeKB}KB)</button>
    </InfoGrid>
    <LineDisplay data={drawBuffer} zoom={fundamental/seconds} offset={elapsedSeconds/seconds}></LineDisplay>
</InfoGrid>

<InfoGrid columns={1}>
    <p>Sine Terms</p>
</InfoGrid>
<InfoGrid>
    <p>Initial</p>
    <p>Final</p>
    <InfoGrid columns={3}>
        <InfoGrid columns={1}>
            <p>frequency</p>
            <p>2000</p>
        </InfoGrid>
        <p>offset</p>
        <p>amplitude</p>
        <InfoGrid columns={1}>
            <p>frequency</p>
            <p>2000</p>
        </InfoGrid>
        <p>offset</p>
        <p>amplitude</p>
    </InfoGrid>
    <InfoGrid columns={3}>
        <InfoGrid columns={1}>
            <p>frequency</p>
            <p>2000</p>
        </InfoGrid>
        <p>offset</p>
        <p>amplitude</p>
        <InfoGrid columns={1}>
            <p>frequency</p>
            <p>2000</p>
        </InfoGrid>
        <p>offset</p>
        <p>amplitude</p>
    </InfoGrid>
</InfoGrid>

<InfoGrid columns={1}>
    <p>Square Terms</p>
</InfoGrid>
<InfoGrid>
    <p>Initial</p>
    <p>Final</p>
    <InfoGrid columns={3}>
        <InfoGrid columns={1}>
            <p>frequency</p>
            <p>2000</p>
        </InfoGrid>
        <p>offset</p>
        <p>amplitude</p>
        <InfoGrid columns={1}>
            <p>frequency</p>
            <p>2000</p>
        </InfoGrid>
        <p>offset</p>
        <p>amplitude</p>
    </InfoGrid>
    <InfoGrid columns={3}>
        <InfoGrid columns={1}>
            <p>frequency</p>
            <p>2000</p>
        </InfoGrid>
        <p>offset</p>
        <p>amplitude</p>
        <InfoGrid columns={1}>
            <p>frequency</p>
            <p>2000</p>
        </InfoGrid>
        <p>offset</p>
        <p>amplitude</p>
    </InfoGrid>
</InfoGrid>

<a id='downloader' href={blobLink} style='display: none'>save wav</a>