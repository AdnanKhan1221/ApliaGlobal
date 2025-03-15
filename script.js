let documents = JSON.parse(localStorage.getItem('documents')) || [];

function renderDocuments() {
  const container = document.getElementById('documentList');
  container.innerHTML = '';
  documents.forEach((doc, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${doc.name}</strong><br/>
      <em>${doc.description}</em><br/>
      <a href="${doc.file}" target="_blank">View Document</a><br/>
      <button onclick="editDocument(${index})">Edit</button>
      <button onclick="deleteDocument(${index})">Delete</button>
      <hr/>
    `;
    container.appendChild(div);
  });
}

document.getElementById('docForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('docName').value;
  const description = document.getElementById('docDescription').value;
  const file = document.getElementById('docFile').files[0];

  const base64 = await toBase64(file);
  documents.push({ name, description, file: base64 });
  localStorage.setItem('documents', JSON.stringify(documents));
  renderDocuments();
  e.target.reset();
});

function editDocument(index) {
  const doc = documents[index];
  const newName = prompt("Edit Name:", doc.name);
  const newDesc = prompt("Edit Description:", doc.description);
  if (newName && newDesc) {
    documents[index].name = newName;
    documents[index].description = newDesc;
    localStorage.setItem('documents', JSON.stringify(documents));
    renderDocuments();
  }
}

function deleteDocument(index) {
  if (confirm("Delete this document?")) {
    documents.splice(index, 1);
    localStorage.setItem('documents', JSON.stringify(documents));
    renderDocuments();
  }
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

window.onload = renderDocuments;
