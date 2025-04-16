import Contact from '../Models/contact-model.js';

export const createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const newContact = new Contact({ firstName, lastName, email, message });
    await newContact.save();

    res.status(201).json({ success: true, message: 'Contact message received successfully.' });
  } catch (error) {
    console.error('Create Contact Error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit contact message.' });
  }
};
