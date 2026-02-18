function initDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    const toggle = document.getElementById('dark-mode-toggle');
    
    if (isDarkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        toggle.textContent = '🌙';
    }
}

function toggleDarkMode() {
    const toggle = document.getElementById('dark-mode-toggle');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('darkMode', newTheme === 'dark' ? 'enabled' : 'disabled');
    
    toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}
