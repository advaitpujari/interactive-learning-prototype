// --- Initialize Supabase ---
// PASTE YOUR URL AND KEY HERE
const SUPABASE_URL = 'https://akmodsqmyetugbncgmfg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrbW9kc3FteWV0dWdibmNnbWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MzU0NzksImV4cCI6MjA3NzMxMTQ3OX0.7T_1CzWY56JS2n3LDvnidtzMF-OFndeVSezNo2bbaB8';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Get HTML Elements ---
const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageEl = document.getElementById('message');

// --- Event Listeners ---

// Sign Up
signupButton.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    const { data, error } = await _supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        messageEl.textContent = error.message;
    } else {
        messageEl.textContent = 'Signed up! Check your email for verification (if enabled).';
    }
});

// Login
loginButton.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        messageEl.textContent = error.message;
    } else {
        // SUCCESS! Send user to the dashboard
        window.location.href = 'dashboard.html';
    }
});