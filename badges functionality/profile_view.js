function main() {
	document.getElementById("assign_badge_button").addEventListener("click", redirectToForm);
}

function redirectToForm() {
	location.href = "badge_assignment_form.html";
}