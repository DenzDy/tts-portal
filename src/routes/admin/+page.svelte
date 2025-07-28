<script>
  // Note that this component shouldn't normally render since we redirect in the server load function
  // This is just a fallback
</script>

<div class="admin-redirect-fallback">
  <h1>Redirecting...</h1>
  <p>If you're seeing this, there might be an issue with the redirect. Please try navigating directly to:</p>
  <ul>
    <li><a href="/admin/login">Admin Login</a></li>
    <li><a href="/admin/dashboard">Admin Dashboard</a></li>
  </ul>
</div>

<style>
  .admin-redirect-fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-family: 'Garet', sans-serif;
    text-align: center;
    padding: 2rem;
  }
  
  h1 {
    margin-bottom: 1rem;
    color: #333;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin-top: 1rem;
  }
  
  li {
    margin: 0.5rem 0;
  }
  
  a {
    color: #f9943b;
    text-decoration: none;
    font-weight: 500;
  }
  
  a:hover {
    text-decoration: underline;
  }
</style>