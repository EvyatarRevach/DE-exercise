import kafka from "../configs/kafka";
import { connectToRedis, redis } from "./functions";

interface MissileData {
    source: string;
    destination: string;
    missileAmount: number;
    timestamp: number;
}

const processMessage = async (message: MissileData) => {
    try {
        const { source, destination, missileAmount, timestamp } = message;
        console.log(message);

        const existKey = await redis.exists(`country{${source}}:dist{${destination}}`);
        if (!existKey) {
            await redis.json.set(
                `country{${source}}:dist{${destination}}`,
                ".",
                JSON.stringify({
                    Rounds: 1,
                    missileAmount,
                    creationTime: timestamp,
                    lastUpdateTime: timestamp,
                })
            );
        } else {
            await redis
                .multi()
                .json.numIncrBy(`country{${source}}:dist{${destination}}`, "$.Rounds", 1)
                .json.numIncrBy(`country{${source}}:dist{${destination}}`, "$.missileAmount", missileAmount)
                .json.merge(`country{${source}}:dist{${destination}}`, "$.lastUpdateTime", timestamp)
                .exec();
        }

        console.log(`Data for ${source} updated successfully.`);
    } catch (error) {
        console.error(`Error processing message: ${error}`);
    }
};


const processMissileData = async () => {
    const consumer = kafka.consumer({ groupId: "a" });
    await connectToRedis()
    await consumer.subscribe({ topic: 'missileDataPSI' });
    
    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const valueString = message.value instanceof Buffer
                    ? message.value.toString('utf-8')
                    : '';
                const value: MissileData = JSON.parse(valueString);
                console.log(value);

                await processMessage(value);
            } catch (error) {
                console.error("Failed to process missile data", error);
            }
        },
    });

    await consumer.disconnect();
};

processMissileData();