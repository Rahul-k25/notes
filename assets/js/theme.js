function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.innerText = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
    }
}

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

document.addEventListener("DOMContentLoaded", function() {
    
    if (!document.getElementById('theme-toggle')) {
        const btn = document.createElement("button");
        btn.id = "theme-toggle";
        btn.className = "theme-toggle-btn";
        btn.innerText = savedTheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
        
        const headerInner = document.querySelector("#header_wrap .inner");
        
        if (headerInner) {
            headerInner.insertBefore(btn, headerInner.firstChild);
        } else {
            btn.style.position = "fixed";
            btn.style.top = "10px";
            btn.style.right = "10px";
            btn.style.zIndex = "1000";
            document.body.appendChild(btn);
        }

        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            applyTheme(next);
        });
    }
});