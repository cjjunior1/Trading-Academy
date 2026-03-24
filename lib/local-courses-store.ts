type LocalCourse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  priceUsd: number;
  level: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

const globalForLocalCourses = globalThis as unknown as {
  localCourses: LocalCourse[] | undefined;
};

if (!globalForLocalCourses.localCourses) {
  globalForLocalCourses.localCourses = [];
}

export function getLocalCourses() {
  return [...(globalForLocalCourses.localCourses || [])].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

export function getLocalCourseById(id: string) {
  return (globalForLocalCourses.localCourses || []).find((course) => course.id === id) || null;
}

export function createLocalCourse(input: {
  title: string;
  slug: string;
  description: string;
  priceUsd: number;
  level: string;
  isPublished: boolean;
}) {
  const now = new Date().toISOString();
  const course: LocalCourse = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title,
    slug: input.slug,
    description: input.description,
    priceUsd: input.priceUsd,
    level: input.level,
    isPublished: input.isPublished,
    createdAt: now,
    updatedAt: now,
  };

  globalForLocalCourses.localCourses = [course, ...(globalForLocalCourses.localCourses || [])];
  return course;
}

export function updateLocalCourse(
  id: string,
  data: Partial<Pick<LocalCourse, "title" | "description" | "priceUsd" | "level" | "isPublished">>
) {
  const courses = globalForLocalCourses.localCourses || [];
  const idx = courses.findIndex((course) => course.id === id);
  if (idx === -1) return null;

  const updated = {
    ...courses[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  courses[idx] = updated;
  globalForLocalCourses.localCourses = courses;
  return updated;
}

export function deleteLocalCourse(id: string) {
  const courses = globalForLocalCourses.localCourses || [];
  const exists = courses.some((course) => course.id === id);
  if (!exists) return false;

  globalForLocalCourses.localCourses = courses.filter((course) => course.id !== id);
  return true;
}
