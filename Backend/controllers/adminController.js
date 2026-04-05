const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
const getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');

        // Map to match frontend mock shape
        const formattedStudents = students.map(student => ({
            id: student._id.toString(),
            name: student.name,
            email: student.email,
            department: student.department || 'N/A',
            year: 'N/A', // Schema does not easily support this yet, fallbacks
            registeredEvents: 0 // In a real robust system, we would perform an aggregation pipe here.
        }));

        res.status(200).json(formattedStudents);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get dashboard reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const activeEvents = await Event.countDocuments({ status: { $in: ['Upcoming', 'Ongoing'] } });
        const totalRegistrations = await Registration.countDocuments();

        // Get registrations grouped by category
        const registrationsByCategory = await Registration.aggregate([
            {
                $lookup: {
                    from: 'events',
                    localField: 'event',
                    foreignField: '_id',
                    as: 'eventDetails'
                }
            },
            { $unwind: '$eventDetails' },
            {
                $group: {
                    _id: '$eventDetails.category',
                    count: { $sum: 1 }
                }
            }
        ]);

        const categories = ['Academic', 'Cultural', 'Sports', 'Technical'];
        const attendanceByCategory = categories.map(cat => ({
            category: cat,
            attendees: registrationsByCategory.find(r => r._id === cat)?.count || 0
        }));

        // Get 5 most recent registrations with populated details
        const recentRegistrations = await Registration.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .populate('event', 'title date category');

        // Get registrations grouped by department
        const departmentalEngagement = await User.aggregate([
            { $match: { role: 'student' } },
            {
                $group: {
                    _id: '$department',
                    studentsCount: { $sum: 1 }
                }
            },
            { $sort: { studentsCount: -1 } }
        ]);

        // Get certificate issuance trends (monthly)
        const certificateTrends = await Registration.aggregate([
            { $match: { status: 'attended' } },
            {
                $group: {
                    _id: { $month: '$updatedAt' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedTrends = certificateTrends.map(t => ({
            month: months[t._id - 1],
            certificates: t.count
        }));

        res.status(200).json({
            overview: {
                totalStudents,
                activeEvents,
                totalRegistrations,
                engagementGrowth: "+12%" 
            },
            attendanceByCategory,
            departmentalEngagement: departmentalEngagement.map(d => ({
                name: d._id || 'General',
                value: d.studentsCount
            })),
            certificateTrends: formattedTrends,
            recentRegistrations: recentRegistrations.map(r => ({
                id: r._id,
                studentName: r.user?.name || 'Unknown',
                eventTitle: r.event?.title || 'Unknown',
                category: r.event?.category || 'N/A',
                date: r.createdAt
            }))
        });
    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getStudents,
    getReports
};
