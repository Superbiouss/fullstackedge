import { CourseForm } from "@/components/admin/course-form";

export default function NewCoursePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Create New Course</h1>
        <p className="text-muted-foreground">Fill out the details below to create a new course.</p>
      </div>
      <CourseForm />
    </div>
  )
}
