import axiosInstance from "@/api/axiosInstance";
import axios from "axios";
import {
  EntityId,
  Module,
  Lesson,
  LessonFile,
  LessonLink,
  ApiListResponse,
  CreateModulePayload,
  UpdateModulePayload,
  CreateLessonPayload,
  UpdateLessonPayload,
  CreateLessonFilePayload,
  CreateLessonLinkPayload,
  Assignment,
  SectionType,
  UpsertAssignmentPayload,
} from "@/types/moduleTypes";

const DUMMY_DB_KEY = "nxgen_dummy_module_db_v1";
const dummyDbEnv = import.meta.env.VITE_USE_DUMMY_DB;
const useDummyDb = dummyDbEnv === "true" ? true : false; // Disabled by default even in DEV so it forces API calls.

type MockModuleRecord = {
  id: number;
  course: EntityId;
  title: string;
  description: string;
  module_type: "training" | "industryReady";
  order: number;
};

type MockLessonRecord = {
  id: number;
  module: EntityId;
  title: string;
  content: string;
  order: number;
};

type MockLessonFileRecord = {
  id: number;
  lesson: EntityId;
  filename: string;
  file_type: string;
  file_url: string;
  uploaded_at: string;
};

type MockLessonLinkRecord = {
  id: number;
  lesson: EntityId;
  title: string;
  url: string;
};

type MockDb = {
  modules: MockModuleRecord[];
  lessons: MockLessonRecord[];
  lessonFiles: MockLessonFileRecord[];
  lessonLinks: MockLessonLinkRecord[];
  nextModuleId: number;
  nextLessonId: number;
  nextFileId: number;
  nextLinkId: number;
};

const createInitialDb = (): MockDb => ({
  modules: [],
  lessons: [],
  lessonFiles: [],
  lessonLinks: [],
  nextModuleId: 1,
  nextLessonId: 1,
  nextFileId: 1,
  nextLinkId: 1,
});

const readDummyDb = (): MockDb => {
  try {
    const raw = localStorage.getItem(DUMMY_DB_KEY);
    if (!raw) {
      return createInitialDb();
    }
    const parsed = JSON.parse(raw) as Partial<MockDb>;
    return {
      ...createInitialDb(),
      ...parsed,
      modules: parsed.modules ?? [],
      lessons: parsed.lessons ?? [],
      lessonFiles: parsed.lessonFiles ?? [],
      lessonLinks: parsed.lessonLinks ?? [],
    };
  } catch {
    return createInitialDb();
  }
};

const writeDummyDb = (db: MockDb): void => {
  localStorage.setItem(DUMMY_DB_KEY, JSON.stringify(db));
};

const shouldUseDummyFallback = (error: unknown): boolean => {
  if (useDummyDb) {
    return true;
  }

  if (!axios.isAxiosError(error)) {
    return false;
  }

  return !error.response || error.code === "ERR_NETWORK";
};

const withDummyFallback = async <T>(
  apiCall: () => Promise<T>,
  dummyCall: () => Promise<T> | T,
  label: string
): Promise<T> => {
  if (useDummyDb) {
    return Promise.resolve(dummyCall());
  }

  try {
    return await apiCall();
  } catch (error) {
    if (shouldUseDummyFallback(error)) {
      console.warn(`[moduleService] Falling back to dummy DB for ${label}.`, error);
      return Promise.resolve(dummyCall());
    }
    throw error;
  }
};

const toArray = <T>(data: T[] | ApiListResponse<T>): T[] => {
  if (Array.isArray(data)) {
    return data;
  }
  return data?.results ?? [];
};

const normalizeLessonFile = (raw: any): LessonFile => ({
  id: raw.id,
  filename: raw.filename || raw.file_name || raw.name || "Untitled file",
  fileType: raw.file_type || raw.mime_type || "application/octet-stream",
  fileUrl: raw.file_url || raw.file || raw.url,
  uploadedAt: raw.uploaded_at || raw.created_at,
});

const normalizeLessonLink = (raw: any): LessonLink => ({
  id: raw.id,
  title: raw.title || raw.label || raw.url || "Resource",
  url: raw.url,
});

const normalizeLesson = (raw: any): Lesson => {
  const files = (raw.files || raw.lesson_files || []).map(normalizeLessonFile);
  if (raw.file && files.length === 0) {
    files.push({
      id: raw.id, // using lesson id as a placeholder
      filename: "Attachment",
      fileType: "application/octet-stream",
      fileUrl: raw.file
    });
  }

  const links = (raw.content_resources || raw.links || raw.lesson_links || []).map((link: any) => ({
    id: link.id,
    title: link.title || "Resource",
    url: link.youtube_url || link.url || "",
  }));
  if (raw.resource_link && links.length === 0) {
    links.push({
      id: raw.id, // using lesson id as placeholder
      title: raw.resource_title || "Resource",
      url: raw.resource_link
    });
  }

  return {
    id: raw.id,
    title: raw.title || "Untitled lesson",
    content: raw.content || "",
    videoUrl: raw.video_url || raw.videoUrl || "",
    order: raw.order || 0,
    files,
    links,
    assignment: raw.assignment_title
      ? {
          id: raw.id,
          title: raw.assignment_title || "",
          description: raw.assignment_description || "",
          dueDate: raw.assignment_due_date || "",
        }
      : null,
  };
};

const normalizeModule = (raw: any): Module => ({
  id: raw.id,
  title: raw.title || "Untitled module",
  description: raw.description || "",
  moduleType: raw.module_type || raw.moduleType || "training",
  order: raw.order || 0,
  lessons: (raw.lessons || []).map(normalizeLesson),
});

const mapSectionTypeToModuleType = (value: string | undefined): "training" | "industryReady" => {
  if (value === "industry_readiness") {
    return "industryReady";
  }
  return "training";
};

const mapModuleTypeToSectionType = (value: "training" | "industryReady" | undefined): string => {
  if (value === "industryReady") {
    return "industry_readiness";
  }
  return "training";
};

const buildRawLesson = (lesson: MockLessonRecord, db: MockDb) => ({
  ...lesson,
  files: db.lessonFiles.filter((file) => String(file.lesson) === String(lesson.id)),
  links: db.lessonLinks.filter((link) => String(link.lesson) === String(lesson.id)),
});

const dummyDbApi = {
  async getModulesByCourse(courseId: EntityId) {
    const db = readDummyDb();
    const lessonsByModule = db.lessons.reduce<Record<string, MockLessonRecord[]>>((acc, lesson) => {
      const key = String(lesson.module);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(lesson);
      return acc;
    }, {});

    return db.modules
      .filter((module) => String(module.course) === String(courseId))
      .sort((a, b) => a.order - b.order)
      .map((module) => ({
        ...module,
        lessons: (lessonsByModule[String(module.id)] || [])
          .sort((a, b) => a.order - b.order)
          .map((lesson) => buildRawLesson(lesson, db)),
      }));
  },

  async createModule(payload: CreateModulePayload) {
    const db = readDummyDb();
    const moduleRecord: MockModuleRecord = {
      id: db.nextModuleId,
      course: payload.courseId,
      title: payload.title,
      description: payload.description || "",
      module_type: payload.moduleType || "training",
      order: payload.order || 0,
    };

    db.modules.push(moduleRecord);
    db.nextModuleId += 1;
    writeDummyDb(db);

    return {
      ...moduleRecord,
      lessons: [],
    };
  },

  async updateModule(courseId: EntityId, moduleId: EntityId, data: UpdateModulePayload) {
    const db = readDummyDb();
    const moduleRecord = db.modules.find((module) => String(module.id) === String(moduleId));

    if (!moduleRecord) {
      throw new Error("Module not found");
    }

    if (data.title !== undefined) moduleRecord.title = data.title;
    if (data.description !== undefined) moduleRecord.description = data.description;
    if (data.moduleType !== undefined) moduleRecord.module_type = data.moduleType;
    if (data.order !== undefined) moduleRecord.order = data.order;

    writeDummyDb(db);
    return {
      ...moduleRecord,
      lessons: [],
    };
  },

  async deleteModule(courseId: EntityId, moduleId: EntityId) {
    const db = readDummyDb();
    db.modules = db.modules.filter((m) => String(m.id) !== String(moduleId));
    writeDummyDb(db);
  },

  async getLessonsByModule(moduleId: EntityId) {
    const db = readDummyDb();
    return db.lessons
      .filter((lesson) => String(lesson.module) === String(moduleId))
      .sort((a, b) => a.order - b.order)
      .map((lesson) => buildRawLesson(lesson, db));
  },

  async createLesson(payload: CreateLessonPayload) {
    const db = readDummyDb();
    const lessonRecord: MockLessonRecord = {
      id: db.nextLessonId,
      module: payload.moduleId,
      title: payload.title,
      content: payload.content,
      order: payload.order || 0,
    };

    db.lessons.push(lessonRecord);
    db.nextLessonId += 1;
    writeDummyDb(db);

    return buildRawLesson(lessonRecord, db);
  },

  async updateLesson(lessonId: EntityId, data: UpdateLessonPayload) {
    const db = readDummyDb();
    const lessonRecord = db.lessons.find((lesson) => String(lesson.id) === String(lessonId));

    if (!lessonRecord) {
      throw new Error("Lesson not found");
    }

    if (data.title !== undefined) lessonRecord.title = data.title;
    if (data.content !== undefined) lessonRecord.content = data.content;
    if (data.order !== undefined) lessonRecord.order = data.order;

    writeDummyDb(db);
    return buildRawLesson(lessonRecord, db);
  },

  async deleteLesson(moduleId: EntityId, lessonId: EntityId) {
    const db = readDummyDb();
    db.lessons = db.lessons.filter((lesson) => String(lesson.id) !== String(lessonId));
    db.lessonFiles = db.lessonFiles.filter((file) => String(file.lesson) !== String(lessonId));
    db.lessonLinks = db.lessonLinks.filter((link) => String(link.lesson) !== String(lessonId));
    writeDummyDb(db);
  },

  async uploadLessonFile(payload: CreateLessonFilePayload) {
    const db = readDummyDb();
    const record: MockLessonFileRecord = {
      id: db.nextFileId,
      lesson: payload.lessonId,
      filename: payload.file.name,
      file_type: payload.file.type || "application/octet-stream",
      file_url: "",
      uploaded_at: new Date().toISOString(),
    };

    db.lessonFiles.push(record);
    db.nextFileId += 1;
    writeDummyDb(db);
    return record;
  },

  async deleteLessonFile(fileId: EntityId) {
    const db = readDummyDb();
    db.lessonFiles = db.lessonFiles.filter((file) => String(file.id) !== String(fileId));
    writeDummyDb(db);
  },

  async createLessonLink(payload: CreateLessonLinkPayload) {
    const db = readDummyDb();
    const record: MockLessonLinkRecord = {
      id: db.nextLinkId,
      lesson: payload.lessonId,
      title: payload.title,
      url: payload.url,
    };

    db.lessonLinks.push(record);
    db.nextLinkId += 1;
    writeDummyDb(db);
    return record;
  },

  async deleteLessonLink(linkId: EntityId) {
    const db = readDummyDb();
    db.lessonLinks = db.lessonLinks.filter((link) => String(link.id) !== String(linkId));
    writeDummyDb(db);
  },
};

export const moduleService = {
  // Modules
  getModulesByCourse: async (courseId: EntityId): Promise<Module[]> => {
    try {
      const data = await withDummyFallback(
        async () => (await axiosInstance.get(`/api/courses/courses/${courseId}/modules/`)).data,
        () => dummyDbApi.getModulesByCourse(courseId),
        "getModulesByCourse"
      );
      return toArray(data).map((item: any) =>
        normalizeModule({
          ...item,
          module_type: mapSectionTypeToModuleType(item.section_type),
        })
      );
    } catch (error) {
      console.error("Error fetching modules:", error);
      throw error;
    }
  },

  createModule: async (payload: CreateModulePayload): Promise<Module> => {
    try {
      const data = await withDummyFallback(
        async () =>
          (
            await axiosInstance.post(`/api/courses/courses/${payload.courseId}/modules/`, {
              title: payload.title,
              section_type: mapModuleTypeToSectionType(payload.moduleType),
              order: payload.order || 0,
            })
          ).data,
        () => dummyDbApi.createModule(payload),
        "createModule"
      );
      return normalizeModule({
        ...data,
        module_type: mapSectionTypeToModuleType(data.section_type),
      });
    } catch (error) {
      console.error("Error creating module:", error);
      throw error;
    }
  },

  updateModule: async (courseId: EntityId, moduleId: EntityId, data: UpdateModulePayload): Promise<Module> => {
    try {
      const responseData = await withDummyFallback(
        async () =>
          (
            await axiosInstance.patch(`/api/courses/courses/${courseId}/modules/${moduleId}/`, {
              title: data.title,
              section_type: data.moduleType ? mapModuleTypeToSectionType(data.moduleType) : undefined,
              order: data.order,
            })
          ).data,
        () => dummyDbApi.updateModule(courseId, moduleId, data),
        "updateModule"
      );
      return normalizeModule({
        ...responseData,
        module_type: mapSectionTypeToModuleType(responseData.section_type),
      });
    } catch (error) {
      console.error("Error updating module:", error);
      throw error;
    }
  },

  deleteModule: async (courseId: EntityId, moduleId: EntityId): Promise<void> => {
    try {
      await withDummyFallback(
        async () => {
          await axiosInstance.delete(`/api/courses/courses/${courseId}/modules/${moduleId}/`);
        },
        () => dummyDbApi.deleteModule(courseId, moduleId),
        "deleteModule"
      );
    } catch (error) {
      console.error("Error deleting module:", error);
      throw error;
    }
  },

  // Lessons
  getLessonsByModule: async (moduleId: EntityId): Promise<Lesson[]> => {
    try {
      const data = await withDummyFallback(
        async () => (await axiosInstance.get(`/api/courses/modules/${moduleId}/lessons/`)).data,
        () => dummyDbApi.getLessonsByModule(moduleId),
        "getLessonsByModule"
      );
      return toArray(data).map(normalizeLesson);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      throw error;
    }
  },

  createLesson: async (payload: CreateLessonPayload): Promise<Lesson> => {
    try {
      const data = await withDummyFallback(
        async () => {
          if (payload.file) {
            const formData = new FormData();
            formData.append("title", payload.title);
            formData.append("content", payload.content || "");
            if (payload.videoUrl) formData.append("video_url", payload.videoUrl);
            if (payload.resourceTitle) formData.append("resource_title", payload.resourceTitle);
            if (payload.resourceLink) formData.append("resource_link", payload.resourceLink);
            formData.append("order", String(payload.order || 0));
            formData.append("module", String(payload.moduleId));
            formData.append("file", payload.file);

            if (payload.assignmentTitle !== undefined) formData.append("assignment_title", payload.assignmentTitle);
            if (payload.assignmentDescription !== undefined) formData.append("assignment_description", payload.assignmentDescription);
            if (payload.assignmentDueDate !== undefined) formData.append("assignment_due_date", payload.assignmentDueDate);

            return (
              await axiosInstance.post(`/api/courses/modules/${payload.moduleId}/lessons/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              })
            ).data;
          } else {
            return (
              await axiosInstance.post(`/api/courses/modules/${payload.moduleId}/lessons/`, {
                title: payload.title,
                content: payload.content || "",
                file: null,
                video_url: payload.videoUrl || "",
                resource_title: payload.resourceTitle || "",
                resource_link: payload.resourceLink || "",
                order: payload.order || 0,
                module: payload.moduleId,
                assignment_title: payload.assignmentTitle || "",
                assignment_description: payload.assignmentDescription || "",
                assignment_due_date: payload.assignmentDueDate || null
              })
            ).data;
          }
        },
        () => dummyDbApi.createLesson(payload),
        "createLesson"
      );
      return normalizeLesson(data);
    } catch (error) {
      console.error("Error creating lesson:", error);
      throw error;
    }
  },

  updateLesson: async (lessonId: EntityId, data: UpdateLessonPayload): Promise<Lesson> => {
    try {
      const responseData = await withDummyFallback(
        async () => {
          if (data.file) {
            const formData = new FormData();
            if (data.title !== undefined) formData.append("title", data.title);
            if (data.content !== undefined) formData.append("content", data.content);
            if (data.videoUrl !== undefined) formData.append("video_url", data.videoUrl);
            if (data.resourceTitle !== undefined) formData.append("resource_title", data.resourceTitle);
            if (data.resourceLink !== undefined) formData.append("resource_link", data.resourceLink);
            if (data.order !== undefined) formData.append("order", String(data.order));
            formData.append("file", data.file);
            
            if (data.assignmentTitle !== undefined) formData.append("assignment_title", data.assignmentTitle);
            if (data.assignmentDescription !== undefined) formData.append("assignment_description", data.assignmentDescription);
            if (data.assignmentDueDate !== undefined) formData.append("assignment_due_date", data.assignmentDueDate);
            
            return (
              await axiosInstance.patch(`/api/courses/modules/${data.moduleId}/lessons/${lessonId}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              })
            ).data;
          } else {
            return (
              await axiosInstance.patch(`/api/courses/modules/${data.moduleId}/lessons/${lessonId}/`, {
                title: data.title,
                content: data.content,
                video_url: data.videoUrl,
                resource_title: data.resourceTitle,
                resource_link: data.resourceLink,
                order: data.order,
                assignment_title: data.assignmentTitle,
                assignment_description: data.assignmentDescription,
                assignment_due_date: data.assignmentDueDate
              })
            ).data;
          }
        },
        () => dummyDbApi.updateLesson(lessonId, data),
        "updateLesson"
      );
      return normalizeLesson(responseData);
    } catch (error) {
      console.error("Error updating lesson:", error);
      throw error;
    }
  },

  deleteLesson: async (moduleId: EntityId, lessonId: EntityId): Promise<void> => {
    try {
      await withDummyFallback(
        async () => {
          await axiosInstance.delete(`/api/courses/modules/${moduleId}/lessons/${lessonId}/`);
        },
        () => dummyDbApi.deleteLesson(moduleId, lessonId),
        "deleteLesson"
      );
    } catch (error) {
      console.error("Error deleting lesson:", error);
      throw error;
    }
  },

  // Lesson Files
  uploadLessonFile: async (payload: CreateLessonFilePayload): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append("lesson", String(payload.lessonId));
      formData.append("file", payload.file);

      const data = await withDummyFallback(
        async () =>
          (
            await axiosInstance.post("/api/lesson-files/", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
          ).data,
        () => dummyDbApi.uploadLessonFile(payload),
        "uploadLessonFile"
      );
      return normalizeLessonFile(data);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  deleteLessonFile: async (fileId: EntityId): Promise<void> => {
    try {
      await withDummyFallback(
        async () => {
          await axiosInstance.delete(`/api/lesson-files/${fileId}/`);
        },
        () => dummyDbApi.deleteLessonFile(fileId),
        "deleteLessonFile"
      );
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },

  getSectionTypes: async (): Promise<SectionType[]> => {
    const data = await axiosInstance.get("/api/courses/section-types/");
    return Array.isArray(data.data) ? data.data : [];
  },

  upsertLessonAssignment: async (payload: UpsertAssignmentPayload): Promise<Assignment> => {
    const formattedDueDate = payload.dueDate ? new Date(payload.dueDate).toISOString() : null;

    const data = await axiosInstance.post(
      `/api/courses/modules/${payload.moduleId}/lessons/${payload.lessonId}/assignment/`,
      {
        assignment_title: payload.title,
        assignment_description: payload.description,
        assignment_due_date: formattedDueDate,
      }
    );

    const raw = data.data || {};

    return {
      id: raw.id ?? payload.lessonId,
      title: raw.assignment_title ?? payload.title,
      description: raw.assignment_description ?? payload.description,
      dueDate: raw.assignment_due_date ?? payload.dueDate,
    };
  },
};
