const express = require("express");
const { nanoid } = require("nanoid");

const app = express();
const port = 8080;

app.use(express.json());

const tours = require("./data"); // data.js

// GET ALL TOURS
app.get("/api/tours", (req, res) => {
  try {
    res.status(200).json({
      data: tours,
      message: "Tours retrieved successfully",
      status: "success",
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
});

// GET SINGLE TOUR BY ID
app.get("/api/tours/:id", (req, res) => {
  try {
    const { id } = req.params;
    const tour = tours.find((t) => t.id === id);

    if (!tour) {
      return res.status(404).json({
        data: null,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      data: tour,
      message: "Tour retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
});

// DELETE TOUR BY ID
app.delete("/api/tours/:id", (req, res) => {
  try {
    const { id } = req.params;
    const idx = tours.findIndex((t) => t.id === id);

    if (idx === -1) {
      return res.status(404).json({
        message: "Tour not found",
      });
    }

    const deletedTour = tours.splice(idx, 1);

    res.status(200).json({
      message: "Tour deleted successfully",
      deletedTour: deletedTour[0],
      updatedTours: tours,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
});

// CREATE NEW TOUR
app.post("/api/tours", (req, res) => {
  try {
    const {
      title,
      destination,
      price,
      discountPrice,
      description,
      startDate,
      endDate,
      duration,
      capacity,
    } = req.body;

    if (
      !title ||
      !destination ||
      price == null ||
      discountPrice == null ||
      !description ||
      !startDate ||
      !endDate ||
      duration == null ||
      capacity == null
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newTour = {
      id: nanoid(8),
      ...req.body,
    };

    tours.push(newTour);

    res.status(201).json({
      message: "Tour created successfully",
      tour: newTour,
      updatedTours: tours,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
});

// UPDATE TOUR BY ID (FULL)
app.put("/api/tours/:id", (req, res) => {
  try {
    const { id } = req.params;

    const idx = tours.findIndex((t) => t.id === id);
    if (idx === -1) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const {
      title,
      destination,
      price,
      discountPrice,
      description,
      startDate,
      endDate,
      duration,
      capacity,
    } = req.body;

    if (
      !title ||
      !destination ||
      price == null ||
      discountPrice == null ||
      !description ||
      !startDate ||
      !endDate ||
      duration == null ||
      capacity == null
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    tours[idx] = { id, ...req.body };

    res.status(200).json({
      message: "Tour updated successfully",
      tour: tours[idx],
      updatedTours: tours,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
});

// PATCH TOUR BY ID (PARTIAL)
app.patch("/api/tours/:id", (req, res) => {
  try {
    const { id } = req.params;

    const idx = tours.findIndex((t) => t.id === id);
    if (idx === -1) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // movzud tur + gelen field-ler
    tours[idx] = { ...tours[idx], ...req.body, id };

    res.status(200).json({
      message: "Tour updated successfully",
      tour: tours[idx],
      updatedTours: tours,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      status: "error",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running: http://localhost:${port}`);
});