async function getAll() {
	const response = await fetch('/admin/get');
	const result = await response.json();
	return result;
}