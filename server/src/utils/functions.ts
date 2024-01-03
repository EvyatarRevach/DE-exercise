import axios from "axios";
import { Producer } from "kafkajs";

const getData = async () => {
    const url = "http://localhost:5002/getData"
    const data = await axios.get(url);
    console.log(data);

    return data.data
}

const sendKafkaMessage = async (producer: Producer, topic: string, message: string) => {
    try {
        await producer.connect();
        await producer.send({ topic, messages: [{ value: message }] });
        await producer.disconnect();
    } catch (error) {
        return Promise.reject(error);
    }
}


const initializationData = async () =>{

}
export { getData, sendKafkaMessage , initializationData}