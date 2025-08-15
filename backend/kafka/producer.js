// kafka/producer.js
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'hostelmate-producer',
  brokers: ['localhost:9092'], // Replace with your Kafka broker(s)
});

// Create a producer instance
const producer = kafka.producer();

// Connect to Kafka when the module is imported
const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer connected");
  } catch (error) {
    console.error("Kafka Producer connection failed:", error);
  }
};

connectProducer(); // auto-connect at startup

// Export function to publish events
export const publishComplaintEvent = async (topic, data) => {
  try {
    await producer.send({
      topic: topic,
      messages: [
        {
          value: JSON.stringify(data),
        },
      ],
    });
    console.log(`Event published to topic "${topic}"`);
  } catch (error) {
    console.error(`Failed to publish to Kafka topic "${topic}"`, error);
  }
};
