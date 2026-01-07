// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const icon = darkModeToggle.querySelector('i');
    const DARK_MODE_KEY = 'darkModeEnabled';

    // Check for saved user preference or system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedMode = localStorage.getItem(DARK_MODE_KEY);
    
    // Set initial state
    if (savedMode === 'true' || (savedMode === null && prefersDarkScheme.matches)) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (localStorage.getItem(DARK_MODE_KEY) === null) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        icon.classList.replace('bi-moon-fill', 'bi-sun-fill');
        localStorage.setItem(DARK_MODE_KEY, 'true');
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        icon.classList.replace('bi-sun-fill', 'bi-moon-fill');
        localStorage.setItem(DARK_MODE_KEY, 'false');
    }
});