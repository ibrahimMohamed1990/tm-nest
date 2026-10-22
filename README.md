# Task Manager API (NestJS + TypeORM + MySQL)

 NestJS: Modules, Controllers, Providers (DI), DTO + ValidationPipe,
Guards, Custom Decorators, Middleware, Interceptors, Exception Filters, Pipes, TypeORM, JWT, Swagger, Testing.

## التشغيل

1. شغّل **MySQL** من XAMPP Control Panel.
2. أنشئ الداتابيز من phpMyAdmin (تبويب SQL):

   ```sql
   CREATE DATABASE task_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. عدّل ملف `.env` لو بياناتك مختلفة (الافتراضي: `root` بدون باسورد).
4. ثبّت واشتغل:

   ```bash
   npm install
   npm run start:dev
   ```

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`

الجداول `users` و `tasks` بتتنشئ تلقائيًا (`synchronize: true`، للتطوير فقط).

## الـ Endpoints

| Method | Path | Auth | الوصف |
|---|---|---|---|
| POST | `/api/auth/register` | لا | تسجيل مستخدم جديد |
| POST | `/api/auth/login` | لا | تسجيل الدخول |
| GET | `/api/tasks?status=todo&page=1&limit=10` | نعم | قائمة المهام مع فلترة وpagination |
| GET | `/api/tasks/:id` | نعم | مهمة واحدة |
| POST | `/api/tasks` | نعم | إنشاء مهمة |
| PATCH | `/api/tasks/:id` | نعم | تعديل مهمة |
| DELETE | `/api/tasks/:id` | نعم | حذف مهمة |

## تجربة سريعة

```bash
curl -X POST localhost:3000/api/auth/register -H "Content-Type: application/json" \
  -d '{"email":"ibrahim@test.com","password":"123456"}'

curl -X POST localhost:3000/api/tasks -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" -d '{"title":"Learn NestJS"}'
```

## الاختبارات

```bash
npm run test       # unit tests (بدون داتابيز)
npm run test:e2e   # يحتاج MySQL شغال. يُفضّل تغيير DB_NAME لداتابيز اختبار
```

## هيكل المشروع

```
src/
  main.ts                    # bootstrap: pipes, interceptors, filters, swagger
  app.module.ts              # Root module + TypeORM + Config + Middleware
  common/                    # Middleware, Interceptor, Filter, Pipe, RolesGuard
  users/                     # Entity + Service (exports) + Module
  auth/                      # DTO, Service, Guard عام (APP_GUARD), Decorators
  tasks/                     # Entity, DTOs, Service, Controller, Module
test/                        # e2e tests
```

## ترتيب مرور الطلب

`Middleware → Guards → Interceptors (قبل) → Pipes → Controller → Service → Interceptors (بعد) → Exception Filters`

## ملاحظات

- في الإنتاج: عطّل `synchronize` واستخدم Migrations، وغيّر `JWT_SECRET`.
- `RolesGuard` موجود كمثال فقط، لأن جدول المستخدمين ما فيهوش عمود `role` حاليًا.
