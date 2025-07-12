<script lang="ts">
  import { cn } from "$lib/utils";
  import type { ClassValue } from "clsx";
  export let type: "button" | "submit" = "button";
  export let variant: "primary" | "outline" | "upload" = "primary";
  export let icon: string | null = null;
  export let btnClass: ClassValue[] = [];
  export let href: string | null = null;
</script>

{#if href}
  <a href={href} class={cn(`btn ${variant}`, btnClass)}>
    {#if icon}
      <span class="icon">{@html icon}</span>
    {/if}
    <slot />
  </a>
{:else}
  <button type={type} class={cn(`btn ${variant}`, btnClass)}>
    {#if icon}
      <span class="icon">{@html icon}</span>
    {/if}
    <slot />
  </button>
{/if}

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
    text-decoration: none;
  }

  .primary {
    background-color: #F9943B;
    color: white;
    border: 2px solid #F9943B;
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
