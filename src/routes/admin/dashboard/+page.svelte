<script lang="ts">
  const requests = [
    {
      date: '07/14/2025',
      name: 'Activity A',
      status: 'Accepted'
    },
    {
      date: '07/15/2025',
      name: 'Activity B',
      status: 'Pending'
    },
    {
      date: '07/16/2025',
      name: 'Activity C',
      status: 'Rejected'
    }
  ];
</script>

<div class="dashboard-wrapper">
  <h1>Dashboard</h1>

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
      {#each requests as r}
        <tr>
          <td>{r.date}</td>
          <td>{r.name}</td>
          <td>
            <span class={`status ${r.status.toLowerCase()}`}>{r.status}</span>
          </td>
          <td>
            <span class="action accept">Accept</span>
            /
            <span class="action reject">Reject</span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .dashboard-wrapper {
    max-width: 1440px;
    margin: 80px auto;
    font-family: 'Garet', sans-serif;
  }

  h1 {
    text-align: center;
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  }

  th {
    background-color: #d3d3d3;
    text-align: left;
    padding: 12px 16px;
    font-weight: 600;
  }

  td {
    padding: 12px 16px;
    font-weight: 500;
  }

  .status.accepted {
    color: green;
  }

  .status.pending {
    color: #f7942f;
  }

  .status.rejected {
    color: red;
  }

  .action {
    font-weight: 600;
    cursor: pointer;
  }

  .action.accept {
    color: green;
  }

  .action.reject {
    color: red;
    margin-left: 6px;
  }

  @media (max-width: 600px) {
    table {
      font-size: 0.9rem;
    }

    th, td {
      padding: 10px 12px;
    }
  }
</style>
