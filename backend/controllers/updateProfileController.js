// controllers/studentController.js
import Student from "../models/Student.js";
import Worker from "../models/Worker.js";
import cloudinary from "../utils/cloudinary.js";

export const updateStudentProfile = async (req, res) => {
  const studentId = req.params.id;
  const { name, email, mobile, hostelBlock, roomNumber } = req.body;

  try {
    let photoUrl;

    // If image is uploaded, upload it to Cloudinary
    if (req.file) {
      console.log('New student photo detected, uploading to Cloudinary...');
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "student-profiles",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      photoUrl = uploadResult.secure_url;
      console.log('Student photo uploaded:', photoUrl);
    }

    const updatedFields = {
      name,
      email,
      mobile,
      hostelBlock,
      roomNumber,
    };

    if (photoUrl) {
      updatedFields.photo = photoUrl;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("Student profile update error:", error);
    res.status(500).json({
      message: "Error updating student profile",
      error: error.message,
    });
  }
};

// controllers/workerController.js

export const updateWorkerProfile = async (req, res) => {
  const workerId = req.params.id;

  const { name, email, mobile, employeeNumber, field } = req.body;

  try {
    let photoUrl;

    // If new photo is uploaded via req.file, upload to Cloudinary
    if (req.file) {
      console.log('New photo detected, uploading to Cloudinary...');
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "worker-profiles",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      photoUrl = uploadResult.secure_url;
      console.log('Photo uploaded successfully:', photoUrl);
    }

    const updatedFields = {
      name,
      email,
      mobile,
      employeeNumber,
      field,
    };

    if (photoUrl) {
      updatedFields.photo = photoUrl;
    }

    const updatedWorker = await Worker.findByIdAndUpdate(
      workerId,
      { $set: updatedFields },
      { new: true }
    );

    if (!updatedWorker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      worker: updatedWorker,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};
