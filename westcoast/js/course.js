// course.js - Logik för course.html (detaljer + bokning)

import { getCourseById, addBooking } from "./api.js";
import { formatDate, getLoggedInUser, updateNavbar } from "./utils.js";

async function init() {
  updateNavbar();

  // Hämta kurs-id från URL: course.html?id=1
  const courseId = window.location.search.split("=")[1];

  if (!courseId) {
    document.getElementById("course-detail").innerHTML = "<p>Ingen kurs vald.</p>";
    return;
  }

  try {
    const course = await getCourseById(courseId);
    renderCourseDetail(course);
    setupBookingForm(course);
  } catch (error) {
    document.getElementById("course-detail").innerHTML = "<p>Kunde inte hämta kurs.</p>";
    console.error(error);
  }
}

function renderCourseDetail(course) {
  const container = document.getElementById("course-detail");

  let classroomBadge = "";
  if (course.classroom) {
    classroomBadge = `<span class="badge">Klassrum</span>`;
  }

  let distanceBadge = "";
  if (course.distance) {
    distanceBadge = `<span class="badge distance">Distans</span>`;
  }

  container.innerHTML = `
    <img src="${course.image}" alt="${course.title}" />
    <h1>${course.title}</h1>
    <p>${course.description}</p>
    <p>Kursnummer: ${course.courseNumber}</p>
    <p>Datum: ${formatDate(course.date)}</p>
    <p>Antal dagar: ${course.days}</p>
    <p>Pris: ${course.price} kr</p>
    <div>${classroomBadge}${distanceBadge}</div>
  `;
}

function setupBookingForm(course) {
  const bookingSection = document.getElementById("booking-section");
  const user = getLoggedInUser();

  // Inte inloggad - visa länk till login
  if (!user) {
    bookingSection.innerHTML = `
      <div class="booking-section">
        <h2>Boka kurs</h2>
        <p>Du måste vara inloggad för att boka.</p>
        <a href="login.html?redirect=course.html?id=${course.id}" class="btn btn-primary">
          Logga in för att boka
        </a>
      </div>
    `;
    return;
  }

  // Bygg alternativ beroende på vad kursen erbjuder
  let typeOptions = "";
  if (course.classroom) {
    typeOptions += `<option value="classroom">Klassrum</option>`;
  }
  if (course.distance) {
    typeOptions += `<option value="distance">Distans</option>`;
  }

  bookingSection.innerHTML = `
    <div class="booking-section">
      <h2>Boka kurs</h2>
      <div class="form-group">
        <label for="name">Namn</label>
        <input type="text" id="name" placeholder="Ditt fullständiga namn" />
      </div>
      <div class="form-group">
        <label for="address">Faktureringsadress</label>
        <input type="text" id="address" placeholder="Gata, postnummer, stad" />
      </div>
      <div class="form-group">
        <label for="email">E-postadress</label>
        <input type="email" id="email" placeholder="din@email.se" />
      </div>
      <div class="form-group">
        <label for="phone">Mobilnummer</label>
        <input type="tel" id="phone" placeholder="07XXXXXXXX" />
      </div>
      <div class="form-group">
        <label for="type">Kurstyp</label>
        <select id="type">${typeOptions}</select>
      </div>
      <button class="btn btn-primary" id="book-btn">Boka nu</button>
      <div class="success-msg" id="success-msg">Bokning bekräftad!</div>
      <div class="error-msg" id="error-msg">Fyll i alla fält.</div>
    </div>
  `;

  document.getElementById("book-btn").addEventListener("click", function () {
    handleBooking(course.id);
  });
}

async function handleBooking(courseId) {
  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const type = document.getElementById("type").value;

  const errorMsg = document.getElementById("error-msg");
  const successMsg = document.getElementById("success-msg");

  if (!name || !address || !email || !phone) {
    errorMsg.classList.add("show");
    successMsg.classList.remove("show");
    return;
  }

  const booking = {
    courseId: Number(courseId),
    name: name,
    address: address,
    email: email,
    phone: phone,
    type: type,
  };

  try {
    await addBooking(booking);
    successMsg.classList.add("show");
    errorMsg.classList.remove("show");
    document.getElementById("book-btn").disabled = true;
  } catch (error) {
    errorMsg.textContent = "Något gick fel. Försök igen.";
    errorMsg.classList.add("show");
    console.error(error);
  }
}

init();
