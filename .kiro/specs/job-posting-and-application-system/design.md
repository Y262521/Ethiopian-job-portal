# Job Posting and Application System - Design Document

## Architecture Overview

### System Components
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Node.js Backend │    │  Payment Gateway │
│                 │    │                 │    │                 │
│ • Job Posting   │◄──►│ • API Routes    │◄──►│ • TeleBirr      │
│ • Applications  │    │ • Payment Logic │    │ • CBE Birr      │
│ • Dashboards    │    │ • Job Management│    │ • Bank Transfer │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   File Storage  │    │  SQLite Database│
│                 │    │                 │
│ • CV Uploads    │    │ • Jobs          │
│ • Documents     │    │ • Applications  │
│ • Receipts      │    │ • Payments      │
└─────────────────┘    └─────────────────┘
```

## Database Design

### Enhanced Schema
```sql
-- Jobs table (enhanced)
CREATE TABLE jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employer_id INTEGER NOT NULL,
  payment_id INTEGER,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  salary TEXT,
  category_name TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  is_featured INTEGER DEFAULT 0,
  is_urgent INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, active, expired, closed
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employer_id) REFERENCES employers (id),
  FOREIGN KEY (payment_id) REFERENCES payments (id)
);

-- Applications table (enhanced)
CREATE TABLE job_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  jobseeker_id INTEGER NOT NULL,
  employer_id INTEGER NOT NULL,
  payment_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  cover_letter TEXT,
  cv_file_path TEXT,
  application_fee DECIMAL(10,2) NOT NULL,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME,
  response_message TEXT,
  FOREIGN KEY (job_id) REFERENCES jobs (id),
  FOREIGN KEY (jobseeker_id) REFERENCES jobseekers (id),
  FOREIGN KEY (employer_id) REFERENCES employers (id),
  FOREIGN KEY (payment_id) REFERENCES payments (id)
);

-- Payments table (enhanced)
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  user_type TEXT NOT NULL,
  plan_id INTEGER,
  amount DECIMAL(10,2) NOT NULL,
  payment_type TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  reference_id INTEGER,
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  confirmed_at DATETIME,
  expires_at DATETIME,
  receipt_url TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Design

### Job Posting Endpoints
```javascript
// POST /api/jobs - Create new job with payment
{
  "title": "Software Developer",
  "description": "Job description...",
  "location": "Addis Ababa",
  "jobType": "Full-time",
  "experienceLevel": "Mid-level",
  "salary": "25,000 - 35,000 ETB",
  "category": "Technology",
  "requirements": "Requirements...",
  "benefits": "Benefits...",
  "planId": 1,
  "paymentMethod": "telebirr"
}

// GET /api/jobs/employer/:employerId - Get employer's jobs
// PUT /api/jobs/:id - Update job
// DELETE /api/jobs/:id - Close job
// GET /api/jobs/:id/applications - Get job applications
```

### Application Endpoints
```javascript
// POST /api/applications - Submit job application
{
  "jobId": 123,
  "coverLetter": "Cover letter text...",
  "cvFile": "base64_encoded_file",
  "paymentMethod": "telebirr"
}

// GET /api/applications/jobseeker/:jobseekerId - Get user's applications
// PUT /api/applications/:id/status - Update application status
// GET /api/applications/:id - Get application details
```

### Payment Endpoints
```javascript
// POST /api/payments/process - Process payment
{
  "amount": 500.00,
  "paymentType": "job_post",
  "paymentMethod": "telebirr",
  "referenceId": 123
}

// GET /api/payments/:id/status - Check payment status
// POST /api/payments/:id/confirm - Confirm payment (admin)
// POST /api/payments/:id/refund - Process refund (admin)
```

## Frontend Components

### Job Posting Flow
```javascript
// PostJob.js - Enhanced with real payment integration
const PostJob = () => {
  const [formData, setFormData] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // 1. Validate form data
    // 2. Create payment record
    // 3. Process payment
    // 4. Create job on payment success
    // 5. Show confirmation
  };
};
```

### Job Application Flow
```javascript
// JobApplication.js - New component
const JobApplication = ({ jobId }) => {
  const [applicationData, setApplicationData] = useState({});
  const [cvFile, setCvFile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleApply = async () => {
    // 1. Validate application data
    // 2. Upload CV file
    // 3. Process application fee payment
    // 4. Submit application on payment success
    // 5. Show confirmation
  };
};
```

### Dashboard Components
```javascript
// EmployerDashboard.js - Job management
const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  
  // Job management functions
  // Application review functions
  // Payment status tracking
};

// JobSeekerDashboard.js - Application tracking
const JobSeekerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [payments, setPayments] = useState([]);
  
  // Application status tracking
  // Payment history
  // Reapplication functionality
};
```

## Payment Integration

### Payment Service
```javascript
// paymentService.js
class PaymentService {
  async processPayment(paymentData) {
    switch (paymentData.method) {
      case 'telebirr':
        return await this.processTeleBirr(paymentData);
      case 'cbe_birr':
        return await this.processCBEBirr(paymentData);
      case 'bank_transfer':
        return await this.processBankTransfer(paymentData);
      case 'cash':
        return await this.processCashPayment(paymentData);
    }
  }

  async processTeleBirr(data) {
    // TeleBirr API integration
    // Generate payment URL
    // Handle callback
    // Update payment status
  }

  async confirmPayment(paymentId) {
    // Verify payment with gateway
    // Update database status
    // Trigger service activation
    // Send notifications
  }
}
```

### Payment Workflow
```
1. User initiates payment
2. Payment record created (status: pending)
3. Redirect to payment gateway
4. User completes payment
5. Gateway callback received
6. Payment status updated
7. Service activated (job posted/application submitted)
8. Confirmation sent to user
```

## Security Implementation

### Authentication & Authorization
```javascript
// middleware/auth.js
const requireAuth = (req, res, next) => {
  // Verify JWT token
  // Check user permissions
  // Validate user type (employer/jobseeker/admin)
};

const requirePayment = (req, res, next) => {
  // Verify payment status
  // Check service limits
  // Validate subscription status
};
```

### Data Protection
```javascript
// Security measures
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting
- File upload validation
- Payment data encryption
```

## Notification System

### Notification Types
```javascript
// Email notifications
- Payment confirmation
- Job posting approval
- Application received
- Application status update
- Payment reminders

// SMS notifications
- Payment confirmations
- Urgent application updates
- Account security alerts

// In-app notifications
- Real-time status updates
- Dashboard alerts
- System announcements
```

## Testing Strategy

### Correctness Properties

#### Property 1: Payment Processing Integrity
**Validates: Requirements 1.1, 2.1, 3.1**
```javascript
// Property: All successful payments must result in service activation
property("payment_service_activation", (paymentData) => {
  const payment = processPayment(paymentData);
  if (payment.status === 'completed') {
    const service = getServiceByPayment(payment.id);
    return service.status === 'active';
  }
  return true;
});
```

#### Property 2: Job Application Constraints
**Validates: Requirements 2.1, 5.3**
```javascript
// Property: Users cannot apply to the same job twice
property("unique_job_applications", (userId, jobId) => {
  const existingApplication = getApplication(userId, jobId);
  if (existingApplication) {
    const newApplication = submitApplication(userId, jobId);
    return newApplication === null;
  }
  return true;
});
```

#### Property 3: Payment Authorization
**Validates: Requirements 4.3, 5.1**
```javascript
// Property: Only authorized users can access payment functions
property("payment_authorization", (userId, paymentAction) => {
  const user = getUser(userId);
  const hasPermission = checkPaymentPermission(user, paymentAction);
  const result = executePaymentAction(userId, paymentAction);
  
  if (!hasPermission) {
    return result.error === 'UNAUTHORIZED';
  }
  return true;
});
```

#### Property 4: Job Expiration Management
**Validates: Requirements 1.2, 5.2**
```javascript
// Property: Jobs automatically expire based on plan duration
property("job_expiration", (jobId, planDuration) => {
  const job = createJob(jobId, planDuration);
  const currentTime = Date.now();
  const expectedExpiry = job.createdAt + planDuration;
  
  if (currentTime > expectedExpiry) {
    const jobStatus = getJobStatus(jobId);
    return jobStatus === 'expired';
  }
  return true;
});
```

#### Property 5: Admin Payment Oversight
**Validates: Requirements 3.1, 3.2**
```javascript
// Property: Admins can view and manage all payments
property("admin_payment_oversight", (adminId, paymentId) => {
  const admin = getUser(adminId);
  if (admin.role === 'admin') {
    const payment = getPayment(paymentId);
    const canManage = canManagePayment(adminId, paymentId);
    return payment !== null && canManage === true;
  }
  return true;
});
```

#### Property 6: Application Fee Validation
**Validates: Requirements 2.1, 5.1**
```javascript
// Property: Application fees must match current pricing
property("application_fee_validation", (applicationData) => {
  const currentFee = getCurrentApplicationFee();
  const paidAmount = applicationData.paymentAmount;
  const application = submitApplication(applicationData);
  
  if (paidAmount < currentFee) {
    return application.status === 'payment_insufficient';
  }
  return application.status === 'submitted';
});
```

## Implementation Phases

### Phase 1: Core Payment System (Week 1-2)
- Payment processing infrastructure
- Database schema implementation
- Basic payment API endpoints
- Payment status tracking

### Phase 2: Job Posting Integration (Week 3-4)
- Enhanced PostJob component
- Payment-gated job creation
- Employer dashboard updates
- Job management features

### Phase 3: Application System (Week 5-6)
- Job application component
- Application fee processing
- Application tracking dashboard
- Employer application management

### Phase 4: Admin Management (Week 7-8)
- Admin payment oversight
- Payment approval workflow
- Reporting and analytics
- Dispute resolution tools

### Phase 5: Testing & Optimization (Week 9-10)
- Property-based testing implementation
- Performance optimization
- Security audit
- User acceptance testing

## Performance Considerations

### Database Optimization
- Indexed payment and application queries
- Efficient job search with filters
- Pagination for large datasets
- Connection pooling for high concurrency

### Caching Strategy
- Cache pricing plans and fees
- Cache user permissions and roles
- Cache frequently accessed job listings
- Redis for session management

### File Handling
- Secure CV upload with validation
- File size limits and type restrictions
- Cloud storage integration
- Automatic file cleanup

## Monitoring & Analytics

### Key Metrics
- Payment success rates by method
- Job posting completion rates
- Application submission rates
- Revenue tracking and forecasting
- User engagement metrics

### Error Tracking
- Payment gateway failures
- File upload errors
- Database transaction failures
- API response time monitoring
- User experience issues

## Deployment Strategy

### Environment Setup
- Development: Local SQLite with mock payments
- Staging: PostgreSQL with test payment gateways
- Production: Scaled PostgreSQL with live payments

### Security Checklist
- SSL/TLS encryption for all endpoints
- Payment data PCI compliance
- Regular security audits
- Backup and disaster recovery
- Access logging and monitoring

This design provides a comprehensive foundation for implementing the complete job posting and application system with integrated payment processing.