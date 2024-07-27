<script lang='ts'>
    import { onMount } from "svelte";


    /*
    we want this to be able to zoom and 
    display a single line
    */
    export let data: number[] = [1,1,-1,-1]; //normalised! 
    //export const range: number[] = [0,3]; //show which to what sample
    export let offset: number = 0; //proportion of the line we are scrolled through
    export let zoom: number = 1; //proportion of zoom (1 = 100%)
    
    const WIDTH = 500;
    const HEIGHT = 250;
    const DRAW_HEIGHT = 100; // 25px margin on top and bottom
    const setStep = (dat: number[]) => dat.length - 1 === 0 ? 0 : (WIDTH * zoom) / (dat.length - 1);
    
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