import type { AuthError as SupabaseAuthError } from '@supabase/supabase-js';

type SupabaseError = {
  message?: string;
  code?: string;
  [key: string]: unknown; // Allow unknown additional fields
};

// Use the actual Supabase AuthError type
type AuthError = SupabaseAuthError;

export function logError(error: unknown, context: string, additionalData?: Record<string, unknown>): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const timestamp = new Date().toISOString();
  
  console.error(`[${timestamp}] ${context}:`, errorMessage);
  
  if (additionalData) {
    console.error('Additional data:', additionalData);
  }
  
  if (error instanceof Error && error.stack) {
    console.error('Stack trace:', error.stack);
  }
}

export function friendlySupabaseErrorMessage(error: SupabaseError | AuthError | null | undefined): string {
  if (!error) return 'An unknown error occurred.';

  if (error.message) {
    return error.message;
  }

  // Handle AuthError specific fields
  if ('status' in error && error.status) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication failed. Please check your credentials.';
      case 403:
        return 'Access denied. You do not have permission for this action.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Request failed with status ${error.status}.`;
    }
  }

  if (error.code) {
    switch (error.code) {
      case 'PGRST116':
        return 'No data found for the given query.';
      case '23505': // Unique constraint violation
        return 'A record with this value already exists.';
      default:
        return `Error code ${error.code}: Something went wrong.`;
    }
  }

  return 'An unexpected error occurred.';
}
