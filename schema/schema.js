const graphql = require("graphql")
const _ = require("lodash");
const User = require("../models/User")
const Profile = require("../models/Profile")
const Selling = require("../models/Selling")
const Post = require("../models/Post")
const Comment = require("../models/Comment")
const Likes = require("../models/Like")

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const {
    GraphQLDate
} = require("graphql-iso-date")

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        },
        profile: {
            type: ProfileType,
            resolve(parent, args) {
                //parent returns the user data in this case
                return Profile.findById(parent.profileId);
            }
        }
    })
});

const ProfileType = new GraphQLObjectType({
    name: "Profile",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        handle: {
            type: GraphQLString
        },
        skills: {
            type: GraphQLString
        },
        bio: {
            type: GraphQLString
        },
        selling: {
            type: SellingType,
            resolve(parent, args) {
                //parent returns the Profile data in this case
                return Selling.findById(parent.sellingId);
            }
        },
        post: {
            type: PostType,
            resolve(parent, args) {
                return Post.findById(parent.postId);
            }
        },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        },
    })
});

const SellingType = new GraphQLObjectType({
    name: "Selling",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        price: {
            type: GraphQLInt
        },
        description: {
            type: GraphQLString
        },
        location: {
            type: GraphQLString
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args) {
                return Comment.find({
                    sellingId: parent.id
                });
            }
        },
        watching: [{
            user: {
                type: UserType,
                resolve(parent, args) {
                    return User.findById(parent.userId);
                }
            }
        }],
        date: {
            type: GraphQLDate
        },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        },
    })
});

const PostType = new GraphQLObjectType({
    name: "Post",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        text: {
            type: GraphQLString
        },
        date: {
            type: GraphQLDate
        },
        comments: [{
            user: {
                type: UserType,
                resolve(parent, args) {
                    return User.findById(parent.userId);
                }
            },
            text: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            date: {
                type: GraphQLDate
            },
        }],
        likes: [{
            user: {
                type: UserType,
                resolve(parent, args) {
                    return User.findById(parent.userId);
                }
            }
        }],
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        },
    })
});


const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                //code to get the data from db or source of data
                //use lodash to find id using args
                // return _.find(Users, { id: args.id });
                return User.findById(args.id);
            }
        },
        profile: {
            type: ProfileType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return Profile.findById(args.id);
            }
        },
    }
})

const Mutation = ""

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
