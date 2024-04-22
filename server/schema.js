const Todo = require('./Todo');

const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList, GraphQLSchema, GraphQLNonNull } = require('graphql');

const TodoType = new GraphQLObjectType({
    name: 'Todo',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        completed: { type: GraphQLBoolean }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        todos: {
            type: new GraphQLList(TodoType),
            resolve: (parent, args) => {
                return Todo.find();
            }
        },
        todo: {
            type: TodoType,
            args: { id: { type: GraphQLID } },
            resolve: (parent, args) => {
                return Todo.findById(args.id);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTodo: {
            type: TodoType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                completed: { type: new GraphQLNonNull(GraphQLBoolean) }
            },
            resolve: (parent, args) => {
                const todo = new Todo({
                    title: args.title,
                    completed: false
                });

                return todo.save();
            },
        }
    }
});
        

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation
});