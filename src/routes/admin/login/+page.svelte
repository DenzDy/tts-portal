<script lang="ts">
  import LoginButton from '$lib/components/admin/LoginButton.svelte';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';

  const handleLogin = () => {
    error = '';

    if (!email || !password) {
      error = 'Please fill out all the fields';
      return;
    }

    if (email === 'admin@gmail.com' && password === 'securepass123') {
      goto('/admin/dashboard');
    } else {
      error = 'Invalid credentials';
    }
  };
</script>

<form class="login-container" on:submit|preventDefault={handleLogin}>
  <h1>Admin Login</h1>

  <label for="email">Email Address</label>
  <input
    id="email"
    type="email"
    bind:value={email}
    placeholder="example@email.com"
  />

  <label for="password">Password</label>
  <input
    id="password"
    type="password"
    bind:value={password}
    placeholder="1234567890"
  />

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <LoginButton type="submit" />
</form>

<style>
  .login-container {
    max-width: 400px;
    margin: 80px auto;
    padding: 0 20px;
    font-family: 'Garet', sans-serif;
  }

  h1 {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 32px;
  }

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 0.95rem;
  }

  input {
    width: 100%;
    padding: 10px 12px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-family: 'Garet', sans-serif;
    font-size: 0.95rem;
    box-sizing: border-box;
  }

  .error {
    color: #d9534f;
    background-color: #f8d7da;
    border: 1px solid #f5c2c7;
    border-radius: 4px;
    padding: 10px;
    font-size: 0.9rem;
    margin-bottom: 20px;
    text-align: center;
  }

  @media (max-width: 480px) {
    .login-container {
      padding: 0 12px;
      margin: 40px auto;
    }

    h1 {
      font-size: 1.5rem;
    }

    input {
      font-size: 1rem;
    }
  }
</style>
