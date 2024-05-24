import React from "react";
import "./ComparisonTable.css";

const ComparisonTable = ({ valueSets, onClose }) => {
  const getMedicationsByIds = (ids) => {
    return ids.map((id) => {
      const med =
        valueSets[0].medications.find((med) => med.medication_id === id) ||
        valueSets[1].medications.find((med) => med.medication_id === id);
      return med ? med.medname : "Unknown";
    });
  };

  const valueSet1Meds = valueSets[0].medications.map(
    (med) => med.medication_id
  );
  const valueSet2Meds = valueSets[1].medications.map(
    (med) => med.medication_id
  );

  const commonMeds = valueSet1Meds.filter((id) => valueSet2Meds.includes(id));
  const uniqueMeds1 = valueSet1Meds.filter((id) => !valueSet2Meds.includes(id));
  const uniqueMeds2 = valueSet2Meds.filter((id) => !valueSet1Meds.includes(id));

  return (
    <div className="comparison-table-container">
      <button className="close-button" onClick={onClose}>
        Close
      </button>
      <h2>Medication Comparison</h2>
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Medication</th>
            <th>{valueSets[0].value_set_name}</th>
            <th>{valueSets[1].value_set_name}</th>
          </tr>
        </thead>
        <tbody>
          {commonMeds.length > 0 && (
            <>
              <tr>
                <td colSpan="3" className="section-title">
                  Common Medications
                </td>
              </tr>
              {commonMeds.map((id) => (
                <tr key={id}>
                  <td>{getMedicationsByIds([id])[0]}</td>
                  <td>✔</td>
                  <td>✔</td>
                </tr>
              ))}
            </>
          )}
          {(uniqueMeds1.length > 0 || uniqueMeds2.length > 0) && (
            <>
              <tr>
                <td colSpan="3" className="section-title">
                  Unique Medications
                </td>
              </tr>
              {uniqueMeds1.map((id) => (
                <tr key={id}>
                  <td>{getMedicationsByIds([id])[0]}</td>
                  <td>✔</td>
                  <td></td>
                </tr>
              ))}
              {uniqueMeds2.map((id) => (
                <tr key={id}>
                  <td>{getMedicationsByIds([id])[0]}</td>
                  <td></td>
                  <td>✔</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
