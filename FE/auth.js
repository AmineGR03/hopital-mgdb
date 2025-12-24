// Authentication Management
let currentUser = null;
let authToken = null;

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on login page
    if (document.getElementById('loginForm')) {
        initializeLoginPage();
        return;
    }

    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');

    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        initializeAuthenticatedApp();
    } else {
        // Redirect to login if not authenticated
        redirectToLogin();
    }
});

// Initialize login page
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const loginBtn = document.getElementById('loginBtn');
        const originalText = loginBtn.innerHTML;

        // Show loading state
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Connexion...';
        loginBtn.disabled = true;

        try {
            const formData = new FormData(loginForm);
            const loginData = {
                username: formData.get('username'),
                password: formData.get('password')
            };

            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Store authentication data
                authToken = result.token;
                currentUser = result.user;

                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                // Redirect based on role
                redirectBasedOnRole();
            } else {
                showLoginError(result.message || 'Erreur de connexion');
            }
        } catch (error) {
            console.error('Login error:', error);
            showLoginError('Erreur de connexion au serveur');
        } finally {
            // Restore button state
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }
    });
}

// Initialize authenticated application
function initializeAuthenticatedApp() {
    // Update UI with user information
    updateUserInterface();

    // Add logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Apply role-based UI restrictions
    applyRoleBasedUI();
}

// Update user interface with current user info
function updateUserInterface() {
    const userInfoElements = document.querySelectorAll('.user-info');
    const userRoleElements = document.querySelectorAll('.user-role');

    userInfoElements.forEach(el => {
        el.textContent = currentUser.username;
    });

    userRoleElements.forEach(el => {
        el.textContent = getRoleDisplayName(currentUser.role);
    });

    // Update role badge
    const roleBadge = document.getElementById('roleBadge');
    if (roleBadge) {
        roleBadge.className = `badge bg-${getRoleColor(currentUser.role)}`;
        roleBadge.textContent = getRoleDisplayName(currentUser.role);
    }
}

// Apply role-based UI restrictions
function applyRoleBasedUI() {
    const role = currentUser.role;

    // Hide admin-only elements
    if (role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Hide receptionist-only elements
    if (role !== 'receptionist' && role !== 'admin') {
        document.querySelectorAll('.receptionist-only').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Hide doctor-only elements
    if (role !== 'doctor' && role !== 'admin') {
        document.querySelectorAll('.doctor-only').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Show role-specific navigation
    showRoleSpecificNavigation(role);
}

// Show role-specific navigation and features
function showRoleSpecificNavigation(role) {
    // Receptionist dashboard
    if (role === 'receptionist' || role === 'admin') {
        document.querySelectorAll('.receptionist-nav').forEach(el => {
            el.style.display = 'block';
        });
    }

    // Doctor dashboard
    if (role === 'doctor' || role === 'admin') {
        document.querySelectorAll('.doctor-nav').forEach(el => {
            el.style.display = 'block';
        });
    }

    // Admin dashboard
    if (role === 'admin') {
        document.querySelectorAll('.admin-nav').forEach(el => {
            el.style.display = 'block';
        });
    }
}

// Logout function
async function logout() {
    try {
        await fetch('/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');

    // Reset variables
    authToken = null;
    currentUser = null;

    // Redirect to login
    redirectToLogin();
}

// Show login error
function showLoginError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.textContent = message;
    errorAlert.classList.remove('d-none');
}

// Fill credentials for demo
function fillCredentials(username, password) {
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
    document.getElementById('password').focus();
}

// Redirect based on role
function redirectBasedOnRole() {
    const role = currentUser.role;

    switch (role) {
        case 'admin':
            window.location.href = 'index.html';
            break;
        case 'receptionist':
            window.location.href = 'index.html'; // Receptionist dashboard
            break;
        case 'doctor':
            window.location.href = 'index.html'; // Doctor dashboard
            break;
        default:
            window.location.href = 'index.html';
    }
}

// Redirect to login page
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Get role display name
function getRoleDisplayName(role) {
    const roleNames = {
        'admin': 'Administrateur',
        'doctor': 'Médecin',
        'receptionist': 'Réceptionniste'
    };
    return roleNames[role] || role;
}

// Get role color for badges
function getRoleColor(role) {
    const roleColors = {
        'admin': 'danger',
        'doctor': 'success',
        'receptionist': 'primary'
    };
    return roleColors[role] || 'secondary';
}

// Check if user is authenticated
function isAuthenticated() {
    return authToken && currentUser;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Get auth token
function getAuthToken() {
    return authToken;
}

// Export functions for use in other files
window.logout = logout;
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.getAuthToken = getAuthToken;