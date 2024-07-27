<script lang='ts'>

    /*
    copy of linedisplay but seeing if its faster not passing state to it 
    */
    //export const range: number[] = [0,3]; //show which to what sample
    export let fundamental: number = 440;
    export let seconds: number = 1;

    export let audioCtx: AudioContext;
    export let soundBuffer: AudioBuffer;

    let data: Float32Array = new Float32Array(); //normalised! 
    let elapsedSeconds: number = 0;
    let source: AudioBufferSourceNode;
    let zoom: number = 1;
    let playing: boolean = false;

    $: {
        fundamental; //update data with fundamental
        if(soundBuffer !== undefined)
            data = new Float32Array(soundBuffer.getChannelData(0));
    }

    $: zoom = fundamental/seconds;

    const makeAudioBufferNode = () => {
        source = audioCtx.createBufferSource();
        source.buffer = soundBuffer;
        source.connect(audioCtx.destination);
    }

    const playOnRepeat = () => {
        makeAudioBufferNode();
        source.start();
        source.onended = () => {
            if(playing) { 
                playOnRepeat();
            }
        };
    }

    export const toggle = (p: boolean) => {
        playing = p;
        makeAudioBufferNode();
        if(playing) {
            playOnRepeat();
        }
        //else if(!playing && source !== null ) source.stop();
    }

    import { onMount } from "svelte";

    const WIDTH = 500;
    const HEIGHT = 250;
    const DRAW_HEIGHT = 100; // 25px margin on top and bottom
    const setStep = (dat: Float32Array) => dat.length - 1 === 0 ? 0 : (WIDTH * zoom) / (dat.length - 1);

    let step: number = setStep(data);
    let ctx: CanvasRenderingContext2D;

    onMount(() => {
        const maybeCanvas =  document.querySelector('canvas');;
        if(maybeCanvas !== null){
            const canvasPtr = <HTMLCanvasElement> document.querySelector('canvas');
            ctx = canvasPtr.getContext('2d')!;
            drawDataLoop();
        }
    });

    $: step = setStep(data);

    const drawDataLoop = (): void => {
        const offset = elapsedSeconds/seconds;
        ctx.fillStyle = '#343a40';
        ctx.fillRect(0, 0, WIDTH, HEIGHT); 
        ctx.strokeStyle = '#f8f9fa';
        ctx.lineWidth = 1;
        ctx.moveTo(0 - (offset * WIDTH * zoom), (DRAW_HEIGHT * data[0]) + HEIGHT / 2);
        ctx.beginPath();
        data.forEach((x, i) => ctx.lineTo(i * step - (offset * WIDTH * zoom), (DRAW_HEIGHT * x) + HEIGHT / 2));
        ctx.stroke();
        requestAnimationFrame(drawDataLoop);
    }
</script>

<style>@import '$lib/styles/LineDisplay.css';</style>

<canvas width={WIDTH} height={HEIGHT}>

</canvas>