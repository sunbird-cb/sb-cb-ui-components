/**
 * Utility functions for sanitizing user input to prevent XSS attacks
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * Converts HTML metacharacters to their escape sequences
 * 
 * @param text - The input text to escape
 * @returns Escaped text safe from HTML injection attacks
 * 
 * @example
 * const input = '<script>alert("XSS")</script>';
 * const safe = escapeHtml(input);
 * // Result: '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 */
export function escapeHtml(text: string): string {
  if (!text) {
    return text
  }

  // Create a temporary DOM element and use textContent to escape HTML
  // This is a secure way to escape without needing a list of entities
  const tempDiv = document.createElement('div')
  tempDiv.textContent = text
  return tempDiv.innerHTML
}

/**
 * Sanitizes text input from HTML/script injection attacks
 * This is the primary function for sanitizing user-submitted comments
 * 
 * @param text - The raw user input to sanitize
 * @returns Sanitized text safe for display or storage
 * 
 * @example
 * const userComment = '<img src=x onerror="alert(\'XSS\')">';
 * const safe = sanitizeTextInput(userComment);
 */
export function sanitizeTextInput(text: string): string {
  return escapeHtml(text)
}

/**
 * Checks if a string contains potentially dangerous HTML/script content
 * Useful for validation before processing
 * 
 * @param text - The text to check
 * @returns true if dangerous content detected, false otherwise
 */
export function hasDangerousContent(text: string): boolean {
  if (!text) {
    return false
  }

  // Check for common XSS patterns
  const dangerousPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=, onerror=, etc.
    /<iframe[^>]*>[\s\S]*?<\/iframe>/gi,
    /javascript:/gi,
    /<object[^>]*>[\s\S]*?<\/object>/gi,
    /<embed[^>]*>/gi
  ]

  return dangerousPatterns.some(pattern => pattern.test(text))
}
