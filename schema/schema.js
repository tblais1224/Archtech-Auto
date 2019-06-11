 const graphql = require("graphql")
 const _ = require("lodash");
 const User = require("../models/User")
 const Profile = require("../models/Profile")
 const Selling = require("../models/Selling")
 const {
     GraphQLDate
 } = require("graphql-iso-date")

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
         sellings: {
             type: new GraphQLList(SellingType),
             resolve(parent, args) {
                 //parent returns the user data in this case
                 return Selling.find({
                     userId: parent.id
                 });
             }
         },
         profile: {
             type: new GraphQLList(ProfileType),
             resolve(parent, args) {
                 console.log(parent)
                 //parent returns the user data in this case
                 return Profile.find({
                     userId: parent.id
                 });
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
         bio: {
             type: GraphQLString
         },
         sellings: {
             type: new GraphQLList(SellingType),
             resolve(parent, args) {
                 return Selling.find({
                     profileId: parent.id
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


 const SellingType = new GraphQLObjectType({
     name: "Selling",
     fields: () => ({
         id: {
             type: GraphQLID
         },
         model: {
             type: GraphQLString
         },
         type: {
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
         //  images: [{
         //      URL: {
         //          type: GraphQLString
         //      }
         //  }],
         date: {
             type: GraphQLDate
         },
         userId: {
             type: GraphQLString
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
             args: {
                 id: {
                     type: GraphQLID
                 }
             },
             resolve(parent, args) {

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
         selling: {
             type: SellingType,
             args: {
                 id: {
                     type: GraphQLID
                 }
             },
             resolve(parent, args) {
                 return Selling.findById(args.id);
             }
         },
         sellings: {
             type: new GraphQLList(SellingType),
             resolve(parent, args) {
                 //returns all games
                 return Selling.find({});
             }
         },
         profiles: {
             type: new GraphQLList(ProfileType),
             resolve(parent, args) {
                 return Profile.find({});
             }
         },
         users: {
             type: new GraphQLList(UserType),
             resolve(parent, args) {
                 return User.find({});
             }
         }
     }
 });

 //setup mutations
 const Mutation = new GraphQLObjectType({
     name: "Mutation",
     fields: {
         addUser: {
             type: UserType,
             args: {
                 name: {
                     type: new GraphQLNonNull(GraphQLString)
                 },
                 email: {
                     type: new GraphQLNonNull(GraphQLString)
                 },
                 password: {
                     type: new GraphQLNonNull(GraphQLString)
                 },
                 //   profileId: { type: GraphQLID }
             },
             resolve(parent, args) {
                 let user = new User({
                     name: args.name,
                     email: args.email,
                     password: args.password,
                     // profileId: args.profileId
                 });
                 return user.save().catch(err => console.log(err));
             }
         },
         //handle bio selling user
         addProfile: {
             type: ProfileType,
             //args are passed in from user on front end
             args: {
                 handle: {
                     type: new GraphQLNonNull(GraphQLString)
                 },
                 bio: {
                     type: GraphQLString
                 },
                 //   sellingId: { type: GraphQLID },
                 userId: {
                     type: GraphQLID
                 },
             },
             resolve(parent, args) {
                 //create an instance of the Profile model
                 let profile = new Profile({
                     handle: args.handle,
                     bio: args.bio,
                     // sellingId: args.sellingId,
                     userId: args.userId
                 });
                 return profile.save().catch(err => console.log(err));
             }
         },

         addSelling: {
             type: SellingType,
             //args are passed in from user on front end
             args: {
                 model: {
                     type: new GraphQLNonNull(GraphQLString)
                 },
                 manufacturer: {
                     type: new GraphQLNonNull(GraphQLString)
                 },
                 type: {
                     type: new GraphQLNonNull(GraphQLString)
                 },
                 mileage: {
                     type: GraphQLInt
                 },
                 price: {
                     type: new GraphQLNonNull(GraphQLInt)
                 },
                 hours: {
                     type: GraphQLInt
                 },
                 condition: {
                     type: GraphQLInt
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
                 date: {
                     type: GraphQLDate
                 },
                 userId: {
                     type: new GraphQLNonNull(GraphQLString)
                 }
             },
             resolve(parent, args) {
                 //create an instance of the Selling model
                 let selling = new Selling({
                     model: args.model,
                     manufacturer: args.manufacturer,
                     type: args.type,
                     mileage: args.mileage,
                     price: args.price,
                     hours: args.hours,
                     condition: args.condition,
                     chargeTime: args.chargeTime,
                     range: args.range,
                     drive: args.drive,
                     acceleration: args.acceleration,
                     topSpeed: args.topSpeed,
                     color: args.color,
                     description: args.description,
                     location: args.location,
                     date: args.date,
                     userId: args.userId,
                 });
                 return selling.save().catch(err => console.log(err));
             }
         },

         deleteUser: {
             type: UserType,
             args: {
                 id: {
                     type: new GraphQLNonNull(GraphQLString)
                 }
             },
             resolve(parent, {
                 id
             }) {
                 return User.findByIdAndDelete(id).then(() => console.log("user deleted")).catch(err => console.log(err))
             }
         },

         deleteProfile: {
             type: ProfileType,
             args: {
                 id: {
                     type: new GraphQLNonNull(GraphQLString)
                 }
             },
             resolve(parent, {
                 id
             }) {
                 return Profile.findByIdAndDelete(id).then(() => console.log("profile deleted")).catch(err => console.log(err))
             }
         },

         deleteSelling: {
             type: SellingType,
             args: {
                 id: {
                     type: new GraphQLNonNull(GraphQLString)
                 }
             },
             resolve(parent, {
                 id
             }) {
                 return Selling.findByIdAndDelete(id).then(() => console.log("Selling deleted")).catch(err => console.log(err))
             }
         }
     }
 });

 module.exports = new GraphQLSchema({
     query: RootQuery,
     mutation: Mutation
 });