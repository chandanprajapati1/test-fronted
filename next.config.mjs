/** @type {import('next').NextConfig} */

import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'; // Import the required AWS SDK v3 modules
import fs from 'fs/promises';

const loadSecrets = async () => {
    if(process.env.NEXT_PUBLIC_APP_ENV !== 'production'){
        // Load secrets from local JSON file for development
        try {
            const localSecrets = await fs.readFile('./env_dev.json', 'utf-8');
            return JSON.parse(localSecrets);
        } catch (err) {
            // throw new Error(`Failed to load secrets with env_dev.json: ${err.message}`);
        }
    }
    else{
      // Load secrets from AWS Secrets Manager for production using AWS SDK v3
      let createClient = {
        region: process.env?.AWS_REGION || 'ap-south-1', // Replace with your AWS region
      };
      
      const client = new SecretsManagerClient(createClient);
  
      try {
        const secretName = process.env?.AWS_SECRET_NAME;  // Replace with your secret's name
        const command = new GetSecretValueCommand({ SecretId: secretName });
        const data = await client.send(command); // Send the command using SDK v3
        let secretData = JSON.parse(data.SecretString);
        return { MAP_API_KEY: secretData?.MAP_API_KEY,FLAG_SERVICE: secretData?.FLAG_SERVICE, EMAIL_CHECK: secretData?.EMAIL_CHECK, CLEAR_CACHE: secretData?.CLEAR_CACHE };
      } catch (err) {
        throw new Error(`Failed to load secrets with Secrets-Manager-Client: ${err.message}`);
        // console.log(`Failed to load secrets with Secrets-Manager-Client: ${err.message}`)
      }
    }
};

const nextConfig = async () => {
    let secrets = await loadSecrets();
    return {
        reactStrictMode: true,
        basePath: "",
        assetPrefix: "",
        i18n: {
          locales: ['en'],
          defaultLocale: 'en',
        },
        env: secrets,
        pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mjs'],
    }    
};

export default nextConfig();