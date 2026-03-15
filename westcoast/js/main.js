// main.js - Logik för index.html

import { getCourses } from "./api.js";
import { createCourseCard, updateNavbar } from "./utils.js";

async function init() {
  updateNavbar();

  const loading = document.getElementById("loading");
  const allCoursesGrid = document.getElementById("all-courses");
  const popularCoursesGrid = document.getElementById("popular-courses");

  try {
    const courses = await getCourses();

    loading.classList.remove("show");

    // Visa alla kurser
    courses.forEach(function (course) {
      allCoursesGrid.appendChild(createCourseCard(course));
    });

    // Visa bara populära kurser
    const popularCourses = courses.filter(function (course) {
      return course.popular === true;
    });

    popularCourses.forEach(function (course) {
      popularCoursesGrid.appendChild(createCourseCard(course));
    });

  } catch (error) {
    loading.textContent = "Kunde inte hämta kurser. Är JSON-Server igång?";
    console.error(error);
  }
}

init();
