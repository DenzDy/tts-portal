<script>
	import { goto } from '$app/navigation';
	export let data;
	let { reservations } = data;

	let search = '';

	$: if (reservations && reservations.length > 0) {
		reservations = reservations.map((res, index) => ({
			...res,
			rowIndex: res.rowIndex || index + 2 // Fallback calculation
		}));
	}

	// Function to format date properly
	function formatDate(dateString) {
		if (!dateString || dateString === 'N/A') return 'N/A';

		try {
			const date = new Date(dateString);
			// Check if date is valid
			if (isNaN(date.getTime())) return dateString;

			// Format as MM/DD/YYYY
			const month = date.getMonth() + 1; // getMonth() returns 0-11
			const day = date.getDate();
			const year = date.getFullYear();

			return `${month}/${day}/${year}`;
		} catch (error) {
			return dateString; // Return original if parsing fails
		}
	}

	async function updateStatus(res, newStatus) {
		console.log('=== BUTTON CLICKED ===');
		console.log('Full object:', res);
		console.log('rowIndex:', res.rowIndex);

		// Use a fallback rowIndex calculation if it's still undefined
		let actualRowIndex = res.rowIndex;
		if (!actualRowIndex) {
			// Find the index in the array and calculate row number
			const arrayIndex = reservations.findIndex(
				(r) => r.activity === res.activity && r.status === res.status
			);
			actualRowIndex = arrayIndex + 2;
			console.log('Calculated fallback rowIndex:', actualRowIndex);
		}

		if (!actualRowIndex || actualRowIndex < 2) {
			alert(`Still can't determine row index. Array index calculation failed.`);
			return;
		}

		const confirmed = confirm(`Update "${res.activity}" to "${newStatus}"?`);
		if (!confirmed) return;

		try {
			const requestData = {
				rowIndex: parseInt(actualRowIndex),
				newStatus: newStatus,
				fromDashboard: true // Flag to indicate this is from dashboard
			};

			console.log('Sending:', requestData);

			const response = await fetch('/api/gsheet/update-status', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestData)
			});

			const result = await response.json();

			if (response.ok && result.success) {
				res.status = newStatus;
				reservations = [...reservations];
				alert(`Updated to "${newStatus}"! Cost set to ₱0 for dashboard approval.`);
			} else {
				alert(`Failed: ${result.error}`);
			}
		} catch (error) {
			alert(`Error: ${error.message}`);
		}
	}

	async function logout() {
		const response = await fetch('/admin/logout', { method: 'POST' });
		if (response.redirected) {
			// Replace current history entry instead of adding new one
			window.location.replace(response.url);
		}
	}

	async function goHome() {
		await goto('/');
	}

	$: filtered = reservations.filter((r) => {
		if (!search) return true;
		const lowerSearch = search.toLowerCase();
		const formattedDate = formatDate(r.date).toLowerCase(); // Use formatted date for search

		return (
			r.activity?.toLowerCase().includes(lowerSearch) ||
			formattedDate.includes(lowerSearch) || // Search formatted date (8/10/2025)
			r.date?.toLowerCase().includes(lowerSearch) || // Also search raw date (in case someone searches 2025-08)
			r.status?.toLowerCase().includes(lowerSearch)
		);
	});
</script>

<div class="header flex flex-col sm:header">
	<h1>Admin Dashboard</h1>
	<div class="user-info">
		<button class="logout-btn text-[0.75rem] sm:logout-btn" on:click={logout}>Logout</button>
		<button class="back-home-btn text-[0.75rem] sm:back-home-btn" on:click={goHome}>Back to Home</button>
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
		<p style="text-align: center; padding: 2rem;">No reservations found.</p>
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
				{#each filtered as res, index}
					<tr>
						<td>{formatDate(res.date)}</td>
						<td>
							<a href="/admin/reservation/{res.rowIndex}" class="activity-link">
								{res.activity}
							</a>
						</td>
						<td>
							<span
								class={res.status === 'Approved'
									? 'approved'
									: res.status === 'Rejected'
										? 'rejected'
										: 'pending'}
							>
								{res.status}
							</span>
						</td>
						<td>
							{#if res.status === 'Pending'}
								<button
									class="action-button approve"
									on:click={() => updateStatus(res, 'Approved')}
								>
									Approve
								</button>
								<button class="action-button reject" on:click={() => updateStatus(res, 'Rejected')}>
									Reject
								</button>
							{:else}
								<span class="no-action">Already {res.status}</span>
							{/if}
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
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

	.back-home-btn {
		background: #f9943b;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
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
		max-height: calc(100vh - 140px);
		overflow-y: scroll;
		scrollbar-width: thin;
	}

	.dashboard-container::-webkit-scrollbar {
		width: 12px;
		display: block;  
	}

	.dashboard-container::-webkit-scrollbar-track {
		background: #f1f1f1; 
	}

	.dashboard-container::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 6px; 
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

	th,
	td {
		padding: 1rem;
		border: 1px solid #ccc;
		text-align: left;
		font-family: 'Garet', sans-serif;
	}

	.activity-link {
		color: #007bff;
		text-decoration: underline;
		cursor: pointer;
	}

	.activity-link:hover {
		color: #0056b3;
	}

	.approved {
		color: green;
		font-weight: bold;
	}
	.rejected {
		color: red;
		font-weight: bold;
	}
	.pending {
		color: orange;
		font-weight: bold;
	}

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

	.approve {
		color: green;
	}
	.approve:hover {
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

	/* Custom scrollbar */
	.dashboard-container::-webkit-scrollbar {
		width: 12px;
		display: block;
	}

	.dashboard-container::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	.dashboard-container::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 6px;
	}

	.dashboard-container::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}

  :global(main) {
		margin: 0 !important;
		padding: 0 !important;
		background-color: #f8f9f0 !important;
		min-height: 100vh !important;
		height: auto !important;
	}
</style>