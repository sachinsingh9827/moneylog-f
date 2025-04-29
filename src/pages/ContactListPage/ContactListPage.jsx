import React, { useState } from "react";

const ContactListPage = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");

  const getContacts = async () => {
    try {
      if (!("contacts" in navigator && "ContactsManager" in window)) {
        setError("❌ Contacts API not supported on this device/browser.");
        return;
      }

      const props = ["name", "tel"];
      const options = { multiple: true };

      const selectedContacts = await navigator.contacts.select(props, options);
      setContacts(selectedContacts);
      setError(""); // Clear error if successful
    } catch (err) {
      setError("❌ Permission denied or error fetching contacts.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>📱 Mobile Contact List</h2>
      <p>
        This works only on supported mobile browsers like{" "}
        <strong>Chrome for Android</strong> with HTTPS.
      </p>

      <button
        onClick={getContacts}
        style={{
          padding: "10px 20px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        📇 Get Contacts
      </button>

      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}

      {contacts.length > 0 && (
        <ul style={{ marginTop: "20px", paddingLeft: "20px" }}>
          {contacts.map((contact, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <strong>{contact.name || "No Name"}</strong> -{" "}
              {contact.tel ? contact.tel.join(", ") : "No Number"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactListPage;
