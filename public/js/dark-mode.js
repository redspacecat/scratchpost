function initDarkMode() {
    let isDarkMode = localStorage.getItem('darkMode');
    
    // If no preference saved, check system preference
    if (isDarkMode === null) {
        isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'enabled' : 'disabled';
    } else {
        isDarkMode = isDarkMode === 'enabled';
    }
    
    const toggle = document.getElementById('dark-mode-toggle');
    
    if (isDarkMode === true || isDarkMode === 'enabled') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.textContent = '☀️';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        toggle.textContent = '🌙';
        localStorage.setItem('darkMode', 'disabled');
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
