# SelfTreat - Disease & Treatment Information System

A web application for managing and accessing disease and treatment information with separate admin and user interfaces.

## Features

### For Administrators
- Secure login system
- Add new diseases and treatments
- Edit existing disease information
- Delete diseases from the database
- Manage comprehensive disease database

### For Users
- Browse all available diseases
- Search for diseases by name, symptoms, or treatments
- View detailed information about diseases and treatments
- Responsive design for all devices
- Educational disclaimers for medical information

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: JSON file storage (lightweight, no compilation required)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Authentication**: Simple session-based authentication with bcrypt password hashing
- **Styling**: Custom CSS with responsive design

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### Step 3: Access the Application
- **User Interface**: Open your browser and go to `http://localhost:3000`
- **Admin Interface**: Go to `http://localhost:3000/admin`

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

> **Important**: Change these credentials after first login for security.

## Project Structure

```
SelfTreat/
├── backend/
│   ├── server.js          # Main Express server
│   ├── database.js        # Database operations and schema
│   └── data.json         # JSON database file (created automatically)
├── frontend/
│   ├── index.html         # User interface
│   ├── admin.html         # Admin interface
│   ├── css/
│   │   └── style.css      # Styling for both interfaces
│   └── js/
│       ├── app.js         # User interface functionality
│       └── admin.js       # Admin interface functionality
├── package.json           # Project dependencies and scripts
└── README.md             # This file
```

## API Endpoints

### Public Endpoints (No Authentication Required)
- `GET /` - Serve user interface
- `GET /admin` - Serve admin interface
- `GET /api/diseases` - Get all diseases
- `GET /api/diseases/:id` - Get disease by ID
- `GET /api/search?q=query` - Search diseases

### Admin Endpoints (Authentication Required)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/check` - Check authentication status
- `POST /api/admin/diseases` - Add new disease
- `PUT /api/admin/diseases/:id` - Update disease
- `DELETE /api/admin/diseases/:id` - Delete disease

## Database Schema

### Admins Table
- `id` (INTEGER, PRIMARY KEY)
- `username` (TEXT, UNIQUE)
- `password` (TEXT, hashed)
- `created_at` (DATETIME)

### Diseases Table
- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `description` (TEXT)
- `symptoms` (TEXT)
- `treatment` (TEXT, NOT NULL)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## Usage Guide

### For Administrators

1. **Login**: Go to `/admin` and login with admin credentials
2. **Add Disease**: Click "Add New Disease" and fill in the form
3. **Edit Disease**: Click "Edit" on any disease card to modify
4. **Delete Disease**: Click "Delete" on any disease card (with confirmation)
5. **Logout**: Click "Logout" to end admin session

### For Users

1. **Browse**: View all diseases on the main page
2. **Search**: Use the search bar to find specific diseases
3. **View Details**: Click on any disease card to see full information
4. **Search Suggestions**: Get real-time suggestions while typing

## Features in Detail

### Search Functionality
- Real-time search suggestions
- Search by disease name, description, or symptoms
- Highlighted search terms in results
- No results fallback with guidance

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Accessible design patterns

### Security Features
- Password hashing with bcrypt
- Session-based authentication
- SQL injection prevention
- XSS protection with HTML escaping

## Development

### Adding New Features
1. Backend routes in `backend/server.js`
2. Database operations in `backend/database.js`
3. Frontend functionality in `frontend/js/`
4. Styling in `frontend/css/style.css`

### Database Management
The JSON database is created automatically when the server starts. To reset the database, simply delete the `backend/data.json` file and restart the server.

## Deployment Considerations

### For Production
1. Change default admin credentials
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Set up proper error logging
5. Configure database backups
6. Use a process manager like PM2

### Environment Variables (Optional)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

This application is for educational purposes only. The medical information provided should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure the database file has proper permissions
4. Check that the correct port is being used

## Version History

- **v1.0.0** - Initial release with basic CRUD functionality
  - Admin authentication system
  - Disease management (Create, Read, Update, Delete)
  - User search and browse functionality
  - Responsive design
  - SQLite database integration