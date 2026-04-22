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
  videoUrl?: string;
  files: LessonFile[];
  links: LessonLink[];
  assignment?: Assignment | null;
  order?: number;
}

export interface Assignment {
  id?: EntityId;
  title: string;
  description: string;
  dueDate?: string;
  fileUrl?: string;
}

export interface SectionType {
  id: "training" | "industry_readiness" | string;
  label: string;
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
  videoUrl?: string;
  order?: number;
  file?: File | null;
  resourceTitle?: string;
  resourceLink?: string;
  assignmentTitle?: string;
  assignmentDescription?: string;
  assignmentDueDate?: string;
}

export interface UpdateLessonPayload {
  title?: string;
  content?: string;
  videoUrl?: string;
  order?: number;
  file?: File | null;
  resourceTitle?: string;
  resourceLink?: string;
  moduleId: EntityId;
  assignmentTitle?: string;
  assignmentDescription?: string;
  assignmentDueDate?: string;
}

export interface UpsertAssignmentPayload {
  moduleId: EntityId;
  lessonId: EntityId;
  title: string;
  description: string;
  dueDate?: string;
  file?: File | null;
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
