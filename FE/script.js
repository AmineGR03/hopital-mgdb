// Healthcare Management System - Main JavaScript
const API_BASE_URL = 'http://localhost:3000';

// Utility Functions
function showLoading(element) {
    element.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Chargement...</span></div></div>';
}

function hideLoading(element, content) {
    element.innerHTML = content;
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// API Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Handle authentication errors
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
            throw new Error('Session expirée');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        showAlert('Erreur de connexion au serveur: ' + error.message, 'danger');
        throw error;
    }
}

// Dashboard Functions
async function loadDashboardStats() {
    try {
        // Load all data in parallel
        const [patients, doctors, appointments, prescriptions] = await Promise.all([
            apiCall('/patients'),
            apiCall('/doctors'),
            apiCall('/appointments'),
            apiCall('/prescriptions')
        ]);

        // Update statistics
        document.getElementById('totalPatients').textContent = patients.length;
        document.getElementById('totalDoctors').textContent = doctors.length;

        // Count today's appointments
        const today = new Date().toDateString();
        const todayAppointments = appointments.filter(apt => new Date(apt.dateRdv).toDateString() === today);
        document.getElementById('todayAppointments').textContent = todayAppointments.length;

        // Count active prescriptions (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activePrescriptions = prescriptions.filter(prescription =>
            new Date(prescription.date) > thirtyDaysAgo
        );
        document.getElementById('activePrescriptions').textContent = activePrescriptions.length;

        // Load recent appointments
        loadRecentAppointments(appointments.slice(-5).reverse());

    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
        showAlert('Erreur lors du chargement des statistiques', 'danger');
    }
}

async function loadRecentAppointments(appointments) {
    const tbody = document.querySelector('#recentAppointmentsTable tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    for (const appointment of appointments) {
        try {
            // Get populated patient and doctor details (if available)
            let patient = appointment.patientId;
            let doctor = appointment.doctorId;

            // If not populated, fetch them (fallback for old data)
            if (typeof patient !== 'object' || !patient) {
                patient = await apiCall(`/patients/${appointment.patientId}`);
            }
            if (typeof doctor !== 'object' || !doctor) {
                doctor = await apiCall(`/doctors/${appointment.doctorId}`);
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(appointment.dateRdv)}</td>
                <td>${patient.prenom} ${patient.nom}</td>
                <td>Dr. ${doctor.prenom} ${doctor.nom}</td>
                <td>${appointment.motif || 'Non spécifié'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="window.location.href='appointments.html'">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        } catch (error) {
            console.error('Failed to load appointment details:', error);
        }
    }
}

// Modal Functions
function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}

function hideModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) {
        modal.hide();
    }
}

// Form Validation
function validateForm(formData, requiredFields) {
    const errors = [];

    requiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
            errors.push(`${field} est requis`);
        }
    });

    return errors;
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the dashboard page
    if (document.getElementById('totalPatients')) {
        loadDashboardStats();
    }

    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 100);
    });
});

// Export functions for use in other files
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showAlert = showAlert;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.apiCall = apiCall;
window.showModal = showModal;
window.hideModal = hideModal;
window.validateForm = validateForm;

