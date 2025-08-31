import fastify from "fastify";
import crypto from "node:crypto";

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
});

const courses = [
  { id: "1", title: "Node.js Basics" },
  { id: "2", title: "Advanced Node.js" },
  { id: "3", title: "Node.js for Beginners" },
];

app.get("/courses", () => {
  return { courses };
});

app.get("/courses/:id", (request, replay) => {
  type Params = {
    id: string;
  };
  const params = request.params as Params;
  const courseId = params.id;
  const course = courses.find((course) => course.id === courseId);

  if (!course) {
    return replay.status(404).send({ error: "Course not found" });
  }
  return { course };
});

app.delete("/courses/:id", (request, replay) => {
  type Params = {
    id: string;
  };
  const params = request.params as Params;
  const courseId = params.id;
  const courseIndex = courses.findIndex((course) => course.id === courseId);

  if (courseIndex === -1) {
    return replay.status(404).send({ error: "Course not found" });
  }
  courses.splice(courseIndex, 1);
  return replay.status(204).send();
});

app.post("/courses", (request, replay) => {
  type Body = {
    title: string;
  };

  const body = request.body as Body;
  const courseTitle = body.title;
  const courseId = crypto.randomUUID();

  if (!courseTitle) {
    return replay.status(400).send({ error: "Title is required" });
  }

  courses.push({ id: courseId, title: courseTitle });

  return replay.status(201).send({ courseId });
});

app.listen({ port: 3333 }).then(() => {
  console.log("Server running on http://localhost:3333");
});
