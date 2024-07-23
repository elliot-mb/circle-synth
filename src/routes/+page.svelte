<script lang='ts'>
    import {SAMPLE_RATE, A_4} from "$lib/audio/constants";
    import { square, squareLerpPW, squarePulseWidth } from "$lib/audio/oscillator";
    import { onMount } from 'svelte';

    let arrayBuffer: AudioBuffer;
    let arrayBuffer2: AudioBuffer;
    let audioCtx: AudioContext;
    let source: AudioBufferSourceNode;

    let s: number = 0;

    onMount(() => {
        const AudioContext = window.AudioContext;

        audioCtx = new AudioContext({sampleRate: SAMPLE_RATE});
        const seconds = 1;
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
        squarePulseWidth(A_4/8, seconds, 0.5, waveBuffer);

        const waveBuffer2 = arrayBuffer2.getChannelData(0);
        squareLerpPW(A_4, seconds, 0.9, 0.5, waveBuffer2);

        s = audioCtx.sampleRate;
        source = audioCtx.createBufferSource();
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
</script>

<svelte:window/>

<h2>Here is a button to make some noise! @ {s}Hz sample rate</h2>
<button type='button' on:click={handleButtonPress}>noise</button>
<button type='button' on:click={handlePWPress}>noise2</button>