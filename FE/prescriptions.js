// Prescriptions Management JavaScript
let allPrescriptions = [];
let filteredPrescriptions = [];
let allPatients = [];
let allDoctors = [];
let currentFilter = 'all';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadPrescriptions();
    loadPatientsAndDoctors();

    // Setup event listeners
    document.getElementById('searchInput').addEventListener('input', filterPrescriptions);
    document.getElementById('doctorFilter').addEventListener('change', filterPrescriptions);
});

// Load all prescriptions and related data
async function loadPrescriptions() {
    try {
        showLoading(document.getElementById('loadingSpinner'));
        document.getElementById('noDataMessage').classList.add('d-none');

        const [prescriptions, patients, doctors] = await Promise.all([
            apiCall('/prescriptions'),
            apiCall('/patients'),
            apiCall('/doctors')
        ]);

        allPrescriptions = prescriptions;
        allPatients = patients;
        allDoctors = doctors;
        filteredPrescriptions = [...allPrescriptions];

        displayPrescriptions(filteredPrescriptions);
        updatePrescriptionCount(filteredPrescriptions.length);

    } catch (error) {
        console.error('Failed to load prescriptions:', error);
        showAlert('Erreur lors du chargement des prescriptions', 'danger');
    } finally {
        hideLoading(document.getElementById('loadingSpinner'), '');
    }
}

// Load patients and doctors for dropdowns
async function loadPatientsAndDoctors() {
    try {
        // Load patients dropdown
        const patientsSelect = document.getElementById('patientId');
        patientsSelect.innerHTML = '<option value="">Sélectionner un patient</option>';

        allPatients.forEach(patient => {
            const option = new Option(`${patient.nom} ${patient.prenom}`, patient._id);
            patientsSelect.appendChild(option);
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

// Display prescriptions in table
function displayPrescriptions(prescriptions) {
    const tbody = document.querySelector('#prescriptionsTable tbody');
    tbody.innerHTML = '';

    if (prescriptions.length === 0) {
        document.getElementById('noDataMessage').classList.remove('d-none');
        return;
    }

    document.getElementById('noDataMessage').classList.add('d-none');

    prescriptions.forEach(prescription => {
        const row = document.createElement('tr');

        // Get related patient and doctor (already populated)
        const patient = prescription.patientId;
        const doctor = prescription.doctorId;

        // Check if prescription is expired
        const prescriptionDate = new Date(prescription.date);
        const validityDays = prescription.validityDays || 30;
        const expiryDate = new Date(prescriptionDate);
        expiryDate.setDate(expiryDate.getDate() + validityDays);
        const isExpired = new Date() > expiryDate;

        // Format medications
        const medicationsText = Array.isArray(prescription.medicaments)
            ? prescription.medicaments.join('; ')
            : prescription.medicaments || 'Non spécifié';

        // Status badge
        const statusBadge = isExpired
            ? '<span class="badge bg-danger">Expirée</span>'
            : '<span class="badge bg-success">Active</span>';

        row.innerHTML = `
            <td>${prescription._id}</td>
            <td>
                <strong>${formatDate(prescription.date)}</strong>
                <br>
                <small class="text-muted">Valide jusqu'au ${formatDate(expiryDate)}</small>
            </td>
            <td>
                ${patient ? `${patient.prenom} ${patient.nom}` : 'Patient inconnu'}
            </td>
            <td>
                ${doctor ? `Dr. ${doctor.prenom} ${doctor.nom}` : 'Médecin inconnu'}
                ${doctor ? `<br><small class="text-muted">${doctor.specialite}</small>` : ''}
            </td>
            <td>
                <span class="text-truncate d-inline-block" style="max-width: 200px;" title="${medicationsText}">
                    ${medicationsText}
                </span>
            </td>
            <td>
                <span class="text-truncate d-inline-block" style="max-width: 150px;" title="${prescription.instructions || 'Aucune'}">
                    ${prescription.instructions || 'Aucune'}
                </span>
            </td>
            <td>${statusBadge}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-warning" onclick="viewPrescription('${prescription._id}')" title="Voir">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary" onclick="editPrescription('${prescription._id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePrescription('${prescription._id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filter prescriptions
function filterPrescriptions(filterType = null) {
    if (filterType) {
        currentFilter = filterType;
    }

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const doctorFilter = document.getElementById('doctorFilter').value;

    filteredPrescriptions = allPrescriptions.filter(prescription => {
        // Get related patient and doctor (already populated)
        const patient = prescription.patientId;
        const doctor = prescription.doctorId;

        // Search filter
        const matchesSearch = !searchTerm ||
            (patient && `${patient.nom} ${patient.prenom}`.toLowerCase().includes(searchTerm)) ||
            (doctor && `Dr. ${doctor.nom} ${doctor.prenom}`.toLowerCase().includes(searchTerm)) ||
            (prescription.medicaments && prescription.medicaments.some(med =>
                med.toLowerCase().includes(searchTerm)
            ));

        // Doctor filter
        const matchesDoctor = !doctorFilter || prescription.doctorId == doctorFilter;

        // Category filter
        let matchesCategory = true;
        const prescriptionDate = new Date(prescription.date);
        const validityDays = prescription.validityDays || 30;
        const expiryDate = new Date(prescriptionDate);
        expiryDate.setDate(expiryDate.getDate() + validityDays);
        const isExpired = new Date() > expiryDate;

        if (currentFilter === 'recent') {
            // Prescriptions from last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            matchesCategory = prescriptionDate >= sevenDaysAgo;
        } else if (currentFilter === 'active') {
            matchesCategory = !isExpired;
        } else if (currentFilter === 'expired') {
            matchesCategory = isExpired;
        }

        return matchesSearch && matchesDoctor && matchesCategory;
    });

    displayPrescriptions(filteredPrescriptions);
    updatePrescriptionCount(filteredPrescriptions.length);
}

// Clear all filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('doctorFilter').value = '';
    currentFilter = 'all';

    // Reset sidebar active state
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('[onclick="filterPrescriptions(\'all\')"]').classList.add('active');

    filteredPrescriptions = [...allPrescriptions];
    displayPrescriptions(filteredPrescriptions);
    updatePrescriptionCount(filteredPrescriptions.length);
}

// Update prescription count
function updatePrescriptionCount(count) {
    document.getElementById('prescriptionCount').textContent = count;
}

// Add medication field
function addMedication() {
    const container = document.getElementById('medicationsContainer');
    const medicationDiv = document.createElement('div');
    medicationDiv.className = 'input-group mb-2 medication-item';
    medicationDiv.innerHTML = `
        <input type="text" class="form-control" name="medicaments[]" placeholder="Nom du médicament, dosage, fréquence" required>
        <button type="button" class="btn btn-outline-danger" onclick="removeMedication(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    container.appendChild(medicationDiv);
}

// Remove medication field
function removeMedication(button) {
    const medicationItems = document.querySelectorAll('.medication-item');
    if (medicationItems.length > 1) {
        button.closest('.medication-item').remove();
    } else {
        showAlert('Au moins un médicament est requis', 'warning');
    }
}

// Show add prescription modal
function showAddPrescriptionModal() {
    document.getElementById('prescriptionModalTitle').innerHTML =
        '<i class="fas fa-prescription me-2"></i>Nouvelle Prescription';
    document.getElementById('prescriptionForm').reset();
    document.getElementById('prescriptionId').value = '';

    // Ensure dropdowns are loaded
    loadPatientsAndDoctors();

    // Reset medications to one field
    const container = document.getElementById('medicationsContainer');
    container.innerHTML = `
        <div class="input-group mb-2 medication-item">
            <input type="text" class="form-control" name="medicaments[]" placeholder="Nom du médicament, dosage, fréquence" required>
            <button type="button" class="btn btn-outline-danger" onclick="removeMedication(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;

    showModal('prescriptionModal');
}

// Edit prescription
async function editPrescription(id) {
    try {
        // Ensure dropdowns are loaded
        await loadPatientsAndDoctors();

        const prescription = await apiCall(`/prescriptions/${id}`);

        // Populate form
        document.getElementById('prescriptionId').value = prescription._id;
        // Handle populated data (patientId/doctorId can be objects or ObjectIds)
        document.getElementById('patientId').value = prescription.patientId?._id || prescription.patientId;
        document.getElementById('doctorId').value = prescription.doctorId?._id || prescription.doctorId;
        document.getElementById('date').value = prescription.date.split('T')[0];
        document.getElementById('validityDays').value = prescription.validityDays || 30;
        document.getElementById('instructions').value = prescription.instructions || '';

        // Populate medications
        const container = document.getElementById('medicationsContainer');
        container.innerHTML = '';

        const medications = Array.isArray(prescription.medicaments)
            ? prescription.medicaments
            : prescription.medicaments ? [prescription.medicaments] : [''];

        medications.forEach((medication, index) => {
            const medicationDiv = document.createElement('div');
            medicationDiv.className = 'input-group mb-2 medication-item';
            medicationDiv.innerHTML = `
                <input type="text" class="form-control" name="medicaments[]" value="${medication}" placeholder="Nom du médicament, dosage, fréquence" required>
                <button type="button" class="btn btn-outline-danger" onclick="removeMedication(this)">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            container.appendChild(medicationDiv);
        });

        document.getElementById('prescriptionModalTitle').innerHTML =
            '<i class="fas fa-prescription-edit me-2"></i>Modifier la Prescription';

        showModal('prescriptionModal');

    } catch (error) {
        console.error('Failed to load prescription for editing:', error);
        showAlert('Erreur lors du chargement de la prescription', 'danger');
    }
}

// Save prescription
async function savePrescription() {
    const form = document.getElementById('prescriptionForm');
    const formData = new FormData(form);

    // Collect medications
    const medications = formData.getAll('medicaments[]').filter(med => med.trim() !== '');

    const prescriptionData = {
        patientId: formData.get('patientId'),
        doctorId: formData.get('doctorId'),
        medicaments: medications,
        date: new Date(formData.get('date')),
        validityDays: parseInt(formData.get('validityDays')) || 30,
        instructions: formData.get('instructions') || ''
    };

    // Validation
    const requiredFields = ['patientId', 'doctorId', 'medicaments'];
    const errors = [];

    if (!prescriptionData.patientId) errors.push('patientId');
    if (!prescriptionData.doctorId) errors.push('doctorId');
    if (medications.length === 0) errors.push('medicaments');

    if (errors.length > 0) {
        showAlert('Veuillez remplir tous les champs obligatoires: ' + errors.join(', '), 'warning');
        return;
    }

    try {
        const prescriptionId = document.getElementById('prescriptionId').value;

        if (prescriptionId) {
            // Update existing prescription
            await apiCall(`/prescriptions/${prescriptionId}`, 'PUT', prescriptionData);
            showAlert('Prescription modifiée avec succès', 'success');
        } else {
            // Add new prescription
            await apiCall('/prescriptions', 'POST', prescriptionData);
            showAlert('Prescription créée avec succès', 'success');
        }

        hideModal('prescriptionModal');
        loadPrescriptions();

    } catch (error) {
        console.error('Failed to save prescription:', error);
        showAlert('Erreur lors de la sauvegarde de la prescription', 'danger');
    }
}

// View prescription details
async function viewPrescription(id) {
    try {
        const prescription = await apiCall(`/prescriptions/${id}`);

        // Patient and doctor details are already populated from server
        const patient = prescription.patientId;
        const doctor = prescription.doctorId;

        const prescriptionDate = new Date(prescription.date);
        const validityDays = prescription.validityDays || 30;
        const expiryDate = new Date(prescriptionDate);
        expiryDate.setDate(expiryDate.getDate() + validityDays);
        const isExpired = new Date() > expiryDate;

        const medications = Array.isArray(prescription.medicaments)
            ? prescription.medicaments
            : prescription.medicaments ? [prescription.medicaments] : [];

        document.getElementById('prescriptionDetails').innerHTML = `
            <div class="row">
                <!-- Prescription Information -->
                <div class="col-md-8">
                    <div class="card mb-3">
                        <div class="card-header">
                            <i class="fas fa-prescription-bottle me-2"></i>Informations de la Prescription
                        </div>
                        <div class="card-body">
                            <div class="row mb-2">
                                <div class="col-sm-3"><strong>ID:</strong></div>
                                <div class="col-sm-9">${prescription.id}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-3"><strong>Date:</strong></div>
                                <div class="col-sm-9">${formatDate(prescription.date)}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-3"><strong>Validité:</strong></div>
                                <div class="col-sm-9">
                                    ${validityDays} jours
                                    <span class="badge ${isExpired ? 'bg-danger' : 'bg-success'} ms-2">
                                        ${isExpired ? 'Expirée' : 'Active'} jusqu'au ${formatDate(expiryDate)}
                                    </span>
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
                                <button class="btn btn-warning btn-sm" onclick="editPrescription(${prescription.id})">
                                    <i class="fas fa-edit me-1"></i>Modifier
                                </button>
                                <button class="btn btn-info btn-sm" onclick="window.open('patients.html', '_blank')">
                                    <i class="fas fa-user me-1"></i>Voir Patient
                                </button>
                                <button class="btn btn-success btn-sm" onclick="window.open('doctors.html', '_blank')">
                                    <i class="fas fa-user-md me-1"></i>Voir Médecin
                                </button>
                                <button class="btn btn-primary btn-sm" onclick="printPrescription(${prescription.id})">
                                    <i class="fas fa-print me-1"></i>Imprimer
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

            <!-- Medications -->
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <i class="fas fa-pills me-2"></i>Médicaments Prescrits
                        </div>
                        <div class="card-body">
                            ${medications.length > 0 ?
                                medications.map((medication, index) => `
                                    <div class="d-flex align-items-center mb-2">
                                        <span class="badge bg-primary me-3">${index + 1}</span>
                                        <span>${medication}</span>
                                    </div>
                                `).join('') :
                                '<p class="text-muted mb-0">Aucun médicament prescrit</p>'
                            }
                        </div>
                    </div>
                </div>
            </div>

            <!-- Instructions -->
            ${prescription.instructions ? `
                <div class="row mt-3">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <i class="fas fa-sticky-note me-2"></i>Instructions et Recommandations
                            </div>
                            <div class="card-body">
                                <p class="mb-0">${prescription.instructions.replace(/\n/g, '<br>')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;

        showModal('viewPrescriptionModal');

    } catch (error) {
        console.error('Failed to load prescription details:', error);
        showAlert('Erreur lors du chargement des détails de la prescription', 'danger');
    }
}

// Delete prescription
async function deletePrescription(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette prescription ? Cette action est irréversible.')) {
        return;
    }

    try {
        await apiCall(`/prescriptions/${id}`, 'DELETE');
        showAlert('Prescription supprimée avec succès', 'success');
        loadPrescriptions();
    } catch (error) {
        console.error('Failed to delete prescription:', error);
        showAlert('Erreur lors de la suppression de la prescription', 'danger');
    }
}

// Print prescription (basic implementation)
function printPrescription(id) {
    // In a real application, this would generate a proper prescription format
    window.open(`prescription-print.html?id=${id}`, '_blank');
}

// Export prescriptions
function exportPrescriptions() {
    const csvContent = [
        ['ID', 'Date', 'Patient ID', 'Patient Nom', 'Médecin ID', 'Médecin Nom', 'Médicaments', 'Instructions', 'Validité (jours)'],
        ...filteredPrescriptions.map(prescription => {
            const patient = prescription.patientId;
            const doctor = prescription.doctorId;

            const medications = Array.isArray(prescription.medicaments)
                ? prescription.medicaments.join('; ')
                : prescription.medicaments || '';

            return [
                prescription.id,
                formatDate(prescription.date),
                prescription.patientId,
                patient ? `${patient.nom} ${patient.prenom}` : 'Inconnu',
                prescription.doctorId,
                doctor ? `Dr. ${doctor.nom} ${doctor.prenom}` : 'Inconnu',
                medications,
                prescription.instructions || '',
                prescription.validityDays || 30
            ];
        })
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `prescriptions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// Refresh prescriptions
function refreshPrescriptions() {
    loadPrescriptions();
}

// Helper functions (reuse from other files)
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

