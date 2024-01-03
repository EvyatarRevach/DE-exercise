import kafka from "../configs/kafka";
import { connectToRedis, redis } from "./functions";
import { KafkaMessage } from 'kafkajs';

const consumer = kafka.consumer({ groupId: 'storeInRedisGroup' });

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

        const countryKey = `country{${source}}`;
        const regionKey = `dist{${destination}}`;

        const existingData = await redis.json.get(countryKey);
        console.log(existingData);
        
        if (!existingData) {
            await redis.json.set(
                countryKey,
                ".",
                JSON.stringify({
                    [regionKey]: {
                        Rounds: 1,
                        missileAmount,
                        creationTime: timestamp,
                        lastUpdateTime: timestamp,
                    }
                })
            );
        } else {
            const parsedData = JSON.parse(existingData as string);
            parsedData[regionKey] = {
                Rounds: 1,
                missileAmount,
                creationTime: timestamp,
                lastUpdateTime: timestamp,
            };

            await redis.json.set(countryKey, ".", JSON.stringify(parsedData));
        }

        console.log(`Data for ${countryKey}:${regionKey} updated successfully.`);
    } catch (error) {
        console.error(`Error processing message: ${error}`);
    }
};

const processMissileData = async () => {
    await consumer.subscribe({ topic: 'missileDataPSI', fromBeginning: true });
    await connectToRedis();

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const valueString = message.value instanceof Buffer
                    ? message.value.toString('utf-8')
                    : '';
                const value = JSON.parse(valueString);
                console.log(value);

                await processMessage(value);
            } catch (error) {
                console.error("Failed to process missile data", error);
            }
        },
    });

};

processMissileData();