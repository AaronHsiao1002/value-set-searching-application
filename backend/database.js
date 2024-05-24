import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MY_SQL_HOST,
    user: process.env.MY_SQL_USER,
    password: process.env.MY_SQL_PASSWORD,
    database: process.env.MY_SQL_DATABASE,
  })
  .promise();

// Get All Value Sets
export async function getValueSets() {
  try {
    const [medications] = await pool.query("SELECT * FROM medications");
    const [valueSets] = await pool.query(
      "SELECT * FROM beta_blocker_value_sets"
    );
    const combinedData = valueSets.map((valueSet) => {
      return {
        ...valueSet,
        medications: medications.filter((medication) =>
          valueSet.medications.includes(medication.medication_id)
        ),
      };
    });
    return combinedData; // array of objects
  } catch (error) {
    throw error;
  }
}

// get a value set by id
export async function getValueSet(id) {
  try {
    const [medications] = await pool.query("SELECT * FROM medications");
    const [valueSets] = await pool.query(
      "SELECT * FROM beta_blocker_value_sets  WHERE value_set_id= ?",
      [id]
    ); // prepared statement, to avoid sql injection
    const combinedData = valueSets.map((valueSet) => {
      return {
        ...valueSet,
        medications: medications.filter((medication) =>
          valueSet.medications.includes(medication.medication_id)
        ),
      };
    });
    return combinedData[0]; // object
  } catch (error) {
    throw error;
  }
}

export async function getValueSetsByName(valueSetName) {
  try {
    const [medications] = await pool.query("SELECT * FROM medications"); // prepared statement, to avoid sql injection
    const [valueSets] = await pool.query(
      "SELECT * FROM beta_blocker_value_sets  WHERE value_set_name LIKE ?",
      [`%${valueSetName}%`]
    ); // prepared statement, to avoid sql injection
    const combinedData = valueSets.map((valueSet) => {
      return {
        ...valueSet,
        medications: medications.filter((medication) =>
          valueSet.medications.includes(medication.medication_id)
        ),
      };
    });
    return combinedData; // array of objects
  } catch (error) {
    throw error;
  }
}

export async function getValueSetByMedicationName(medicationName) {
  try {
    // Fetch all medications from the database
    const [searchMedications] = await pool.query(
      "SELECT * FROM medications WHERE medname LIKE ?",
      [`%${medicationName}%`]
    );

    const [allMedications] = await pool.query("SELECT * FROM medications");

    // Fetch value sets containing the specified medication name
    const [valueSets] = await pool.query(
      "SELECT * FROM beta_blocker_value_sets" // Using the medicationName as a wildcard search
    );
    const valueSetIdContainedMedication = [];
    for (const valueSet of valueSets) {
      // Check if any medication in the value set matches the searched medication
      for (const medication of searchMedications) {
        if (valueSet.medications.includes(medication.medication_id)) {
          valueSetIdContainedMedication.push(valueSet.value_set_id);
          break; // No need to check other medications in this value set
        }
      }
    }
    const combinedData = [];

    for (const valueSet of valueSets) {
      // Check if the current value set's value_set_id is in valueSetIdContainedMedication
      if (valueSetIdContainedMedication.includes(valueSet.value_set_id)) {
        // Fetch medications for the current value set
        const medicationsForValueSet = allMedications.filter((medication) =>
          valueSet.medications.includes(medication.medication_id)
        );

        // Combine value set and medications
        const combinedValueSet = {
          ...valueSet,
          medications: medicationsForValueSet,
        };

        // Push combined data to the array
        combinedData.push(combinedValueSet);
      }
    }

    return combinedData; // array of objects
  } catch (error) {
    throw error;
  }
}
