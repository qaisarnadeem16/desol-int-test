import Cars from "../models/carModel.js";

const carFormController = async (req, res) => {
  const { formData, userId,pictures } = req.body;
  try {

    let carForm = await Cars.findOne({ userId });

    if (!carForm) {
      carForm = new Cars({
        userId: userId,
        carModel: formData.carModel,
        price: formData.price,
        phoneNumber: formData.phoneNumber,
        maxPictures: formData.maxPictures,
        pictures: pictures
      });

      const savedCarForm = await carForm.save();
      return res.status(201).json(savedCarForm);
    } else {
      // Update existing car form
      carForm.carModel = formData.carModel;
      carForm.price = formData.price;
      carForm.phoneNumber = formData.phoneNumber;
      carForm.maxPictures = formData.maxPictures;
      carForm.pictures = pictures;

      // Save the updated car form
      const updatedCarForm = await carForm.save();
      return res.status(200).json(updatedCarForm);
    }
  } catch (error) {
    console.error('Error saving car form:', error);
    res.status(500).json({ error: 'Failed to save car form' });
  }
};

export default carFormController;
