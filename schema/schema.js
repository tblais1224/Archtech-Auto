const graphql = require("graphql")
const _ = require("lodash");
const User = require("../models/User")
const Profile = require("../models/Profile")
const Selling = require("../models/Selling")
const Post = require("../models/Post")
const Comment = require("../models/Comment")
const Like = require("../models/Like")
const Wishlist = require("../models/Wishlist")

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
                return Selling.find(parent.id);
            }
        },
        post: {
            type: PostType,
            resolve(parent, args) {
                return Post.find(parent.id);
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
        model: {
            type: GraphQLString
        },
        manufacturer: {
            type: GraphQLString
        },
        mileage: {
            type: GraphQLInt
        },
        hours: {
            type: GraphQLInt
        },
        price: {
            type: GraphQLInt
        },
        condition: {
            type: GraphQLString
        },
        chargeTime: {
            type: GraphQLString
        },
        range: {
            type: GraphQLString
        },
        drive: {
            type: GraphQLString
        },
        acceleration: {
            type: GraphQLString
        },
        topSpeed: {
            type: GraphQLString
        },
        color: {
            type: GraphQLString
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
        likes: {
            type: new GraphQLList(LikeType),
            resolve(parent, args) {
                return Like.find({
                    sellingId: parent.id
                });
            }
        },
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
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args) {
                return Comment.find({
                    postId: parent.id
                });
            }
        },
        likes: {
            type: new GraphQLList(LikeType),
            resolve(parent, args) {
                return Like.find({
                    postId: parent.id
                });
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

const CommentType = new GraphQLObjectType({
    name: "Comment",
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
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        },
        post: {
            type: PostType,
            resolve(parent, args) {
                return Post.findById(parent.postId);
            }
        },
        selling: {
            type: SellingType,
            resolve(parent, args) {
                return Selling.findById(parent.sellingId);
            }
        },
    })
});

const LikeType = new GraphQLObjectType({
    name: "Like",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        date: {
            type: GraphQLDate
        },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        },
        post: {
            type: PostType,
            resolve(parent, args) {
                return Post.findById(parent.postId);
            }
        },
        selling: {
            type: SellingType,
            resolve(parent, args) {
                return Selling.findById(parent.sellingId);
            }
        },
    })
});

const WishlistType = new GraphQLObjectType({
    name: "Wishlist",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        date: {
            type: GraphQLDate
        },
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            }
        },
        model: {
            type:GraphQLString
        },
        manufacturer: {
            type:GraphQLString
        },
        type: {
            type:GraphQLString
        },
        selling: {
            type: SellingType,
            resolve(parent, args) {
                return Selling.findById(parent.sellingId);
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