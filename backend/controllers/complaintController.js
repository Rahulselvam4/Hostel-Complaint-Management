import Complaint from "../models/Complaint.js";
import { publishComplaintEvent } from "../kafka/producer.js";
import cloudinary from "../utils/cloudinary.js";

// const setPriority = (category, description) => {
//   const desc = description.toLowerCase();

//   // Keywords for Emergency
//   const emergencyKeywords = [
//     "fire", "short circuit", "burst", "electric shock",
//     "gas leak", "flood", "broken glass", "sparking", "electrocution", "smoke", "explosion"
//   ];

//   // Keywords for High Priority
//   const highKeywords = [
//     "no power", "power cut", "leak", "water overflow", "choking", "sewage", 
//     "broken pipe", "clogged drain", "water issue", "no water", "mosquito breeding", 
//     "fan not working", "light not working", "flickering light"
//   ];

//   // Keywords for Medium Priority
//   const mediumKeywords = [
//     "urgent", "asap", "immediately", "soon", "emergency", 
//     "critical", "priority", "important", "quick"
//   ];

//   // Match Emergency
//   if (emergencyKeywords.some(word => desc.includes(word))) {
//     return "Emergency";
//   }

//   // Match High Priority
//   if (
//     (category === "Electrical" && highKeywords.some(word => desc.includes(word))) ||
//     (category === "Plumbing" && highKeywords.some(word => desc.includes(word))) ||
//     (category === "Cleaning" && highKeywords.some(word => desc.includes(word)))
//   ) {
//     return "High";
//   }

//   // Match Medium Priority
//   if (mediumKeywords.some(word => desc.includes(word))) {
//     return "Medium";
//   }

//   // Default to Low
//   return "Low";
// };


import axios from "axios";

const predictPriority = async (description) => {
  try {
    const response = await axios.post("http://localhost:5001/predict", {
      description,
    });
    return response.data.priority;
  } catch (error) {
    console.error("Prediction API failed:", error.message);
    return "Low"; // Fallback
  }
};



export const createComplaint = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { issueCategory, location, description } = req.body;
    const priority = await predictPriority(description);
    let photoUrl = null;

    // If file is present, upload to Cloudinary
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "hostel-complaints",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer); // Send buffer to Cloudinary
      });

      photoUrl = uploadResult.secure_url;
    }

    // Create complaint (with or without photoUrl)
    const complaint = await Complaint.create({
      student: studentId,
      issueCategory,
      location,
      description,
      priority,
      photo: photoUrl,
    });

    // Kafka Event Publish
    await publishComplaintEvent("complaint_created", {
      complaintId: complaint._id,
      category: issueCategory,
      description,
      location,
      priority,
      photo: photoUrl,
      student: {
        id: req.user._id,
        name: req.user.name,
        room: req.user.room,
        email: req.user.email,
      },
      createdAt: complaint.createdAt,
    });

    res.status(201).json({ message: "Complaint submitted successfully", complaint });

  } catch (error) {
    console.error("Complaint creation failed:", error);
    res.status(500).json({ message: "Error submitting complaint", error: error.message });
  }
};



export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .sort({ createdAt: -1 })
      .populate('student', 'name email')
      .populate('worker', 'name field');

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending complaints', error: error.message });
  }
};

export const getPendingComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: 'Pending' })
      .sort({ createdAt: 1 })
      .populate('student', 'name email')
      .populate('worker', 'name field');

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending complaints', error: error.message });
  }
};

export const getResolvedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: 'Resolved' })
      .sort({ resolvedAt: -1 })
      .populate('student', 'name email')
      .populate('worker', 'name field');

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resolved complaints', error: error.message });
  }
};

export const getStalePendingComplaints = async (req, res) => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const complaints = await Complaint.find({
      status: 'Pending',
      createdAt: { $lt: threeDaysAgo }
    })
      .sort({ createdAt: 1 })
      .populate('student', 'name email')
      .populate('worker', 'name field');

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stale pending complaints', error: error.message });
  }
};



export const getComplaintsByStudent = async (req, res) => {
  try {
    const studentId = req.user._id;

    const complaints = await Complaint.find({
      student: studentId,
    })
    .sort({ createdAt: -1 })
    .populate('worker', 'name field');

    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending complaints', error: error.message });
  }
};


export const addComplaintFeedback = async (req, res) => {
  const studentId = req.user._id;
  const { complaintId } = req.params;
  const { rating, comment } = req.body;

  try {
    const complaint = await Complaint.findOne({
      _id: complaintId,
      student: studentId,
      status: 'Resolved' 
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found or not resolved yet' });
    }

    complaint.feedback = { rating, comment };
    await complaint.save();

    res.status(200).json({ message: 'Feedback submitted successfully', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
};

  

  export const getWorkerComplaints = async (req, res) => {
    try {
      const workerField = req.user.field;
  
      const complaints = await Complaint.find({
        issueCategory: workerField,
        status:'Pending'
      })
      .sort({ createdAt: 1 })
      .populate('student', 'name email');
  
      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching worker complaints', error: error.message });
    }
  };
  

  
export const updateComplaintStatusByWorker = async (req, res) => {
  try {
    const workerId = req.user._id; // coming from the JWT token
    const { id } = req.params; // complaint ID
    console.log(workerId);
    console.log(id);
    
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // // Only update if the complaint is still pending
    // if (complaint.status === 'Resolved') {
    //   return res.status(200).json({ message: 'Complaint already resolved' });
    // }

    // Update complaint
    complaint.status = 'Resolved';
    complaint.worker = workerId;
    complaint.resolvedAt = new Date();

    await complaint.save();

    res.status(200).json({
      message: 'Complaint marked as resolved',
      complaint,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint', error: error.message });
  }
};



export const adminUpdateComplaintStatus = async (req, res) => {
  const { complaintId } = req.params;

  try {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = 'Resolved';
    complaint.resolvedAt = new Date();

    await complaint.save();

    res.status(200).json({ message: 'Complaint marked as resolved by admin', complaint });
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint status', error: error.message });
  }
};
