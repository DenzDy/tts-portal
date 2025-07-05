<script lang="ts">
  import { cn } from "$lib/utils";
  export let label = "";
  export let placeholder = "";
  export let value = "";
  export let name = "";
  export let divClasses = "";
</script>

<div class={cn("font-[Garet]", divClasses)}>
  {#if label}
    <label for={name} class="textarea-label">{label}</label>
  {/if}
  <textarea
    id={name}
    name={name}
    bind:value
    placeholder={placeholder}
    class="textarea"
  ></textarea>
</div>

<style>
  .textarea {
    width: 100%;
    min-height: 120px;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    font-family: inherit;
    font-size: 1rem;
    background-color: white;
  }

  .textarea:focus {
    border-color: #F9943B;
    outline: none;
  }

  .textarea-label {
    font-weight: 600;
    display: block;
    margin-bottom: 0.25rem;
  }
</style>
