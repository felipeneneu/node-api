import fastify from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import scalarAPIReference from "@scalar/fastify-api-reference";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { createCourseRoute } from "./routes/create-course.ts";
import { getCourses } from "./routes/get-courses.ts";
import { getCourseByIdRoute } from "./routes/get-course-by-id.ts";
import { deleteCourseByIdRoute } from "./routes/delete-course-by-id.ts";

const app = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

if (process.env.NODE_ENV === "development") {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Curso de NodeJS 2025",
        description: "API REST criada no curso de NodeJS 2025",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(scalarAPIReference, {
    routePrefix: "/docs",
  });
}

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(createCourseRoute);
app.register(getCourses);
app.register(getCourseByIdRoute);
app.register(deleteCourseByIdRoute);

app.listen({ port: 3333 }).then(() => {
  console.log("Server running on http://localhost:3333");
});
