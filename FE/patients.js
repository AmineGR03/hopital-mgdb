// Patients Management JavaScript
let allPatients = [];
let filteredPatients = [];
let currentFilter = 'all';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadPatients();

    // Setup event listeners
    document.getElementById('searchInput').addEventListener('input', filterPatients);
    document.getElementById('bloodTypeFilter').addEventListener('change', filterPatients);
    document.getElementById('genderFilter').addEventListener('change', filterPatients);
});

// Load all patients
async function loadPatients() {
    try {
        showLoading(document.getElementById('loadingSpinner'));
        document.getElementById('noDataMessage').classList.add('d-none');

        allPatients = await apiCall('/patients');
        filteredPatients = [...allPatients];

        displayPatients(filteredPatients);
        updatePatientCount(filteredPatients.length);

    } catch (error) {
        console.error('Failed to load patients:', error);
        showAlert('Erreur lors du chargement des patients', 'danger');
    } finally {
        hideLoading(document.getElementById('loadingSpinner'), '');
    }
}

// Display patients in table
function displayPatients(patients) {
    const tbody = document.querySelector('#patientsTable tbody');
    tbody.innerHTML = '';

    if (patients.length === 0) {
        document.getElementById('noDataMessage').classList.remove('d-none');
        return;
    }

    document.getElementById('noDataMessage').classList.add('d-none');

    patients.forEach(patient => {
        const row = document.createElement('tr');

        // Format allergies
        const allergies = patient.historique_medical?.allergies || [];
        const allergiesText = allergies.length > 0 ? allergies.join(', ') : 'Aucune';

        // Calculate age
        const age = calculateAge(patient.dateNaissance);

        row.innerHTML = `
            <td>${patient._id}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar-circle me-2">
                        ${patient.prenom.charAt(0)}${patient.nom.charAt(0)}
                    </div>
                    <div>
                        <strong>${patient.prenom} ${patient.nom}</strong>
                        <br>
                        <small class="text-muted">${age} ans</small>
                    </div>
                </div>
            </td>
            <td>${formatDate(patient.dateNaissance)}</td>
            <td>
                <span class="badge bg-${patient.sexe === 'Homme' ? 'primary' : 'success'}">
                    ${patient.sexe}
                </span>
            </td>
            <td>
                <span class="badge bg-info">${patient.historique_medical?.groupe_sanguin || 'N/A'}</span>
            </td>
            <td>${patient.contact?.telephone || 'N/A'}</td>
            <td>
                <span class="text-truncate d-inline-block" style="max-width: 150px;" title="${allergiesText}">
                    ${allergiesText}
                </span>
            </td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewPatient('${patient._id}')" title="Voir">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="editPatient('${patient._id}')" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deletePatient('${patient._id}')" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Calculate age from birth date
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

// Filter patients
function filterPatients(filterType = null) {
    if (filterType) {
        currentFilter = filterType;
    }

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const bloodTypeFilter = document.getElementById('bloodTypeFilter').value;
    const genderFilter = document.getElementById('genderFilter').value;

    filteredPatients = allPatients.filter(patient => {
        // Search filter
        const matchesSearch = !searchTerm ||
            `${patient.nom} ${patient.prenom}`.toLowerCase().includes(searchTerm) ||
            patient.contact?.telephone?.includes(searchTerm);

        // Blood type filter
        const matchesBloodType = !bloodTypeFilter ||
            patient.historique_medical?.groupe_sanguin === bloodTypeFilter;

        // Gender filter
        const matchesGender = !genderFilter ||
            patient.sexe === genderFilter;

        // Category filter
        let matchesCategory = true;
        if (currentFilter === 'recent') {
            // Patients added in the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            matchesCategory = new Date(patient.createdAt || patient.dateNaissance) > thirtyDaysAgo;
        } else if (currentFilter === 'critical') {
            // Patients with allergies or critical conditions
            matchesCategory = patient.historique_medical?.allergies?.length > 0 ||
                             patient.historique_medical?.diagnostics_passes?.some(d => d.condition.includes('critique'));
        }

        return matchesSearch && matchesBloodType && matchesGender && matchesCategory;
    });

    displayPatients(filteredPatients);
    updatePatientCount(filteredPatients.length);
}

// Clear all filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('bloodTypeFilter').value = '';
    document.getElementById('genderFilter').value = '';
    currentFilter = 'all';

    // Reset sidebar active state
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector('[onclick="filterPatients(\'all\')"]').classList.add('active');

    filteredPatients = [...allPatients];
    displayPatients(filteredPatients);
    updatePatientCount(filteredPatients.length);
}

// Update patient count
function updatePatientCount(count) {
    document.getElementById('patientCount').textContent = count;
}

// Show add patient modal
function showAddPatientModal() {
    document.getElementById('patientModalTitle').innerHTML =
        '<i class="fas fa-user-plus me-2"></i>Ajouter un Patient';
    document.getElementById('patientForm').reset();
    document.getElementById('patientId').value = '';

    showModal('patientModal');
}

// Edit patient
async function editPatient(id) {
    try {
        const patient = await apiCall(`/patients/${id}`);

        // Populate form
        document.getElementById('patientId').value = patient._id;
        document.getElementById('nom').value = patient.nom;
        document.getElementById('prenom').value = patient.prenom;
        document.getElementById('dateNaissance').value = patient.dateNaissance.split('T')[0];
        document.getElementById('sexe').value = patient.sexe;
        document.getElementById('telephone').value = patient.contact?.telephone || '';
        document.getElementById('adresse').value = patient.contact?.adresse || '';
        document.getElementById('groupeSanguin').value = patient.historique_medical?.groupe_sanguin || '';
        document.getElementById('allergies').value = patient.historique_medical?.allergies?.join(', ') || '';

        document.getElementById('patientModalTitle').innerHTML =
            '<i class="fas fa-user-edit me-2"></i>Modifier le Patient';

        showModal('patientModal');

    } catch (error) {
        console.error('Failed to load patient for editing:', error);
        showAlert('Erreur lors du chargement du patient', 'danger');
    }
}

// Save patient
async function savePatient() {
    const form = document.getElementById('patientForm');
    const formData = new FormData(form);

    const patientId = document.getElementById('patientId').value;

    let patientData;

    if (patientId) {
        // For updates, get existing patient to preserve diagnostics_passes
        try {
            const existingPatient = await apiCall(`/patients/${patientId}`);

            patientData = {
                nom: formData.get('nom'),
                prenom: formData.get('prenom'),
                dateNaissance: formData.get('dateNaissance'),
                sexe: formData.get('sexe'),
                contact: {
                    telephone: formData.get('telephone'),
                    adresse: formData.get('adresse')
                },
                historique_medical: {
                    groupe_sanguin: formData.get('groupeSanguin'),
                    allergies: formData.get('allergies') ? formData.get('allergies').split(',').map(a => a.trim()) : [],
                    diagnostics_passes: existingPatient.historique_medical?.diagnostics_passes || []
                }
            };
        } catch (error) {
            console.error('Failed to get existing patient:', error);
            showAlert('Erreur lors de la récupération du patient existant', 'danger');
            return;
        }
    } else {
        // For new patients
        patientData = {
            nom: formData.get('nom'),
            prenom: formData.get('prenom'),
            dateNaissance: formData.get('dateNaissance'),
            sexe: formData.get('sexe'),
            contact: {
                telephone: formData.get('telephone'),
                adresse: formData.get('adresse')
            },
            historique_medical: {
                groupe_sanguin: formData.get('groupeSanguin'),
                allergies: formData.get('allergies') ? formData.get('allergies').split(',').map(a => a.trim()) : [],
                diagnostics_passes: []
            }
        };
    }

    // Validation
    const requiredFields = ['nom', 'prenom', 'dateNaissance', 'sexe'];
    const errors = validateForm(patientData, requiredFields);

    if (errors.length > 0) {
        showAlert('Veuillez remplir tous les champs obligatoires: ' + errors.join(', '), 'warning');
        return;
    }

    try {
        if (patientId) {
            // Update existing patient
            await apiCall(`/patients/${patientId}`, 'PUT', patientData);
            showAlert('Patient modifié avec succès', 'success');
        } else {
            // Add new patient
            await apiCall('/patients', 'POST', patientData);
            showAlert('Patient ajouté avec succès', 'success');
        }

        hideModal('patientModal');
        loadPatients();

    } catch (error) {
        console.error('Failed to save patient:', error);
        showAlert('Erreur lors de la sauvegarde du patient', 'danger');
    }
}

// View patient details
async function viewPatient(id) {
    try {
        const patient = await apiCall(`/patients/${id}`);

        const age = calculateAge(patient.dateNaissance);
        const allergies = patient.historique_medical?.allergies || [];
        const diagnostics = patient.historique_medical?.diagnostics_passes || [];

        document.getElementById('patientDetails').innerHTML = `
            <div class="row">
                <!-- Basic Information -->
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header">
                            <i class="fas fa-user me-2"></i>Informations Personnelles
                        </div>
                        <div class="card-body">
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>ID:</strong></div>
                                <div class="col-sm-8">${patient.id}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Nom:</strong></div>
                                <div class="col-sm-8">${patient.nom} ${patient.prenom}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Âge:</strong></div>
                                <div class="col-sm-8">${age} ans</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Genre:</strong></div>
                                <div class="col-sm-8">${patient.sexe}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Date de naissance:</strong></div>
                                <div class="col-sm-8">${formatDate(patient.dateNaissance)}</div>
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
                                <div class="col-sm-8">${patient.contact?.telephone || 'Non spécifié'}</div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Adresse:</strong></div>
                                <div class="col-sm-8">${patient.contact?.adresse || 'Non spécifiée'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Medical Information -->
            <div class="row">
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header">
                            <i class="fas fa-heartbeat me-2"></i>Informations Médicales
                        </div>
                        <div class="card-body">
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Groupe sanguin:</strong></div>
                                <div class="col-sm-8">
                                    <span class="badge bg-info">${patient.historique_medical?.groupe_sanguin || 'Non spécifié'}</span>
                                </div>
                            </div>
                            <div class="row mb-2">
                                <div class="col-sm-4"><strong>Allergies:</strong></div>
                                <div class="col-sm-8">
                                    ${allergies.length > 0 ?
                                        allergies.map(allergy => `<span class="badge bg-warning me-1">${allergy}</span>`).join('') :
                                        'Aucune allergie connue'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Medical History -->
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header">
                            <i class="fas fa-history me-2"></i>Historique Médical
                        </div>
                        <div class="card-body">
                            ${diagnostics.length > 0 ?
                                diagnostics.map(d => `
                                    <div class="mb-2 p-2 border rounded">
                                        <small class="text-muted">${formatDate(d.date)}</small>
                                        <br><strong>${d.condition}</strong>
                                        ${d.notes ? `<br><small>${d.notes}</small>` : ''}
                                    </div>
                                `).join('') :
                                '<p class="text-muted mb-0">Aucun diagnostic passé enregistré</p>'
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;

        showModal('viewPatientModal');

    } catch (error) {
        console.error('Failed to load patient details:', error);
        showAlert('Erreur lors du chargement des détails du patient', 'danger');
    }
}

// Delete patient
async function deletePatient(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.')) {
        return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.')) {
        return;
    }

    try {
        await apiCall(`/patients/${id}`, 'DELETE');
        showAlert('Patient supprimé avec succès', 'success');
        loadPatients();
    } catch (error) {
        console.error('Failed to delete patient:', error);
        showAlert('Erreur lors de la suppression du patient', 'danger');
    }
}

// Export patients
function exportPatients() {
    const csvContent = [
        ['ID', 'Nom', 'Prénom', 'Date de Naissance', 'Genre', 'Téléphone', 'Groupe Sanguin', 'Allergies'],
        ...filteredPatients.map(patient => [
            patient.id,
            patient.nom,
            patient.prenom,
            formatDate(patient.dateNaissance),
            patient.sexe,
            patient.contact?.telephone || '',
            patient.historique_medical?.groupe_sanguin || '',
            patient.historique_medical?.allergies?.join('; ') || ''
        ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `patients_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// Refresh patients
function refreshPatients() {
    loadPatients();
}
