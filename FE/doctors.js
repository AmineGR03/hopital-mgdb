// Doctors Management JavaScript
let allDoctors = [];
let filteredDoctors = [];
let currentFilter = 'all';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadDoctors();

    // Setup event listeners
    document.getElementById('searchInput').addEventListener('input', filterDoctors);
    document.getElementById('specialtyFilter').addEventListener('change', filterDoctors);
});

// Load all doctors
async function loadDoctors() {
    try {
        showLoading(document.getElementById('loadingSpinner'));
        document.getElementById('noDataMessage').classList.add('d-none');

        allDoctors = await apiCall('/doctors');
        filteredDoctors = [...allDoctors];

        displayDoctors(filteredDoctors);
        updateDoctorCount(filteredDoctors.length);

    } catch (error) {
        console.error('Failed to load doctors:', error);
        showAlert('Erreur lors du chargement des médecins', 'danger');
    } finally {
        hideLoading(document.getElementById('loadingSpinner'), '');
    }
}

// Display doctors in table
async function displayDoctors(doctors) {
    const tbody = document.querySelector('#doctorsTable tbody');
    tbody.innerHTML = '';

    if (doctors.length === 0) {
        document.getElementById('noDataMessage').classList.remove('d-none');
        return;
    }

    document.getElementById('noDataMessage').classList.add('d-none');

    // Load appointments data to count today's appointments per doctor
    let appointments = [];
    try {
        appointments = await apiCall('/appointments');
    } catch (error) {
        console.error('Failed to load appointments:', error);
    }

    const today = new Date().toDateString();
    const todayAppointments = appointments.filter(apt => new Date(apt.dateRdv).toDateString() === today);

    doctors.forEach(doctor => {
        const row = document.createElement('tr');

        // Count today's appointments for this doctor
        const doctorTodayAppointments = todayAppointments.filter(apt => apt.doctorId === doctor.id).length;

        // Specialty badge color
        const specialtyColor = getSpecialtyColor(doctor.specialite);

        row.innerHTML = `
            <td>${doctor._id}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2 bg-success">
                        ${doctor.prenom.charAt(0)}${doctor.nom.charAt(0)}
                    </div>
                    <div>
                        <strong>Dr. ${doctor.prenom} ${doctor.nom}</strong>
                    </div>
                </div>
            </td>
            <td>
                <span class="badge bg-${specialtyColor}">${doctor.specialite}</span>
            </td>
            <td>${doctor.contact?.telephone || 'N/A'}</td>
            <td>
                <span class="text-truncate d-inline-block" style="max-width: 200px;" title="${doctor.contact?.adresse || 'N/A'}">
                    ${doctor.contact?.adresse || 'N/A'}
                </span>
            </td>
            <td>
                <span class="badge bg-info">${doctorTodayAppointments}</span>
            </td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-success" onclick="viewDoctor('${doctor._id}')" title="Voir">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="editDoctor('${doctor._id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDoctor('${doctor._id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Get color for specialty badge
function getSpecialtyColor(specialty) {
    const colors = {
        'Médecine générale': 'primary',
        'Cardiologie': 'danger',
        'Dermatologie': 'warning',
        'Gynécologie': 'success',
        'Ophtalmologie': 'info',
        'Pédiatrie': 'secondary',
        'Psychiatrie': 'dark',
        'Radiologie': 'primary',
        'Chirurgie': 'danger',
        'Neurologie': 'info',
        'Orthopédie': 'success',
        'Urologie': 'warning',
        'Endocrinologie': 'secondary',
        'Gastro-entérologie': 'primary'
    };
    return colors[specialty] || 'secondary';
}

// Filter doctors
function filterDoctors(filterType = null) {
    if (filterType) {
        currentFilter = filterType;
    }

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const specialtyFilter = document.getElementById('specialtyFilter').value;

    filteredDoctors = allDoctors.filter(doctor => {
        // Search filter
        const matchesSearch = !searchTerm ||
            `Dr. ${doctor.nom} ${doctor.prenom}`.toLowerCase().includes(searchTerm) ||
            doctor.specialite.toLowerCase().includes(searchTerm) ||
            doctor.contact?.telephone?.includes(searchTerm);

        // Specialty filter
        const matchesSpecialty = !specialtyFilter ||
            doctor.specialite === specialtyFilter;

        // Category filter
        let matchesCategory = true;
        if (currentFilter === 'available') {
            // For now, consider all doctors as available
            // In a real system, this would check schedules
            matchesCategory = true;
        }

        return matchesSearch && matchesSpecialty && matchesCategory;
    });

    displayDoctors(filteredDoctors);
    updateDoctorCount(filteredDoctors.length);
}

// Clear all filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('specialtyFilter').value = '';
    currentFilter = 'all';

    // Reset sidebar active state
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('[onclick="filterDoctors(\'all\')"]').classList.add('active');

    filteredDoctors = [...allDoctors];
    displayDoctors(filteredDoctors);
    updateDoctorCount(filteredDoctors.length);
}

// Update doctor count
function updateDoctorCount(count) {
    document.getElementById('doctorCount').textContent = count;
}

// Show add doctor modal
function showAddDoctorModal() {
    document.getElementById('doctorModalTitle').innerHTML =
        '<i class="fas fa-user-md me-2"></i>Ajouter un Médecin';
    document.getElementById('doctorForm').reset();
    document.getElementById('doctorId').value = '';

    showModal('doctorModal');
}

// Edit doctor
async function editDoctor(id) {
    try {
        const doctor = await apiCall(`/doctors/${id}`);

        // Populate form
        document.getElementById('doctorId').value = doctor.id;
        document.getElementById('nom').value = doctor.nom;
        document.getElementById('prenom').value = doctor.prenom;
        document.getElementById('specialite').value = doctor.specialite;
        document.getElementById('telephone').value = doctor.contact?.telephone || '';
        document.getElementById('adresse').value = doctor.contact?.adresse || '';

        document.getElementById('doctorModalTitle').innerHTML =
            '<i class="fas fa-user-edit me-2"></i>Modifier le Médecin';

        showModal('doctorModal');

    } catch (error) {
        console.error('Failed to load doctor for editing:', error);
        showAlert('Erreur lors du chargement du médecin', 'danger');
    }
}

// Save doctor
async function saveDoctor() {
    const form = document.getElementById('doctorForm');
    const formData = new FormData(form);

    const doctorData = {
        nom: formData.get('nom'),
        prenom: formData.get('prenom'),
        specialite: formData.get('specialite'),
        contact: {
            telephone: formData.get('telephone'),
            adresse: formData.get('adresse')
        }
    };

    // Validation
    const requiredFields = ['nom', 'prenom', 'specialite'];
    const errors = validateForm(doctorData, requiredFields);

    if (errors.length > 0) {
        showAlert('Veuillez remplir tous les champs obligatoires: ' + errors.join(', '), 'warning');
        return;
    }

    try {
        const doctorId = document.getElementById('doctorId').value;

        if (doctorId) {
            // Update existing doctor
            await apiCall(`/doctors/${doctorId}`, 'PUT', doctorData);
            showAlert('Médecin modifié avec succès', 'success');
        } else {
            // Add new doctor
            await apiCall('/doctors', 'POST', doctorData);
            showAlert('Médecin ajouté avec succès', 'success');
        }

        hideModal('doctorModal');
        loadDoctors();

    } catch (error) {
        console.error('Failed to save doctor:', error);
        showAlert('Erreur lors de la sauvegarde du médecin', 'danger');
    }
}

// View doctor details
async function viewDoctor(id) {
    try {
        const doctor = await apiCall(`/doctors/${id}`);

        // Get doctor's appointments and prescriptions
        const [appointments, prescriptions] = await Promise.all([
            apiCall('/appointments'),
            apiCall('/prescriptions')
        ]);

        const doctorAppointments = appointments.filter(apt => apt.doctorId === doctor.id);
        const doctorPrescriptions = prescriptions.filter(pres => pres.doctorId === doctor.id);

        // Count today's appointments
        const today = new Date().toDateString();
        const todayAppointments = doctorAppointments.filter(apt => new Date(apt.dateRdv).toDateString() === today);

        document.getElementById('doctorDetails').innerHTML = `
            <div class="row">
                <!-- Basic Information -->
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header">
                            <i class="fas fa-user-md me-2"></i>Informations Personnelles
                        </div>
                        <div class="card-body">
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>ID:</strong></div>
                                <div class="col-sm-8">${doctor.id}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Nom:</strong></div>
                                <div class="col-sm-8">Dr. ${doctor.nom} ${doctor.prenom}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Spécialité:</strong></div>
                                <div class="col-sm-8">
                                    <span class="badge bg-${getSpecialtyColor(doctor.specialite)}">${doctor.specialite}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact Information -->
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header">
                            <i class="fas fa-address-book me-2"></i>Informations de Contact
                        </div>
                        <div class="card-body">
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Téléphone:</strong></div>
                                <div class="col-sm-8">${doctor.contact?.telephone || 'Non spécifié'}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Adresse:</strong></div>
                                <div class="col-sm-8">${doctor.contact?.adresse || 'Non spécifiée'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Statistics -->
            <div class="row">
                <div class="col-md-4">
                    <div class="card mb-3 text-center">
                        <div class="card-body">
                            <h3 class="text-primary">${doctorAppointments.length}</h3>
                            <p class="mb-0">Total Rendez-vous</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card mb-3 text-center">
                        <div class="card-body">
                            <h3 class="text-info">${todayAppointments.length}</h3>
                            <p class="mb-0">RDV Aujourd'hui</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card mb-3 text-center">
                        <div class="card-body">
                            <h3 class="text-warning">${doctorPrescriptions.length}</h3>
                            <p class="mb-0">Prescriptions</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Appointments -->
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <i class="fas fa-calendar-alt me-2"></i>Derniers Rendez-vous
                        </div>
                        <div class="card-body">
                            ${doctorAppointments.length > 0 ?
                                doctorAppointments.slice(-5).reverse().map(apt => `
                                    <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                                        <div>
                                            <strong>${formatDate(apt.dateRdv)}</strong>
                                            <br>
                                            <small class="text-muted">${apt.motif || 'Motif non spécifié'}</small>
                                        </div>
                                        <span class="badge bg-primary">Patient #${apt.patientId}</span>
                                    </div>
                                `).join('') :
                                '<p class="text-muted mb-0">Aucun rendez-vous enregistré</p>'
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;

        showModal('viewDoctorModal');

    } catch (error) {
        console.error('Failed to load doctor details:', error);
        showAlert('Erreur lors du chargement des détails du médecin', 'danger');
    }
}

// Delete doctor
async function deleteDoctor(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce médecin ? Cette action est irréversible.')) {
        return;
    }

    try {
        await apiCall(`/doctors/${id}`, 'DELETE');
        showAlert('Médecin supprimé avec succès', 'success');
        loadDoctors();
    } catch (error) {
        console.error('Failed to delete doctor:', error);
        showAlert('Erreur lors de la suppression du médecin', 'danger');
    }
}

// Show specialties breakdown
async function showSpecialties() {
    try {
        const specialtyCount = {};
        allDoctors.forEach(doctor => {
            specialtyCount[doctor.specialite] = (specialtyCount[doctor.specialite] || 0) + 1;
        });

        const totalDoctors = allDoctors.length;
        const specialtiesHtml = Object.entries(specialtyCount)
            .sort(([,a], [,b]) => b - a)
            .map(([specialty, count]) => {
                const percentage = ((count / totalDoctors) * 100).toFixed(1);
                return `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span>${specialty}</span>
                        <div class="d-flex align-items-center">
                            <div class="progress me-2" style="width: 100px;">
                                <div class="progress-bar bg-${getSpecialtyColor(specialty)}" style="width: ${percentage}%"></div>
                            </div>
                            <span class="badge bg-${getSpecialtyColor(specialty)}">${count} (${percentage}%)</span>
                        </div>
                    </div>
                `;
            }).join('');

        document.getElementById('specialtiesContent').innerHTML = `
            <div class="mb-3">
                <h6>Répartition des spécialités (${totalDoctors} médecins)</h6>
                ${specialtiesHtml}
            </div>
        `;

        showModal('specialtiesModal');

    } catch (error) {
        console.error('Failed to load specialties:', error);
        showAlert('Erreur lors du chargement des spécialités', 'danger');
    }
}

// Export doctors
function exportDoctors() {
    const csvContent = [
        ['ID', 'Nom', 'Prénom', 'Spécialité', 'Téléphone', 'Adresse'],
        ...filteredDoctors.map(doctor => [
            doctor.id,
            doctor.nom,
            doctor.prenom,
            doctor.specialite,
            doctor.contact?.telephone || '',
            doctor.contact?.adresse || ''
        ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `medecins_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// Refresh doctors
function refreshDoctors() {
    loadDoctors();
}
