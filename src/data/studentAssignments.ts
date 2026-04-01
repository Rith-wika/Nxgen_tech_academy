import { courses as fallbackCourses } from "@/data/courses";

export const ASSIGNMENT_STATUS_STORAGE_KEY = "studentAssignmentStatusMap";
const DUMMY_DB_KEY = "nxgen_dummy_module_db_v1";

export type StudentAssignment = {
    id: string;
    moduleName: string;
    lessonName: string;
    assignmentTitle: string;
    submissionLink: string;
    hasSubmitted: boolean;
};

export type BatchStudent = {
    id: string;
    name: string;
    userId: string;
    assignments: StudentAssignment[];
};

export type StudentBatch = {
    id: string;
    batchName: string;
    students: BatchStudent[];
};

export type StudentCourseGroup = {
    id: string;
    courseName: string;
    batches: StudentBatch[];
};

type AssignmentTemplate = {
    templateId: string;
    moduleName: string;
    lessonName: string;
    assignmentTitle: string;
};

type MockModuleRecord = {
    id: number;
    course: string | number;
    title: string;
    order: number;
};

type MockLessonRecord = {
    id: number;
    module: string | number;
    title: string;
    assignment_title?: string;
    assignment_description?: string;
    order: number;
};

type MockDb = {
    modules?: MockModuleRecord[];
    lessons?: MockLessonRecord[];
};

const fallbackAssignmentTemplates: AssignmentTemplate[] = [
    {
        templateId: "fallback-1",
        moduleName: "Module 01 · Discovery Lab",
        lessonName: "Lesson 01 · Discovery Kickoff",
        assignmentTitle: "Persona Mapping Sprint",
    },
    {
        templateId: "fallback-2",
        moduleName: "Module 02 · Build Systems",
        lessonName: "Lesson 03 · Workflow Systems",
        assignmentTitle: "Workflow Automation Prototype",
    },
    {
        templateId: "fallback-3",
        moduleName: "Module 03 · Launch Studio",
        lessonName: "Lesson 05 · Launch Narrative",
        assignmentTitle: "Client Delivery Showcase",
    },
];

const FIRST_NAMES = [
    "Aarav", "Nisha", "Karthik", "Priya", "Rohit", "Sneha", "Abhinav", "Meera", "Harsha", "Lalitha",
    "Diya", "Arjun", "Tanvi", "Varun", "Saanvi", "Naveen", "Pooja", "Rahul", "Ishita", "Gokul",
    "Vikram", "Kiran", "Nandini", "Yash", "Ritika", "Mohan", "Keerthi", "Aditya", "Bhavya", "Tejaswini",
    "Anaya", "Siddharth", "Mihika", "Darshan", "Akash", "Riya", "Sanjana", "Nikhil", "Aditi", "Rohan",
];

const LAST_NAMES = [
    "Sharma", "Reddy", "Rao", "Menon", "Kumar", "Iyer", "Das", "Patel", "Sai", "Devi",
    "Babu", "Shah", "Teja", "Nair", "Jain", "Paul", "Sen", "Gupta", "Bose", "Kulkarni",
];

const BATCHES_PER_COURSE = 5;

type CourseSeed = {
    id: string | number;
    title?: string;
    name?: string;
};

const resolveCourseName = (course: CourseSeed): string => {
    return String(course.title || course.name || `Course ${course.id}`);
};

const getDefaultCourseSeeds = (): CourseSeed[] => {
    return fallbackCourses.map((course) => ({ id: course.id, title: course.title }));
};

const seededUnit = (seed: number): number => {
    const value = Math.sin(seed * 999.91) * 43758.5453;
    return value - Math.floor(value);
};

const seededInt = (min: number, max: number, seed: number): number => {
    const unit = seededUnit(seed);
    return Math.floor(unit * (max - min + 1)) + min;
};

const buildStudentName = (sequence: number): string => {
    const first = FIRST_NAMES[sequence % FIRST_NAMES.length];
    const last = LAST_NAMES[Math.floor(sequence / FIRST_NAMES.length) % LAST_NAMES.length];
    return `${first} ${last}`;
};

const readDummyDb = (): MockDb => {
    try {
        const raw = localStorage.getItem(DUMMY_DB_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const buildAssignmentTemplatesByCourse = (courseId: string | number): AssignmentTemplate[] => {
    const db = readDummyDb();
    const modules = [...(db.modules || [])]
        .filter((module) => String(module.course) === String(courseId))
        .sort((left, right) => (left.order || 0) - (right.order || 0));
    const lessons = [...(db.lessons || [])].sort((left, right) => (left.order || 0) - (right.order || 0));

    const templates = modules.flatMap((moduleRecord) => {
        const moduleLessons = lessons.filter((lesson) => String(lesson.module) === String(moduleRecord.id));

        return moduleLessons.map((lessonRecord, index) => ({
            templateId: `${moduleRecord.id}-${lessonRecord.id}`,
            moduleName: moduleRecord.title,
            lessonName: lessonRecord.title,
            assignmentTitle: lessonRecord.assignment_title || `${lessonRecord.title} Assignment ${index + 1}`,
        }));
    });

    return templates;
};

const buildAssignments = (userId: string, seed: number, templates: AssignmentTemplate[]): StudentAssignment[] => {
    return templates.map((template, index) => {
        const hasSubmitted = (seed + index) % 2 === 0;

        return {
            id: `${userId}-${template.templateId}`,
            moduleName: template.moduleName,
            lessonName: template.lessonName,
            assignmentTitle: template.assignmentTitle,
            submissionLink: hasSubmitted ? `https://demo.nxgen.app/submissions/${userId.toLowerCase()}/${index + 1}` : "",
            hasSubmitted,
        };
    });
};

const buildCourseGroups = (courseList: CourseSeed[]): StudentCourseGroup[] => {
    let userSequence = 1001;

    return courseList.map((course, courseIndex) => {
        const templatesForCourse = buildAssignmentTemplatesByCourse(course.id);

        const batches: StudentBatch[] = Array.from({ length: BATCHES_PER_COURSE }, (_, batchIndex) => {
            const studentCount = seededInt(5, 12, (courseIndex + 1) * 101 + (batchIndex + 1) * 17);
            const students: BatchStudent[] = Array.from({ length: studentCount }, (_, studentIndex) => {
                const currentSequence = userSequence;
                userSequence += 1;
                const userId = `STU${String(currentSequence).padStart(4, "0")}`;

                return {
                    id: `course-${courseIndex + 1}-batch-${batchIndex + 1}-student-${studentIndex + 1}`,
                    name: buildStudentName(currentSequence + studentIndex),
                    userId,
                    assignments: buildAssignments(userId, currentSequence + studentIndex, templatesForCourse),
                };
            });

            return {
                id: `course-${courseIndex + 1}-batch-${batchIndex + 1}`,
                batchName: `Batch ${String.fromCharCode(65 + batchIndex)}`,
                students,
            };
        });

        return {
            id: `course-${courseIndex + 1}`,
            courseName: resolveCourseName(course),
            batches,
        };
    });
};

export const getStudentCourseGroups = (courseList?: CourseSeed[]): StudentCourseGroup[] => {
    const sourceCourses = courseList && courseList.length > 0 ? courseList : getDefaultCourseSeeds();
    return buildCourseGroups(sourceCourses);
};

export const getStudentBatches = (courseList?: CourseSeed[]): StudentBatch[] => {
    return getStudentCourseGroups(courseList).flatMap((course) => course.batches);
};

export const getAllStudents = (courseList?: CourseSeed[]): BatchStudent[] => getStudentBatches(courseList).flatMap((batch) => batch.students);