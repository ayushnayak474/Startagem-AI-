import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('API Error Encountered:', err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.issues.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
    return;
  }

  if (err.name === 'UnauthorizedError' || err.status === 401) {
    res.status(401).json({
      success: false,
      error: err.message || 'Unauthorized access'
    });
    return;
  }

  if (err.status === 404 || err.message === 'Not Found') {
    res.status(404).json({
      success: false,
      error: 'Requested resource not found'
    });
    return;
  }

  if (err.message && (err.message.includes('Gemini') || err.message.includes('API key') || err.message.includes('upstream'))) {
    res.status(502).json({
      success: false,
      error: `Decision Engine AI service error: ${err.message}`
    });
    return;
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error occurred'
  });
}
