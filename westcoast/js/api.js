// api.js - All kommunikation med JSON-Server sker här

const BASE_URL = "http://localhost:3001";

// Hämta alla kurser
export async function getCourses() {
  const response = await fetch(BASE_URL + "/courses");
  const data = await response.json();
  return data;
}

// Hämta en kurs med id
export async function getCourseById(id) {
  const response = await fetch(BASE_URL + "/courses/" + id);
  const data = await response.json();
  return data;
}

// Lägg till en ny kurs (admin)
export async function addCourse(course) {
  const response = await fetch(BASE_URL + "/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
  const data = await response.json();
  return data;
}

// Hämta bokningar för en specifik kurs
export async function getBookingsByCourse(courseId) {
  const response = await fetch(BASE_URL + "/bookings?courseId=" + courseId);
  const data = await response.json();
  return data;
}

// Lägg till en ny bokning
export async function addBooking(booking) {
  const response = await fetch(BASE_URL + "/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  const data = await response.json();
  return data;
}
