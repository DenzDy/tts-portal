<!-- src/routes/admin/reservation/[id]/+page.svelte -->
<script lang="ts">
	import { generateFormFields } from '$lib/form/generateFormField';
	import type { PageData } from './$types';

	export let data: PageData;
	
	const { reservation, formFields, adminSession, reservationId } = data;

	let classes = {
		divClasses: ['my-4'],
		labelClasses: ['font-bold', 'text-md'],
		helperClasses: ['text-gray-500', 'italic', 'text-sm', 'my-1'],
		inputClasses: ['my-2', 'rounded-md', 'border-blue', 'w-full', 'bg-gray-100', 'cursor-not-allowed'],
		errorClasses: ['text-red-500', 'italic', 'text-sm']
	};

	// Generate form fields with reservation data
	let renderedFields = formFields?.map((def) => {
		const fieldConfig = generateFormFields(def, classes);
		
		// Get the value from reservation data
		let fieldValue = reservation[def.Name] || '';
		
		// Debug logging
		console.log(`Field: ${def.Name}, Label: ${def.Label}, Value: "${fieldValue}"`);
		
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

	// FIXED: Get the correct status - use reservation.status which we set correctly in the server
	$: currentStatus = reservation.status || reservation['Approved?'] || 'Pending';
	
	console.log('Current status in component:', currentStatus);
	console.log('Full reservation data:', reservation);

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
			return equipmentRentValue.some(item => 
				item && item.toLowerCase().includes('others')
			);
		}
		
		if (typeof equipmentRentValue === 'string') {
			return equipmentRentValue.toLowerCase().includes('others');
		}
		
		return false;
	}

	// Get the equipment rent field value for checking "Others"
	$: equipmentRentField = renderedFields?.find(field => field.name === 'equipmentRent');
	$: showOthersField = equipmentRentField ? hasOthersSelected(equipmentRentField.value) : false;
</script>

<div class="header">
	<h1>View Reservation Details</h1>
	<div class="user-info">
		<img src={adminSession?.picture} alt="Profile" class="profile-pic" />
		<span class="user-email">{adminSession?.email}</span>
		<a href="/admin/dashboard" class="back-btn">Back to Dashboard</a>
	</div>
</div>

<div class="mx-auto my-8 w-5/6 md:w-1/2">
	<h2 class="text-center text-3xl font-bold mb-4">Reservation #{reservationId}</h2>
	
	<!-- FIXED: Status Badge - now uses the correct status -->
	<div class="text-center mb-6">
		<span class={
			currentStatus === 'Approved' ? 'status-badge approved' :
			currentStatus === 'Rejected' ? 'status-badge rejected' : 'status-badge pending'
		}>
			{currentStatus}
		</span>
	</div>

	<div class="mx-auto my-7 w-full border-b-2 border-gray-500"></div>

	<!-- Form Fields Display -->
	<div class="reservation-details">
		{#each renderedFields as field (field.name)}
			{#if !field.name.includes('Others')}
				<div class="field-container">
					<label class="field-label">
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
								<a href={field.value} target="_blank" class="file-link">
									View Uploaded File
								</a>
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
						<label class="field-label">
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
	
	<!-- Additional Actions Section (for future use) -->
	<div class="actions-section mt-8">
		<!-- Actions will be added here later -->
	</div>
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

	.actions-section {
		border-top: 2px solid #e9ecef;
		padding-top: 1rem;
		text-align: center;
	}
</style>