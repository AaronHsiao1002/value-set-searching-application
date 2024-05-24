// Popup.js
import React, { useState } from "react";

const Popup = ({ valueSet, onClose }) => {
  const [hoveredMedication, setHoveredMedication] = useState(null);

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={onClose}>
          Close
        </button>
        <p>Value Set ID: {valueSet.value_set_id}</p>
        <p>Value Set Name: {valueSet.value_set_name}</p>
        <div className="medications-list">
          <h3>Value Set Medications:</h3>
          <ul>
            {valueSet.medications.map((medication, index) => (
              <li
                key={index}
                onMouseEnter={() => setHoveredMedication(medication)}
                onMouseLeave={() => setHoveredMedication(null)}
              >
                {medication.medname}
                {hoveredMedication === medication && (
                  <div className="medication-details">
                    Simple Generic Name: {medication.simple_generic_name}
                    <br />
                    Route: {medication.route}
                    <br />
                    Patients: {medication.patients}
                    <br />
                    Inatients: {medication.inpatients}
                    <br />
                    Outatients: {medication.outpatients}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Popup;
