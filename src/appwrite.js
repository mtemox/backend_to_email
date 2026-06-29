import { Client, Users } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '6a3d88c70024b0b40bab')
    .setKey(process.env.APPWRITE_API_KEY);

export const users = new Users(client);
