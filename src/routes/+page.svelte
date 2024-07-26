<script lang='ts'>
    import {SAMPLE_RATE, A_4} from "$lib/audio/constants";
    import { bufferToWav } from "$lib/audio/converter";
    import { square, squareLerpPW, squarePulseWidth } from "$lib/audio/oscillator";
    import InfoGrid from "$lib/components/InfoGrid.svelte";
    import { onMount } from 'svelte';

    const seconds: number = 10;
    let soundBuffer: AudioBuffer;
    let audioCtx: AudioContext;
    let source: AudioBufferSourceNode;
    let blobLink: string = 'none';
    let downloader: HTMLAnchorElement;
    let canDownload: boolean = false;

    let sampleRate: number = 0;

    onMount(() => {
        const AudioContext = window.AudioContext;

        audioCtx = new AudioContext({sampleRate: SAMPLE_RATE});
        soundBuffer = audioCtx.createBuffer(
            1, //1 is mono
            audioCtx.sampleRate * seconds,
            audioCtx.sampleRate
        );
        
        const waveBuffer = soundBuffer.getChannelData(0);
        squareLerpPW(A_4, seconds, 0.9, 0.5, waveBuffer);

        sampleRate = audioCtx.sampleRate;
        source = audioCtx.createBufferSource();

        const maybeDownloader = document.getElementById('downloader');
        if(maybeDownloader !== null) {
            downloader = <HTMLAnchorElement> maybeDownloader;
            canDownload = true;
        } 
    });

    const handleButtonPress = () => {
        source = audioCtx.createBufferSource();
        source.buffer = soundBuffer;
        source.connect(audioCtx.destination);
        source.start();
    }

    const saveWav = () => {
        const wav: Blob = bufferToWav(soundBuffer, audioCtx.sampleRate * seconds);
        const url = window.URL.createObjectURL(wav);
        downloader.href = url;
        downloader.download = 'file.wav';
        downloader.click();
        window.URL.revokeObjectURL(url);
    }
</script>

<svelte:window/>

<InfoGrid columns={1}>
    <p>Synthesizer Status</p>
</InfoGrid>
<InfoGrid>
    <InfoGrid>
        <p>Sample Rate</p>
        <p>{sampleRate}Hz</p>
        <InfoGrid columns={1}>
            <p>Current Note</p>
            <button class='btn-primary' type='button' on:click={handleButtonPress}>Play</button>
        </InfoGrid>
        <div class="dropdown">
            <select name="notes">
                <option value={440}>A-3(220)</option>
                <option value={440}>A-4(440)</option>
                <option value={440}>A-5(880)</option>
            </select>
        </div>
    </InfoGrid>
    <p>Waveform</p>
    <p>Sine Terms</p>
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
        <p>frequency</p>
        <p>offset</p>
        <p>amplitude</p>
        <p>frequency</p>
        <p>offset</p>
        <p>amplitude</p>
    </InfoGrid>
    <p>Square Terms</p>
</InfoGrid>


<button type='button' style='display: {canDownload ? 'block' : 'none'};' on:click={saveWav}>save wav</button>
<a id='downloader' href={blobLink} style='display: none'>save wav</a>