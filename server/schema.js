const Todo = require("./Todo");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} = require("graphql");

const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    todos: {
      type: new GraphQLList(TodoType),
      resolve: (parent, args) => {
        return Todo.find();
      },
    },
    todo: {
      type: TodoType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        return Todo.findById(args.id);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addTodo: {
      type: TodoType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        completed: { type: new GraphQLNonNull(GraphQLBoolean) },
      },
      resolve(parent, args) {
        const todo = new Todo({
          title: args.title,
          completed: false,
        });

        return todo.save();
      },
    },
    deleteTodo: {
      type: TodoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Todo.findByIdAndDelete(args.id);
      },
    },
    updateTodo: {
      type: TodoType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Todo.findByIdAndUpdate(args.id, {
          $set: {
            title: args.title,
          },
        });
      },
    },
    toggleTodo: {
      type: TodoType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        completed: { type: GraphQLNonNull(GraphQLBoolean) },
      },
      async resolve(parent, args) {
        try {
          const todo = await Todo.findById(args.id);
          if (!todo) {
            throw new Error('Todo not found');
          }
          return Todo.findByIdAndUpdate(args.id, { $set: { completed: !todo.completed } }, { new: true });
        } catch (error) {
          console.error("Error toggling todo:", error);
          throw new Error(error.message || 'Error processing request');
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation,
});
