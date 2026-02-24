import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        if (error.error?.errors) {
          errorMessage = Array.isArray(error.error.errors)
            ? error.error.errors.join(', ')
            : JSON.stringify(error.error.errors);
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
        }
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
