# Django Backend Implementation Example

This file contains example Django code for the backend API endpoints needed for the Module Builder.

## Django Models

```python
# courses/models.py
from django.db import models
from django.contrib.auth.models import User

class Course(models.Model):
    """Course model"""
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    instructor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Module(models.Model):
    """Module model - each course can have multiple modules"""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Lesson(models.Model):
    """Lesson model - each module can have multiple lessons"""
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    content = models.TextField()
    notes = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.module.title} - {self.title}"


class LessonFile(models.Model):
    """Lesson file model - files associated with lessons"""
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='lesson_files/%Y/%m/%d/')
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lesson.title} - {self.filename}"


class LessonLink(models.Model):
    """Lesson link model - resource links for lessons"""
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='links')
    url = models.URLField()
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lesson.title} - {self.title}"
```

## Serializers

```python
# courses/serializers.py
from rest_framework import serializers
from .models import Course, Module, Lesson, LessonFile, LessonLink


class LessonFileSerializer(serializers.ModelSerializer):
    """Serializer for lesson files"""
    class Meta:
        model = LessonFile
        fields = ['id', 'lesson', 'file', 'filename', 'file_type', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class LessonLinkSerializer(serializers.ModelSerializer):
    """Serializer for lesson links"""
    class Meta:
        model = LessonLink
        fields = ['id', 'lesson', 'url', 'title', 'created_at']
        read_only_fields = ['id', 'created_at']


class LessonSerializer(serializers.ModelSerializer):
    """Serializer for lessons with nested files and links"""
    files = LessonFileSerializer(many=True, read_only=True)
    links = LessonLinkSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'module', 'title', 'content', 'notes', 'files', 'links', 'order', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ModuleSerializer(serializers.ModelSerializer):
    """Serializer for modules with nested lessons"""
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ['id', 'course', 'title', 'description', 'lessons', 'order', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class CourseSerializer(serializers.ModelSerializer):
    """Serializer for courses with nested modules"""
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'instructor', 'modules', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
```

## ViewSets

```python
# courses/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Course, Module, Lesson, LessonFile, LessonLink
from .serializers import (
    CourseSerializer,
    ModuleSerializer,
    LessonSerializer,
    LessonFileSerializer,
    LessonLinkSerializer
)


class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet for courses"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Get courses for current user"""
        if self.request.user.is_staff:
            return Course.objects.all()
        return Course.objects.filter(instructor=self.request.user)

    def perform_create(self, serializer):
        """Set instructor to current user"""
        serializer.save(instructor=self.request.user)


class ModuleViewSet(viewsets.ModelViewSet):
    """ViewSet for modules"""
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter modules by course_id if provided"""
        queryset = Module.objects.all()
        course_id = self.request.query_params.get('course_id')

        if course_id:
            queryset = queryset.filter(course_id=course_id)

        return queryset.order_by('order')


class LessonViewSet(viewsets.ModelViewSet):
    """ViewSet for lessons"""
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter lessons by module_id if provided"""
        queryset = Lesson.objects.all()
        module_id = self.request.query_params.get('module_id')

        if module_id:
            queryset = queryset.filter(module_id=module_id)

        return queryset.order_by('order')


class LessonFileViewSet(viewsets.ModelViewSet):
    """ViewSet for lesson files"""
    queryset = LessonFile.objects.all()
    serializer_class = LessonFileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        """Handle file upload"""
        file = self.request.FILES.get('file')
        if file:
            # Save file type from MIME type
            file_type = file.content_type
            serializer.save(file_type=file_type)
        else:
            serializer.save()


class LessonLinkViewSet(viewsets.ModelViewSet):
    """ViewSet for lesson links"""
    queryset = LessonLink.objects.all()
    serializer_class = LessonLinkSerializer
    permission_classes = [IsAuthenticated]
```

## URL Configuration

```python
# courses/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet,
    ModuleViewSet,
    LessonViewSet,
    LessonFileViewSet,
    LessonLinkViewSet
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'modules', ModuleViewSet, basename='module')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'lesson-files', LessonFileViewSet, basename='lesson-file')
router.register(r'lesson-links', LessonLinkViewSet, basename='lesson-link')

urlpatterns = [
    path('', include(router.urls)),
]
```

## Main URLs

```python
# myproject/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('rest_framework.urls')),
    path('api/', include('courses.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## Settings Configuration

```python
# settings.py
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# CORS Configuration (if frontend is on different domain)
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'courses',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://192.168.0.135:8000",
]

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}

# File Upload Settings
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MAX_UPLOAD_SIZE = 10485760  # 10MB

# Allowed File Types
ALLOWED_FILE_EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip']
```

## Django Admin

```python
# courses/admin.py
from django.contrib import admin
from .models import Course, Module, Lesson, LessonFile, LessonLink

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'instructor', 'created_at']
    search_fields = ['title', 'description']
    list_filter = ['created_at']

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'order', 'created_at']
    search_fields = ['title']
    list_filter = ['course', 'created_at']

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'module', 'order', 'created_at']
    search_fields = ['title', 'content']
    list_filter = ['module', 'created_at']

@admin.register(LessonFile)
class LessonFileAdmin(admin.ModelAdmin):
    list_display = ['filename', 'lesson', 'uploaded_at']
    search_fields = ['filename']
    list_filter = ['uploaded_at']

@admin.register(LessonLink)
class LessonLinkAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'url', 'created_at']
    search_fields = ['title', 'url']
    list_filter = ['created_at']
```

## Installation Steps

1. **Create models**:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Install dependencies**:

   ```bash
   pip install djangorestframework
   pip install django-cors-headers
   pip install djangorestframework-simplejwt
   ```

3. **Update settings.py** with configurations above

4. **Create superuser**:

   ```bash
   python manage.py createsuperuser
   ```

5. **Run development server**:
   ```bash
   python manage.py runserver
   ```

## API Examples

### Create Module

```bash
POST /api/modules/
Content-Type: application/json

{
  "course": 1,
  "title": "Introduction to Python",
  "description": "Learn Python basics",
  "order": 0
}
```

### Create Lesson

```bash
POST /api/lessons/
Content-Type: application/json

{
  "module": 1,
  "title": "Variables and Data Types",
  "content": "Lesson content here",
  "notes": "Important notes",
  "order": 0
}
```

### Upload File

```bash
POST /api/lesson-files/
Content-Type: multipart/form-data

lesson=1
file=<binary file data>
```

### Create Link

```bash
POST /api/lesson-links/
Content-Type: application/json

{
  "lesson": 1,
  "url": "https://docs.python.org",
  "title": "Python Official Docs"
}
```

## Pagination

The API includes pagination. Adjust `PAGE_SIZE` in settings.py to control results per page.

## Permissions

All endpoints require authentication. Update permission classes in `settings.py` to change access control.

## Error Handling

Django REST Framework automatically handles common errors:

- 400: Bad Request (validation errors)
- 401: Unauthorized (no authentication)
- 403: Forbidden (no permission)
- 404: Not Found
- 500: Server Error

## Testing

```python
# courses/tests.py
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Course, Module, Lesson

class ModuleBuilderTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='test', password='test123')
        self.course = Course.objects.create(
            title='Test Course',
            instructor=self.user
        )

    def test_create_module(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/modules/', {
            'course': self.course.id,
            'title': 'Test Module'
        })
        self.assertEqual(response.status_code, 201)
```

This implementation provides a complete backend for the React Module Builder component.
