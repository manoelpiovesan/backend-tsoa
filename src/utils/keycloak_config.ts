/**
 * Keycloak configuration for the application.
 */
export const keycloakConfig = {
    'auth-server-url': process.env.KC_AUTH_URL || 'http://localhost:8080',
    'ssl-required': process.env.KEYCLOAK_SSL_REQUIRED || 'external',
    'confidential-port': parseInt(process.env.KC_CONF_PORT || '8080'),
    // Set to false to allow direct access grants (password flow)
    "bearer-only": false,
    realm: process.env.KC_REALM || 'backend_tsoa',
    resource: process.env.KC_CLIENT_ID || 'backend_node',
    credentials: {
        secret: process.env.KC_CLIENT_SECRET || 'default_client_secret'
    },
    'public-client': false,
    'verify-token-audience': true
};