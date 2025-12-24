// Appointments Management JavaScript
let allAppointments = [];
let filteredAppointments = [];
let allPatients = [];
let allDoctors = [];
let currentFilter = 'all';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadAppointments();
    loadPatientsAndDoctors();

    // Setup event listeners
    document.getElementById('searchInput').addEventListener('input', filterAppointments);
    document.getElementById('doctorFilter').addEventListener('change', filterAppointments);
    document.getElementById('patientFilter').addEventListener('change', filterAppointments);
});

// Load all appointments and related data
async function loadAppointments() {
    try {
        showLoading(document.getElementById('loadingSpinner'));
        document.getElementById('noDataMessage').classList.add('d-none');

        const [appointments, patients, doctors] = await Promise.all([
            apiCall('/appointments'),
            apiCall('/patients'),
            apiCall('/doctors')
        ]);

        allAppointments = appointments;
        allPatients = patients;
        allDoctors = doctors;
        filteredAppointments = [...allAppointments];

        displayAppointments(filteredAppointments);
        updateAppointmentCount(filteredAppointments.length);

    } catch (error) {
        console.error('Failed to load appointments:', error);
        showAlert('Erreur lors du chargement des rendez-vous', 'danger');
    } finally {
        hideLoading(document.getElementById('loadingSpinner'), '');
    }
}

// Load patients and doctors for dropdowns
async function loadPatientsAndDoctors() {
    try {
        // Load patients dropdown
        const patientsSelect = document.getElementById('patientId');
        const patientFilterSelect = document.getElementById('patientFilter');

        patientsSelect.innerHTML = '<option value="">Sélectionner un patient</option>';
        patientFilterSelect.innerHTML = '<option value="">Tous les patients</option>';

        allPatients.forEach(patient => {
            const option1 = new Option(`${patient.nom} ${patient.prenom}`, patient._id);
            const option2 = new Option(`${patient.nom} ${patient.prenom}`, patient._id);
            patientsSelect.appendChild(option1);
            patientFilterSelect.appendChild(option2);
        });

        // Load doctors dropdown
        const doctorsSelect = document.getElementById('doctorId');
        const doctorFilterSelect = document.getElementById('doctorFilter');

        doctorsSelect.innerHTML = '<option value="">Sélectionner un médecin</option>';
        doctorFilterSelect.innerHTML = '<option value="">Tous les médecins</option>';

        allDoctors.forEach(doctor => {
            const option1 = new Option(`Dr. ${doctor.nom} ${doctor.prenom} (${doctor.specialite})`, doctor._id);
            const option2 = new Option(`Dr. ${doctor.nom} ${doctor.prenom}`, doctor._id);
            doctorsSelect.appendChild(option1);
            doctorFilterSelect.appendChild(option2);
        });

    } catch (error) {
        console.error('Failed to load patients and doctors:', error);
    }
}

// Display appointments in table
function displayAppointments(appointments) {
    const tbody = document.querySelector('#appointmentsTable tbody');
    tbody.innerHTML = '';

    if (appointments.length === 0) {
        document.getElementById('noDataMessage').classList.remove('d-none');
        return;
    }

    document.getElementById('noDataMessage').classList.add('d-none');

    appointments.forEach(appointment => {
        const row = document.createElement('tr');

        // Get patient and doctor details (already populated from server)
        const patient = appointment.patientId;
        const doctor = appointment.doctorId;

        // Determine status and styling
        const appointmentDate = new Date(appointment.dateRdv);
        const now = new Date();
        const isPast = appointmentDate < now;
        const isToday = appointmentDate.toDateString() === now.toDateString();

        let statusBadge = '<span class="badge bg-secondary">Planifié</span>';
        if (appointment.status) {
            switch (appointment.status) {
                case 'confirmé':
                    statusBadge = '<span class="badge bg-success">Confirmé</span>';
                    break;
                case 'annulé':
                    statusBadge = '<span class="badge bg-danger">Annulé</span>';
                    break;
                case 'terminé':
                    statusBadge = '<span class="badge bg-info">Terminé</span>';
                    break;
            }
        } else if (isPast) {
            statusBadge = '<span class="badge bg-warning">Passé</span>';
        } else if (isToday) {
            statusBadge = '<span class="badge bg-primary">Aujourd\'hui</span>';
        }

        // Row styling for past appointments
        const rowClass = isPast && appointment.status !== 'terminé' ? 'table-secondary' : '';

        row.className = rowClass;
        row.innerHTML = `
            <td>${appointment._id}</td>
            <td>
                <strong>${formatDateTime(appointment.dateRdv)}</strong>
                ${isToday ? '<br><small class="badge bg-primary">Aujourd\'hui</small>' : ''}
            </td>
            <td>
                ${patient ? `${patient.prenom} ${patient.nom}` : 'Patient inconnu'}
                ${patient ? `<br><small class="text-muted">${patient.contact?.telephone || ''}</small>` : ''}
            </td>
            <td>
                ${doctor ? `Dr. ${doctor.prenom} ${doctor.nom}` : 'Médecin inconnu'}
                ${doctor ? `<br><small class="text-muted">${doctor.specialite}</small>` : ''}
            </td>
            <td>
                <span class="text-truncate d-inline-block" style="max-width: 200px;" title="${appointment.motif || 'Non spécifié'}">
                    ${appointment.motif || 'Non spécifié'}
                </span>
            </td>
            <td>${statusBadge}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-info" onclick="viewAppointment('${appointment._id}')" title="Voir">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="editAppointment('${appointment._id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteAppointment('${appointment._id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filter appointments
function filterAppointments(filterType = null) {
    if (filterType) {
        currentFilter = filterType;
    }

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const doctorFilter = document.getElementById('doctorFilter').value;
    const patientFilter = document.getElementById('patientFilter').value;

    filteredAppointments = allAppointments.filter(appointment => {
        // Get related patient and doctor (already populated)
        const patient = appointment.patientId;
        const doctor = appointment.doctorId;

        // Search filter
        const matchesSearch = !searchTerm ||
            (patient && `${patient.nom} ${patient.prenom}`.toLowerCase().includes(searchTerm)) ||
            (doctor && `Dr. ${doctor.nom} ${doctor.prenom}`.toLowerCase().includes(searchTerm)) ||
            (appointment.motif && appointment.motif.toLowerCase().includes(searchTerm));

        // Doctor filter
        const matchesDoctor = !doctorFilter || appointment.doctorId === doctorFilter;

        // Patient filter
        const matchesPatient = !patientFilter || appointment.patientId === patientFilter;

        // Category filter
        let matchesCategory = true;
        const appointmentDate = new Date(appointment.dateRdv);
        const now = new Date();

        if (currentFilter === 'today') {
            matchesCategory = appointmentDate.toDateString() === now.toDateString();
        } else if (currentFilter === 'upcoming') {
            matchesCategory = appointmentDate >= now;
        } else if (currentFilter === 'past') {
            matchesCategory = appointmentDate < now;
        }

        return matchesSearch && matchesDoctor && matchesPatient && matchesCategory;
    });

    displayAppointments(filteredAppointments);
    updateAppointmentCount(filteredAppointments.length);
}

// Clear all filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('doctorFilter').value = '';
    document.getElementById('patientFilter').value = '';
    currentFilter = 'all';

    // Reset sidebar active state
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('[onclick="filterAppointments(\'all\')"]').classList.add('active');

    filteredAppointments = [...allAppointments];
    displayAppointments(filteredAppointments);
    updateAppointmentCount(filteredAppointments.length);
}

// Update appointment count
function updateAppointmentCount(count) {
    document.getElementById('appointmentCount').textContent = count;
}

// Show add appointment modal
function showAddAppointmentModal() {
    document.getElementById('appointmentModalTitle').innerHTML =
        '<i class="fas fa-calendar-plus me-2"></i>Nouveau Rendez-vous';
    document.getElementById('appointmentForm').reset();
    document.getElementById('appointmentId').value = '';

    // Ensure dropdowns are loaded
    loadPatientsAndDoctors();

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateRdv').value = today;

    showModal('appointmentModal');
}

// Edit appointment
async function editAppointment(id) {
    try {
        // Ensure dropdowns are loaded
        await loadPatientsAndDoctors();

        const appointment = await apiCall(`/appointments/${id}`);

        // Populate form
        document.getElementById('appointmentId').value = appointment._id;
        document.getElementById('patientId').value = appointment.patientId;
        document.getElementById('doctorId').value = appointment.doctorId;
        document.getElementById('dateRdv').value = appointment.dateRdv.split('T')[0];
        document.getElementById('heureRdv').value = appointment.dateRdv.split('T')[1]?.substring(0, 5) || '';
        document.getElementById('motif').value = appointment.motif || '';
        document.getElementById('status').value = appointment.status || 'planifié';

        document.getElementById('appointmentModalTitle').innerHTML =
            '<i class="fas fa-calendar-edit me-2"></i>Modifier le Rendez-vous';

        showModal('appointmentModal');

    } catch (error) {
        console.error('Failed to load appointment for editing:', error);
        showAlert('Erreur lors du chargement du rendez-vous', 'danger');
    }
}

// Save appointment
async function saveAppointment() {
    // Get form values directly
    const patientId = document.getElementById('patientId').value;
    const doctorId = document.getElementById('doctorId').value;
    const dateRdv = document.getElementById('dateRdv').value;
    const heureRdv = document.getElementById('heureRdv').value;
    const motif = document.getElementById('motif').value;
    const status = document.getElementById('status').value;

    // Combine date and time
    const dateTimeString = heureRdv ? `${dateRdv}T${heureRdv}:00` : `${dateRdv}T00:00:00`;

    const appointmentData = {
        patientId: patientId,
        doctorId: doctorId,
        dateRdv: new Date(dateTimeString),
        motif: motif,
        status: status || 'planifié'
    };

    // Validation
    if (!patientId || patientId === '') {
        showAlert('Veuillez sélectionner un patient', 'warning');
        return;
    }

    if (!doctorId || doctorId === '') {
        showAlert('Veuillez sélectionner un médecin', 'warning');
        return;
    }

    if (!dateRdv || dateRdv === '') {
        showAlert('Veuillez sélectionner une date', 'warning');
        return;
    }

    if (!motif || motif.trim() === '') {
        showAlert('Veuillez saisir un motif', 'warning');
        return;
    }

    // Check if date is in the past (only for new appointments)
    const appointmentDate = new Date(appointmentData.dateRdv);
    const now = new Date();
    const appointmentId = document.getElementById('appointmentId').value;

    if (!appointmentId && appointmentDate < now) {
        showAlert('Impossible de créer un rendez-vous dans le passé', 'warning');
        return;
    }

    try {
        if (appointmentId) {
            // Update existing appointment
            await apiCall(`/appointments/${appointmentId}`, 'PUT', appointmentData);
            showAlert('Rendez-vous modifié avec succès', 'success');
        } else {
            // Add new appointment
            await apiCall('/appointments', 'POST', appointmentData);
            showAlert('Rendez-vous créé avec succès', 'success');
        }

        hideModal('appointmentModal');
        loadAppointments();

    } catch (error) {
        console.error('Failed to save appointment:', error);
        showAlert('Erreur lors de la sauvegarde du rendez-vous', 'danger');
    }
}

// View appointment details
async function viewAppointment(id) {
    try {
        const appointment = await apiCall(`/appointments/${id}`);

        // Patient and doctor details are already populated from server
        const patient = appointment.patientId;
        const doctor = appointment.doctorId;

        const appointmentDate = new Date(appointment.dateRdv);
        const now = new Date();
        const isPast = appointmentDate < now;
        const isToday = appointmentDate.toDateString() === now.toDateString();

        let statusBadge = 'secondary';
        if (appointment.status) {
            switch (appointment.status) {
                case 'confirmé': statusBadge = 'success'; break;
                case 'annulé': statusBadge = 'danger'; break;
                case 'terminé': statusBadge = 'info'; break;
            }
        }

        document.getElementById('appointmentDetails').innerHTML = `
            <div class="row">
                <!-- Appointment Information -->
                <div class="col-md-8">
                    <div class="card mb-3">
                        <div class="card-header">
                            <i class="fas fa-calendar-check me-2"></i>Informations du Rendez-vous
                        </div>
                        <div class="card-body">
                            <div class="row mb-2">
                                <div class="col-sm-3"><strong>ID:</strong></div>
                                <div class="col-sm-9">${appointment._id}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-3"><strong>Date & Heure:</strong></div>
                                <div class="col-sm-9">
                                    <strong>${formatDateTime(appointment.dateRdv)}</strong>
                                    ${isToday ? '<span class="badge bg-primary ms-2">Aujourd\'hui</span>' : ''}
                                    ${isPast ? '<span class="badge bg-warning ms-2">Passé</span>' : ''}
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-3"><strong>Motif:</strong></div>
                                <div class="col-sm-9">${appointment.motif || 'Non spécifié'}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-3"><strong>Statut:</strong></div>
                                <div class="col-sm-9">
                                    <span class="badge bg-${statusBadge}">${appointment.status || 'Planifié'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="col-md-4">
                    <div class="card mb-3">
                        <div class="card-header">
                            <i class="fas fa-bolt me-2"></i>Actions Rapides
                        </div>
                        <div class="card-body">
                            <div class="d-grid gap-2">
                                <button class="btn btn-info btn-sm" onclick="editAppointment('${appointment._id}')">
                                    <i class="fas fa-edit me-1"></i>Modifier
                                </button>
                                <button class="btn btn-success btn-sm" onclick="window.open('patients.html', '_blank')">
                                    <i class="fas fa-user me-1"></i>Voir Patient
                                </button>
                                <button class="btn btn-primary btn-sm" onclick="window.open('doctors.html', '_blank')">
                                    <i class="fas fa-user-md me-1"></i>Voir Médecin
                                </button>
                                <button class="btn btn-warning btn-sm" onclick="window.open('prescriptions.html', '_blank')">
                                    <i class="fas fa-prescription me-1"></i>Créer Prescription
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Patient Details -->
            <div class="row">
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header">
                            <i class="fas fa-user me-2"></i>Informations du Patient
                        </div>
                        <div class="card-body">
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Nom:</strong></div>
                                <div class="col-sm-8">${patient.prenom} ${patient.nom}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Âge:</strong></div>
                                <div class="col-sm-8">${calculateAge(patient.dateNaissance)} ans</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Téléphone:</strong></div>
                                <div class="col-sm-8">${patient.contact?.telephone || 'Non spécifié'}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Groupe sanguin:</strong></div>
                                <div class="col-sm-8">
                                    <span class="badge bg-info">${patient.historique_medical?.groupe_sanguin || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Doctor Details -->
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header">
                            <i class="fas fa-user-md me-2"></i>Informations du Médecin
                        </div>
                        <div class="card-body">
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Nom:</strong></div>
                                <div class="col-sm-8">Dr. ${doctor.prenom} ${doctor.nom}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Spécialité:</strong></div>
                                <div class="col-sm-8">
                                    <span class="badge bg-${getSpecialtyColor(doctor.specialite)}">${doctor.specialite}</span>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Téléphone:</strong></div>
                                <div class="col-sm-8">${doctor.contact?.telephone || 'Non spécifié'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        showModal('viewAppointmentModal');

    } catch (error) {
        console.error('Failed to load appointment details:', error);
        showAlert('Erreur lors du chargement des détails du rendez-vous', 'danger');
    }
}

// Delete appointment
async function deleteAppointment(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.')) {
        return;
    }

    try {
        await apiCall(`/appointments/${id}`, 'DELETE');
        showAlert('Rendez-vous supprimé avec succès', 'success');
        loadAppointments();
    } catch (error) {
        console.error('Failed to delete appointment:', error);
        showAlert('Erreur lors de la suppression du rendez-vous', 'danger');
    }
}

// Export appointments
function exportAppointments() {
    const csvContent = [
        ['ID', 'Date RDV', 'Patient ID', 'Patient Nom', 'Médecin ID', 'Médecin Nom', 'Spécialité', 'Motif', 'Statut'],
        ...filteredAppointments.map(appointment => {
            const patient = allPatients.find(p => p._id === appointment.patientId);
            const doctor = allDoctors.find(d => d._id === appointment.doctorId);

            return [
                appointment._id,
                formatDateTime(appointment.dateRdv),
                appointment.patientId,
                patient ? `${patient.nom} ${patient.prenom}` : 'Inconnu',
                appointment.doctorId,
                doctor ? `Dr. ${doctor.nom} ${doctor.prenom}` : 'Inconnu',
                doctor ? doctor.specialite : '',
                appointment.motif || '',
                appointment.status || 'planifié'
            ];
        })
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rendez_vous_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// Refresh appointments
function refreshAppointments() {
    loadAppointments();
}

// Helper function to get specialty color (reuse from doctors.js)
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

// Helper function to calculate age (reuse from patients.js)
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

