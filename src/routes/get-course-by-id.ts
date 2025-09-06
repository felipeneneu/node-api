import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { courses } from "../database/schema.ts";
import { db } from "../database/client.ts";
import { desc, eq } from "drizzle-orm";
import z from "zod";
import { title } from "process";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/courses/:id",
    {
      schema: {
        tags: ["courses"],
        summary: "Get course by ID",
        description: "Endpoint to retrieve all courses",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            course: z.object({
              id: z.uuid(),
              title: z.string(),
              description: z.string().nullable(),
            }),
          }),
          404: z.null().describe("Course not found"),
        },
      },
    },
    async (request, replay) => {
      const courseId = request.params.id;
      const result = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));

      if (result.length > 0) {
        return { course: result[0] };
      }
      return replay.status(404).send();
    }
  );
};
