<script>
  export let data;
  const { reservations } = data;

  let search = '';

  async function updateStatus(res, newStatus) {
    const confirmed = confirm(`Are you sure you want to mark this as "${newStatus}"?`);
    if (!confirmed) return;

    const response = await fetch('/api/gsheet/update-status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ row: res.id, newStatus })
    });

    if (response.ok) {
      res.status = newStatus;
    } else {
      alert('Failed to update status.');
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
</script>

<style>
  h1 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .dashboard-container {
    width: 90%;
    margin: 0 auto;
  }

  .search-bar {
    width: 100%;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    margin-bottom: 1rem;
  }

  input[type="text"] {
    width: 100%;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
  }

  thead {
    background-color: #d3d3d3;
  }

  th, td {
    padding: 1rem;
    border: 1px solid #ccc;
    text-align: left;
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
  }

  .accept { color: green; margin-right: 0.5rem; }
  .reject { color: red; }
  .no-action { font-style: italic; color: gray; }
</style>

<h1>Dashboard</h1>

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
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>


