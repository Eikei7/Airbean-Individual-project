import db from "../database/db.js";
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'some-secret-key';

const logInAdmin = async (adminUsername, adminPassword) => {
    try {
        const adminUser = await db.admin.findOne({ username: adminUsername, password: adminPassword });
        if (!adminUser) {
            throw new Error("Admin user does not exist");
        }
        
        const token = jwt.sign({ id: adminUser._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        return { adminUser, token };
    } catch (error) {
        console.error("Error finding admin user", error);
        throw error;
    }
};

export { logInAdmin };
