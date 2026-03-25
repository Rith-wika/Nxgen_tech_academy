# Quick Start Guide - LMS Module Builder

## 🚀 5-Minute Setup

### 1. Verify Files Are Created ✅

Check that these files exist in your project:

**Components:**

- ✅ `src/components/ModuleBuilder.tsx`
- ✅ `src/components/LessonBuilder.tsx`
- ✅ `src/components/FileUpload.tsx`
- ✅ `src/components/LinkInput.tsx`

**Services & Types:**

- ✅ `src/services/moduleService.ts`
- ✅ `src/types/moduleTypes.ts`

**Updated Files:**

- ✅ `src/pages/Instructor/InstructorCourses.tsx`

**Documentation:**

- ✅ `MODULE_BUILDER_GUIDE.md`
- ✅ `DJANGO_BACKEND_EXAMPLE.md`
- ✅ `LMS_IMPLEMENTATION_SUMMARY.md`

### 2. Frontend is Ready! 📱

No additional frontend installation needed. All components use existing dependencies:

- React 18 ✅
- TypeScript ✅
- Tailwind CSS ✅
- shadcn/ui ✅
- lucide-react ✅
- sonner ✅
- axios ✅

### 3. Backend Setup (Django) 🔧

#### 3.1 Install Django Rest Framework

```bash
pip install djangorestframework
pip install django-cors-headers
```

#### 3.2 Create Django Apps

```bash
python manage.py startapp courses
python manage.py startapp lessons
```

#### 3.3 Copy Models

Copy the models from `DJANGO_BACKEND_EXAMPLE.md` to your Django app:

```python
# courses/models.py
# ... paste code from DJANGO_BACKEND_EXAMPLE.md
```

#### 3.4 Create Serializers

```python
# courses/serializers.py
# ... paste code from DJANGO_BACKEND_EXAMPLE.md
```

#### 3.5 Create ViewSets

```python
# courses/views.py
# ... paste code from DJANGO_BACKEND_EXAMPLE.md
```

#### 3.6 Configure URLs

```python
# courses/urls.py
# ... paste code from DJANGO_BACKEND_EXAMPLE.md

# myproject/urls.py
urlpatterns = [
    path('api/', include('courses.urls')),
]
```

#### 3.7 Update Settings

```python
# settings.py
INSTALLED_APPS = [
    'rest_framework',
    'corsheaders',
    'courses',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
]
```

#### 3.8 Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. API Configuration 🌐

Update your axiosInstance to point to your Django API:

```typescript
// src/api/axiosInstance.ts
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### 5. Environment Variables 🔑

Create a `.env` file in your project root:

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_MEDIA_URL=http://localhost:8000/media
```

### 6. Test the Integration 🧪

#### Frontend Test:

1. Start your React app: `npm run dev`
2. Navigate to: `http://localhost:8000/instructor/courses`
3. Click "Add Lesson Plan" button
4. You should see the Module Builder modal

#### Backend Test:

1. Start Django: `python manage.py runserver`
2. Test API endpoint: `curl http://localhost:8000/api/modules/?course_id=1`
3. Should return JSON response

### 7. Common Issues & Solutions 🔧

#### Issue: ModuleBuilder modal doesn't open

**Solution:** Check browser console for import errors. Ensure all components exist in `src/components/`.

#### Issue: API returns 404

**Solution:** Verify Django URLs are configured correctly. Test with `http://localhost:8000/api/` in browser.

#### Issue: CORS errors

**Solution:** Add your frontend URL to `CORS_ALLOWED_ORIGINS` in Django settings.

#### Issue: Files not uploading

**Solution:**

1. Create `media/` folder in Django project root
2. Verify `MEDIA_ROOT` and `MEDIA_URL` in settings.py
3. Ensure file permissions are correct

#### Issue: Tailwind styles not showing

**Solution:** Clear browser cache and rebuild Tailwind CSS.

## 📋 Feature Checklist

After setup, verify these features work:

- [ ] Click "Add Lesson Plan" opens modal
- [ ] Can create a module
- [ ] Can edit module title
- [ ] Can delete module (with confirmation)
- [ ] Can expand/collapse modules
- [ ] Can add lesson to module
- [ ] Can edit lesson content
- [ ] Can upload files via drag & drop
- [ ] Can add resource links
- [ ] Can add post-lesson notes
- [ ] Files display correctly
- [ ] Links are clickable
- [ ] Notifications appear
- [ ] Loading states show
- [ ] Can delete lessons
- [ ] Can close modal and save

## 🎯 Next Steps

1. **Test with Sample Data**
   - Create a test course
   - Add 2-3 modules
   - Add 5-10 lessons
   - Upload test files

2. **Customize Styling**
   - Adjust colors in components
   - Modify spacing/sizing
   - Add your brand colors

3. **Extend Functionality**
   - Add rich text editor
   - Implement drag & drop reordering
   - Add lesson preview
   - Create student view

4. **Deploy**
   - Build React: `npm run build`
   - Deploy to your hosting
   - Test API endpoints in production

## 📚 Documentation Links

- **Full Guide**: Read `MODULE_BUILDER_GUIDE.md` for complete documentation
- **Django Examples**: Check `DJANGO_BACKEND_EXAMPLE.md` for backend code
- **Summary**: Review `LMS_IMPLEMENTATION_SUMMARY.md` for overview

## 💡 Pro Tips

1. **Test API First**: Before testing UI, verify all API endpoints work using Postman or curl
2. **Use Django Admin**: Access `http://localhost:8000/admin/` to manage data directly
3. **Browser DevTools**: Check Network tab to see API requests
4. **Console Logs**: Check browser console for error messages
5. **Document Changes**: Keep notes of any modifications you make

## 🆘 Need Help?

1. Check the documentation files for your specific issue
2. Review browser console for error messages
3. Look at Network tab in DevTools to see API responses
4. Test API endpoints directly with Postman
5. Verify Django is running: `python manage.py runserver`

## ✨ You're All Set!

Your Learning Management System Module Builder is ready to use. Start by:

1. Creating a course in the admin panel
2. Clicking "Add Lesson Plan" as an instructor
3. Creating modules and lessons
4. Uploading files and resources
5. Viewing as a student (read-only mode)

Happy teaching! 🎓
