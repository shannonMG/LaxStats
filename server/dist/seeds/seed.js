// seedUsers.js
import dotenv from 'dotenv';
import db from '../config/connection.js';
import User from '../models/User.js';
dotenv.config();
const seedUsers = async () => {
    try {
        await db();
        // Clear existing users
        await User.deleteMany();
        const users = [
            {
                role: 'coach',
                name: 'Coach Kat',
                username: 'coachkat',
                password: 'password123',
            },
            {
                role: 'player',
                name: 'Player Emily',
                username: 'emily',
                password: 'password123',
            },
            {
                role: 'player',
                name: 'Player Lucy',
                username: 'lucy',
                password: 'password123',
            },
        ];
        await User.insertMany(users);
        console.log('✅ Database seeded successfully');
        process.exit();
    }
    catch (err) {
        console.error('❌ Seeding Error:');
        process.exit(1);
    }
};
seedUsers();
