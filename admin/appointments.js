async function loadAppointments() {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("You are not authenticated. Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/admin/appointments",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error("Failed to load appointments:", data.message);
            alert("Failed to load appointments: " + (data.message || "Unknown error"));
            return;
        }

        const appointments = data.data;
        const table = document.getElementById("appointmentTable");

        // Clear existing rows
        const rows = table.querySelectorAll("tr:not(:first-child)");
        rows.forEach(row => row.remove());

        appointments.forEach((appointment) => {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${appointment.name}</td>
                <td>${appointment.number}</td>
                <td>${new Date(appointment.preferdDate).toLocaleDateString()}</td>
                <td>${appointment.preferdTime}</td>
            `;
        });
    } catch (error) {
        console.error("Error loading appointments:", error);
        alert("Server error while loading appointments");
    }
}

loadAppointments();