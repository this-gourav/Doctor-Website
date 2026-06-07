const Appointment = require("../models/doctor");

exports.createAppointment = async(req,res)=>{
    try{
        const { name, number, preferdDate, preferdTime } = req.body;
        
        if (!name || !number || !preferdDate || !preferdTime) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, number, preferdDate, and preferdTime are required",
            });
        }

        const appointment = await Appointment.create(req.body);

        res.status(201).json({
            success: true,
            data: appointment,
            message: "Appointment Created Successfully",
        });
    }
    catch(error){
        console.error("Error creating appointment:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create appointment",
        });
    }
};

exports.getAllAppointments = async(req,res)=>{
    try{
        const appointments = await Appointment.find();

        res.status(200).json({
            success: true,
            data: appointments,
            message: "Appointments Fetched Successfully",
        });
    }
    catch(error){
        console.error("Error fetching appointments:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch appointments",
        });
    }
};
