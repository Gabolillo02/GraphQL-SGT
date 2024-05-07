const {ApolloServer, gql} = require('apollo-server');
const fs = require('fs');
const schema = fs.readFileSync("./schema.graphql", "utf-8");

let tasks = [
    { id: '1', title: 'Complete project proposal', description: 'Write a detailed proposal for the new project', deadline: '2024-05-10', completed: false },
    { id: '2', title: 'Prepare presentation slides', description: 'Create slides for the upcoming meeting', deadline: '2024-05-12', completed: false }
  ];


  const resolvers = {
    Query: {
      tasks: () => tasks
    },
    Mutation: {
      addTask: (_, { input }) => {
        const newTask = { id: String(tasks.length + 1), ...input, completed: false };
        tasks.push(newTask);
        return newTask;
      },
      updateTaskStatus: (_, { id, completed }) => {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) throw new Error("Task not found");
        tasks[taskIndex].completed = completed;
        return tasks[taskIndex];
      },
      deleteTask: (_, { id }) => {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex === -1) throw new Error("Task not found");
        const deletedTask = tasks.splice(taskIndex, 1)[0];
        return deletedTask;
      }
    }
  };
  
const server = new ApolloServer({
    typeDefs: gql(schema),
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`Server running on: ${url}`);
})