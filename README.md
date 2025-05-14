# Instructly - Server Side (Backend)

-   **Live Server**: https://instructly-server.vercel.app/

## **Project Overview**

Instructly Server is a robust backend built with Node.js, Express, and TypeScript, enabling seamless user management, tutor profiles, bookings, and reviews, with all data securely stored in MongoDB. It features JWT-based authentication, role-based access control, and integrates payment solutions like SSLCommerz or Stripe, ensuring efficient API handling and smooth interaction with the Next.js frontend.

## **Tech Stack**

-   **Backend Framework:** Node.js (Express.js) + TypeScript
-   **Langages:** MongoDB (Mongoose ODM)
-   **Database:** MongoDB (Mongoose ODM)
-   **Authentication:** Custom authentication with MongoDB
-   **File Storage:** Cloudinary

## **Getting Started**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/mahfuzzayn/instructly-server.git
cd instructly-server
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Environment Variables**

Create a `.env` file in the root directory and add the following:

```env
# Environment
NODE_ENV=development

# Port
PORT=5000

# Database URL
DB_URL=your_mongodb_url

# Bcrypt Salt Rounds
BCRYPT_SALT_ROUNDS=12

# JWT Secrets and Expiry
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_ACCESS_EXPIRES_IN=10d
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=1y
JWT_OTP_SECRET=your_jwt_otp_secret
JWT_PASS_RESET_SECRET=your_jwt_pass_reset_secret
JWT_PASS_RESET_EXPIRES_IN=15m

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration
SENDER_EMAIL=your_sender_email
SENDER_APP_PASS=your_sender_app_pass

# SSLCommerz Payment Info
STORE_NAME=your_store_name
PAYMENT_API=your_payment_api
VALIDATION_API="https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
STORE_ID=your_store_id
STORE_PASSWORD=your_store_password
VALIDATION_URL="http://localhost:5000/api/v1/ssl/validate"
SUCCESS_URL="http://localhost:3000/payment-success"
FAILED_URL="http://localhost:3000/payment-failed"
CANCEL_URL="http://localhost:3000/payment-failed"
```

### **4️⃣ Run the Development Server**

```sh
npm run dev
```

Your backend will be running at `http://localhost:5000`.

## **API Endpoints**

-   **Auth Routes:** Login & Register user
-   **Subjects Routes:** CRUD operations for subjects
-   **Bookings Routes:** CRUD operations for booking
-   **Reviews Routes:** CRUD operations for reviews

Developed by [Mahfuz Zayn](https://mahfuzzayn.netlify.app/).
