<script lang='ts'>
    import { cn } from "$lib/utils";
    import type { ClassValue } from "clsx";
    export let question: string = "";
    export let answer: string = "";
    export let divClass: ClassValue[] = [];
    export let questionClass: ClassValue[] = [];
    export let answerClass: ClassValue[] = [];
</script>

<div class={cn("text-wrap", "font-[Garet]", divClass)}>
    <h3 class={cn("text-wrap", questionClass)}>{@html question}</h3>
    <p class={cn("text-wrap", answerClass)}>{@html answer}</p>
</div>