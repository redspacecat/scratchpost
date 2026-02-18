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
    
    // Apply chart colors if charts are already created
    updateChartColors();
}

function updateChartColors() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const tickColor = currentTheme === 'dark' ? '#e0e0e0' : 'black';
    const gridColor = currentTheme === 'dark' ? '#444444' : '#e0e0e0';
    
    // User page charts
    if (window.userPageCharts) {
        if (window.userPageCharts.chart) {
            window.userPageCharts.chart.options.scales.x.ticks.color = tickColor;
            window.userPageCharts.chart.options.scales.y.ticks.color = tickColor;
            window.userPageCharts.chart.options.scales.x.grid.color = gridColor;
            window.userPageCharts.chart.options.scales.y.grid.color = gridColor;
            window.userPageCharts.chart.update();
        }
        
        if (window.userPageCharts.chart2) {
            window.userPageCharts.chart2.options.scales.x.ticks.color = tickColor;
            window.userPageCharts.chart2.options.scales.y.ticks.color = tickColor;
            window.userPageCharts.chart2.options.scales.x.grid.color = gridColor;
            window.userPageCharts.chart2.options.scales.y.grid.color = gridColor;
            window.userPageCharts.chart2.update();
        }
        
        if (window.userPageCharts.chart3) {
            window.userPageCharts.chart3.options.plugins.legend.labels.color = tickColor;
            window.userPageCharts.chart3.update();
        }
    }
    
    // Leaderboard page charts
    if (window.chartInstances) {
        const chartIds = ['topAll', 'topWeek', 'topMonth', 'topYear', 'amountOverTime', 'categoryCumulative', 'countOverTime'];
        for (const id of chartIds) {
            if (window.chartInstances[id]) {
                const chart = window.chartInstances[id];
                if (chart.options.scales?.x?.ticks) {
                    chart.options.scales.x.ticks.color = tickColor;
                }
                if (chart.options.scales?.y?.ticks) {
                    chart.options.scales.y.ticks.color = tickColor;
                }
                if (chart.options.scales?.x?.grid) {
                    chart.options.scales.x.grid.color = gridColor;
                }
                if (chart.options.scales?.y?.grid) {
                    chart.options.scales.y.grid.color = gridColor;
                }
                chart.update();
            }
        }
    }
}

function toggleDarkMode() {
    const toggle = document.getElementById('dark-mode-toggle');
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('darkMode', newTheme === 'dark' ? 'enabled' : 'disabled');
    
    toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    // Update chart colors
    updateChartColors();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}
