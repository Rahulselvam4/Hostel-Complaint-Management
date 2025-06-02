// kafka/consumer.js
import { Kafka } from 'kafkajs';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import Worker from '../models/Worker.js';

// 1. Connect to MongoDB before starting the Kafka consumer
const connectToMongoDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/HCMSD', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if DB not connected
  }
};

// 2. Kafka setup
const kafka = new Kafka({
  clientId: 'hostelmate-consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'complaint-group' });

// 3. Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'unakuloruvan7@gmail.com',
    pass: 'ipjb lgiq kzur vijc', // App password (not actual Gmail password)
  },
});

// 4. Email sending function
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: '"Hostel Mate" <unakuloruvan7@gmail.com>',
      to,
      subject,
      text,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}`, error);
  }
};

// 5. Main consumer runner
const run = async () => {
  await connectToMongoDB(); // Ensure MongoDB is connected first

  await consumer.connect();
  await consumer.subscribe({ topic: 'complaint_created', fromBeginning: false });

  console.log('✅ Kafka consumer listening for new complaints...');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const complaint = JSON.parse(message.value.toString());
        const category = complaint.category?.toLowerCase();

        if (!category) {
          console.warn('⚠️ No category found in complaint');
          return;
        }

        console.log(`Category being searched: ${category}`);

        const workers = await Worker.find({
          field: { $regex: new RegExp(category, 'i') },
        }).select('email');

        const recipients = workers.map(worker => worker.email);

        if (recipients.length === 0) {
          console.warn(`⚠️ No workers found for category: ${category}`);
          return;
        }

        const subject = `New ${category} complaint in Hostel Mate`;
        const text = `
          New complaint submitted:

          Location: ${complaint.location}
          Priority: ${complaint.priority}
          Description: ${complaint.description}
          Submitted by: ${complaint.student?.name} (${complaint.student?.email})

          Please address it promptly.
        `;

        for (const email of recipients) {
          await sendEmail(email, subject, text);
        }
      } catch (err) {
        console.error('❌ Error processing Kafka message:', err);
      }
    },
  });
};

run().catch(err => {
  console.error('❌ Error in Kafka consumer:', err);
});
