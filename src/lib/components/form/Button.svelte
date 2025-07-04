<!-- src/lib/components/form/Button.svelte -->
<script lang="ts">
  export let type: "button" | "submit" = "button";
  export let variant: "primary" | "outline" | "upload" = "primary";
  export let icon: string | null = null;
</script>

<button type={type} class={`btn ${variant}`}>
  {#if icon}
    <span class="icon">{@html icon}</span>
  {/if}
  <slot />
</button>

<style>
  .btn {
    padding: 0.5rem 1.25rem;
    border-radius: 0.375rem;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .primary {
    background-color: #F9943B;
    color: white;
    border: none;
  }

  .outline {
    background-color: transparent;
    border: 2px solid #F9943B;
    color: black;
    outline: none;
  }

  .upload {
    background-color: #F9943B;
    color: white;
    border: none;
    gap: 0.5rem;
  }

  .icon {
    display: inline-flex;
    margin-right: 0.5rem;
  }
</style>
