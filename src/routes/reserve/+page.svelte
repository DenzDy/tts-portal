<script lang='ts'>
    import Button from '$lib/components/form/Button.svelte';
    import FAQ from '$lib/components/faq/FAQ.svelte';

    export let data;
    let guidelines = data?.guidelines;
    
    let divClasses: string[] = ["my-8", "text-justify"];
    let questionClasses: string[] = ["font-black", "text-lg", "my-1", "text-orange"];
    let answerClasses: string[] = ["text-gray-600"];
</script>

<div class="mx-auto w-5/6 md:w-1/2 my-8">
    <h1 class="text-5xl text-center font-bold">
        Reservation Guidelines
    </h1>

    <div class="w-full mx-auto border-b-2 border-gray-500 my-7"></div>

    {#each guidelines as guideline (guideline[0])}
        <FAQ
            question={guideline?.question}
            answer={guideline?.answer}
            divClass={divClasses}
            questionClass={questionClasses}
            answerClass={answerClasses}
        />
    {/each}

    <Button href="/reserve/new" btnClass={["w-full"]}>Reserve</Button>
</div>