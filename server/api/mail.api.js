import nodemailer from 'nodemailer';


const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: PASSWORD
    }
});


const sendOTP = async (userOTP, recieverEmail) => {
    try {
        const mailOptions = {
            from: `"EZITECH" ${EMAIL}`,
            to: recieverEmail,
            subject: 'Request for OTP, Log in to our EZITech Portal',
            html: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Notification</title>
            <style>
                /* Fallback rules for fonts and responsiveness */
                @import url('https://googleapis.com');
                
                body {
                    margin: 0;
                    padding: 0;
                    width: 100% !important;
                    background-color: #F5F9FC;
                }
                img {
                    border: 0;
                }
                table {
                    border-spacing: 0;
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                }
                td {
                    padding: 0;
                }
                a {
                    text-decoration: none;
                }
            </style>
        </head>
        
        <body style="margin: 0; padding: 0; background-color: #F5F9FC; font-family: 'Inter', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
            <center style="width: 100%; table-layout: fixed; background-color: #F5F9FC; padding-top: 40px; padding-bottom: 40px;">
                
                <!-- Main Email Container Table (Max-width 600px for desktop compatibility) -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #DCE7EF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px #00000008;">
                    
                    <!-- HEADER SECTION -->
                    <tr>
                        <td align="center" style="background-color: #1899D6; padding: 32px 24px;">
                            <h1 style="margin: 0; font-family: 'Poppins', sans-serif; font-size: 28px; color: #FFFFFF; font-weight: 600; letter-spacing: 1px;">EZITech</h1>
                        </td>
                    </tr>
                    
                    <!-- BODY CONTENT SECTION -->
                    <tr>
                        <td style="padding: 40px 32px; background-color: #FFFFFF;">
                            
                            <!-- Intro Paragraph -->
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #1F2937;">
                                Assalam-o-Alaikum, <br><br>
                                Here's your One-Time Pin you requested for:
                            </p>
                            
                            <!-- OTP DISPLAY CONTAINER -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                                <tr>
                                    <td align="center">
                                        <div style="background-color: #F5F9FC; border: 1px dashed #1899D6; color: #1899D6; font-size: 36px; font-weight: bold; letter-spacing: 6px; padding: 18px 40px; border-radius: 6px; display: inline-block; font-family: monospace, sans-serif;">
                                            ${userOTP}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 1.5; color: #64748B;">
                                This OTP is valid for the next <b>10 minutes</b>. For security reasons, please do not share this code with anyone.
                            </p>
                            
                            <!-- WARNING BOX SECTION -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f59f0b1f; border-left: 4px solid #F59E0B; border-radius: 4px;">
                                <tr>
                                    <td style="padding: 16px 20px;">
                                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #78350F;">
                                            If you haven't requested for the OTP, your account security might be at risk. You are strongly requested to change your account's password immediately.
                                        </p>
                                        <p style="margin: 12px 0 0 0; font-size: 14px;">
                                            <a href="http://localhost:5173/change-password" style="color: #1899D6; font-weight: 600; text-decoration: underline;">Click here to change password →</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- FOOTER SECTION -->
                    <tr>
                        <td align="center" style="background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #DCE7EF;">
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748B; font-weight: 600;">EZITech HRMS Platform</p>
                            <p style="margin: 0; font-size: 12px; color: #94A3B8;">This is an automated operational email. Please do not reply directly to this message.</p>
                        </td>
                    </tr>
                    
                </table>
                
            </center>
        </body>
        
        </html>
        `
        }
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully! ID: ', info.messageId);
    } catch (err) {
        console.log(err);
    }
}

const sendNewEmployeeRecord = async (data, recieverEmail) => {
    try {
        const mailOptions = {
            from: `"EZITech" ${EMAIL}`,
            to: recieverEmail,
            subject: "Your Employee Data",
            html: `<!DOCTYPE html>
        <html lang="en">
 
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to EZITech</title>
            <style>
                @import url('https://googleapis.com');
 
                body {
                    margin: 0;
                    padding: 0;
                    width: 100% !important;
                    background-color: #F5F9FC;
                }
                img {
                    border: 0;
                }
                table {
                    border-spacing: 0;
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                }
                td {
                    padding: 0;
                }
                a {
                    text-decoration: none;
                }
            </style>
        </head>
 
        <body style="margin: 0; padding: 0; background-color: #F5F9FC; font-family: 'Inter', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
            <center style="width: 100%; table-layout: fixed; background-color: #F5F9FC; padding-top: 40px; padding-bottom: 40px;">
 
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #DCE7EF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px #00000008;">
 
                    <!-- HEADER SECTION -->
                    <tr>
                        <td align="center" style="background-color: #1899D6; padding: 32px 24px;">
                            <h1 style="margin: 0; font-family: 'Poppins', sans-serif; font-size: 28px; color: #FFFFFF; font-weight: 600; letter-spacing: 1px;">EZITech</h1>
                        </td>
                    </tr>
 
                    <!-- BODY CONTENT SECTION -->
                    <tr>
                        <td style="padding: 40px 32px; background-color: #FFFFFF;">
 
                            <p style="margin: 0 0 8px 0; font-size: 18px; line-height: 1.6; color: #1F2937; font-weight: 600;">
                                Welcome aboard, ${data.firstName}! 🎉
                            </p>
 
                            <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4B5563;">
                                Assalam-o-Alaikum, <br><br>
                                Your employee record has been successfully created in the EZITech HRMS system. Here are your details on file:
                            </p>
 
                            <!-- EMPLOYEE ID DISPLAY -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <div style="background-color: #F5F9FC; border: 1px dashed #1899D6; color: #1899D6; font-size: 22px; font-weight: bold; letter-spacing: 2px; padding: 14px 32px; border-radius: 6px; display: inline-block; font-family: monospace, sans-serif;">
                                            ${data.userId}
                                        </div>
                                    </td>
                                </tr>
                            </table>
 
                            <!-- EMPLOYEE DETAILS TABLE -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #E5EAF0; border-radius: 6px; overflow: hidden; margin-bottom: 24px;">
                                <tr style="background-color: #F8FAFC;">
                                    <td style="padding: 12px 16px; font-size: 13px; color: #64748B; font-weight: 600; width: 40%;">Full Name</td>
                                    <td style="padding: 12px 16px; font-size: 14px; color: #1F2937; border-bottom: 1px solid #E5EAF0;">${data.firstName + data.lastName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #64748B; font-weight: 600; background-color: #F8FAFC;">Department</td>
                                    <td style="padding: 12px 16px; font-size: 14px; color: #1F2937; border-bottom: 1px solid #E5EAF0;">${data.departmentId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #64748B; font-weight: 600; background-color: #F8FAFC;">Designation</td>
                                    <td style="padding: 12px 16px; font-size: 14px; color: #1F2937; border-bottom: 1px solid #E5EAF0;">${data.designationId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #64748B; font-weight: 600; background-color: #F8FAFC;">Reporting Manager</td>
                                    <td style="padding: 12px 16px; font-size: 14px; color: #1F2937; border-bottom: 1px solid #E5EAF0;">${data.managerId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #64748B; font-weight: 600; background-color: #F8FAFC;">Employment Type</td>
                                    <td style="padding: 12px 16px; font-size: 14px; color: #1F2937; border-bottom: 1px solid #E5EAF0;">${data.employmentType || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; color: #64748B; font-weight: 600; background-color: #F8FAFC;">Joining Date</td>
                                    <td style="padding: 12px 16px; font-size: 14px; color: #1F2937;">${data.joinDate}</td>
                                </tr>
                            </table>
 
                            <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 1.5; color: #64748B;">
                                Please log in to the HRMS portal using your registered email to set up your password and complete your profile.
                            </p>
 
                            <!-- CTA BUTTON -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <a href="http://localhost:5173/login" style="background-color: #1899D6; color: #FFFFFF; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 6px; display: inline-block;">Log In to HRMS →</a>
                                    </td>
                                </tr>
                            </table>
 
                            <!-- INFO BOX SECTION -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f59f0b1f; border-left: 4px solid #F59E0B; border-radius: 4px; margin-top: 32px;">
                                <tr>
                                    <td style="padding: 16px 20px;">
                                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #78350F;">
                                            If any of the details above are incorrect, please reach out to HR immediately to have your record updated.
                                        </p>
                                    </td>
                                </tr>
                            </table>
 
                        </td>
                    </tr>
 
                    <!-- FOOTER SECTION -->
                    <tr>
                        <td align="center" style="background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #DCE7EF;">
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748B; font-weight: 600;">EZITech HRMS Platform</p>
                            <p style="margin: 0; font-size: 12px; color: #94A3B8;">This is an automated operational email. Please do not reply directly to this message.</p>
                        </td>
                    </tr>
 
                </table>
 
            </center>
        </body>
 
        </html>
        `
        }

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email Sent! ID: ${info.messageId}`);
    } catch (err) {
        console.log(err)
    }
}


export { sendOTP, sendNewEmployeeRecord };