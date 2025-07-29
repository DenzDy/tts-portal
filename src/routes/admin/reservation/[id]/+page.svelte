<script lang="ts">
	import { generateFormFields } from '$lib/form/generateFormField';
	import type { PageData } from './$types';

	export let data: PageData;

	const { reservation, formFields, adminSession, reservationId } = data;

	let classes = {
		divClasses: ['my-4'],
		labelClasses: ['font-bold', 'text-md'],
		helperClasses: ['text-gray-500', 'italic', 'text-sm', 'my-1'],
		inputClasses: [
			'my-2',
			'rounded-md',
			'border-blue',
			'w-full',
			'bg-gray-100',
			'cursor-not-allowed'
		],
		errorClasses: ['text-red-500', 'italic', 'text-sm']
	};

	// Generate form fields with reservation data
	let renderedFields = formFields?.map((def) => {
		const fieldConfig = generateFormFields(def, classes);

		// Get the value from reservation data
		let fieldValue = reservation[def.Name] || '';

		// Handle different field types for display
		if (def.Type === 'checkbox' && typeof fieldValue === 'string') {
			fieldValue = fieldValue ? fieldValue.split('; ') : [];
		}

		return {
			name: def.Name,
			label: def.Label,
			type: def.Type,
			value: fieldValue,
			...fieldConfig
		};
	});

	// Get the correct status - use reservation.status which we set correctly in the server
	$: currentStatus = reservation.status || reservation['Approved?'] || 'Pending';

	// Helper function to format values for display
	function formatValue(value: any, type: string): string {
		if (!value) return 'N/A';

		if (Array.isArray(value)) {
			return value.join(', ');
		}

		if (type === 'date' && value) {
			try {
				const date = new Date(value);
				return date.toLocaleDateString();
			} catch {
				return value.toString();
			}
		}

		return value.toString();
	}

	// Helper function to check if "Others" option is selected in equipment to rent
	function hasOthersSelected(equipmentRentValue: any): boolean {
		if (!equipmentRentValue) return false;

		if (Array.isArray(equipmentRentValue)) {
			return equipmentRentValue.some((item) => item && item.toLowerCase().includes('others'));
		}

		if (typeof equipmentRentValue === 'string') {
			return equipmentRentValue.toLowerCase().includes('others');
		}

		return false;
	}

	// Get the equipment rent field value for checking "Others"
	$: equipmentRentField = renderedFields?.find((field) => field.name === 'equipmentRent');
	$: showOthersField = equipmentRentField ? hasOthersSelected(equipmentRentField.value) : false;

	// Loading states for buttons
	let approvingReservation = false;
	let rejectingReservation = false;
	let savingCosts = false;

	// Cost fields - initialize from reservation data
	let costBreakdown = reservation['Cost Breakdown'] || '';
	let actualTotal = parseFloat(reservation['Actual Total']) || 0;

	// Function to save cost changes
	async function saveCostChanges() {
		savingCosts = true;

		try {
			const requestData = {
				rowIndex: parseInt(reservationId),
				costBreakdown: costBreakdown,
				actualTotal: actualTotal
			};

			const response = await fetch('/api/gsheet/update-cost', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestData)
			});

			const result = await response.json();

			if (response.ok && result.success) {
				// Update the local reservation data
				reservation['Cost Breakdown'] = costBreakdown;
				reservation['Actual Total'] = actualTotal;
				alert('Cost information saved successfully!');
			} else {
				alert(`Failed to save cost information: ${result.error}`);
			}
		} catch (error) {
			console.error('Error saving cost information:', error);
			alert(`Error: ${error.message}`);
		} finally {
			savingCosts = false;
		}
	}

	// Function to update reservation status
	async function updateReservationStatus(newStatus: 'Approved' | 'Rejected') {
		if (newStatus === 'Approved') {
			approvingReservation = true;
		} else {
			rejectingReservation = true;
		}

		const confirmed = confirm(
			`Are you sure you want to change this reservation's status to ${newStatus.toLowerCase()}?`
		);
		if (!confirmed) {
			approvingReservation = false;
			rejectingReservation = false;
			return;
		}

		try {
			const requestData = {
				rowIndex: parseInt(reservationId),
				newStatus: newStatus,
				fromDashboard: false // Flag to indicate this is from details page
			};

			const response = await fetch('/api/gsheet/update-status', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(requestData)
			});

			const result = await response.json();

			if (response.ok && result.success) {
				// Update the current status
				reservation.status = newStatus;
				alert(`Reservation ${newStatus.toLowerCase()} successfully!`);

				// Optionally redirect back to dashboard after a short delay
				// setTimeout(() => {
				//	 window.location.href = '/admin/dashboard';
				// }, 1500);
			} else {
				alert(`Failed to ${newStatus.toLowerCase()} reservation: ${result.error}`);
			}
		} catch (error) {
			console.error('Error updating reservation status:', error);
			alert(`Error: ${error.message}`);
		} finally {
			approvingReservation = false;
			rejectingReservation = false;
		}
	}
</script>

<div class="header">
	<h1>View Reservation Details</h1>
	<div class="user-info">
		<a href="/admin/dashboard" class="back-btn">Back to Dashboard</a>
	</div>
</div>

<div class="mx-auto my-8 w-5/6 md:w-1/2">
	<h2 class="mb-4 text-center text-3xl font-bold">Reservation #{reservationId - 1}</h2>

	<!-- Status Badge -->
	<div class="mb-6 text-center">
		<span
			class={currentStatus === 'Approved'
				? 'status-badge approved'
				: currentStatus === 'Rejected'
					? 'status-badge rejected'
					: 'status-badge pending'}
		>
			{currentStatus}
		</span>
	</div>

	<div class="mx-auto my-7 w-full border-b-2 border-gray-500"></div>

	<!-- Form Fields Display -->
	<div class="reservation-details">
		{#each renderedFields as field (field.name)}
			{#if !field.name.includes('Others')}
				<div class="field-container">
					<label for="field-label" class="field-label">
						{field.label}
					</label>

					{#if field.type === 'textarea'}
						<div class="field-value textarea-value">
							{formatValue(field.value, field.type)}
						</div>
					{:else if field.type === 'checkbox' || field.type === 'multiselect'}
						<div class="field-value">
							{formatValue(field.value, field.type)}
						</div>
					{:else if field.type === 'upload'}
						<div class="field-value">
							{#if field.value}
								<a href={field.value} target="_blank" class="file-link"> View Uploaded File </a>
							{:else}
								No file uploaded
							{/if}
						</div>
					{:else}
						<div class="field-value">
							{formatValue(field.value, field.type)}
						</div>
					{/if}

					<!-- Show helper text if available -->
					{#if field.props?.helper}
						<p class="field-helper">{@html field.props.helper}</p>
					{/if}
				</div>

				<!-- Show "Other Equipment to Rent" field right after "Equipment to Rent" if Others is selected -->
				{#if field.name === 'equipmentRent' && showOthersField}
					<div class="field-container others-field">
						<label for="dashboard-other-equipment" class="field-label">
							Other Equipment to Rent (Specify)
						</label>
						<div class="field-value">
							{reservation['equipmentRentOthers'] || 'N/A'}
						</div>
						<p class="field-helper">
							<em>This field appears because "Others" was selected in Equipment to Rent</em>
						</p>
					</div>
				{/if}
			{/if}
		{/each}
	</div>

	<!-- Cost Fields Section -->
	<div class="cost-fields-section">
		<h3 class="cost-section-title">Cost Information</h3>

		<div class="field-container">
			<label for="dashboard-cost-breakdown" class="field-label"> Cost Breakdown </label>
			<textarea
				bind:value={costBreakdown}
				placeholder="Enter cost breakdown (e.g., Projector: 100&#10;Chairs: 50&#10;Setup fee: 25)"
				class="cost-textarea"
				rows="4"
			></textarea>
			<p class="field-helper">Enter each item on a new line in the format "Item: Cost"</p>
		</div>

		<div class="field-container">
			<label for="dashboard-actual-total" class="field-label"> Actual Total (₱) </label>
			<input
				type="number"
				bind:value={actualTotal}
				placeholder="0"
				class="cost-input"
				min="0"
				step="0.01"
			/>
			<p class="field-helper">Total amount to be paid by the user</p>
		</div>

		<button class="save-changes-button" on:click={saveCostChanges} disabled={savingCosts}>
			{#if savingCosts}
				<span class="loader save-loader"></span>
				Saving Changes...
			{:else}
				Save Changes
			{/if}
		</button>
	</div>

	<!-- Action Buttons Section - Only show if status is Pending -->
	{#if currentStatus === 'Pending'}
		<div class="my-4 flex w-full gap-2">
			<button
				class="action-button approve-button w-1/2"
				on:click={() => updateReservationStatus('Approved')}
				disabled={approvingReservation || rejectingReservation}
			>
				{#if approvingReservation}
					<span class="loader approve-loader"></span>
					Approving...
				{:else}
					Approve
				{/if}
			</button>
			<button
				class="action-button reject-button w-1/2"
				on:click={() => updateReservationStatus('Rejected')}
				disabled={approvingReservation || rejectingReservation}
			>
				{#if rejectingReservation}
					<span class="loader reject-loader"></span>
					Rejecting...
				{:else}
					Reject
				{/if}
			</button>
		</div>
	{:else}
		<!-- Show status message when not pending -->
		<div class="mt-8 text-center">
			<p class="status-message">
				This reservation has already been <strong>{currentStatus.toLowerCase()}</strong>.
			</p>
			<a href="/admin/dashboard" class="back-link">← Back to Dashboard</a>
		</div>
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

	.back-btn {
		background: #f9943b;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		text-decoration: none;
		font-size: 0.9rem;
		font-family: 'Garet', sans-serif;
		transition: background 0.2s;
	}

	.back-btn:hover {
		background: #e6831d;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0;
		color: #333;
		font-family: 'Garet', sans-serif;
	}

	.status-badge {
		display: inline-block;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-weight: bold;
		font-size: 0.9rem;
		text-transform: uppercase;
	}

	.status-badge.approved {
		background: #e8f5e8;
		color: #2d5a2d;
		border: 1px solid #4caf50;
	}

	.status-badge.rejected {
		background: #ffeaea;
		color: #d32f2f;
		border: 1px solid #f44336;
	}

	.status-badge.pending {
		background: #fff3e0;
		color: #f57c00;
		border: 1px solid #ff9800;
	}

	.reservation-details {
		font-family: 'Garet', sans-serif;
	}

	.field-container {
		margin-bottom: 1.5rem;
		border-bottom: 1px solid #eee;
		padding-bottom: 1rem;
	}

	.others-field {
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 6px;
		border: 1px solid #e9ecef;
		margin-left: 1rem;
		margin-top: 0.5rem;
	}

	.field-label {
		display: block;
		font-weight: bold;
		font-size: 1rem;
		color: #333;
		margin-bottom: 0.5rem;
	}

	.field-value {
		padding: 0.75rem;
		background: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 4px;
		min-height: 2.5rem;
		display: flex;
		align-items: center;
		color: #495057;
		font-size: 0.95rem;
	}

	.textarea-value {
		min-height: 4rem;
		align-items: flex-start;
		padding-top: 0.75rem;
		white-space: pre-wrap;
	}

	.field-helper {
		margin-top: 0.25rem;
		font-size: 0.8rem;
		color: #6c757d;
		font-style: italic;
	}

	.file-link {
		color: #007bff;
		text-decoration: underline;
	}

	.file-link:hover {
		color: #0056b3;
	}

	/* Cost Fields Styling */
	.cost-fields-section {
		margin: 2rem 0;
		padding: 1.5rem;
		background: #f8f9fa;
		border: 2px solid #e9ecef;
		border-radius: 8px;
		font-family: 'Garet', sans-serif;
	}

	.cost-section-title {
		font-size: 1.5rem;
		font-weight: bold;
		color: #333;
		margin-bottom: 1rem;
		font-family: 'Garet', sans-serif;
	}

	.cost-textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ced4da;
		border-radius: 4px;
		font-family: 'Garet', sans-serif;
		font-size: 0.95rem;
		resize: vertical;
		min-height: 100px;
	}

	.cost-input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ced4da;
		border-radius: 4px;
		font-family: 'Garet', sans-serif;
		font-size: 0.95rem;
	}

	.save-changes-button {
		width: 100%;
		padding: 0.75rem 1.5rem;
		background-color: #f9943b;
		color: white;
		border: none;
		border-radius: 0.375rem;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-family: 'Garet', sans-serif;
		transition: all 0.2s ease;
		margin-top: 1rem;
	}

	.save-changes-button:hover:not(:disabled) {
		background-color: #e6831d;
	}

	.save-changes-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		filter: grayscale(50%);
	}

	/* Action Buttons Styling - Matching the create form buttons */
	.action-button {
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
		border: 2px solid;
		font-family: 'Garet', sans-serif;
		transition: all 0.2s ease;
	}

	.approve-button {
		background-color: #4caf50;
		color: white;
		border-color: #4caf50;
	}

	.approve-button:hover:not(:disabled) {
		background-color: #45a049;
		border-color: #45a049;
	}

	.reject-button {
		background-color: #f44336;
		color: white;
		border-color: #f44336;
	}

	.reject-button:hover:not(:disabled) {
		background-color: #da190b;
		border-color: #da190b;
	}

	.action-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		filter: grayscale(50%);
	}

	/* Loading spinner */
	.loader {
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top: 3px solid white;
		border-radius: 50%;
		width: 18px;
		height: 18px;
		animation: spin 0.6s linear infinite;
		margin-right: 0.5rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	/* Status message styling */
	.status-message {
		font-size: 1.1rem;
		color: #666;
		margin-bottom: 1rem;
		font-family: 'Garet', sans-serif;
	}

	.back-link {
		color: #f9943b;
		text-decoration: none;
		font-weight: 500;
		font-family: 'Garet', sans-serif;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	:global(main) {
		margin: 0 !important;
		padding: 0 !important;
		background-color: #f8f9f0 !important;
		min-height: 100vh !important;
		height: auto !important;
	}
</style>
