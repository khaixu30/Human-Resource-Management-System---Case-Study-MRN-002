# Weekly Report

This report documents the components, views, client routes, server routes, models, middleware and utilities implemented so far in the HRMS Case Study project.

**Frontend (client/**src**)**
- `App.jsx`: Root React component that mounts the `AppRouter`.
- `AppRouter.jsx`: Defines client-side routes using React Router:
  - `/` → `HomeView` (home page placeholder)
  - `/login` → `LoginView` (renders `Login` form)
  - `/register` → `RegisterView` (renders `Register` form)
- `main.jsx`: App entry point. Wraps `App` with `BrowserRouter` and renders to `#root`.
- `api/api.js`: Axios instance configured with `baseURL` (from `VITE_HOST` or default `http://localhost:3000/api`) and a request interceptor that attaches `Authorization: Bearer <token>` when a `token` is present in `localStorage`.

Views and Components
- `views/HomeView.jsx`: Simple placeholder Home view ("Hello, World! This is Home page").
- `views/LoginView.jsx`: Page component that renders the `Login` form component.
- `views/RegisterView.jsx`: Page component that renders the `Register` form component.
- `components/forms/Login.jsx`: Login form component with:
  - Local state for form fields and error messages.
  - Password show/hide toggle.
  - `MessageBox` subcomponent to show success/error messages.
  - Device detection helper to include device info in login payload.
  - Calls `api.post('/login', request)` sending email, password, and `payload`; on success navigates to `/` and stores server message state; on failure displays server error message.
- `components/forms/Register.jsx`: Register form component with:
  - Local state for email, password, confirm password, and messages.
  - Password confirmation check; shows error if mismatch.
  - Device detection helper; posts register data to `api.post('/register', { email, password, payload })` and navigates to `/` on success.
- `components/forms/forms.css`: Shared styling used by `Login` and `Register` components (present in repo under `client/src/components/forms/forms.css`).

**Backend (server/)**
- `index.js`: Express server setup:
  - Uses `helmet`, CORS, rate-limiter, request logger and JSON parsing.
  - Connects to MongoDB via `connect.db.js`.
  - Registers routers under `/api`:
    - `authRouter` (auth.routes.js)
    - `employeeRouter` (employee.routes.js)
    - `departmentRouter` (department.routes.js)
    - `designationRouter` (designation.routes.js)
  - Root GET `/` returns a simple JSON greeting.

Server Routes (what they provide)
- `routes/auth.routes.js` (prefixed by `/api` in `index.js`):
  - `POST /api/auth/register`:
    - Accepts `email`, `password`, and `payload` (device info, timestamp, userAgent).
    - Creates an `AuthIdentity` record with hashed password, device info and generated OTP (expires in 10 minutes).
    - Sends OTP email via `sendOTP` and returns a JWT token (status `unverified`).
  - `POST /api/auth/login`:
    - Accepts `email`, `password`, and `payload`.
    - Updates device/otp info for the user, verifies password, sends OTP via email and returns a token (status `unverified`).
  - `POST /api/auth/verify-otp`:
    - Protected by `verifyAuthIdentityForOTP` middleware which checks the temporary token and OTP expiry.
    - Verifies submitted OTP with stored OTP and, on success, returns a JWT marked `verified`.

- `routes/employee.routes.js`:
  - `POST /api/employee/create` (protected):
    - Requires `authenticate` and `authorize(['HRAdmin','SuperAdmin'])`.
    - Accepts employee details (name, CNIC, phone, address, gender, DOB, departmentId, designationId, managerId, employmentType, skills, certification, documentsUrl).
    - Generates a `userId` using `generateEmployeeId()` helper, creates `Employee` document, updates the corresponding `AuthIdentity` record with `employeeId`, and sends an employee-record email via `sendNewEmployeeRecord`.
  - `GET /api/employee/:id` (protected):
    - Returns an employee record if found and status is `active`.

- `routes/department.routes.js`:
  - `POST /api/department/create` (protected):
    - Requires `authenticate` and `authorize(['SuperAdmin','HRAdmin'])`.
    - Creates a new Department document with `name` and `managerId`.
  - `GET /api/department/:id` (protected):
    - Returns a department by id (authorized for roles `SuperAdmin`, `HRAdmin`, `Manager`, `Employee`).

- `routes/designation.routes.js`:
  - `POST /api/Designation/create` (protected):
    - Creates a Designation record (title, departmentId) and requires `SuperAdmin` or `HRAdmin`.
  - `GET /api/designation/:id` (protected): returns designation details for authorized roles.

Data Models (Mongoose)
- `models/authIdentity.model.js`: `AuthIdentity` model storing `email`, `passwordHash`, `role`, optional `employeeId` reference to `Employee`, array of `devices` subdocuments, `status`, and `otp` object.
- `models/employee.model.js`: `Employee` model with `userId`, names, `cnic`, contact, `departmentId` (ref `Department`), `designationId` (ref `Designation`), `managerId` (ref `Employee`), `employmentType`, skills, certifications, documents, status, `joinDate`, `exitDate`.
- `models/department.model.js`: `Department` model (name, managerId reference to `AuthIdentity`).
- `models/designation.model.js`: `Designation` model (title, departmentId ref).
- `models/candidate.model.js`: `Candidate` model (jobId ref, userId ref to `AuthIdentity`, phone, documents, pipelineStage, interviews).
- `models/job.model.js`: Job model scaffold present but contains a minor typo (`mongooseSchema` vs `new mongoose.Schema`) and likely needs a small fix before use.

Middleware and Utilities
- `middleware/auth.middleware.js`:
  - `verifyAuthIdentityForOTP`: verifies a temporary JWT from registration/login flow, checks OTP expiry and attaches `req.user` with `dbOtp` for OTP comparison.
  - `authenticate`: verifies access JWT, sets `req.user` (id, email, status, role).
  - `authorize`: factory that enforces allowed roles for protected routes.
- `middleware/appError.middleware.js`: `AppError` class used to create standardized operational errors.
- `middleware/validate.middleware.js`: Validation helper wrapper (zod recommended) to parse and validate `req.body`, `params`, and `query`.
- `middleware/upload.middleware.js`: File upload handling using `multer` + `cloudinary`, MIME and file-signature checks, and `uploadBufferToCloudinary` helper.
- `middleware/requestLogger.middleware.js`: Winston-based request logger which logs request metadata and latency.
- `middleware/errorHandler.middleware.js`: Global error handler producing consistent JSON error responses and logging.
- `utils/genUserId.util.js`: `generateEmployeeId()` helper that builds a unique `EMP-<YEAR>-<SUFFIX>` identifier and ensures uniqueness by checking the `Employee` collection.
- `api/mail.api.js`: Nodemailer-based helpers `sendOTP` and `sendNewEmployeeRecord` to send OTP and onboarding emails.

Notes / Observations
- Client-side auth flow uses the `api` Axios instance pointed at `/api` and expects the backend at `http://localhost:3000` by default.
- The auth routes are namespaced under `/api/auth/*` per `auth.routes.js`.
- Some minor issues observed in server code (e.g., `job.model.js` typos) which will need fixes before those models/routes are used.
- The frontend Login/Register components include UX niceties such as message popups, password visibility toggles, and device metadata in the payload sent to server.

Files referenced in this report:
- [client/src/App.jsx](client/src/App.jsx#L1)
- [client/src/AppRouter.jsx](client/src/AppRouter.jsx#L1)
- [client/src/main.jsx](client/src/main.jsx#L1)
- [client/src/api/api.js](client/src/api/api.js#L1)
- [client/src/components/forms/Login.jsx](client/src/components/forms/Login.jsx#L1)
- [client/src/components/forms/Register.jsx](client/src/components/forms/Register.jsx#L1)
- [server/index.js](server/index.js#L1)
- [server/routes/auth.routes.js](server/routes/auth.routes.js#L1)
- [server/routes/employee.routes.js](server/routes/employee.routes.js#L1)
- [server/routes/department.routes.js](server/routes/department.routes.js#L1)
- [server/routes/designation.routes.js](server/routes/designation.routes.js#L1)
- [server/models/authIdentity.model.js](server/models/authIdentity.model.js#L1)
- [server/models/employee.model.js](server/models/employee.model.js#L1)
- [server/models/department.model.js](server/models/department.model.js#L1)
- [server/models/designation.model.js](server/models/designation.model.js#L1)
- [server/models/candidate.model.js](server/models/candidate.model.js#L1)
- [server/models/job.model.js](server/models/job.model.js#L1)
- [server/utils/genUserId.util.js](server/utils/genUserId.util.js#L1)
- [server/api/mail.api.js](server/api/mail.api.js#L1)

---

If you want, I can:
- Fix the minor issues (e.g., `job.model.js`) and run a quick lint/test.
- Expand the report with API example payloads and sample responses.
- Commit this file to git and open a PR.

