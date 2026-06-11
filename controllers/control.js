const Appointment = require("../models/doctor");
const nodemailer = require("nodemailer");

const sendAppointmentEmail = async (appointment) => {
    try {
        if (!appointment.email) {
            console.log("❌ No email provided, skipping email notification");
            return;
        }

        console.log("📧 Sending confirmation email to:", appointment.email);

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT || 587,
            secure: process.env.MAIL_SECURE === 'true' ? true : false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        // Verify connection
        await transporter.verify();
        console.log("✅ Mail server connected");

        const mailOptions = {
            from: `"${process.env.MAIL_FROM_NAME || 'Doctor Appointment'}" <${process.env.MAIL_USER}>`,
            to: appointment.email,
            subject: "Appointment Confirmation - Doctor Booking",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                    <div style="background-color: #2c3e50; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h2 style="margin: 0;">Appointment Confirmed ✓</h2>
                    </div>
                    <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px;">
                        <p>Dear <strong>${appointment.name}</strong>,</p>
                        
                        <p>Thank you for booking your appointment with us! Your booking has been confirmed.</p>
                        
                        <div style="background-color: #ecf0f1; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0; border-radius: 5px;">
                            <h3 style="margin-top: 0; color: #2c3e50;">Appointment Details</h3>
                            <p><strong>Name:</strong> ${appointment.name}</p>
                            <p><strong>Date:</strong> ${new Date(appointment.preferdDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p><strong>Time:</strong> ${appointment.preferdTime}</p>
                            <p><strong>Phone:</strong> ${appointment.number}</p>
                            ${appointment.message ? `<p><strong>Additional Notes:</strong> ${appointment.message}</p>` : ''}
                        </div>
                        
                        <p style="color: #7f8c8d; font-size: 14px;">If you need to reschedule or cancel, please contact us as soon as possible.</p>
                        
                        <p>Best regards,<br><strong>Doctor Appointment System</strong></p>
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully! Message ID:", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
        return false;
    }
};

exports.createAppointment = async(req,res)=>{
    try{
        const { name, number, preferdDate, preferdTime, email, message } = req.body;
        
        if (!name || !number || !preferdDate || !preferdTime) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, number, preferdDate, and preferdTime are required",
            });
        }

        console.log("📝 Creating appointment with data:", { name, number, email, preferdDate, preferdTime });

        const appointment = await Appointment.create({
            name,
            number,
            email: email || "",
            preferdDate,
            preferdTime,
            message: message || ""
        });

        console.log("✅ Appointment created with ID:", appointment._id);

        // Send confirmation email
        await sendAppointmentEmail(appointment);

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
