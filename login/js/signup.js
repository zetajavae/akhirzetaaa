// ===== TOGGLE PASSWORD =====
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon  = document.getElementById(iconId);
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

// ===== PASSWORD STRENGTH =====
document.getElementById('password').addEventListener('input', function () {
    const val   = this.value;
    const bar   = document.getElementById('strengthBar');
    const fill  = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');

    if (!val) {
        bar.classList.remove('visible');
        label.classList.remove('visible');
        return;
    }

    bar.classList.add('visible');
    label.classList.add('visible');

    let score = 0;
    if (val.length >= 8)              score++;
    if (/[A-Z]/.test(val))            score++;
    if (/[0-9]/.test(val))            score++;
    if (/[^a-zA-Z0-9]/.test(val))    score++;

    const levels = [
        { pct: '25%', color: '#e53e3e', text: 'Lemah' },
        { pct: '50%', color: '#dd6b20', text: 'Cukup' },
        { pct: '75%', color: '#d69e2e', text: 'Baik' },
        { pct: '100%',color: '#38a169', text: 'Kuat' },
    ];
    const lvl = levels[score - 1] || levels[0];
    fill.style.width      = lvl.pct;
    fill.style.background = lvl.color;
    label.textContent     = lvl.text;
    label.style.color     = lvl.color;
});

// ===== REAL-TIME VALIDATION =====
const fields = [
    { id: 'firstName',       group: 'group-firstName',       validate: v => v ? null : 'Nama depan tidak boleh kosong.' },
    { id: 'lastName',        group: 'group-lastName',        validate: v => v ? null : 'Nama belakang tidak boleh kosong.' },
    { id: 'username',        group: 'group-username',        validate: v => !v ? 'Username tidak boleh kosong.' : !isValidUsername(v) ? 'Username minimal 3 karakter (huruf, angka, . _ -).' : null },
    { id: 'email',           group: 'group-email',           validate: v => !v ? 'Email tidak boleh kosong.' : !isValidEmail(v) ? 'Format email tidak valid.' : null },
    { id: 'password',        group: 'group-password',        validate: v => !v ? 'Password tidak boleh kosong.' : v.length < 8 ? 'Password minimal 8 karakter.' : null },
    { id: 'confirmPassword', group: 'group-confirmPassword', validate: v => !v ? 'Konfirmasi password tidak boleh kosong.' : v !== document.getElementById('password').value ? 'Password tidak cocok.' : null },
];

fields.forEach(({ id, group, validate }) => {
    const el = document.getElementById(id);
    el.addEventListener('blur', function () {
        const err = validate(this.value.trim());
        err ? setError(group, err) : setSuccess(group);
    });
    el.addEventListener('input', function () {
        if (document.getElementById(group).classList.contains('has-error')) clearState(group);
    });
});

// ===== FORM SUBMIT =====
document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    fields.forEach(({ id, group, validate }) => {
        const val = document.getElementById(id).value.trim();
        const err = validate(val);
        if (err) { setError(group, err); valid = false; }
        else       setSuccess(group);
    });

    // Cek terms
    const termsEl    = document.getElementById('terms');
    const termsError = document.getElementById('error-terms');
    if (!termsEl.checked) {
        termsError.textContent = 'Anda harus menyetujui syarat & ketentuan.';
        termsError.classList.add('show');
        valid = false;
    } else {
        termsError.textContent = '';
        termsError.classList.remove('show');
    }

    if (!valid) return;

    const btn = document.getElementById('btnSignup');
    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
        btn.classList.remove('loading');
        btn.disabled = false;
        showToast('✅ Akun berhasil dibuat! Silakan login.', 'success');
        setTimeout(() => window.location.href = 'login.html', 1500);
    }, 2000);
});

// ===== SOCIAL BUTTONS =====
document.getElementById('btnGoogle').addEventListener('click',   () => showToast('Menghubungkan ke Google...'));
document.getElementById('btnFacebook').addEventListener('click', () => showToast('Menghubungkan ke Facebook...'));
