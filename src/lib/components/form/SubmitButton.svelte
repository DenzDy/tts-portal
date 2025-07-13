<script lang="ts">
    import type { ClassValue } from "clsx";
    import Button from './Button.svelte';
    export let btnClass: ClassValue[] = [];
</script>

<Button type="submit" variant="primary" btnClass={btnClass}>
  Submit
</Button>
