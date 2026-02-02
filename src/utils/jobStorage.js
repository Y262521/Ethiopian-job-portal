// Utility functions for managing posted jobs in localStorage

export const savePostedJob = (jobData) => {
    try {
        const existingJobs = getPostedJobs();
        const newJob = {
            id: Date.now(), // Simple ID generation
            title: jobData.title,
            description: jobData.description,
            location: jobData.location,
            job_type: jobData.jobType,
            experience_level: jobData.experienceLevel,
            salary: jobData.salary || 'Negotiable',
            category: jobData.categoryName,
            company_name: jobData.companyName || 'Your Company',
            company_logo: null,
            is_featured: jobData.isFeatured || 0,
            is_urgent: jobData.isUrgent || 0,
            created_at: new Date().toISOString(),
            employer_id: jobData.employerId
        };

        const updatedJobs = [newJob, ...existingJobs];
        localStorage.setItem('postedJobs', JSON.stringify(updatedJobs));

        console.log('✅ Job saved to localStorage:', newJob);
        return newJob;
    } catch (error) {
        console.error('Error saving job to localStorage:', error);
        return null;
    }
};

export const getPostedJobs = () => {
    try {
        const jobs = localStorage.getItem('postedJobs');
        return jobs ? JSON.parse(jobs) : [];
    } catch (error) {
        console.error('Error getting posted jobs from localStorage:', error);
        return [];
    }
};

export const getAllJobs = (sampleJobs = []) => {
    const postedJobs = getPostedJobs();
    const allJobs = [...postedJobs, ...sampleJobs];

    // Remove duplicates based on ID
    const uniqueJobs = allJobs.filter((job, index, self) =>
        index === self.findIndex(j => j.id === job.id)
    );

    // Sort by creation date (newest first)
    return uniqueJobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const clearPostedJobs = () => {
    localStorage.removeItem('postedJobs');
};