import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'isPublic';
// يعلّم الـ route أو الـ controller كمفتوح بدون توكن
export const Public = () => SetMetadata(IS_PUBLIC, true);
