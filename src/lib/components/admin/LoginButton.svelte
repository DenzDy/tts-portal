<script lang="ts">
  export let onClick: () => void;
</script>

<button on:click={onClick} class="login-button">
  <slot>Login</slot>
</button>

<style>
  .login-button {
    width: 100%;
    background-color: #f7942f;
    color: white;
    font-weight: bold;
    border-radius: 4px;
    padding: 12px;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .login-button:hover {
    background-color: #e6831d;
  }
</style>
