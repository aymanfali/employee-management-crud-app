const addNew = document.querySelector(".add-new");
const viewTrash = document.querySelector(".view-trash");

const addForm = document.querySelector(".form");
const trash = document.querySelector(".trash");
const overlay = document.querySelector(".overlay");

const submit = document.querySelector("#submit");
const nameField = document.querySelector("#name");
const roleField = document.querySelector("#role");
const statusField = document.querySelector("#status");
const employeesTable = document.querySelector(".main-table");
const employeesTableBody = document.querySelector(".main-table-body");
const trashTableBody = document.querySelector(".trash-body");

let itemsCount = 0;
let deletedItems = 0;

const addedCount = document.querySelector(".count-added");
const removedCount = document.querySelector(".count-removed");

addNew.addEventListener("click", () => {
  addForm.style.display = "flex";
  overlay.style.visibility = "visible";
});

overlay.addEventListener("click", () => {
  addForm.style.display = "none";
  trash.style.display = "none";
  overlay.style.visibility = "hidden";
});

viewTrash.addEventListener("click", () => {
  trash.style.display = "flex";
  overlay.style.visibility = "visible";
});

submit.addEventListener("click", (e) => {
  e.preventDefault();

  document.querySelectorAll(".error").forEach((error) => error.remove());

  let isValid = true;

  // Validate name
  if (nameField.value.trim().length === 0) {
    const validateName = document.createElement("p");
    validateName.className = "error";
    validateName.textContent = "Please Enter at least one character";
    nameField.after(validateName);
    isValid = false;
  }

  // Validate role
  if (roleField.value.trim().length === 0) {
    const validateRole = document.createElement("p");
    validateRole.className = "error";
    validateRole.textContent = "Please Enter at least one character";
    roleField.after(validateRole);
    isValid = false;
  }

  // Validate status
  if (statusField.value.trim().length === 0) {
    const validatStatus = document.createElement("p");
    validatStatus.className = "error";
    validatStatus.textContent = "Please select one item";
    statusField.after(validatStatus);
    isValid = false;
  }

  // Only proceed if validation passed
  if (!isValid) {
    return;
  }

  // count the added items
  itemsCount++;
  addedCount.textContent = itemsCount;

  // Create table row
  const tr = document.createElement("tr");
  const tdName = document.createElement("td");
  tdName.textContent = nameField.value;
  const tdRole = document.createElement("td");
  tdRole.textContent = roleField.value;
  const tdStatus = document.createElement("td");
  tdStatus.textContent = statusField.value;
  const tdAction = document.createElement("td");

  // create Edit action for the row
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  editBtn.addEventListener("click", () => {
    editRow(tr);
  });

  // create delete action for the row
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", (e) => {
    trashTableBody.appendChild(tr);
    deleteRow(tr);
  });

  tdAction.append(editBtn, deleteBtn);
  tr.append(tdName, tdRole, tdStatus, tdAction);
  employeesTableBody.appendChild(tr);

  // Clear form fields
  nameField.value = "";
  roleField.value = "";
  statusField.value = "";

  // Hide form
  addForm.style.display = "none";
  overlay.style.visibility = "hidden";
});

function editRow(row) {
  const newName = prompt("Edit Name:", row.children[0].textContent);
  if (newName === null) return;

  const newRole = prompt("Edit Role:", row.children[1].textContent);
  if (newRole === null) return;

  if (newName.trim() !== "") row.children[0].textContent = newName;
  if (newRole.trim() !== "") row.children[1].textContent = newRole;
}

function deleteRow(row) {
  if (confirm("Are you sure you want to move this employee to the trash?")) {
    const trashRow = row.cloneNode(true);
    row.remove(); // Remove the original row first

    // Remove last child in row (action)
    trashRow.removeChild(trashRow.lastElementChild);

    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "Restore";
    restoreBtn.className = "edit-btn";
    restoreBtn.addEventListener("click", () => {
      // Clone the trash row without buttons
      const restoredRow = trashRow.cloneNode(true);
      restoredRow.removeChild(restoredRow.lastElementChild);

      // get back the original action buttons
      const tdAction = document.createElement("td");
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-btn";
      editBtn.addEventListener("click", () => {
        editRow(restoredRow);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", () => {
        deleteRow(restoredRow);
      });

      // count the removed items
      --deletedItems;
      removedCount.textContent = deletedItems;

      // decrement added items
      ++itemsCount;
      addedCount.textContent = itemsCount;

      tdAction.append(editBtn, deleteBtn);
      restoredRow.appendChild(tdAction);

      employeesTableBody.appendChild(restoredRow);

      trashRow.remove();
    });

    const pDeleteBtn = document.createElement("button");
    pDeleteBtn.textContent = "Permanent Delete";
    pDeleteBtn.className = "delete-btn";
    pDeleteBtn.addEventListener("click", () => {
      if (
        confirm("Are you sure you want to permanently delete this employee?")
      ) {
        trashRow.remove();

        // count the removed items
        --deletedItems;
        removedCount.textContent = deletedItems;
      }
    });

    // count the removed items
    ++deletedItems;
    removedCount.textContent = deletedItems;

    // decrement added items
    --itemsCount;
    addedCount.textContent = itemsCount;

    const trashActions = document.createElement("td");
    trashActions.append(restoreBtn, pDeleteBtn);
    trashRow.appendChild(trashActions);
    trashTableBody.appendChild(trashRow);
  }
}
