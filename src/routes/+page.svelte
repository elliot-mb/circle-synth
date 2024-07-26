<script lang='ts'>
    import {SAMPLE_RATE, A_4} from "$lib/audio/constants";
    import { bufferToWav } from "$lib/audio/converter";
    import { square, squareLerpPW, squarePulseWidth } from "$lib/audio/oscillator";
    import { onMount } from 'svelte';

    const seconds: number = 1;
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

<h2>Here is a button to make some noise! @ {sampleRate}Hz sample rate</h2>
<button type='button' on:click={handleButtonPress}>noise</button>
<button type='button' style='display: {canDownload ? 'block' : 'none'};' on:click={saveWav}>save wav</button>
<a id='downloader' href={blobLink} style='display: none'>save wav</a>