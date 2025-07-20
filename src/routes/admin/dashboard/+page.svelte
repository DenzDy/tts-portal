<script>
  export let data;
  const { adminSession } = data;
  let { reservations } = data;

  let search = '';

  async function updateStatus(res, newStatus) {
    console.log('updateStatus called with:', { res, newStatus });
    
    const confirmed = confirm(`Are you sure you want to mark "${res.activity}" as "${newStatus}"?`);
    if (!confirmed) return;

    try {
      const requestData = { 
        rowIndex: res.rowIndex, 
        newStatus: newStatus
      };
      
      console.log('Sending request with data:', requestData);

      const response = await fetch('/api/gsheet/update-status', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const result = await response.json();
      console.log('Response body:', result);

      if (response.ok && result.success) {
        // Update the local state
        res.status = newStatus;
        // Force reactivity by reassigning the array
        reservations = [...reservations];
        alert(`Status updated to "${newStatus}" successfully!`);
      } else {
        console.error('Update failed:', result);
        alert(`Failed to update status: ${result.error || 'Unknown error'}\n\nDetails: ${JSON.stringify(result, null, 2)}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(`Network error: ${error.message}`);
    }
  }

  async function logout() {
    const response = await fetch('/admin/logout', {
      method: 'POST'
    });
    
    if (response.redirected) {
      window.location.href = response.url;
    }
  }

  $: filtered = reservations.filter(r => {
    const lowerSearch = search.toLowerCase();
    return (
      r.activity.toLowerCase().includes(lowerSearch) ||
      new Date(r.date).toLocaleDateString().includes(lowerSearch) ||
      r.status.toLowerCase().includes(lowerSearch)
    );
  });

  // Debug: Log reservations data on component mount
  $: {
    console.log('Current reservations data:', reservations);
    console.log('Sample reservation:', reservations[0]);
  }
</script>

<div class="header">
  <h1>Admin Dashboard</h1>
  <div class="user-info">
    <img src={adminSession?.picture} alt="Profile" class="profile-pic" />
    <span class="user-email">{adminSession?.email}</span>
    <button class="logout-btn" on:click={logout}>Logout</button>
  </div>
</div>

<div class="dashboard-container">
  <input
    type="text"
    placeholder="Search by date or activity..."
    bind:value={search}
    class="search-bar"
  />

  {#if filtered.length === 0}
    <p style="text-align: center;">No matching reservations found.</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Activity Name</th>
          <th>Status</th>
          <th>Action</th>
          <th>Debug Info</th> <!-- Temporary debug column -->
        </tr>
      </thead>
      <tbody>
        {#each filtered as res}
          <tr>
            <td>{new Date(res.date).toLocaleDateString()}</td>
            <td>{res.activity}</td>
            <td>
              <span class={
                res.status === 'Approved' ? 'approved' :
                res.status === 'Rejected' ? 'rejected' : 'pending'
              }>
                {res.status}
              </span>
            </td>
            <td>
              {#if res.status === 'Pending'}
                <button class="action-button accept" on:click={() => updateStatus(res, 'Approved')}>Accept</button>
                <button class="action-button reject" on:click={() => updateStatus(res, 'Rejected')}>Reject</button>
              {:else}
                <span class="no-action">No action available</span>
              {/if}
            </td>
            <td style="font-size: 0.8em; color: #666;">
              Row: {res.rowIndex}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .profile-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .user-email {
    font-weight: 500;
    color: #666;
    font-family: 'Garet', sans-serif;
  }

  .logout-btn {
    background: #f44336;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    font-family: 'Garet', sans-serif;
  }

  .logout-btn:hover {
    background: #d32f2f;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    color: #333;
    font-family: 'Garet', sans-serif;
  }

  .dashboard-container {
    width: 90%;
    margin: 0 auto;
    font-family: 'Garet', sans-serif;
  }

  .search-bar {
    width: 100%;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    margin-bottom: 1rem;
    font-family: 'Garet', sans-serif;
    box-sizing: border-box;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    font-family: 'Garet', sans-serif;
  }

  thead {
    background-color: #d3d3d3;
  }

  th, td {
    padding: 1rem;
    border: 1px solid #ccc;
    text-align: left;
    font-family: 'Garet', sans-serif;
  }

  .approved { color: green; }
  .rejected { color: red; }
  .pending { color: orange; }

  .action-button {
    cursor: pointer;
    font-weight: bold;
    background: none;
    border: none;
    font-size: 1rem;
    text-decoration: underline;
    font-family: 'Garet', sans-serif;
    margin-right: 0.5rem;
    padding: 0.25rem 0.5rem;
  }

  .accept { 
    color: green; 
  }
  
  .accept:hover {
    background-color: rgba(0, 128, 0, 0.1);
    border-radius: 4px;
  }
  
  .reject { 
    color: red; 
  }
  
  .reject:hover {
    background-color: rgba(255, 0, 0, 0.1);
    border-radius: 4px;
  }
  
  .no-action { 
    font-style: italic; 
    color: gray; 
  }
</style>