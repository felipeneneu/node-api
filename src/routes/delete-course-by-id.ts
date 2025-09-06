import { courses } from "../database/schema.ts";
import { db } from "../database/client.ts";
import { eq } from "drizzle-orm";
import z from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const deleteCourseByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/courses/:id",
    {
      schema: {
        tags: ["courses"],
        summary: "Delete course by ID",
        description: "Endpoint to delete a course by its ID",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          204: z.object({
            message: z.string().describe("Course deleted successfully"),
          }),
          404: z.object({
            error: z.string().describe("Course not found"),
          }),
        },
      },
    },
    async (request, replay) => {
      const courseId = request.params.id;

      const courseIndex = db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));

      if ((await courseIndex).length === 0) {
        return replay.status(404).send({ error: "Course not found" });
      }
      await db.delete(courses).where(eq(courses.id, courseId));
      return replay
        .status(204)
        .send({ message: "Course deleted successfully" });
    }
  );
};
