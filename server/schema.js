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
      },
      async resolve(parent, args) {
        const todo = await Todo.findById(args.id);
        return Todo.findByIdAndUpdate(args.id, {
          $set: {
            completed: !todo.completed,
          },
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation,
});
