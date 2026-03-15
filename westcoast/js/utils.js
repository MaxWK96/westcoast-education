// utils.js - Delade hjälpfunktioner

// Formatera ett datum till svenskt format
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("sv-SE");
}

// Skapa ett kurskort som ett HTML-element
export function createCourseCard(course) {
  const card = document.createElement("div");
  card.className = "course-card";

  let classroomBadge = "";
  if (course.classroom) {
    classroomBadge = `<span class="badge">Klassrum</span>`;
  }

  let distanceBadge = "";
  if (course.distance) {
    distanceBadge = `<span class="badge distance">Distans</span>`;
  }

  card.innerHTML = `
    <img src="${course.image}" alt="${course.title}" />
    <div class="card-body">
      <h3>${course.title}</h3>
      <p class="course-meta">Kursnr: ${course.courseNumber} - ${course.days} dagar</p>
      <p class="course-meta">Datum: ${formatDate(course.date)}</p>
      <div>${classroomBadge}${distanceBadge}</div>
    </div>
  `;

  // Klick går till kurssidan
  card.addEventListener("click", function () {
    window.location.href = "course.html?id=" + course.id;
  });

  return card;
}

// Hämta inloggad användare från localStorage
export function getLoggedInUser() {
  const user = localStorage.getItem("loggedInUser");
  if (user) {
    return JSON.parse(user);
  }
  return null;
}

// Uppdatera navbaren beroende på om användaren är inloggad
export function updateNavbar() {
  const userInfo = document.getElementById("nav-user-info");
  if (!userInfo) return;

  const user = getLoggedInUser();

  if (user) {
    userInfo.innerHTML = `Inloggad: ${user.username} <button id="logout-btn">Logga ut</button>`;

    document.getElementById("logout-btn").addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    });
  } else {
    userInfo.innerHTML = `<a href="login.html">Logga in</a>`;
  }
}
