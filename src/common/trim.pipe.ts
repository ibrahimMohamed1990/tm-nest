import { Injectable, PipeTransform } from '@nestjs/common';

// مثال على Custom Pipe. الاستخدام: @Body('title', TrimPipe) title: string
@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any) {
    return typeof value === 'string' ? value.trim() : value;
  }
}
