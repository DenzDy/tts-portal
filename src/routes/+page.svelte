<script>
    export let data;
    const values = data?.values ?? [];
    async function writeToSheet() {
    console.log("writing to sheet");
    const res = await fetch("/api/gsheet", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        values: [[true, 0, new Date(), 'Test Submit', '2012-34567']],
        targetTab: 'Form Responses'
        })
    });

    const result = await res.json();
    console.log(result);
    }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#each values as row}
    <p>{row}</p>
{/each}

<button type="button" on:click={writeToSheet} style="background-color: black; color: white">Write to Sheet</button>
