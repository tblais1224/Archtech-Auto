 const graphql = require("graphql")
 const _ = require("lodash");
 const User = require("../models/User")
 const Profile = require("../models/Profile")
 const Selling = require("../models/Selling")
 const {GraphQLDate} = require("graphql-iso-date")

 const {
     GraphQLSchema,
     GraphQLObjectType,
     GraphQLString,
     GraphQLID,
     GraphQLInt,
     GraphQLList,
     GraphQLNonNull
 } = graphql;

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
        images: [ URL ]
        ,
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

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      user: {
        type: UserType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
          //code to get the data from db or source of data
          //use lodash to find id using args
          // return _.find(games, { id: args.id });
          return User.findById(args.id);
        }
      },
      profile: {
        type: ProfileType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
          return Profile.findById(args.id);
        }
      },
      selling: {
        type: SellingType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
          return Selling.findById(args.id);
        }
      },
      sellings: {
        type: new GraphQLList(GameType),
        resolve(parent, args) {
          //returns all games
          return Selling.find({});
        }
      },
      profiles: {
        type: new GraphQLList(PlatformType),
        resolve(parent, args) {
          return Profile.find({});
        }
      },
      users: {
        type: new GraphQLList(DesignerType),
        resolve(parent, args) {
          return User.find({});
        }
      }
    }
  });
  


module.exports = new GraphQLSchema({
    query: RootQuery,
    // mutation: Mutation
});