export type EntityId = string | number;

export interface LessonFile {
  id?: EntityId;
  file?: File | null;
  filename: string;
  fileType: string;
  fileUrl?: string;
  uploadedAt?: string;
}

export interface LessonLink {
  id?: EntityId;
  url: string;
  title: string;
}

export interface Lesson {
  id?: EntityId;
  title: string;
  content: string;
  notes: string;
  files: LessonFile[];
  links: LessonLink[];
  order?: number;
}

export interface Module {
  id?: EntityId;
  title: string;
  description?: string;
  moduleType?: "training" | "industryReady";
  lessons: Lesson[];
  order?: number;
}

export interface CreateModulePayload {
  courseId: EntityId;
  title: string;
  description?: string;
  moduleType?: "training" | "industryReady";
  order?: number;
}

export interface UpdateModulePayload {
  title?: string;
  description?: string;
  moduleType?: "training" | "industryReady";
  order?: number;
}

export interface CreateLessonPayload {
  moduleId: EntityId;
  title: string;
  content: string;
  notes: string;
  order?: number;
}

export interface UpdateLessonPayload {
  title?: string;
  content?: string;
  notes?: string;
  order?: number;
}

export interface CreateLessonFilePayload {
  lessonId: EntityId;
  file: File;
}

export interface CreateLessonLinkPayload {
  lessonId: EntityId;
  url: string;
  title: string;
}

export interface ApiListResponse<T> {
  results?: T[];
}
