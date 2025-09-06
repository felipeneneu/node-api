import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { courses } from "../database/schema.ts";
import { db } from "../database/client.ts";
import z from "zod";
import { title } from "process";

export const getCourses: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Get all courses",
        description: "Endpoint to retrieve all courses",
        response: {
          200: z.object({
            courses: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
              })
            ),
          }),
        },
      },
    },
    async (request, replay) => {
      const results = await db
        .select({
          id: courses.id,
          title: courses.title,
        })
        .from(courses);
      return replay.send({ courses: results });
    }
  );
};
