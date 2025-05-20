// ====== 1. FUNDAMENTOS BÁSICOS (Variables, DOM Selectors) ======
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");
const queryForm = document.querySelector("#queryForm");
const userSection = document.querySelector("#userSection");
const logoutBtn = document.querySelector("#logoutBtn");

// ====== 2. ARRAYS Y OBJETOS (Almacenamiento de datos) ======
let users = JSON.parse(localStorage.getItem("users")) || [];
let queries = JSON.parse(localStorage.getItem("queries")) || [];

// ====== 3. FUNCIONES CONSTRUCTORAS (Para usuarios y consultas) ======
function User(username, password, email) {
  this.username = username;
  this.password = password; // ¡En un proyecto real, usa bcrypt!
  this.email = email;
}

function Query(studentName, question, topic) {
  this.studentName = studentName;
  this.question = question;
  this.topic = topic;
  this.date = new Date().toLocaleDateString();
}

// ====== 4. FUNCIONES Y PARÁMETROS (Registro, Login, etc.) ======
function registerUser(e) {
  e.preventDefault();
  const username = document.querySelector("#registerUsername").value;
  const password = document.querySelector("#registerPassword").value;
  const email = document.querySelector("#registerEmail").value;

  if (users.some(user => user.username === username)) {
    alert("¡Usuario ya existe!");
    return;
  }

  const newUser = new User(username, password, email);
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registro exitoso. Ahora inicia sesión.");
  registerForm.reset();
}

function loginUser(e) {
  e.preventDefault();
  const username = document.querySelector("#loginUsername").value;
  const password = document.querySelector("#loginPassword").value;

  const foundUser = users.find(
    user => user.username === username && user.password === password
  );

  if (!foundUser) {
    alert("Credenciales incorrectas.");
    return;
  }

  // Mostrar sección de usuario logueado
  userSection.style.display = "block";
  loginForm.style.display = "none";
  document.querySelector("#welcomeMessage").textContent = `Bienvenido, ${username}!`;
}

function submitQuery(e) {
  e.preventDefault();
  const studentName = document.querySelector("#queryName").value;
  const question = document.querySelector("#queryQuestion").value;
  const topic = document.querySelector("#queryTopic").value;

  const newQuery = new Query(studentName, question, topic);
  queries.push(newQuery);
  localStorage.setItem("queries", JSON.stringify(queries));
  displayQueries();
  queryForm.reset();
}

// ====== 5. FUNCIONES DE ORDEN SUPERIOR (Manipulación de arrays) ======
function displayQueries() {
  const queriesList = document.querySelector("#queriesList");
  queriesList.innerHTML = queries
    .map(
      (query, index) => `
      <div class="query-card">
        <p><strong>Estudiante:</strong> ${query.studentName}</p>
        <p><strong>Tema:</strong> ${query.topic}</p>
        <p><strong>Consulta:</strong> ${query.question}</p>
        <p><strong>Fecha:</strong> ${query.date}</p>
        <button onclick="deleteQuery(${index})">Eliminar</button>
      </div>
    `
    )
    .join("");
}

function deleteQuery(index) {
  queries.splice(index, 1);
  localStorage.setItem("queries", JSON.stringify(queries));
  displayQueries();
}

// ====== 6. DOM Y EVENTOS (Listeners y lógica de UI) ======
loginForm.addEventListener("submit", loginUser);
registerForm.addEventListener("submit", registerUser);
queryForm.addEventListener("submit", submitQuery);
logoutBtn.addEventListener("click", () => {
  userSection.style.display = "none";
  loginForm.style.display = "block";
});

// Cargar consultas al iniciar
if (localStorage.getItem("queries")) {
  displayQueries();
}