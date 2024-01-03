import axios from "axios";
import { Producer } from "kafkajs";
import { createClient } from 'redis';
import { producer } from "../configs/producer";
import moment from "moment";

// import kafka from "../configs/kafka";

const getData = async () => {
    try {
        const url = "http://localhost:5002/getData"
        const data = await axios.get(url);
        return data.data
    } catch (error) {
        console.log(error);
        throw new Error('field to get data')
    }

}

const sendKafkaMessage = async (producer: Producer, topic: string, message: string) => {
    try {
        // const admin = kafka.admin()
        // await admin.connect()
        // const listTopics = await admin.listTopics()
        // console.log(listTopics);

        await producer.connect();
        console.log('producer connect');

        await producer.send({ topic, messages: [{ value: message }] });
        await producer.disconnect();
        return
    } catch (error) {
        return Promise.reject(error);
    }
}

const initializationData = async () => {
    const missileData = await getData();
    const formattedTime = moment().format('MMMM Do YYYY, h:mm:ss a');

    const message = {
        source: missileData.source,
        missileAmount: missileData.missileAmount,
        destination: missileData.destination,
        timestamp: formattedTime,
    };


    await sendKafkaMessage(producer, 'missileDataPSI', JSON.stringify(message));
    console.log('send massage to kafka');

}



const redis = createClient({
    socket:
    {
        port: 6379,
        host: '127.0.0.1'
    }
});

const connectToRedis = async () => {
    try {
        console.log('Trying to connect to Redis...');
        await redis.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
};
export { getData, sendKafkaMessage, initializationData, redis, connectToRedis }