function buildUsersAndReceivers(result) {
	const usersContent = document.getElementById('login-list');
	usersContent.innerHTML = '';

	result.users.forEach(function(element, index) {
		const div = document.createElement('div');
		div.className = 'list';
		div.id = element.login;

		const span = document.createElement('span');
		span.innerText = element.login;
		const button = document.createElement('button');
		button.innerText = '×';

		div.append(span);
		div.append(button);
		usersContent.append(div);
	});

	const receiversContent = document.getElementById('username-list');
	receiversContent.innerHTML = '';

	result.receivers.forEach(function(element, index) {
		const div = document.createElement('div');
		div.className = 'list';
		div.id = element.username;

		const span = document.createElement('span');
		span.innerText = element.username;
		const button = document.createElement('button');
		button.innerText = '×';

		div.append(span);
		div.append(button);
		receiversContent.append(div);
	});
}