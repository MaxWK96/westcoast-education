// admin.js - Logik för admin.html

import { getCourses, addCourse, getBookingsByCourse } from "./api.js";
import { updateNavbar, getLoggedInUser } from "./utils.js";

async function init() {
  updateNavbar();

  // Kolla om användaren är admin
  const user = getLoggedInUser();
  if (!user || user.role !== "admin") {
    document.getElementById("admin-content").innerHTML = `
      <p>Du har inte behörighet att se denna sida.</p>
      <a href="login.html" class="btn btn-primary">Logga in</a>
    `;
    return;
  }

  setupAddCourseForm();
  await loadCourseSelect();

  // När admin väljer en kurs, visa dess bokningar
  document.getElementById("course-select").addEventListener("change", async function () {
    const courseId = document.getElementById("course-select").value;
    const tableBody = document.getElementById("bookings-body");
    const noBookingsMsg = document.getElementById("no-bookings");

    if (!courseId) {
      tableBody.innerHTML = "";
      noBookingsMsg.classList.remove("show");
      return;
    }

    try {
      const bookings = await getBookingsByCourse(courseId);
      tableBody.innerHTML = "";

      if (bookings.length === 0) {
        noBookingsMsg.classList.add("show");
        return;
      }

      noBookingsMsg.classList.remove("show");

      bookings.forEach(function (booking) {
        const row = document.createElement("tr");

        let type = "Distans";
        if (booking.type === "classroom") {
          type = "Klassrum";
        }

        row.innerHTML = `
          <td>${booking.name}</td>
          <td>${booking.email}</td>
          <td>${booking.phone}</td>
          <td>${type}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error(error);
    }
  });
}

// Hantera formuläret för att lägga till kurs
function setupAddCourseForm() {
  document.getElementById("add-course-btn").addEventListener("click", async function () {
    const title = document.getElementById("course-title").value.trim();
    const courseNumber = document.getElementById("course-number").value.trim();
    const days = document.getElementById("course-days").value.trim();
    const price = document.getElementById("course-price").value.trim();

    const errorMsg = document.getElementById("add-error");
    const successMsg = document.getElementById("add-success");

    if (!title || !courseNumber || !days || !price) {
      errorMsg.classList.add("show");
      successMsg.classList.remove("show");
      return;
    }

    const newCourse = {
      title: title,
      courseNumber: courseNumber,
      days: Number(days),
      price: Number(price),
      classroom: true,
      distance: false,
      image: "https://placehold.co/400x220",
      date: new Date().toISOString().split("T")[0],
      popular: false,
      description: "Beskrivning saknas.",
    };

    try {
      await addCourse(newCourse);
      successMsg.classList.add("show");
      errorMsg.classList.remove("show");

      // Rensa formulärfälten
      document.getElementById("course-title").value = "";
      document.getElementById("course-number").value = "";
      document.getElementById("course-days").value = "";
      document.getElementById("course-price").value = "";

      // Uppdatera dropdown med ny kurs
      await loadCourseSelect();
    } catch (error) {
      errorMsg.textContent = "Kunde inte spara kurs.";
      errorMsg.classList.add("show");
      console.error(error);
    }
  });
}

// Ladda kurser i dropdown-menyn
async function loadCourseSelect() {
  const select = document.getElementById("course-select");
  const courses = await getCourses();

  select.innerHTML = `<option value="">-- Välj kurs --</option>`;

  courses.forEach(function (course) {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = course.title + " (" + course.courseNumber + ")";
    select.appendChild(option);
  });
}

init();
