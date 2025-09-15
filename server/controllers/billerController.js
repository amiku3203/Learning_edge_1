const Biller = require("../models/BIller");

 
exports.createBiller = async (req, res) => {
  try {
    const { companyName, email, phone, address, gstNumber } = req.body;

    const biller = new Biller({
      user: req.user._id,
      companyName,
      email,
      phone,
      address,
      gstNumber,
    });

    await biller.save();
    res.status(201).json({ message: "Biller created successfully", biller });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res
        .status(400)
        .json({ message: `A biller with this ${field} already exists.` });
    }
    res
      .status(500)
      .json({ message: "Error creating biller", error: error.message });
  }
};
 
exports.getBillers = async (req, res) => {
  try {
    const billers = await Biller.find({ user: req.user._id });
    res.json(billers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching billers", error: error.message });
  }
};

 
exports.getBillerById = async (req, res) => {
  try {
    const biller = await Biller.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!biller) return res.status(404).json({ message: "Biller not found" });
    res.json(biller);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching biller", error: error.message });
  }
};

 
exports.updateBiller = async (req, res) => {
  try {
    const { companyName, email, phone, address, gstNumber } = req.body;

    const biller = await Biller.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { companyName, email, phone, address, gstNumber },
      { new: true, runValidators: true }
    );

    if (!biller) return res.status(404).json({ message: "Biller not found" });

    res.json({ message: "Biller updated successfully", biller });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res
        .status(400)
        .json({ message: `A biller with this ${field} already exists.` });
    }
    res
      .status(500)
      .json({ message: "Error updating biller", error: error.message });
  }
};

exports.deleteBiller = async (req, res) => {
  try {
    const biller = await Biller.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!biller) return res.status(404).json({ message: "Biller not found" });
    res.json({ message: "Biller deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting biller", error: error.message });
  }
};
