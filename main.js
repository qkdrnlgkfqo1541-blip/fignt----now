document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            themeToggle.textContent = 'Light Mode';
        } else {
            themeToggle.textContent = 'Dark Mode';
        }
    } else {
        // Default to light mode if no preference is saved
        body.classList.remove('dark-mode');
        themeToggle.textContent = 'Dark Mode';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark-mode');
            themeToggle.textContent = 'Light Mode';
        } else {
            localStorage.setItem('theme', 'light-mode');
            themeToggle.textContent = 'Dark Mode';
        }
    });
});
