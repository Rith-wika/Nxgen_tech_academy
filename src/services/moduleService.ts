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
} from "@/types/moduleTypes";

const DUMMY_DB_KEY = "nxgen_dummy_module_db_v1";
const dummyDbEnv = import.meta.env.VITE_USE_DUMMY_DB;
const useDummyDb =
  dummyDbEnv === "true" ? true : dummyDbEnv === "false" ? false : import.meta.env.DEV;

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
  notes: string;
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

const normalizeLesson = (raw: any): Lesson => ({
  id: raw.id,
  title: raw.title || "Untitled lesson",
  content: raw.content || "",
  notes: raw.notes || "",
  order: raw.order || 0,
  files: (raw.files || raw.lesson_files || []).map(normalizeLessonFile),
  links: (raw.links || raw.lesson_links || []).map(normalizeLessonLink),
});

const normalizeModule = (raw: any): Module => ({
  id: raw.id,
  title: raw.title || "Untitled module",
  description: raw.description || "",
  moduleType: raw.module_type || raw.moduleType || "training",
  order: raw.order || 0,
  lessons: (raw.lessons || []).map(normalizeLesson),
});

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

  async updateModule(moduleId: EntityId, data: UpdateModulePayload) {
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

  async deleteModule(moduleId: EntityId) {
    const db = readDummyDb();
    const moduleIdsToDelete = new Set(
      db.modules.filter((module) => String(module.id) === String(moduleId)).map((module) => String(module.id))
    );
    const lessonIdsToDelete = new Set(
      db.lessons
        .filter((lesson) => moduleIdsToDelete.has(String(lesson.module)))
        .map((lesson) => String(lesson.id))
    );

    db.modules = db.modules.filter((module) => String(module.id) !== String(moduleId));
    db.lessons = db.lessons.filter((lesson) => !lessonIdsToDelete.has(String(lesson.id)));
    db.lessonFiles = db.lessonFiles.filter((file) => !lessonIdsToDelete.has(String(file.lesson)));
    db.lessonLinks = db.lessonLinks.filter((link) => !lessonIdsToDelete.has(String(link.lesson)));
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
      notes: payload.notes,
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
    if (data.notes !== undefined) lessonRecord.notes = data.notes;
    if (data.order !== undefined) lessonRecord.order = data.order;

    writeDummyDb(db);
    return buildRawLesson(lessonRecord, db);
  },

  async deleteLesson(lessonId: EntityId) {
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
        async () => (await axiosInstance.get(`/api/modules/?course_id=${courseId}`)).data,
        () => dummyDbApi.getModulesByCourse(courseId),
        "getModulesByCourse"
      );
      return toArray(data).map(normalizeModule);
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
            await axiosInstance.post("/api/modules/", {
              course: payload.courseId,
              title: payload.title,
              description: payload.description || "",
              module_type: payload.moduleType || "training",
              order: payload.order || 0,
            })
          ).data,
        () => dummyDbApi.createModule(payload),
        "createModule"
      );
      return normalizeModule(data);
    } catch (error) {
      console.error("Error creating module:", error);
      throw error;
    }
  },

  updateModule: async (moduleId: EntityId, data: UpdateModulePayload): Promise<Module> => {
    try {
      const responseData = await withDummyFallback(
        async () =>
          (
            await axiosInstance.patch(`/api/modules/${moduleId}/`, {
              title: data.title,
              description: data.description,
              module_type: data.moduleType,
              order: data.order,
            })
          ).data,
        () => dummyDbApi.updateModule(moduleId, data),
        "updateModule"
      );
      return normalizeModule(responseData);
    } catch (error) {
      console.error("Error updating module:", error);
      throw error;
    }
  },

  deleteModule: async (moduleId: EntityId): Promise<void> => {
    try {
      await withDummyFallback(
        async () => {
          await axiosInstance.delete(`/api/modules/${moduleId}/`);
        },
        () => dummyDbApi.deleteModule(moduleId),
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
        async () => (await axiosInstance.get(`/api/lessons/?module_id=${moduleId}`)).data,
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
        async () =>
          (
            await axiosInstance.post("/api/lessons/", {
              module: payload.moduleId,
              title: payload.title,
              content: payload.content,
              notes: payload.notes,
              order: payload.order || 0,
            })
          ).data,
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
        async () =>
          (
            await axiosInstance.patch(`/api/lessons/${lessonId}/`, {
              title: data.title,
              content: data.content,
              notes: data.notes,
              order: data.order,
            })
          ).data,
        () => dummyDbApi.updateLesson(lessonId, data),
        "updateLesson"
      );
      return normalizeLesson(responseData);
    } catch (error) {
      console.error("Error updating lesson:", error);
      throw error;
    }
  },

  deleteLesson: async (lessonId: EntityId): Promise<void> => {
    try {
      await withDummyFallback(
        async () => {
          await axiosInstance.delete(`/api/lessons/${lessonId}/`);
        },
        () => dummyDbApi.deleteLesson(lessonId),
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

  // Lesson Links
  createLessonLink: async (payload: CreateLessonLinkPayload): Promise<any> => {
    try {
      const data = await withDummyFallback(
        async () =>
          (
            await axiosInstance.post("/api/lesson-links/", {
              lesson: payload.lessonId,
              url: payload.url,
              title: payload.title,
            })
          ).data,
        () => dummyDbApi.createLessonLink(payload),
        "createLessonLink"
      );
      return normalizeLessonLink(data);
    } catch (error) {
      console.error("Error creating link:", error);
      throw error;
    }
  },

  deleteLessonLink: async (linkId: EntityId): Promise<void> => {
    try {
      await withDummyFallback(
        async () => {
          await axiosInstance.delete(`/api/lesson-links/${linkId}/`);
        },
        () => dummyDbApi.deleteLessonLink(linkId),
        "deleteLessonLink"
      );
    } catch (error) {
      console.error("Error deleting link:", error);
      throw error;
    }
  },
};
