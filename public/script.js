// script.js - For index.html only

// Redirect to login if not authenticated
const auth = localStorage.getItem("apolloniaAuth");
if (!auth) {
    window.location.href = "login.html";
}

// Logout handler
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("apolloniaAuth");
    window.location.href = "login.html";
});

// Helper for authenticated fetch
const fetchWithAuth = (url, options = {}) => {
    options.headers = {
        ...(options.headers || {}),
        "Authorization": "Basic " + auth,
        "Content-Type": "application/json"
    };
    return fetch(url, options);
};

const departmentCheckboxes = document.getElementById("departmentCheckboxes");
const employeeList = document.getElementById("employeeList");
const form = document.getElementById("employee-form");
const searchInput = document.getElementById("searchInput");

let editingEmployeeId = null; // <-- Track if editing an employee

// Load Departments and create checkboxes
async function loadDepartments() {
    const res = await fetchWithAuth('/api/departments');
    const departments = await res.json();

    departmentCheckboxes.innerHTML = ""; // Clear existing
    departments.forEach(dept => {
        const label = document.createElement("label");
        label.style.display = "block"; // Each checkbox on its own line

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = dept._id;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + dept.name));

        departmentCheckboxes.appendChild(label);
    });
}

// Load Employees
async function loadEmployees() {
    const res = await fetchWithAuth('/api/employees');
    const employees = await res.json();

    employeeList.innerHTML = "";
    employees.forEach(emp => {
        const li = document.createElement("li");
        li.textContent = `${emp.firstName} ${emp.lastName} - ${emp.departments.map(d => d.name).join(', ')}`;

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️ Edit";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", () => {
            document.getElementById("firstName").value = emp.firstName;
            document.getElementById("lastName").value = emp.lastName;

            // Set department checkboxes
            const checkboxes = document.querySelectorAll('#departmentCheckboxes input[type="checkbox"]');
            checkboxes.forEach(cb => {
                cb.checked = emp.departments.some(d => d._id === cb.value || d === cb.value);
            });

            editingEmployeeId = emp._id;
            form.querySelector("button[type='submit']").textContent = "Update Employee";
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️ Delete";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", async () => {
            if (!confirm(`Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`)) return;

            const deleteRes = await fetchWithAuth(`/api/employees/${emp._id}`, {
                method: 'DELETE'
            });

            if (deleteRes.ok) {
                await loadEmployees();
            } else {
                const error = await deleteRes.json();
                alert("Error: " + (error.error || "Could not delete employee."));
            }
        });

        // Buttons container
        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("button-group");

        buttonGroup.appendChild(editBtn);
        buttonGroup.appendChild(deleteBtn);

        li.appendChild(buttonGroup);
        employeeList.appendChild(li);
    });
}


// Validate Form
function validateForm(firstName, lastName, departments) {
    if (!firstName.trim() || !lastName.trim()) {
        alert("Please enter both first and last name.");
        return false;
    }
    if (departments.length === 0) {
        alert("Please select at least one department.");
        return false;
    }
    return true;
}

// Handle Add or Update Employee
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();

    const selected = Array.from(
        document.querySelectorAll('#departmentCheckboxes input[type="checkbox"]:checked')
    ).map(cb => cb.value);

    if (!validateForm(firstName, lastName, selected)) return;

    const payload = { firstName, lastName, departments: selected };

    let res;
    if (editingEmployeeId) {
        // Update existing employee
        res = await fetchWithAuth(`/api/employees/${editingEmployeeId}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
    } else {
        // Create new employee
        res = await fetchWithAuth('/api/employees', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    if (res.ok) {
        form.reset();
        editingEmployeeId = null;
        form.querySelector("button[type='submit']").textContent = "Add Employee";
        await loadEmployees();
    } else {
        const error = await res.json();
        alert("Error: " + (error.error || "Could not save employee."));
    }
});



// Search functionality
searchInput.addEventListener("input", async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const res = await fetchWithAuth('/api/employees');
    const employees = await res.json();

    employeeList.innerHTML = "";
    employees
        .filter(emp =>
            emp.firstName.toLowerCase().includes(searchTerm) ||
            emp.lastName.toLowerCase().includes(searchTerm)
        )
        .forEach(emp => {
            const li = document.createElement("li");
            li.textContent = `${emp.firstName} ${emp.lastName} - ${emp.departments.map(d => d.name).join(', ')}`;
            employeeList.appendChild(li);
        });
});

// Initial load
(async () => {
    await loadDepartments();
    await loadEmployees();
})();
