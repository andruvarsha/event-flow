require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

mongoose.connect(process.env.MONGODB_URI);

const mockStudents = [
    {
        name: 'Aiden Smith',
        email: '24B11CS001@adityauniversity.in',
        password: '12345',
        role: 'student',
        department: 'Computer Science',
        studentId: '24B11CS001',
        certificates: [
            {
                title: 'Professional Data Analyst',
                issuedBy: 'Google Cloud (Coursera)',
                date: new Date('2023-11-15'),
                url: 'https://coursera.org/verify/sample-google-data',
                verificationId: 'GCP-DA-2023-X92'
            },
            {
                title: 'AWS Certified Solutions Architect',
                issuedBy: 'Amazon Web Services',
                date: new Date('2024-01-20'),
                url: 'https://aws.amazon.com/verification/aws-sa-2024',
                verificationId: 'AWS-SA-778899'
            },
            {
                title: 'Advanced React Patterns',
                issuedBy: 'Frontend Masters',
                date: new Date('2024-02-10'),
                url: 'https://frontendmasters.com/verify/react-adv',
                verificationId: 'FM-7712'
            },
            {
                title: 'Mobile Development with Flutter',
                issuedBy: 'Google Developers',
                date: new Date('2024-03-05'),
                url: 'https://verify.google.com/flutter-pro',
                verificationId: 'G-FLUT-882'
            },
            {
                title: 'Blockchain Essentials',
                issuedBy: 'IBM SkillsBuild',
                date: new Date('2023-10-12'),
                url: 'https://ibm.com/verify/blockchain-101',
                verificationId: 'IBM-BC-9923'
            }
        ]
    },
    { 
        name: 'Elara Vane', 
        email: '24B11EE002@adityauniversity.in', 
        password: '12345', 
        role: 'student', 
        department: 'Electrical Engineering', 
        studentId: '24B11EE002',
        certificates: [
            {
                title: 'IoT Fundamentals',
                issuedBy: 'CISCO Networking Academy',
                date: new Date('2023-12-05'),
                url: 'https://netacad.com/verify/iot-101',
                verificationId: 'CISCO-IOT-992'
            },
            {
                title: 'Renewable Energy Systems',
                issuedBy: 'Coursera (University of Geneva)',
                date: new Date('2024-01-15'),
                url: 'https://coursera.org/verify/energy-99',
                verificationId: 'GEN-EN-772'
            }
        ]
    },
    { 
        name: 'Jasper Stone', 
        email: '24B11ME003@adityauniversity.in', 
        password: '12345', 
        role: 'student', 
        department: 'Mechanical Engineering', 
        studentId: '24B11ME003',
        certificates: [] 
    },
    { name: 'Sienna Ray', email: '24B11CE004@adityauniversity.in', password: '12345', role: 'student', department: 'Civil Engineering', studentId: '24B11CE004' },
    { name: 'Kaelen Thorne', email: '24B11IT005@adityauniversity.in', password: '12345', role: 'student', department: 'Information Technology', studentId: '24B11IT005' }
];

const mockEvents = [
    {
        title: 'Tech Symposium 2024',
        date: '2024-03-15',
        time: '09:00 AM',
        location: 'Main Auditorium',
        category: 'Academic',
        capacity: 500,
        registered: 120,
        status: 'Completed',
        description: 'Annual technology symposium featuring industry leaders.',
        imageUrl: '/events/1.jpg'
    },
    {
        title: 'Cultural Fest',
        date: '2024-04-01',
        time: '04:00 PM',
        location: 'Campus Ground',
        category: 'Cultural',
        capacity: 1000,
        registered: 450,
        status: 'Upcoming',
        description: 'The biggest cultural festival of the year.',
        imageUrl: '/events/2.jpg'
    },
    {
        title: 'Annual Sports Meet',
        date: '2024-02-20',
        time: '08:00 AM',
        location: 'University Stadium',
        category: 'Sports',
        capacity: 2000,
        registered: 800,
        status: 'Upcoming',
        description: 'Join us for the annual inter-departmental sports competition spanning multiple disciplines.',
        imageUrl: '/events/3.jpg'
    },
    {
        title: 'AI & Machine Learning Workshop',
        date: '2024-03-25',
        time: '10:00 AM',
        location: 'Computer Lab 3',
        category: 'Technical',
        capacity: 60,
        registered: 58,
        status: 'Upcoming',
        description: 'A hands-on workshop covering the basics of neural networks and deep learning using Python.',
        imageUrl: '/events/4.jpg'
    },
    {
        title: 'Photography Exhibition',
        date: '2024-04-10',
        time: '11:00 AM',
        location: 'Arts Block Atrium',
        category: 'Cultural',
        capacity: 300,
        registered: 150,
        status: 'Upcoming',
        description: 'Showcasing the incredible talent of the university photography club over the past year.',
        imageUrl: '/events/5.jpg'
    },
    {
        title: 'Startup Pitch Competition',
        date: '2024-05-05',
        time: '02:00 PM',
        location: 'Innovation Hub',
        category: 'Academic',
        capacity: 200,
        registered: 80,
        status: 'Upcoming',
        description: 'Students pitch their startup ideas to a panel of venture capitalists and industry experts.',
        imageUrl: '/events/6.jpg'
    },
    {
        title: 'Inter-College Hackathon 2024',
        date: '2024-04-15',
        time: '09:00 AM',
        location: 'Main Lab Complex',
        category: 'Technical',
        capacity: 150,
        registered: 90,
        status: 'Upcoming',
        description: 'A 24-hour coding marathon to solve real-world problems. Great prizes to be won!',
        imageUrl: '/events/7.jpg'
    },
    {
        title: 'Dance Battle Royale',
        date: '2024-03-10',
        time: '06:00 PM',
        location: 'Open Air Theatre',
        category: 'Cultural',
        capacity: 800,
        registered: 350,
        status: 'Upcoming',
        description: 'Watch the best dance crews from across the university battle it out for the top spot.',
        imageUrl: '/events/8.jpg'
    },
    {
        title: 'Robotics Workshop: Build a Drone',
        date: '2024-05-12',
        time: '10:00 AM',
        location: 'Mechanical Engineering Block',
        category: 'Technical',
        capacity: 50,
        registered: 45,
        status: 'Upcoming',
        description: 'Hands-on session on assembling, programming, and flying your own quadcopter drone.',
        imageUrl: '/events/9.jpg'
    },
    {
        title: 'Guest Lecture: Future of Web3',
        date: '2024-03-22',
        time: '11:30 AM',
        location: 'Seminar Hall 1',
        category: 'Academic',
        capacity: 400,
        registered: 250,
        status: 'Upcoming',
        description: 'An insightful talk by industry veterans on blockchain, smart contracts, and Web3 evolution.',
        imageUrl: '/events/10.jpg'
    },
    {
        title: 'University Premier League (Cricket)',
        date: '2024-04-20',
        time: '08:00 AM',
        location: 'Cricket Ground',
        category: 'Sports',
        capacity: 3000,
        registered: 1200,
        status: 'Upcoming',
        description: 'The highly anticipated intra-university T20 cricket tournament kicks off!',
        imageUrl: '/events/11.jpg'
    },
    {
        title: 'Music Club Jam Session',
        date: '2024-03-05',
        time: '05:00 PM',
        location: 'Student Activity Center',
        category: 'Cultural',
        capacity: 150,
        registered: 70,
        status: 'Upcoming',
        description: 'An open mic and jam session for all music enthusiasts. Bring your own instruments!',
        imageUrl: '/events/12.jpg'
    },
    {
        title: 'Cybersecurity Bootcamp',
        date: '2024-04-05',
        time: '10:00 AM',
        location: 'Cyber Lab',
        category: 'Technical',
        capacity: 80,
        registered: 80,
        status: 'Completed',
        description: 'Intensive training on ethical hacking, network security, and cryptography. Registration full.',
        imageUrl: '/events/13.jpg'
    },
    {
        title: 'Literature Festival',
        date: '2024-03-29',
        time: '10:30 AM',
        location: 'Central Library',
        category: 'Academic',
        capacity: 250,
        registered: 100,
        status: 'Upcoming',
        description: 'Panel discussions, book signings, and poetry slams featuring renowned authors.',
        imageUrl: '/events/1.jpg'
    },
    {
        title: 'Marathon for a Cause',
        date: '2024-05-19',
        time: '06:00 AM',
        location: 'University Gates',
        category: 'Sports',
        capacity: 5000,
        registered: 3200,
        status: 'Upcoming',
        description: 'A 10km run around the campus and city to raise awareness for mental health.',
        imageUrl: '/events/2.jpg'
    },
    {
        title: 'Drama Society Play: The Crucible',
        date: '2024-04-08',
        time: '07:00 PM',
        location: 'Auditorium C',
        category: 'Cultural',
        capacity: 450,
        registered: 200,
        status: 'Upcoming',
        description: 'Our award-winning drama society presents their annual flagship theater production.',
        imageUrl: '/events/3.jpg'
    }
];

const importData = async () => {
    try {
        await User.deleteMany();
        await Event.deleteMany();
        await Registration.deleteMany();

        const adminUser = {
            name: 'Aarav (Admin)',
            email: 'aarav@aditya.edu',
            password: '12345',
            role: 'admin',
            department: 'Administration',
            studentId: 'ADMIN1'
        };

        const createdUsers = await User.create([adminUser, ...mockStudents]);
        const createdEvents = await Event.insertMany(mockEvents);

        // Create sample registrations for the first three students
        const student1 = createdUsers.find(u => u.email === '24B11CS001@adityauniversity.in');
        const student2 = createdUsers.find(u => u.email === '24B11EE002@adityauniversity.in');
        const compEvent = createdEvents.find(e => e.status === 'Completed');
        const upEvent = createdEvents.find(e => e.status === 'Upcoming');

        if (student1 && compEvent) {
            await Registration.create({
                user: student1._id,
                event: compEvent._id,
                status: 'attended',
                registrationDate: new Date('2024-03-01')
            });
        }

        const compEvent2 = createdEvents.find(e => e.title === 'Cybersecurity Bootcamp');
        if (student1 && compEvent2) {
            await Registration.create({
                user: student1._id,
                event: compEvent2._id,
                status: 'attended',
                registrationDate: new Date('2024-04-01')
            });
        }

        if (student2 && compEvent) {
            await Registration.create({
                user: student2._id,
                event: compEvent._id,
                status: 'attended',
                registrationDate: new Date('2024-03-05')
            });
        }

        if (student1 && upEvent) {
            await Registration.create({
                user: student1._id,
                event: upEvent._id,
                status: 'registered',
                registrationDate: new Date('2024-03-10')
            });
        }

        console.log('Data Imported successfully! 🟢');
        console.log(`\n==== LOGIN CREDENTIALS ====`);
        console.log(`Admin Email: aarav@aditya.edu | Password: 12345`);
        console.log(`Student Email: 24B11CS001@adityauniversity.in | Password: 12345`);
        console.log(`===========================`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message} 🔴`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Event.deleteMany();
        await Registration.deleteMany();

        console.log('Data Destroyed! 🔴');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message} 🔴`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
