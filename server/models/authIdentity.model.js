import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    deviceId: {     // It's like fields in SQL database, In NoSQL DB this is called key
        type: String,   // It's datatype
        required: true  // Just like REQUIRED in SQL
    },
    lastLogin: {    // Second field
        type: Date, // Type = TIMESTAMP
        default: Date.now   // Like DEFAULT CURRENT_TIMESTAMPS in SQL
    },
    userAgent: {    // Third Field
        type: String    // DATATYPE
    }
}, { _id: false  /* TO PREVENT DEFAULT ID, we don't need id for this schema */ });

const authIdentitySchema = new mongoose.Schema({    // It is same as common user, but we named it as authIdentitySchema, because we'll be authenticatinig him from here.
    email: {
        type: String,   // DATATYPE
        required: [true, 'Email is required'],  // REQUIRED, If not provided, it'll return this error message
        unique: true, // Enforces uniqueness in the database, just like UNIQUE in SQL
        lowercase: true, // Normalizes email inputs, make every letter small
        trim: true, // Not in SQL, removes extra spaces before and after the string. for example " email@email.com " will be "email@email.com".
        index: true // Speeds up login lookup queries
    },
    passwordHash: {
        type: String,
        required: [true, 'Password hash is required']
    },
    role: {
        type: String,
        enum: {
            values: ['SuperAdmin', 'HRAdmin', 'Manager', 'Employee', 'Recruiter', 'Candidate'],
            message: '{VALUE} is not a valid role'
        },
        required: [true, 'User role is required'],
        default: 'Candidate'
    },
    employeeId: {       // It will work as a foreign key
        type: mongoose.Schema.Types.ObjectId,      // DATATYPE will be the ObjectId default type for storing ids in mongodb
        ref: 'Employee', // Points to your Employees collection
        default: null // Nullable if the user is not onboarded as an employee yet
    },
    devices: [deviceSchema], // Array of embedded device subdocuments
    status: {   // It only accepts the values that are present in enum.
        type: String,
        enum: {
            values: ['active', 'suspended', 'deactivated'], // Only accept these
            message: '{VALUE} is not a valid status'        // Return this message if value that is passed is active, suspended or deactivated
        },
        default: 'active'
    },
    otp:{
        type: Object,
        default: null
    }
}, {
    timestamps: true // Automatically manages createdAt and updatedAt fields
});

const authIdentity = mongoose.model('AuthIdentity', authIdentitySchema);

export default authIdentity;  // Exports the authIdentitySchema for use in other files. 