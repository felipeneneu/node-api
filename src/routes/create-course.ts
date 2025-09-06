import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { courses } from "../database/schema.ts";
import { db } from "../database/client.ts";
import z from "zod";

export const createCourseRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Create a course",
        description: "Endpoint to create a new course",
        body: z.object({
          title: z.string().min(5, "Titulo deve ter no mínimo 5 caracteres."),
        }),
        response: {
          201: z
            .object({
              courseId: z.uuid(),
            })
            .describe("Response when the course is created successfully"),
        },
      },
    },
    async (request, replay) => {
      const courseTitle = request.body.title;

      const result = await db
        .insert(courses)
        .values({
          title: courseTitle,
        })
        .returning();

      return replay.status(201).send({ courseId: result[0].id });
    }
  );
};
