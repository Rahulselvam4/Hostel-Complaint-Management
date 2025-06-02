// controllers/workerController.js
import Worker from "../models/Worker.js";
import cloudinary from "../utils/cloudinary.js";

export const addWorker = async (req, res) => {
    // Debug logging
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Content-Type:', req.get('Content-Type'));

    // Check if req.body exists
    if (!req.body) {
        return res.status(400).json({
            message: 'Request body is missing. Make sure multer middleware is properly configured.',
            debug: {
                headers: req.headers,
                contentType: req.get('Content-Type')
            }
        });
    }

    const { name, email, password, mobile, employeeNumber, field } = req.body;

    // Check individual fields
    console.log('Extracted fields:', { name, email, password, mobile, employeeNumber, field });

    try {
        let photoUrl = null;

        // If file is present, upload to Cloudinary
        if (req.file) {
            console.log('File detected, uploading to Cloudinary...');
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

        // Create new worker with photo URL
        const newWorker = new Worker({
            name,
            email,
            password,
            mobile,
            employeeNumber,
            field,
            photo: photoUrl
        });

        const savedWorker = await newWorker.save();

        res.status(201).json({
            message: 'Worker added successfully',
            worker: savedWorker
        });

    } catch (error) {
        console.error('Error in addWorker:', error);
        res.status(500).json({
            message: 'Error adding worker',
            error: error.message
        });
    }
};


export const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().select('-password').sort({ createdAt: 1 }); 
    res.status(200).json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workers', error: error.message });
  }
};

export const deleteWorker = async (req, res) => {
  const workerId = req.params.id;

  try {
    const deleted = await Worker.findByIdAndDelete(workerId);
    if (!deleted) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.status(200).json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting worker', error: error.message });
  }
};
