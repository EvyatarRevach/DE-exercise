export const typeDefs = `#graphql
  # Comments in GraphQL Strings (such as this one) start with the hash (#) symbol.

  # This "Data" type defines the queryable fields for every User in our data source.

  type Data {
    source: String 
    missileAmount: Int
    destination: String
  }
  type DataToKafka {
  message: String
}
  type Query {
    getData: Data
    initializationDataToKafka:DataToKafka

  }



# type Mutation {
#     initializationDataToKafka:DataToKafka
#   }
`;