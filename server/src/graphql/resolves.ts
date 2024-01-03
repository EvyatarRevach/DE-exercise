import { GraphQLError } from "graphql";
import { getData, initializationData } from "../utils/functions";


export const resolvers = {
    Query: {
        getData: getData,
        initializationDataToKafka: initializationData 
    },
 
   
}