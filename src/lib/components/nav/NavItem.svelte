<script lang="ts">
    export let name;
    export let link;
    export let onClick: () => void;
</script>
<a href={link} class="ml-4 py-4 sm:px-2 font-[League_Spartan] text-[1.25rem]" onclick={onClick}>{name}</a>