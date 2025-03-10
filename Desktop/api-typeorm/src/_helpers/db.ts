import { DataSource, Repository } from 'typeorm';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { User } from '../users/user.model';

dotenv.config(); 

export interface Database {
    User: Repository<User>;
}

export const db: Database = {} as Database;

async function connectDatabase() {
    try {
        const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

        if (!DB_HOST || !DB_PORT || !DB_USER || !DB_NAME) {
            throw new Error('Missing required database environment variables.');
        }

        const connection = await mysql.createConnection({
            host: DB_HOST,
            port: +DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        await connection.end(); 

        const dataSource = new DataSource({
            type: 'mysql',
            host: DB_HOST,
            port: +DB_PORT,
            username: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            entities: [User],
            synchronize: true,
        });

        await dataSource.initialize();
        db.User = dataSource.getRepository(User);
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1); 
    }
}

connectDatabase();

export default db;
