import Announcement from "../models/Announcement.js";

export const addAnnouncement = async (req, res) => {
  const { announcement } = req.body;

  try {
    const addannounce = await Announcement.create({ announcement });
    res.status(201).json({ message: 'Added successfully', addannounce });
  } catch (error) {
    res.status(500).json({ message: 'Error:Announcement', error: error.message });
  }
};


export const getAnnouncement = async (req, res) => {
  try {
    const announce = await Announcement.find().sort({ createdAt: 1 }); 
    res.status(200).json(announce);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announce', error: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  const announcementId = req.params.id;

  try {
    const deleted = await Announcement.findByIdAndDelete(announcementId);

    res.status(200).json({ message: 'Annoucement deleted successfully' ,deleted});
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Announcement', error: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
    const announcementId = req.params.id;
    const announce = req.body.announcement;

    try {
        const update = await Announcement.findByIdAndUpdate(
            announcementId,
            { $set: {announcement:announce} }
        );

        res.status(200).json({ message: 'Annoucement Updated successfully' ,update});
    } catch (error) {
        res.status(500).json({ message: 'Error Updating Announcement', error: error.message });
    }
};
