import dotenv from 'dotenv';

dotenv.config({ silent: true });

export default {
    api_version: '1.0.0',
    community: process.env.COMMUNITY || 'API',
    port: process.env.PORT || 5000,
    cache_enabled: process.env.CACHE_ENABLED,
    app_key: process.env.APP_KEY,
    CRYPTO_KEY : process.env.CRYPTO_KEY || 'salesForce_secret_value',
    app_env: process.env.APP_ENV,
    encryption: {
        private_key: process.env.PRIVATE_KEY,
        public_key: process.env.PUBLIC_KEY
    },
    auth: {
        serviceToken: process.env.SERVICE_TOKEN,
        bankstatementAPIKey: process.env.X_API_KEY,
        endpointExclusions: [
            '/api/v1/applications/',
        ],
        tokens: {
            types: {
                allowed: ['user', 'app'],
                default: 'user'
            }
        }
    },
    roles: {
        allowed: ['user', 'admin'],
        default: 'user'
    },
    storage: {
        s3: {
            access_key_id: process.env.STORAGE_S3_ACCESS_KEY_ID,
            secret_access_key: process.env.STORAGE_S3_SECRET_ACCESS_KEY
        }
    },
}
