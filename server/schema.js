const {todos} = require('./sampleData');

const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList, GraphQLSchema } = require('graphql');

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
            resolve: (root, args) => {
                return todos;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQueryType
});