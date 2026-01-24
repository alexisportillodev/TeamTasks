import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.errors) {
          errorMessage = error.error.errors.join(', ');
        } else {
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
        }
      }

      console.error('HTTP Error:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
