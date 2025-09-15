const Client = require("../models/Client");

exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, address, companyName } = req.body;

    const client = new Client({
      user: req.user._id,
      name,
      email,
      phone,
      address,
      companyName,
    });

    await client.save();
    res.status(201).json({ message: "Client created successfully", client });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res
        .status(400)
        .json({ message: `A client with this ${field} already exists.` });
    }

    res
      .status(500)
      .json({ message: "Error creating client", error: error.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ user: req.user._id });
    res.json(clients);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching clients", error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client updated successfully", client });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating client", error: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting client", error: error.message });
  }
};
