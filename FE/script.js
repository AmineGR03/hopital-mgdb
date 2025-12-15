const API_URL = "http://localhost:3000/patients";

// Afficher tous les patients
const loadPatients = async () => {
  const res = await fetch(API_URL);
  const patients = await res.json();
  const list = document.getElementById("patients-list");
  list.innerHTML = "";

  patients.forEach(p => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <strong>${p.nom} ${p.prenom}</strong> (${p.sexe})<br>
        <small>${p.contact.telephone} - ${p.contact.adresse}</small>
      </div>
      <button class="btn btn-sm btn-info">Détails</button>
    `;
    list.appendChild(li);

    // Click sur bouton "Détails"
    li.querySelector("button").addEventListener("click", () => showPatientDetails(p._id));
  });
};

// Afficher les détails d'un patient dans le modal
const showPatientDetails = async (patientId) => {
  try {
    const res = await fetch(`${API_URL}/${patientId}/details`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des détails");
    const p = await res.json();

    const modalBody = document.getElementById("patient-modal-body");
    modalBody.innerHTML = `
      <p><strong>Nom :</strong> ${p.nom} ${p.prenom}</p>
      <p><strong>Date de naissance :</strong> ${new Date(p.dateNaissance).toLocaleDateString()}</p>
      <p><strong>Sexe :</strong> ${p.sexe}</p>
      <p><strong>Téléphone :</strong> ${p.contact.telephone}</p>
      <p><strong>Adresse :</strong> ${p.contact.adresse}</p>
      <hr>
      <h5>Historique médical</h5>
      <p><strong>Groupe sanguin :</strong> ${p.historique_medical?.groupe_sanguin || '-'}</p>
      <p><strong>Allergies :</strong> ${p.historique_medical?.allergies.join(", ") || '-'}</p>
      <p><strong>Diagnostics passés :</strong></p>
      <ul>
        ${p.historique_medical?.diagnostics_passes.map(d => `<li>${new Date(d.date).toLocaleDateString()} - ${d.condition} - ${d.notes}</li>`).join("") || "<li>-</li>"}
      </ul>
      <hr>
      <h5>Rendez-vous</h5>
      <ul>
        ${p.appointments.map(a => `<li>${new Date(a.dateRdv).toLocaleString()} - ${a.motif}</li>`).join("") || "<li>-</li>"}
      </ul>
      <h5>Prescriptions</h5>
      <ul>
        ${p.prescriptions.map(pr => `<li>${new Date(pr.date).toLocaleDateString()} - Médicaments: ${pr.medicaments.join(", ")} - Instructions: ${pr.instructions}</li>`).join("") || "<li>-</li>"}
      </ul>
    `;

    const modal = new bootstrap.Modal(document.getElementById("patientModal"));
    modal.show();
  } catch (err) {
    alert(err.message);
  }
};

// Ajouter un patient
const form = document.getElementById("patient-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const patientData = {
    nom: document.getElementById("nom").value,
    prenom: document.getElementById("prenom").value,
    dateNaissance: document.getElementById("dateNaissance").value,
    sexe: document.getElementById("sexe").value,
    contact: {
      telephone: document.getElementById("telephone").value,
      adresse: document.getElementById("adresse").value
    },
    historique_medical: {
      groupe_sanguin: document.getElementById("groupe_sanguin").value,
      allergies: document.getElementById("allergies").value.split(",").map(a => a.trim()),
      diagnostics_passes: []
    }
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patientData)
  });

  if (res.ok) {
    form.reset();
    loadPatients();
  } else {
    alert("Erreur lors de l'ajout du patient");
  }
});

// Charger la liste au démarrage
loadPatients();
