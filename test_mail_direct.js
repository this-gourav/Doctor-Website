// Direct mail test with Doctors Schema
require("dotenv").config();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Appointment = require("./models/doctor");

const dbconnect = require("./config/database");

const testMail = async () => {
    try {
        console.log("\n🔧 Testing Mail Configuration...\n");
        console.log("Mail Host:", process.env.MAIL_HOST);
        console.log("Mail Port:", process.env.MAIL_PORT);
        console.log("Mail User:", process.env.MAIL_USER);
        console.log("Mail From Name:", process.env.MAIL_FROM_NAME);

        // Connect to database
        console.log("\n🗄️  Connecting to database...");
        await dbconnect();
        console.log("✅ Database connected!\n");

        // Fetch appointment from schema
        console.log("📥 Fetching appointment from database...");
        const appointment = await Appointment.findOne().sort({ createdAt: -1 });

        if (!appointment) {
            console.log("⚠️  No appointments found in database. Creating a test appointment...\n");
            
            const testAppointment = await Appointment.create({
                name: "Test Patient",
                number: "+919876543210",
                email: process.env.TEST_EMAIL || "krishna9039krishna@gmail.com",
                preferdDate: new Date("2026-06-20"),
                preferdTime: "2:00 PM",
                message: "This is a test appointment"
            });

            console.log("✅ Test appointment created!\n");
            console.log("Appointment Data:", testAppointment);
        } else {
            console.log("✅ Appointment found!");
            console.log("Appointment Data:", appointment);
        }

        const appointmentToTest = appointment || await Appointment.findOne().sort({ createdAt: -1 });

        // Setup mail transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT || 587,
            secure: process.env.MAIL_SECURE === 'true' ? true : false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        console.log("\n📡 Verifying mail connection...");
        await transporter.verify();
        console.log("✅ Mail server connection verified!\n");

        // Send mail using appointment data from schema
        const mailOptions = {
            from: `"${process.env.MAIL_FROM_NAME || 'Doctor Appointment'}" <${process.env.MAIL_USER}>`,
            to: appointmentToTest.email,
            subject: "Appointment Confirmation - Doctor Booking",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                    <div style="background-color: #2c3e50; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h2 style="margin: 0;">Appointment Confirmed ✓</h2>
                    </div>
                    <div style="background-color: white; padding: 20px; border-radius: 0 0 10px 10px;">
                        <p>Dear <strong>${appointmentToTest.name}</strong>,</p>
                        
                        <p>Thank you for booking your appointment with us! Your booking has been confirmed.</p>
                        
                        <div style="background-color: #ecf0f1; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0; border-radius: 5px;">
                            <h3 style="margin-top: 0; color: #2c3e50;">Appointment Details</h3>
                            <p><strong>Name:</strong> ${appointmentToTest.name}</p>
                            <p><strong>Date:</strong> ${new Date(appointmentToTest.preferdDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p><strong>Time:</strong> ${appointmentToTest.preferdTime}</p>
                            <p><strong>Phone:</strong> ${appointmentToTest.number}</p>
                            ${appointmentToTest.message ? `<p><strong>Additional Notes:</strong> ${appointmentToTest.message}</p>` : ''}
                        </div>
                        
                        <p style="color: #7f8c8d; font-size: 14px;">If you need to reschedule or cancel, please contact us as soon as possible.</p>
                        
                        <p>Best regards,<br><strong>Doctor Appointment System</strong></p>
                    </div>
                </div>
            `,
        };

        console.log("📧 Sending email to:", appointmentToTest.email);
        const info = await transporter.sendMail(mailOptions);
        
        console.log("\n✅ SUCCESS! Email sent successfully!");
        console.log("📨 Message ID:", info.messageId);
        console.log("\n🎉 Mail functionality is working with Doctors Schema!\n");
        
        // Close database connection
        await mongoose.connection.close();
        console.log("🗄️  Database connection closed.\n");
        
    } catch (error) {
        console.error("\n❌ ERROR:", error.message);
        console.error("\n📋 Full Error Details:");
        console.error(error);
        
        // Ensure database connection is closed on error
        try {
            await mongoose.connection.close();
        } catch (e) {
            // Ignore
        }
    }
};

testMail();
