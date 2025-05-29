# Freqtrade UI

این پروژه یک رابط کاربری وب برای Freqtrade است که به شما امکان می‌دهد به راحتی استراتژی‌های معاملاتی خود را مدیریت کنید.

## ویژگی‌ها

- داشبورد مدیریت استراتژی‌ها
- نمایش وضعیت معاملات زنده
- مدیریت تنظیمات Freqtrade
- نمودارهای تحلیلی
- مدیریت سرمایه و ریسک

## پیش‌نیازها

- Python 3.11.8
- Node.js 18.x
- TA-Lib (برای تحلیل تکنیکال)

## نصب و راه‌اندازی محلی

1. نصب وابستگی‌های پایتون:
```bash
pip install -r requirements.txt
```

2. نصب وابستگی‌های فرانت‌اند:
```bash
cd frontend
npm install
```

3. راه‌اندازی بک‌اند:
```bash
cd backend
uvicorn main:app --reload
```

4. راه‌اندازی فرانت‌اند:
```bash
cd frontend
npm run dev
```

## دیپلوی روی Render.com

این پروژه برای دیپلوی روی Render.com آماده شده است. برای دیپلوی:

1. یک اکانت در [Render.com](https://render.com) بسازید
2. پروژه را در GitHub آپلود کنید
3. در Render.com روی "New +" کلیک کنید و "Blueprint" را انتخاب کنید
4. repository خود را انتخاب کنید
5. تنظیمات محیطی مورد نیاز را در بخش Environment Variables تنظیم کنید

## ساختار پروژه

```
.
├── backend/           # کدهای بک‌اند FastAPI
│   └── main.py       # فایل اصلی بک‌اند
├── frontend/         # کدهای فرانت‌اند React
├── requirements.txt  # وابستگی‌های پایتون
├── render.yaml      # تنظیمات دیپلوی Render.com
└── README.md        # مستندات پروژه
```

## متغیرهای محیطی مورد نیاز

برای اجرای صحیح پروژه، متغیرهای محیطی زیر باید تنظیم شوند:

### بک‌اند
- `PYTHON_VERSION`: 3.11.8
- `PORT`: 8000

### فرانت‌اند
- `NODE_VERSION`: 18.x
- `PORT`: 3000
- `REACT_APP_API_URL`: آدرس API بک‌اند

## امنیت

- فایل `.env` و سایر فایل‌های حساس در `.gitignore` قرار گرفته‌اند
- از API keys و اطلاعات حساس در کد استفاده نکنید
- برای محیط production حتماً از HTTPS استفاده کنید 