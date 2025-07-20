const addNew = document.querySelector(".add-new");
const viewTrash = document.querySelector(".view-trash");

const addForm = document.querySelector(".form");
const trash = document.querySelector(".trash");
const overlay = document.querySelector(".overlay");

const submit = document.querySelector("#submit");
const nameField = document.querySelector("#name");
const roleField = document.querySelector("#role");
const salaryField = document.querySelector("#salary");
const statusField = document.querySelector("#status");
const employeesTable = document.querySelector(".main-table");
const employeesTableBody = document.querySelector(".main-table-body");
const trashTableBody = document.querySelector(".trash-body");
const addBonus = document.querySelector(".bonus-modal .form");
const submitBonus = document.querySelector("#submit-bonus");
const bonusField = document.querySelector("#bonus");
const bonusBtn = document.querySelector("#bonus-btn");

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
  addBonus.style.display = "none";
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

  // Validate salary
  if (isNaN(parseFloat(salaryField.value))) {
    const validateSalary = document.createElement("p");
    validateSalary.className = "error";
    validateSalary.textContent = "Please enter a valid number";
    salaryField.after(validateSalary);
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
  tdName.id = "e-name";
  tdName.textContent = nameField.value;
  const tdRole = document.createElement("td");
  tdRole.textContent = roleField.value;
  const tdSalary = document.createElement("td");
  tdSalary.textContent = salaryField.value;
  const tdStatus = document.createElement("td");
  tdStatus.textContent = statusField.value;
  const tdAction = document.createElement("td");

  // create Bonus action for the row
  const bonusBtn = document.createElement("button");
  bonusBtn.textContent = "Bonus";
  bonusBtn.id = "bonus-btn";
  bonusBtn.className = "edit-btn";
  bonusBtn.addEventListener("click", () => {
    addBonus.style.display = "block";
    overlay.style.visibility = "visible";
  });

  bonusBtn.addEventListener("click", (row) => {
    var salary = row.target.parentElement.parentElement.children[2];
    submitBonus.addEventListener("click", (e) => {
      e.preventDefault();
      addBonus.style.display = "block";
      overlay.style.visibility = "visible";

      var bonus =
        parseFloat(salary.textContent) * parseFloat(bonusField.value / 100);
      var newSalary = parseFloat(salary.textContent) + bonus;
      row.target.parentElement.parentElement.children[2].innerText = newSalary;

      const bonusBadge = document.createElement("div");
      bonusBadge.className = "bonus-badge";
      console.log(row.target.parentElement.parentElement.children[0]);

      row.target.parentElement.parentElement.children[0].appendChild(
        bonusBadge
      );

      addBonus.style.display = "none";
      overlay.style.visibility = "hidden";
    });
  });

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

  tdAction.append(bonusBtn, editBtn, deleteBtn);
  tr.append(tdName, tdRole, tdSalary, tdStatus, tdAction);
  employeesTableBody.appendChild(tr);

  const totalSalary = document.querySelector("#total-salaries");

  var total = 0;
  const rows = employeesTableBody.children;
  for (let i = 0; i < rows.length; i++) {
    const items = rows[i].cells[2].textContent;
    total += parseFloat(items);
  }

  totalSalary.textContent = total;

  const emp_items = employeesTableBody.childNodes;

  emp_items.forEach((item) => {
    if (parseFloat(item.cells[2].textContent) >= 100000) {
      const greenBadge = document.createElement("div");
      greenBadge.className = "green-badge";
      item.cells[0].appendChild(greenBadge);
    }
  });

  // Clear form fields
  nameField.value = "";
  roleField.value = "";
  salaryField.value = 0;
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

  const newSalary = prompt("Edit Salary:", row.children[2].textContent);
  if (newSalary === null) return;

  if (newName.trim() !== "") row.children[0].textContent = newName;
  if (newSalary != 0) row.children[2].textContent = newSalary;
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

function bonusModal(row) {
  console.log(row.children[2].textContent);
}

// filter employees

const submitFilterBtn = document.querySelector("#filter-submit");
const filterName = document.querySelector("#filter-name");
const filterRole = document.querySelector("#filter-role");
const filterSalary = document.querySelector("#filter-salary");
const filterStatus = document.querySelector("#filter-status");

submitFilterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const nameFilter = filterName.value.toLowerCase();
  const roleFilter = filterRole.value.toLowerCase();
  const salaryFilter = filterSalary.value;
  const statusFilter = filterStatus.value;

  Array.from(employeesTableBody.rows).forEach((row) => {
    const name = row.cells[0].textContent.toLowerCase();
    const role = row.cells[1].textContent.toLowerCase();
    const salary = row.cells[2].textContent;
    const status = row.cells[3].textContent;

    const nameMatch = name.includes(nameFilter);
    const roleMatch = role.includes(roleFilter);
    const salaryMatch = salary.includes(salaryFilter);
    const statusMatch = statusFilter == "" || status == statusFilter;

    const shouldShow =
      (nameFilter === "" || nameMatch) &&
      (roleFilter === "" || roleMatch) &&
      (salaryFilter === "" || salaryMatch) &&
      (statusFilter === "" || statusMatch);
    row.style.display = shouldShow ? "" : "none";
  });
});

