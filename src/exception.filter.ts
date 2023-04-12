import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = {
      errorsMessages: [],
    };

    if (status === 400) {
      const responseBody: any = exception.getResponse();
      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach((m) => {
          errorResponse.errorsMessages.push(m);
        });
      } else {
        errorResponse.errorsMessages.push(responseBody.message);
      }

      response.status(status).json(errorResponse);
      return;
    } else {
      const exceptionInfo =
        typeof exception.getResponse() === 'string'
          ? exception.getResponse()
          : (exception.getResponse() as { message: string }).message;
      response.status(status).json({
        statusCode: status,
        message: exceptionInfo,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }
  }
}
