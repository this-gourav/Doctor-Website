async function getDashboardData() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:5000/api/dashboard/stats",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    document.getElementById("totalAppointments").innerText =
        data.totalAppointments;

    document.getElementById("pendingAppointments").innerText =
        data.pendingAppointments;
}

getDashboardData();