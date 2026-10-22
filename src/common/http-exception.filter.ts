import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

// يوحّد شكل كل الأخطاء: { success: false, statusCode, error }
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(ex: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    const status = ex.getStatus();
    res.status(status).json({
      success: false,
      statusCode: status,
      error: ex.getResponse(),
    });
  }
}
