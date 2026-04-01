const API_URL = "https://jsonplaceholder.typicode.com/users";
let contacts = [];

// Fetch Contacts
async function fetchContacts() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    
    contacts = data.map(user => ({
      id: user.id,
      name: user.name,
      phone: user.phone
    }));

    renderContacts();
  } catch (err) {
    console.error("Error fetching contacts:", err);
  }
}

// Render UI
function renderContacts() {
  const list = document.getElementById("contactList");
  list.innerHTML = "";

  contacts.forEach(contact => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <strong>${contact.name}</strong><br>
      📱 ${contact.phone}<br>
      <button onclick="editContact(${contact.id})">Edit</button>
      <button onclick="deleteContact(${contact.id})">Delete</button>
    `;

    list.appendChild(div);
  });
}

// Add Contact
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  const newContact = { name, phone };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newContact),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    contacts.push({ ...newContact, id: data.id || Date.now() });
    renderContacts();

    e.target.reset();
  } catch (err) {
    console.error("Error adding contact:", err);
  }
});

// Delete Contact
async function deleteContact(id) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    contacts = contacts.filter(c => c.id !== id);
    renderContacts();
  } catch (err) {
    console.error("Error deleting:", err);
  }
}

// Edit Contact
async function editContact(id) {
  const contact = contacts.find(c => c.id === id);

  const newName = prompt("Edit Name:", contact.name);
  const newPhone = prompt("Edit Phone:", contact.phone);

  if (!newName || !newPhone) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: newName,
        phone: newPhone
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    contact.name = newName;
    contact.phone = newPhone;

    renderContacts();
  } catch (err) {
    console.error("Error updating:", err);
  }
}

// Initial Load
fetchContacts();