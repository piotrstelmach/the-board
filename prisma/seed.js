const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Role bitmask
  const ROLES = {
    USER: 1,
    ADMIN: 2,
    SCRUM_MASTER: 4,
    DEVELOPER: 8,
  };

  // Add users
  const users = await prisma.user.createMany({
    data: [
      { name: "John Doe", email: "johdfn@example.com", password: "hashed_password", roles: ROLES.SCRUM_MASTER | ROLES.DEVELOPER },
      { name: "Jane Smith", email: "janedf@example.com", password: "hashed_password", roles: ROLES.ADMIN },
      { name: "Tom Johnson", email: "tomdf@example.com", password: "hashed_password", roles: ROLES.DEVELOPER },
    ],
  });

  console.log(`${users.count} users have been added.`);

  // Add sprints
  const sprint1 = await prisma.sprint.create({
    data: {
      name: "Sprint 1",
      goal: "Implement basic functionalities",
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-14'),
    },
  });

  const sprint2 = await prisma.sprint.create({
    data: {
      name: "Sprint 2",
      goal: "Extend the system with new modules",
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-28'),
    },
  });

  console.log("Sprints have been added.");

  // Add epics
  const epic1 = await prisma.epic.create({
    data: {
      name: "Login Module",
      description: "Functionality allowing users to log into the system.",
    },
  });

  const epic2 = await prisma.epic.create({
    data: {
      name: "Task Management Module",
      description: "Functionality allowing task management within sprints.",
    },
  });

  console.log("Epics have been added.");

  // Add user stories
  const story1 = await prisma.userStory.create({
    data: {
      title: "Login API",
      description: "Create an API endpoint for user login.",
      priority: "HIGH",
      status: "PLANNED",
      epicId: epic1.id,
      storyPoints: 8,
    },
  });

  const story2 = await prisma.userStory.create({
    data: {
      title: "Task Dashboard",
      description: "Create a dashboard view for task management.",
      priority: "MEDIUM",
      status: "PLANNED",
      epicId: epic2.id,
      storyPoints: 5,
    },
  });

  console.log("User stories have been added.");

  // Add tasks
  const task1 = await prisma.task.create({
    data: {
      title: "Implement login endpoint",
      description: "Create POST /login endpoint in the API.",
      status: "TODO",
      priority: "HIGH",
      storyPoints: 5,
      sprintId: sprint1.id,
      storyId: story1.id,
      assigneeId: 1, // Assigned to John Doe
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Create login form",
      description: "Create the frontend login form.",
      status: "TODO",
      priority: "MEDIUM",
      storyPoints: 3,
      sprintId: sprint1.id,
      storyId: story1.id,
      assigneeId: 3, // Assigned to Tom Johnson
    },
  });

  console.log("Tasks have been added.");

  // Add comments
  await prisma.comment.createMany({
    data: [
      { content: "Does the login endpoint support JWT?", taskId: task1.id, authorId: 1 },
      { content: "I need more details for the login form.", taskId: task2.id, authorId: 3 },
    ],
  });

  console.log("Comments have been added.");
}

main()
  .then(() => {
    console.log("Seed completed successfully.");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error("Seed completed with errors:", e);
    prisma.$disconnect();
    process.exit(1);
  });