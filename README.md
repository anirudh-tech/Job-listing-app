# Job Listing Application

A modern job listing application built with Next.js, MongoDB, and Cloudinary. Features admin approval system for job postings and job seeker registration.

## Features

- **Job Posting**: Users can post job listings with approval workflow
- **Admin Dashboard**: Admins can approve/reject job postings
- **Job Seeking**: Users can register as job seekers
- **Responsive Design**: Modern UI with Tailwind CSS
- **Image Upload**: Cloudinary integration for file uploads

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: Custom admin authentication
- **File Upload**: Cloudinary

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/job-listing-app
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
MAIL_FROM="Job Listing <no-reply@yourdomain.com>"
```

### 3. Database Setup

Make sure MongoDB is running on your system. The application will automatically create the database and collections.

### 4. Setup Admin User

Run the following to create the default admin user:

```bash
curl -X POST http://localhost:3000/api/setup-admin
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Usage

### For Job Posters
1. Click "Post a Job" button
2. Fill in job details (title, description, company, Aadhar card, etc.)
3. Submit for admin approval
4. Job will appear in listings after approval

### For Job Seekers
1. Click "Looking for Job?" button
2. Enter your name and select job title
3. Register to be notified of matching jobs

### For Admins
1. Go to `/admin/login`
2. Login with admin credentials
3. Review and approve/reject pending jobs
4. Approved jobs appear on the main page

## API Endpoints

- `GET /api/jobs` - Get all approved jobs
- `POST /api/jobs` - Create new job posting
- `GET /api/jobs/pending` - Get pending jobs (admin only)
- `PUT /api/jobs/[id]/approve` - Approve job
- `PUT /api/jobs/[id]/reject` - Reject job
- `POST /api/job-seekers` - Register job seeker
- `POST /api/auth/login` - Admin login

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── admin/          # Admin pages
│   └── page.tsx        # Main job listing page
├── components/         # React components
├── lib/               # Utility functions
└── models/            # MongoDB models
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
