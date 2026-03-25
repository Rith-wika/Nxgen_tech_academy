# Learning Management System - Module Builder Implementation Guide

## Overview

This implementation provides a complete module and lesson management system for your Learning Management System (LMS). It allows instructors to create courses with multiple modules, each containing multiple lessons with rich content, file uploads, and resource links.

## Architecture

### Components Structure

```
ModuleBuilder (Container)
├── Modules List
│   └── Module Card (Expandable)
│       └── LessonBuilder
│           ├── Lessons List
│           │   └── Lesson Card (Expandable)
│           │       ├── Content Editor
│           │       ├── FileUpload
│           │       └── LinkInput
│           └── Add Lesson Form
└── Add Module Form
```

## Components

### 1. `ModuleBuilder.tsx`

Main component that manages all modules for a course.

**Props:**

- `courseId` (string): ID of the course
- `isOpen` (boolean): Controls modal visibility
- `onClose` (function): Callback when modal closes
- `isReadOnly` (boolean, optional): Read-only mode for students

**Features:**

- Create new modules
- Edit module title and description
- Delete modules with confirmation
- Expandable/collapsible modules
- Integrates LessonBuilder for each module
- Automatic API integration

**Usage:**

```tsx
import { ModuleBuilder } from "@/components/ModuleBuilder";

const [isOpen, setIsOpen] = useState(false);
const [courseId, setCourseId] = useState("course-123");

<ModuleBuilder
  courseId={courseId}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>;
```

### 2. `LessonBuilder.tsx`

Manages lessons within a module.

**Props:**

- `moduleId` (string): ID of the parent module
- `lessons` (Lesson[]): Array of lesson objects
- `onLessonsChange` (function): Callback when lessons change
- `isLoading` (boolean, optional): Loading state
- `isReadOnly` (boolean, optional): Read-only mode

**Features:**

- Create lessons with title, content, and notes
- Edit lesson details inline
- File upload support
- Resource links management
- Expandable lesson cards
- Delete lessons

**Lesson Object Structure:**

```typescript
{
  id?: string;
  title: string;
  content: string;
  notes: string;
  files: LessonFile[];
  links: LessonLink[];
  order?: number;
}
```

### 3. `FileUpload.tsx`

Drag-and-drop file upload component.

**Props:**

- `files` (LessonFile[]): Array of uploaded files
- `onFilesChange` (function): Callback when files change
- `isLoading` (boolean, optional): Loading state

**Features:**

- Drag-and-drop upload area
- Multiple file selection
- File type detection (PDF, Word, PPT, etc.)
- File size display
- Remove file button
- Visual feedback for drag state

**File Object Structure:**

```typescript
{
  id?: string;
  file: File | null;
  filename: string;
  fileType: string;
  uploadedAt?: string;
}
```

### 4. `LinkInput.tsx`

Dynamic link management component.

**Props:**

- `links` (LessonLink[]): Array of resource links
- `onLinksChange` (function): Callback when links change
- `isLoading` (boolean, optional): Loading state

**Features:**

- Add links with title and URL
- URL validation
- Edit and remove links
- Clickable links with target="\_blank"
- Form validation

**Link Object Structure:**

```typescript
{
  id?: string;
  url: string;
  title: string;
}
```

## Services

### `moduleService.ts`

API service for backend communication.

**Methods:**

#### Modules

```typescript
// Get all modules for a course
moduleService.getModulesByCourse(courseId: string): Promise<Module[]>

// Create new module
moduleService.createModule(payload: CreateModulePayload): Promise<Module>

// Update module
moduleService.updateModule(moduleId: string, data: Partial<Module>): Promise<Module>

// Delete module
moduleService.deleteModule(moduleId: string): Promise<void>
```

#### Lessons

```typescript
// Get all lessons for a module
moduleService.getLessonsByModule(moduleId: string): Promise<Lesson[]>

// Create lesson
moduleService.createLesson(payload: CreateLessonPayload): Promise<Lesson>

// Update lesson
moduleService.updateLesson(lessonId: string, data: Partial<Lesson>): Promise<Lesson>

// Delete lesson
moduleService.deleteLesson(lessonId: string): Promise<void>
```

#### Files

```typescript
// Upload lesson file
moduleService.uploadLessonFile(payload: CreateLessonFilePayload): Promise<any>

// Delete lesson file
moduleService.deleteLessonFile(fileId: string): Promise<void>
```

#### Links

```typescript
// Create lesson link
moduleService.createLessonLink(payload: CreateLessonLinkPayload): Promise<any>

// Delete lesson link
moduleService.deleteLessonLink(linkId: string): Promise<void>
```

## Django Backend API Endpoints

The service expects the following endpoints on your Django backend:

```
POST   /api/modules/                    # Create module
GET    /api/modules/?course_id=<id>     # List modules for course
PATCH  /api/modules/<id>/               # Update module
DELETE /api/modules/<id>/               # Delete module

POST   /api/lessons/                    # Create lesson
GET    /api/lessons/?module_id=<id>     # List lessons for module
PATCH  /api/lessons/<id>/               # Update lesson
DELETE /api/lessons/<id>/               # Delete lesson

POST   /api/lesson-files/               # Upload file
DELETE /api/lesson-files/<id>/          # Delete file

POST   /api/lesson-links/               # Create link
DELETE /api/lesson-links/<id>/          # Delete link
```

### Example Django Models

```python
# models.py
from django.db import models

class Module(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

class Lesson(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    content = models.TextField()
    notes = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

class LessonFile(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='lesson_files/')
    filename = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class LessonLink(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='links')
    url = models.URLField()
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
```

### Example Django Serializers

```python
# serializers.py
from rest_framework import serializers
from .models import Module, Lesson, LessonFile, LessonLink

class LessonFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonFile
        fields = ['id', 'file', 'filename', 'created_at']

class LessonLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonLink
        fields = ['id', 'url', 'title', 'created_at']

class LessonSerializer(serializers.ModelSerializer):
    files = LessonFileSerializer(many=True, read_only=True)
    links = LessonLinkSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'module', 'title', 'content', 'notes', 'files', 'links', 'order']

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ['id', 'course', 'title', 'description', 'lessons', 'order']
```

## Integration Guide

### Step 1: Set up Django Backend

Implement the models, serializers, and viewsets in your Django project following the examples above.

### Step 2: Configure API Endpoint

Update your `axiosInstance.ts` to point to your Django API:

```typescript
// src/api/axiosInstance.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if needed
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Step 3: Import and Use ModuleBuilder

Already integrated in `InstructorCourses.tsx`. The "Add Lesson Plan" button opens the module builder.

### Step 4: Test the Flow

1. Navigate to Instructor Courses
2. Click "Add Lesson Plan" button
3. Create a module
4. Expand the module
5. Add lessons with content, files, and links
6. Save and close

## State Management

The components use React `useState` for local state management:

- **ModuleBuilder**: Manages modules list and UI state
- **LessonBuilder**: Manages lessons list and UI state
- **FileUpload**: Manages files list and drag state
- **LinkInput**: Manages links list and form state

For more complex scenarios, consider migrating to `useReducer` or Redux.

## Styling

All components use:

- **Tailwind CSS** for styling
- **Navy blue (#000080)** as primary theme color
- **shadcn/ui** components for consistency
- **lucide-react** for icons

## Read-Only Mode

Pass `isReadOnly={true}` to any component to display data without edit capabilities (useful for student views):

```tsx
<ModuleBuilder
  courseId={courseId}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  isReadOnly={true} // Student can view but not edit
/>
```

## Accessibility

- Keyboard navigation for expandable elements
- ARIA labels on buttons
- Color contrast compliant
- Focus states on interactive elements

## Performance Considerations

- Modules are fetched only when the builder opens
- Lazy loading of lesson details (on expand)
- Debounced save operations
- Optimized file upload handling

## Error Handling

- Toast notifications for all operations (errors and success)
- Try-catch blocks in all API calls
- User-friendly error messages
- Disabled state during loading/saving

## Future Enhancements

1. **Rich Text Editor**: Replace textarea with React Quill integration
2. **Drag & Drop Reordering**: Reorder modules and lessons
3. **Bulk Actions**: Delete multiple items at once
4. **Versioning**: Keep history of lesson changes
5. **Collaboration**: Real-time editing with WebSockets
6. **Analytics**: Track student progress through modules
7. **Export/Import**: Export modules as JSON or PDF

## Troubleshooting

### Files not uploading

- Check Django file upload settings (`MEDIA_URL`, `MEDIA_ROOT`)
- Verify CORS headers are configured
- Ensure request includes `multipart/form-data` header

### Modules not loading

- Verify course ID is correct
- Check network requests in browser DevTools
- Ensure Django API endpoints are accessible

### Styling issues

- Clear browser cache
- Verify Tailwind CSS is properly imported
- Check for conflicting CSS classes

## Support

For issues or questions:

1. Check browser console for errors
2. Review network requests in DevTools
3. Verify Django API responses
4. Check component props are properly passed

## License

This implementation is part of your Learning Management System project.
