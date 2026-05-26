// ===== TOGGLE PASSWORD =====
function togglePassword() {
    const input = document.getElementById('password');
    const icon  = document.getElementById('eyeIcon');
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    icon.innerHTML = isHidden
        ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
           <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
           <line x1="1" y1="1" x2="23" y2="23"/>`
        : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
           <circle cx="12" cy="12" r="3"/>`;
}

// ===== TOAST =====
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
}

// ===== VALIDATION HELPERS =====
function setError(groupId, message) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.classList.remove('has-success');
    group.classList.add('has-error');
    const el = document.getElementById('error-' + groupId.replace('group-', ''));
    if (el) el.textContent = message;
}
function setSuccess(groupId) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.classList.remove('has-error');
    group.classList.add('has-success');
    const el = document.getElementById('error-' + groupId.replace('group-', ''));
    if (el) el.textContent = '';
}
function clearState(groupId) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.classList.remove('has-error', 'has-success');
    const el = document.getElementById('error-' + groupId.replace('group-', ''));
    if (el) el.textContent = '';
}

function isValidEmail(v)    { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isValidUsername(v) { return /^[a-zA-Z0-9._-]{3,}$/.test(v); }

// ===== REAL-TIME VALIDATION =====
// Username
document.getElementById('username').addEventListener('blur', function () {
    const v = this.value.trim();
    if (!v)                  setError('group-username', 'Username tidak boleh kosong.');
    else if (!isValidUsername(v)) setError('group-username', 'Username minimal 3 karakter (huruf, angka, . _ -).');
    else                     setSuccess('group-username');
});
document.getElementById('username').addEventListener('input', function () {
    if (document.getElementById('group-username').classList.contains('has-error')) clearState('group-username');
});

// Email
document.getElementById('email').addEventListener('blur', function () {
    const v = this.value.trim();
    if (!v)               setError('group-email', 'Email tidak boleh kosong.');
    else if (!isValidEmail(v)) setError('group-email', 'Format email tidak valid.');
    else                  setSuccess('group-email');
});
document.getElementById('email').addEventListener('input', function () {
    if (document.getElementById('group-email').classList.contains('has-error')) clearState('group-email');
});

// Password
document.getElementById('password').addEventListener('blur', function () {
    const v = this.value;
    if (!v)          setError('group-password', 'Password tidak boleh kosong.');
    else if (v.length < 8) setError('group-password', 'Password minimal 8 karakter.');
    else             setSuccess('group-password');
});
document.getElementById('password').addEventListener('input', function () {
    if (document.getElementById('group-password').classList.contains('has-error')) clearState('group-password');
});

// ===== FORM SUBMIT =====
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    let valid = true;

    if (!username)               { setError('group-username', 'Username tidak boleh kosong.'); valid = false; }
    else if (!isValidUsername(username)) { setError('group-username', 'Username minimal 3 karakter.'); valid = false; }
    else setSuccess('group-username');

    if (!email)               { setError('group-email', 'Email tidak boleh kosong.'); valid = false; }
    else if (!isValidEmail(email)) { setError('group-email', 'Format email tidak valid.'); valid = false; }
    else setSuccess('group-email');

    if (!password)           { setError('group-password', 'Password tidak boleh kosong.'); valid = false; }
    else if (password.length < 8) { setError('group-password', 'Password minimal 8 karakter.'); valid = false; }
    else setSuccess('group-password');

    if (!valid) return;

    const btn = document.getElementById('btnLogin');
    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
        btn.classList.remove('loading');
        btn.disabled = false;
        // Simpan status login (ganti dengan API call asli)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        showToast('✅ Login berhasil! Selamat datang.', 'success');
        setTimeout(() => window.location.href = 'index.html', 1500);
    }, 2000);
});

// ===== SOCIAL BUTTONS =====
document.getElementById('btnGoogle').addEventListener('click',   () => showToast('Menghubungkan ke Google...'));
document.getElementById('btnFacebook').addEventListener('click', () => showToast('Menghubungkan ke Facebook...'));
