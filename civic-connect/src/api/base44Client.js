import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68b2f8cf1cb22a245154a7d7", 
  requiresAuth: true // Ensure authentication is required for all operations
});
