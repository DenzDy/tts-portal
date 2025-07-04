<script>
  import NextButton from '$lib/components/form/NextButton.svelte';
  import BackButton from '$lib/components/form/BackButton.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import UploadButton from '$lib/components/form/UploadButton.svelte';
</script>

<h1>Button Test Page</h1>

<div style="display: flex; flex-direction: column; gap: 1rem; width: 300px">
  <NextButton />
  <BackButton />
  <SubmitButton />
  <UploadButton />
</div>
