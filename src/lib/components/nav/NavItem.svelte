<script lang="ts">
    export let name;
    export let link;
    export let onClick: () => void;
</script>
<a href={link} class="ml-4 py-4 sm:px-1 font-[League_Spartan] text-[1.25rem] sm:text-[1rem]" onclick={onClick}>{name}</a>