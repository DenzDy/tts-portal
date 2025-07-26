<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ClassValue } from 'clsx';
	export let type: 'button' | 'submit' = 'button';
	export let variant: 'primary' | 'outline' | 'upload' = 'primary';
	export let icon: string | null = null;
	export let btnClass: ClassValue[] = [];
	export let href: string | null = null;
	export let loading: boolean = false;
</script>

{#if href}
	<a {href} class={cn(`btn ${variant}`, btnClass)}>
		{#if icon}
			<span class="icon">{@html icon}</span>
		{/if}
		<slot />
	</a>
{:else}
	<button
		{type}
		class={cn(`btn ${variant}`, btnClass)}
		disabled={loading}
		aria-disabled={loading}
		{...$$restProps}
	>
		{#if loading}
			<span class={cn('loader', variant === 'outline' && 'loader-outline')}></span>
		{/if}
		{#if icon && !loading}
			<span class="icon">{@html icon}</span>
		{/if}
		<slot />
	</button>
{/if}

<style>
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		filter: grayscale(100%);
	}

	.loader {
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top: 3px solid white;
		border-radius: 50%;
		width: 18px;
		height: 18px;
		animation: spin 0.6s linear infinite;
	}

	.loader-outline {
		border: 3px solid rgba(249, 148, 59, 0.3);
		border-top: 3px solid #f9943b;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

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
		gap: 0.5rem;
	}

	.primary {
		background-color: #f9943b;
		color: white;
		border: 2px solid #f9943b;
	}

	.outline {
		background-color: transparent;
		border: 2px solid #f9943b;
		color: black;
		outline: none;
	}

	.upload {
		background-color: #f9943b;
		color: white;
		border: none;
		gap: 0.5rem;
	}

	.icon {
		display: inline-flex;
		margin-right: 0.5rem;
	}
</style>
