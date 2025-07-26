<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/form/Button.svelte';

	let isLoading = false;
	let errorMessage = '';

	onMount(() => {
		// Check if there's an error from the callback
		const urlParams = new URLSearchParams(window.location.search);
		const error = urlParams.get('error');
		if (error === 'unauthorized') {
			errorMessage = 'Unauthorized access. Your email is not in the admin list.';
		} else if (error === 'auth_failed') {
			errorMessage = 'Authentication failed. Please try again.';
		}
	});

	async function handleGoogleLogin() {
		isLoading = true;
		errorMessage = '';

		try {
			// Redirect to Google OAuth
			window.location.href = '/auth/google';
		} catch (error) {
			console.error('Login error:', error);
			errorMessage = 'Login failed. Please try again.';
			isLoading = false;
		}
	}
</script>

<div class="login-container">
	<div class="login-card">
		<h1>Admin Login</h1>

		{#if errorMessage}
			<div class="error-message">
				{errorMessage}
			</div>
		{/if}

		<button class="google-login-btn" on:click={handleGoogleLogin} disabled={isLoading}>
			{#if isLoading}
				<div class="spinner"></div>
				Signing in...
			{:else}
				<svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
					<path
						fill="#4285F4"
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					/>
					<path
						fill="#34A853"
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					/>
					<path
						fill="#FBBC05"
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					/>
					<path
						fill="#EA4335"
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					/>
				</svg>
				Login with Google
			{/if}
		</button>
		<Button href="/" type="button" btnClass={['mt-5', 'w-full']}>Back to Home</Button>
	</div>
</div>

<style>
	.login-container {
		min-height: calc(100vh - 56px); /* Account for navbar height */
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f5f5f5;
		font-family: 'Garet', sans-serif;
		padding: 1rem 0;
		box-sizing: border-box;
	}

	.login-card {
		background: white;
		padding: 3rem 2rem;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		text-align: center;
		width: 90%;
		max-width: 400px;
		margin: 1rem;
		box-sizing: border-box;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 2rem;
		color: #333;
		font-family: 'Garet', sans-serif;
	}

	.google-login-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		width: 100%;
		padding: 12px 24px;
		border: 2px solid #dadce0;
		border-radius: 8px;
		background: white;
		color: #3c4043;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		box-sizing: border-box;
	}

	.google-login-btn:hover:not(:disabled) {
		border-color: #4285f4;
		box-shadow: 0 2px 8px rgba(66, 133, 244, 0.2);
	}

	.google-login-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.google-icon {
		flex-shrink: 0;
	}

	.error-message {
		background: #fee;
		color: #d93025;
		padding: 12px;
		border-radius: 6px;
		margin-bottom: 1rem;
		border: 1px solid #fce8e6;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid #f3f3f3;
		border-top: 2px solid #4285f4;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
