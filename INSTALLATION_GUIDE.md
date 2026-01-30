# Ethiopia Job Portal - Installation Guide

## Prerequisites

- Windows 10/11
- XAMPP (Apache + MySQL + PHP)
- Web browser (Chrome, Firefox, Edge)

## Step-by-Step Installation

### 1. Install XAMPP

1. Download XAMPP from: https://www.apachefriends.org/download.html
2. Run the installer
3. Install to default location: `C:\xampp`
4. Select components: Apache, MySQL, PHP, phpMyAdmin

### 2. Move Project Files

1. Copy the entire `html` folder to: `C:\xampp\htdocs\`
2. Rename it to `ethiopiajob` (optional, for cleaner URLs)
3. Final path should be: `C:\xampp\htdocs\ethiopiajob\`

### 3. Start XAMPP Services

1. Open **XAMPP Control Panel** (from Start menu)
2. Click **Start** next to **Apache**
3. Click **Start** next to **MySQL**
4. Both should show green "Running" status

### 4. Create Database

**Option A: Using phpMyAdmin (Easier)**

1. Open browser and go to: `http://localhost/phpmyadmin`
2. Click **New** in left sidebar
3. Database name: `jobs_ethiopia`
4. Collation: `utf8mb4_general_ci`
5. Click **Create**
6. Click on `jobs_ethiopia` database
7. Click **Import** tab
8. Choose file: `C:\xampp\htdocs\ethiopiajob\database\schema.sql`
9. Click **Go** at bottom

**Option B: Using Command Line**

```bash
# Open Command Prompt
cd C:\xampp\mysql\bin

# Login to MySQL
mysql -u root -p
# (Press Enter when asked for password - default is empty)

# Create database
CREATE DATABASE jobs_ethiopia CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# Exit MySQL
exit

# Import schema
mysql -u root jobs_ethiopia < C:\xampp\htdocs\ethiopiajob\database\schema.sql
```

### 5. Configure Database Connection

1. Open: `C:\xampp\htdocs\ethiopiajob\config.php`
2. Verify these settings:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'jobs_ethiopia');
define('DB_USER', 'root');
define('DB_PASS', '');  // Empty for default XAMPP
```

### 6. Create Required Directories

Open Command Prompt in project folder:

```bash
cd C:\xampp\htdocs\ethiopiajob

# Create upload directories
mkdir uploads
mkdir uploads\logos
mkdir uploads\cvs
mkdir uploads\company_docs
mkdir logs
```

Or create them manually in File Explorer.

### 7. Set Permissions (if needed)

Right-click on these folders → Properties → Security → Edit:
- `uploads` folder - Allow "Full Control"
- `logs` folder - Allow "Full Control"

### 8. Access the Website

Open your browser and go to:

**Main Site:**
- `http://localhost/ethiopiajob/index.php`
- Or: `http://localhost/ethiopiajob/`

**Admin Panel:**
- `http://localhost/ethiopiajob/admin.php`

**phpMyAdmin (Database Management):**
- `http://localhost/phpmyadmin`

## Default Admin Account

After importing the database, you may need to create an admin account:

1. Go to: `http://localhost/phpmyadmin`
2. Select `jobs_ethiopia` database
3. Click on `adminb` table
4. Click **Insert** tab
5. Add admin user:
   - `AdminName`: admin
   - `password`: (use password hash - see below)
   - `email`: admin@ethiopiajob.com

**To generate password hash:**
Create a file `hash.php` in your project:

```php
<?php
echo password_hash('your_password', PASSWORD_DEFAULT);
?>
```

Visit: `http://localhost/ethiopiajob/hash.php`
Copy the hash and paste it in the database.

## Troubleshooting

### Apache Won't Start

**Error: Port 80 is already in use**

Solution:
1. Open XAMPP Control Panel
2. Click **Config** next to Apache
3. Select **httpd.conf**
4. Find line: `Listen 80`
5. Change to: `Listen 8080`
6. Save and restart Apache
7. Access site at: `http://localhost:8080/ethiopiajob/`

### MySQL Won't Start

**Error: Port 3306 is already in use**

Solution:
1. Open XAMPP Control Panel
2. Click **Config** next to MySQL
3. Select **my.ini**
4. Find line: `port=3306`
5. Change to: `port=3307`
6. Update `config.php` to use port 3307

### Database Connection Error

**Error: "Database connection failed"**

Check:
1. MySQL is running in XAMPP
2. Database name is correct: `jobs_ethiopia`
3. Username is: `root`
4. Password is empty (default XAMPP)
5. Database exists in phpMyAdmin

### Page Not Found (404)

Check:
1. Files are in correct location: `C:\xampp\htdocs\ethiopiajob\`
2. Apache is running
3. URL is correct: `http://localhost/ethiopiajob/index.php`
4. File names match exactly (case-sensitive on some systems)

### Blank White Page

Check:
1. PHP errors: Open `config.php` and set:
   ```php
   define('ENVIRONMENT', 'development');
   ```
2. Check Apache error log: `C:\xampp\apache\logs\error.log`
3. Check PHP error log: `C:\xampp\php\logs\php_error_log`

### File Upload Errors

Check:
1. `uploads` folder exists
2. Folder has write permissions
3. PHP settings in `php.ini`:
   ```ini
   upload_max_filesize = 5M
   post_max_size = 6M
   ```

## Testing the Installation

### 1. Test Home Page
Visit: `http://localhost/ethiopiajob/index.php`
- Should see job search page
- No errors displayed

### 2. Test Database Connection
Create `test-db.php`:

```php
<?php
require_once 'config.php';
require_once 'includes/database.php';

try {
    $stmt = $pdo->query("SELECT 1");
    echo "✓ Database connection successful!";
} catch (Exception $e) {
    echo "✗ Database error: " . $e->getMessage();
}
?>
```

Visit: `http://localhost/ethiopiajob/test-db.php`

### 3. Test Registration
1. Go to: `http://localhost/ethiopiajob/Signup.php`
2. Try creating a test account
3. Check if data appears in database

### 4. Test Login
1. Go to: `http://localhost/ethiopiajob/login.php`
2. Try logging in with test account
3. Should redirect to profile page

## Production Deployment

When moving to a live server:

1. **Update config.php:**
   ```php
   define('ENVIRONMENT', 'production');
   define('SITE_URL', 'https://yourdomain.com');
   ```

2. **Update database credentials:**
   ```php
   define('DB_HOST', 'your_host');
   define('DB_NAME', 'your_database');
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   ```

3. **Enable HTTPS redirect in .htaccess:**
   Uncomment these lines:
   ```apache
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

4. **Set proper file permissions:**
   - Files: 644
   - Directories: 755
   - uploads/: 777 (or 755 with proper ownership)

5. **Secure sensitive files:**
   - Move `config.php` outside web root if possible
   - Ensure `.htaccess` is protecting sensitive files

## Useful Commands

### Start/Stop Services (Command Line)

```bash
# Start Apache
C:\xampp\apache_start.bat

# Stop Apache
C:\xampp\apache_stop.bat

# Start MySQL
C:\xampp\mysql_start.bat

# Stop MySQL
C:\xampp\mysql_stop.bat
```

### Database Backup

```bash
cd C:\xampp\mysql\bin
mysqldump -u root jobs_ethiopia > backup.sql
```

### Database Restore

```bash
cd C:\xampp\mysql\bin
mysql -u root jobs_ethiopia < backup.sql
```

## Support

For issues:
- Check XAMPP documentation: https://www.apachefriends.org/faq.html
- Review project README.md
- Check Apache error logs
- Enable development mode in config.php to see errors

## Next Steps

After installation:
1. ✓ Test all main pages
2. ✓ Create admin account
3. ✓ Add sample job postings
4. ✓ Test job application process
5. ✓ Configure email settings (for notifications)
6. ✓ Customize site content
7. ✓ Review security settings
8. ✓ Set up regular backups

---

**Installation complete!** Your Ethiopia Job Portal should now be running at:
`http://localhost/ethiopiajob/`
