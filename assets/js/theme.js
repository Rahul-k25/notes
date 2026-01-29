const toggleButton = document.getElementById('theme-toggle');
const storedTheme = localStorage.getItem('theme');

if (storedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    toggleButton.innerText = '🌙 Dark Mode';
} else {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleButton.innerText = '☀️ Light Mode';
}

toggleButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        toggleButton.innerText = '☀️ Light Mode';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        toggleButton.innerText = '🌙 Dark Mode';
    }
});