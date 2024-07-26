<script lang='ts'>
    import { coinFlip } from "$lib/utils";


    export let columns = 2;

</script>

<style>@import '$lib/styles/InfoGrid.css';</style>


<div class='infogrid' style=
    'grid-template-columns: repeat({columns}, 1fr);'>
    <slot>
        <p>example info</p>
        <p>example info</p>
        <p>example info</p>
        <p>example info</p>
        <p>example info</p>
        <p>example info</p>
    </slot>
</div>