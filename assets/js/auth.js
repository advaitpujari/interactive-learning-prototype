// --- Initialize Supabase ---
const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Get HTML Elements ---

// Forms
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const resetForm = document.getElementById('reset-form');
const updatePasswordForm = document.getElementById('update-password-form'); // NEW

// Toggle Links
const showSignup = document.getElementById('show-signup');
const showLoginFromSignup = document.getElementById('show-login-from-signup');
const showLoginFromReset = document.getElementById('show-login-from-reset');
const showReset = document.getElementById('show-reset');

// Message element
const messageEl = document.getElementById('message');

// Login fields
const loginButton = document.getElementById('loginButton');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');

// Signup fields
const signupButton = document.getElementById('signupButton');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupBoard = document.getElementById('signup-board');
const signupGrade = document.getElementById('signup-grade');

// Reset fields
const resetButton = document.getElementById('resetButton');
const resetEmail = document.getElementById('reset-email');

// Update Password fields
const updatePasswordButton = document.getElementById('updatePasswordButton'); // NEW
const newPasswordInput = document.getElementById('new-password'); // NEW


// --- Event Listeners for Toggling ---

showSignup.addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    resetForm.style.display = 'none';
    updatePasswordForm.style.display = 'none';
    messageEl.textContent = ''; 
});

showLoginFromSignup.addEventListener('click', () => {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    resetForm.style.display = 'none';
    updatePasswordForm.style.display = 'none';
    messageEl.textContent = '';
});

showLoginFromReset.addEventListener('click', () => {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    resetForm.style.display = 'none';
    updatePasswordForm.style.display = 'none';
    messageEl.textContent = '';
});

showReset.addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    resetForm.style.display = 'block';
    updatePasswordForm.style.display = 'none';
    messageEl.textContent = '';
});


// --- Event Listeners for Auth Buttons ---

// LOGIN
loginButton.addEventListener('click', async () => {
    // ... (This code is unchanged) ...
    const email = loginEmail.value;
    const password = loginPassword.value;
    
    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        messageEl.textContent = error.message;
    } else {
        window.location.href = 'dashboard.html';
    }
});

// SIGN UP
signupButton.addEventListener('click', async () => {
    // ... (This code is unchanged) ...
    const email = signupEmail.value;
    const password = signupPassword.value;
    const board = signupBoard.value;
    const grade = parseInt(signupGrade.value);

    messageEl.textContent = 'Processing...';

    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                board: board,
                grade: grade
            }
        }
    });

    if (error) {
        messageEl.textContent = error.message;
    } else {
        messageEl.textContent = 'Signup successful! Please check your email to verify.';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        resetForm.style.display = 'none';
    }
});

// RESET PASSWORD
resetButton.addEventListener('click', async () => {
    // ... (This code is unchanged) ...
    const email = resetEmail.value;
    
    if (!email) {
        messageEl.textContent = 'Please enter your email address.';
        return;
    }

    messageEl.textContent = 'Sending reset link...';
    
    const { data, error } = await _supabase.auth.resetPasswordForEmail(email);

    if (error) {
        messageEl.textContent = error.message;
    } else {
        messageEl.textContent = 'Password reset link has been sent to your email!';
    }
});


// --- NEW - UPDATE PASSWORD BUTTON ---
updatePasswordButton.addEventListener('click', async () => {
    const newPassword = newPasswordInput.value;
    if (!newPassword) {
        messageEl.textContent = 'Please enter a new password.';
        return;
    }

    // Supabase knows who the user is because they were logged in by the reset link
    const { data, error } = await _supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        messageEl.textContent = `Error updating password: ${error.message}`;
    } else {
        messageEl.textContent = 'Password updated successfully! You can now log in.';
        // Hide all forms and show the login form
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        resetForm.style.display = 'none';
        updatePasswordForm.style.display = 'none';
    }
});


// --- NEW - AUTH STATE LISTENER ---
// This code runs automatically when the page loads
_supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
        // This is the magic!
        // User clicked the reset link. Hide all forms and show the update password form.
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        resetForm.style.display = 'none';
        updatePasswordForm.style.display = 'block';
        messageEl.textContent = 'You are logged in. Please set a new password.';
    }
});