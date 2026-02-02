const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file path
const dbPath = path.join(__dirname, '../database.sqlite');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ SQLite connection failed:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeTables();
  }
});

// Initialize database tables
const initializeTables = () => {
  console.log('🔧 Creating database tables...');

  // Create jobseekers table
  db.run(`
    CREATE TABLE IF NOT EXISTS jobseekers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT NOT NULL,
      profile_photo TEXT,
      status TEXT DEFAULT 'approved',
      suspension_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating jobseekers table:', err);
    else {
      console.log('✅ Jobseekers table ready');
      // Add new columns for profile completion
      addJobseekerProfileColumns();
    }
  });

  // Create employers table
  db.run(`
    CREATE TABLE IF NOT EXISTS employers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_name TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT NOT NULL,
      website TEXT,
      description TEXT,
      location TEXT,
      industry TEXT,
      employees TEXT,
      founded TEXT,
      logo TEXT,
      profile_photo TEXT,
      is_featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'approved',
      suspension_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating employers table:', err);
    else {
      console.log('✅ Employers table ready');
      insertSampleEmployers();
    }
  });

  // Create jobs table
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employer_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      job_type TEXT NOT NULL,
      experience_level TEXT NOT NULL,
      salary TEXT,
      category_name TEXT NOT NULL,
      is_featured INTEGER DEFAULT 0,
      is_urgent INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      moderation_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employer_id) REFERENCES employers (id)
    )
  `, (err) => {
    if (err) console.error('Error creating jobs table:', err);
    else {
      console.log('✅ Jobs table ready');
      setTimeout(insertSampleJobs, 1000); // Wait for employers to be inserted
    }
  });

  // Create admin table
  db.run(`
    CREATE TABLE IF NOT EXISTS adminb (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      profile_photo TEXT,
      status TEXT DEFAULT 'approved',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating admin table:', err);
    else {
      console.log('✅ Admin table ready');
      insertDefaultAdmin();
    }
  });

  // Create pricing plans table
  db.run(`
    CREATE TABLE IF NOT EXISTS pricing_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL, -- 'employer' or 'jobseeker'
      price DECIMAL(10,2) NOT NULL,
      duration_days INTEGER NOT NULL,
      features TEXT NOT NULL, -- JSON string of features
      job_posts_limit INTEGER DEFAULT 0,
      applications_limit INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating pricing plans table:', err);
    else {
      console.log('✅ Pricing plans table ready');
      insertDefaultPricingPlans();
    }
  });

  // Create payments table
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      user_type TEXT NOT NULL, -- 'employer' or 'jobseeker'
      plan_id INTEGER,
      amount DECIMAL(10,2) NOT NULL,
      payment_type TEXT NOT NULL, -- 'job_post', 'subscription', 'application_fee'
      payment_method TEXT, -- 'telebirr', 'cbe_birr', 'bank_transfer', 'cash'
      transaction_id TEXT,
      status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
      reference_id INTEGER, -- job_id for job posts, application_id for applications
      payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating payments table:', err);
    else console.log('✅ Payments table ready');
  });

  // Create subscriptions table
  db.run(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      user_type TEXT NOT NULL,
      plan_id INTEGER NOT NULL,
      payment_id INTEGER,
      status TEXT DEFAULT 'active', -- 'active', 'expired', 'cancelled'
      starts_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      job_posts_used INTEGER DEFAULT 0,
      applications_used INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (plan_id) REFERENCES pricing_plans (id),
      FOREIGN KEY (payment_id) REFERENCES payments (id)
    )
  `, (err) => {
    if (err) console.error('Error creating subscriptions table:', err);
    else console.log('✅ Subscriptions table ready');
  });

  // Create job applications table
  db.run(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      jobseeker_id INTEGER,
      employer_id INTEGER,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      cover_letter TEXT NOT NULL,
      experience TEXT NOT NULL,
      expected_salary TEXT,
      available_start_date DATE,
      additional_info TEXT,
      cv_file_path TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      response_message TEXT,
      payment_id INTEGER,
      application_fee DECIMAL(10,2) DEFAULT 0,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_at DATETIME,
      FOREIGN KEY (job_id) REFERENCES jobs (id),
      FOREIGN KEY (jobseeker_id) REFERENCES jobseekers (id),
      FOREIGN KEY (employer_id) REFERENCES employers (id),
      FOREIGN KEY (payment_id) REFERENCES payments (id)
    )
  `, (err) => {
    if (err) console.error('Error creating job applications table:', err);
    else console.log('✅ Job applications table ready');
  });

  // Create saved jobs table
  db.run(`
    CREATE TABLE IF NOT EXISTS saved_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jobseeker_id INTEGER NOT NULL,
      job_id INTEGER NOT NULL,
      saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (jobseeker_id) REFERENCES jobseekers (id),
      FOREIGN KEY (job_id) REFERENCES jobs (id),
      UNIQUE(jobseeker_id, job_id)
    )
  `, (err) => {
    if (err) console.error('Error creating saved jobs table:', err);
    else console.log('✅ Saved jobs table ready');
  });

  // Create job alerts table
  db.run(`
    CREATE TABLE IF NOT EXISTS job_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jobseeker_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      keywords TEXT,
      location TEXT,
      category TEXT,
      job_type TEXT,
      experience_level TEXT,
      salary_min INTEGER,
      salary_max INTEGER,
      is_active INTEGER DEFAULT 1,
      email_frequency TEXT DEFAULT 'daily',
      last_sent DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (jobseeker_id) REFERENCES jobseekers (id)
    )
  `, (err) => {
    if (err) console.error('Error creating job alerts table:', err);
    else console.log('✅ Job alerts table ready');
  });

  // Create notifications table
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      recipients TEXT NOT NULL,
      scheduled_for DATETIME,
      status TEXT DEFAULT 'sent',
      delivered_count INTEGER DEFAULT 0,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating notifications table:', err);
    else console.log('✅ Notifications table ready');
  });
};

// Insert sample employers
const insertSampleEmployers = () => {
  db.get("SELECT COUNT(*) as count FROM employers", (err, row) => {
    if (err || row.count > 0) return;

    console.log('📊 Inserting sample employers...');

    const sampleEmployers = [
      ['Ethiopian Airlines', 'HR Manager', 'hr@ethiopianairlines.com', '$2b$12$dummy', '+251911234567', 'https://ethiopianairlines.com', 'Africa\'s largest airline', 'Addis Ababa', 'Aviation', '17000+', '1945', 'logo6.png', 1],
      ['Commercial Bank of Ethiopia', 'Recruitment Team', 'jobs@cbe.com.et', '$2b$12$dummy', '+251911234568', 'https://cbe.com.et', 'Ethiopia\'s largest bank', 'Addis Ababa', 'Banking', '40000+', '1963', 'logo7.png', 1],
      ['Ethio Telecom', 'HR Department', 'careers@ethiotelecom.et', '$2b$12$dummy', '+251911234569', 'https://ethiotelecom.et', 'Leading telecom provider', 'Addis Ababa', 'Telecommunications', '25000+', '1894', 'logo8.png', 1],
      ['Tech Solutions Ethiopia', 'Tech HR', 'hr@techsolutions.et', '$2b$12$dummy', '+251911234570', 'https://techsolutions.et', 'Leading tech solutions provider', 'Addis Ababa', 'Technology', '500+', '2010', 'logo9.png', 1],
      ['Ethiopian Marketing Group', 'Marketing HR', 'hr@emg.et', '$2b$12$dummy', '+251911234571', 'https://emg.et', 'Top marketing agency in Ethiopia', 'Addis Ababa', 'Marketing', '200+', '2005', 'logo10.png', 1],
      ['Ethiopian Construction Corp', 'Construction HR', 'hr@ecc.et', '$2b$12$dummy', '+251911234572', 'https://ecc.et', 'Major construction company', 'Addis Ababa', 'Construction', '5000+', '1980', 'logo11.png', 1],
      ['Ethiopian Revenue Authority', 'Revenue HR', 'hr@era.gov.et', '$2b$12$dummy', '+251911234573', 'https://era.gov.et', 'Government revenue authority', 'Addis Ababa', 'Government', '10000+', '2008', 'logo12.png', 1]
    ];

    sampleEmployers.forEach(employer => {
      db.run(`
        INSERT INTO employers 
        (company_name, contact_person, email, password, phone, website, description, location, industry, employees, founded, logo, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, employer, (err) => {
        if (err) console.error('Error inserting employer:', err);
      });
    });
  });
};

// Insert default pricing plans
const insertDefaultPricingPlans = () => {
  db.get("SELECT COUNT(*) as count FROM pricing_plans", (err, row) => {
    if (err || row.count > 0) return;

    console.log('📊 Inserting default pricing plans...');

    const defaultPlans = [
      // Employer Plans
      {
        name: 'Basic Job Post',
        type: 'employer',
        price: 500.00,
        duration_days: 30,
        features: JSON.stringify(['1 Job Post', '30 Days Active', 'Basic Support']),
        job_posts_limit: 1,
        applications_limit: 0
      },
      {
        name: 'Standard Package',
        type: 'employer',
        price: 1500.00,
        duration_days: 30,
        features: JSON.stringify(['5 Job Posts', '30 Days Active', 'Featured Listing', 'Priority Support']),
        job_posts_limit: 5,
        applications_limit: 0
      },
      {
        name: 'Premium Package',
        type: 'employer',
        price: 3000.00,
        duration_days: 60,
        features: JSON.stringify(['Unlimited Job Posts', '60 Days Active', 'Featured Listings', 'Premium Support', 'Analytics Dashboard']),
        job_posts_limit: -1, // -1 means unlimited
        applications_limit: 0
      },
      // Job Seeker Plans
      {
        name: 'Basic Application',
        type: 'jobseeker',
        price: 50.00,
        duration_days: 1,
        features: JSON.stringify(['Apply to 1 Job', 'Basic Profile']),
        job_posts_limit: 0,
        applications_limit: 1
      },
      {
        name: 'Job Seeker Premium',
        type: 'jobseeker',
        price: 200.00,
        duration_days: 30,
        features: JSON.stringify(['Apply to 10 Jobs', 'Premium Profile', 'CV Builder', 'Job Alerts']),
        job_posts_limit: 0,
        applications_limit: 10
      },
      {
        name: 'Job Seeker Pro',
        type: 'jobseeker',
        price: 500.00,
        duration_days: 90,
        features: JSON.stringify(['Unlimited Applications', 'Premium Profile', 'CV Builder', 'Job Alerts', 'Priority Support']),
        job_posts_limit: 0,
        applications_limit: -1 // -1 means unlimited
      }
    ];

    defaultPlans.forEach(plan => {
      db.run(`
        INSERT INTO pricing_plans 
        (name, type, price, duration_days, features, job_posts_limit, applications_limit)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [plan.name, plan.type, plan.price, plan.duration_days, plan.features, plan.job_posts_limit, plan.applications_limit], (err) => {
        if (err) console.error('Error inserting pricing plan:', err);
      });
    });

    console.log('✅ Default pricing plans inserted');
  });
};

// Insert default admin account
const insertDefaultAdmin = () => {
  db.get("SELECT COUNT(*) as count FROM adminb", (err, row) => {
    if (err || row.count > 0) return;

    console.log('👑 Creating default admin account...');

    const bcrypt = require('bcryptjs');
    const defaultPassword = 'admin123456'; // Change this in production!

    bcrypt.hash(defaultPassword, 12, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing admin password:', err);
        return;
      }

      db.run(`
        INSERT INTO adminb (username, email, password, status)
        VALUES (?, ?, ?, ?)
      `, ['admin', 'admin@ethiopiajob.com', hashedPassword, 'approved'], (err) => {
        if (err) {
          console.error('Error creating admin account:', err);
        } else {
          console.log('✅ Default admin created:');
          console.log('   Email: admin@ethiopiajob.com');
          console.log('   Password: admin123456');
          console.log('   ⚠️  Please change this password in production!');
        }
      });
    });
  });
};

// Insert sample jobs
const insertSampleJobs = () => {
  db.get("SELECT COUNT(*) as count FROM jobs", (err, row) => {
    if (err || row.count > 0) return;

    console.log('📊 Inserting sample jobs...');

    const sampleJobs = [
      [1, 'Software Developer', 'We are looking for a skilled software developer to join our growing team. You will work on exciting projects using modern technologies.', 'Addis Ababa', 'Full-time', 'Mid-level', '25,000 - 35,000 ETB', 'Technology', 1, 0],
      [2, 'Marketing Manager', 'Lead our marketing initiatives and drive brand awareness across Ethiopia. Experience in digital marketing required.', 'Addis Ababa', 'Full-time', 'Senior', '30,000 - 45,000 ETB', 'Marketing', 0, 1],
      [3, 'Customer Service Representative', 'Provide excellent customer service to our valued passengers and handle inquiries professionally.', 'Addis Ababa', 'Full-time', 'Entry-level', '15,000 - 20,000 ETB', 'Customer Service', 0, 0],
      [1, 'Project Manager', 'Oversee technology projects from planning to completion. Strong leadership skills required.', 'Addis Ababa', 'Full-time', 'Senior', '35,000 - 50,000 ETB', 'Management', 1, 0],
      [2, 'Accountant', 'Handle financial records and ensure compliance with banking regulations.', 'Addis Ababa', 'Full-time', 'Mid-level', '22,000 - 30,000 ETB', 'Finance', 0, 0],
      [3, 'Sales Representative', 'Drive sales growth and manage key client relationships in the telecom sector.', 'Addis Ababa', 'Full-time', 'Entry-level', '18,000 - 25,000 ETB', 'Sales', 0, 0]
    ];

    sampleJobs.forEach(job => {
      db.run(`
        INSERT INTO jobs 
        (employer_id, title, description, location, job_type, experience_level, salary, category_name, is_featured, is_urgent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, job, (err) => {
        if (err) console.error('Error inserting job:', err);
      });
    });

    console.log('✅ Sample data inserted successfully');
  });
};

// Promisify database operations
const dbAsync = {
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
};

module.exports = dbAsync;

// Add new columns to jobseekers table for profile completion
const addJobseekerProfileColumns = () => {
  const newColumns = [
    'bio TEXT',
    'skills TEXT',
    'experience TEXT',
    'education TEXT',
    'location TEXT',
    'cv_file_path TEXT',
    'cv_file_name TEXT',
    'preferred_job_types TEXT',
    'preferred_categories TEXT',
    'preferred_locations TEXT',
    'salary_expectation TEXT',
    'work_arrangement TEXT',
    'experience_level TEXT',
    'availability TEXT'
  ];

  newColumns.forEach(column => {
    const columnName = column.split(' ')[0];
    db.run(`ALTER TABLE jobseekers ADD COLUMN ${column}`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Error adding column ${columnName}:`, err.message);
      }
    });
  });
};