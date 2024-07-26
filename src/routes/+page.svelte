<script lang='ts'>
    import {SAMPLE_RATE, A_4} from "$lib/audio/constants";
    import { bufferToWav } from "$lib/audio/converter";
    import { square, squareLerpPW, squarePulseWidth } from "$lib/audio/oscillator";
    import { onMount } from 'svelte';

    const seconds: number = 1;
    let arrayBuffer: AudioBuffer;
    let arrayBuffer2: AudioBuffer;
    let audioCtx: AudioContext;
    let source: AudioBufferSourceNode;
    let blobLink: string = 'none';
    let downloader: HTMLAnchorElement;
    let canDownload: boolean = false;

    let s: number = 0;

    onMount(() => {
        const AudioContext = window.AudioContext;

        audioCtx = new AudioContext({sampleRate: SAMPLE_RATE});
        arrayBuffer = audioCtx.createBuffer(
            1, //1 is mono
            audioCtx.sampleRate * seconds,
            audioCtx.sampleRate
        );
        
        arrayBuffer2 = audioCtx.createBuffer(
            1, //1 is mono
            audioCtx.sampleRate * seconds,
            audioCtx.sampleRate
        );

        const waveBuffer = arrayBuffer.getChannelData(0);
        squarePulseWidth(A_4, seconds, 0.5, waveBuffer);

        const waveBuffer2 = arrayBuffer2.getChannelData(0);
        squareLerpPW(A_4, seconds, 0.9, 0.5, waveBuffer2);

        s = audioCtx.sampleRate;
        source = audioCtx.createBufferSource();

        const maybeDownloader = document.getElementById('downloader');
        if(maybeDownloader !== null) {
            downloader = <HTMLAnchorElement> maybeDownloader;
            canDownload = true;
        } 

    });

    const handleButtonPress = () => {
        source = audioCtx.createBufferSource();
        source.buffer = arrayBuffer;
        source.connect(audioCtx.destination);
        source.start();
    }

    const handlePWPress = () => {
        source = audioCtx.createBufferSource();
        source.buffer = arrayBuffer2;
        source.connect(audioCtx.destination);
        source.start();
    }

    const saveWav = () => {
        const wav: Blob = bufferToWav(arrayBuffer2, audioCtx.sampleRate * seconds);
        const url = window.URL.createObjectURL(wav);
        downloader.href = url;
        downloader.download = 'file.wav';
        downloader.click();
        window.URL.revokeObjectURL(url);
    }
</script>

<svelte:window/>

<h2>Here is a button to make some noise! @ {s}Hz sample rate</h2>
<button type='button' on:click={handleButtonPress}>noise</button>
<button type='button' on:click={handlePWPress}>noise2</button>
<button type='button' style='display: {canDownload ? 'block' : 'none'};' on:click={saveWav}>save wav</button>
<a id='downloader' href={blobLink} style='display: none'>save wav</a>