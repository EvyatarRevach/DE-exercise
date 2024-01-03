import { Partitioners } from "kafkajs";
import kafka from "./kafka";

export const producer = kafka.producer({
 createPartitioner: Partitioners.LegacyPartitioner,
});