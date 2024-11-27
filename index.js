const express = require("express");
const axios = require("axios");

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Constants
const API_KEY = "fblvEw8nfIVCRehFXzSoBBN2Y_lrzMZFDMhQHSJZeY8"; // Unsplash API Key
const PORT = 4000; // Server port
const ENDPOINT = `http://localhost:${PORT}`; // Server endpoint

/**
 * Route: GET /images/random
 * Description: Fetch a random image from the Unsplash API.
 */

// path for get rendom image
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/photos/random?client_id=${API_KEY}`
    );

    const { id, urls, created_at, updated_at, color } = response.data;

    res.json({
      status: true,
      id,
      urls,
      created_at,
      updated_at,
      color,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch random image",
      error: error.message,
    });
  }
});

/**
 * Route: GET /images
 * Description: Fetch paginated or default images from the Unsplash API.
 */
app.get("/images", async (req, res) => {
  try {
    const { page = 1, per_page = 20 } = req.query; // Default values if not provided

    const response = await axios.get(
      `https://api.unsplash.com/photos/?page=${page}&per_page=${per_page}&client_id=${API_KEY}`
    );

    res.json({
      status: true,
      total_results: response.headers["x-total"], // Total images available
      images: response.data, // List of images
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to fetch images",
      error: error.message,
    });
  }
});

/**
 * Route: POST /images/search
 * Description: Search for images by query using the Unsplash API.
 */
app.post("/images/search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        status: false,
        message: "Query parameter is required",
      });
    }

    const response = await axios.get(
      `https://api.unsplash.com/search/collections?query=${query}&client_id=${API_KEY}`
    );

    res.json({
      status: true,
      total: response.data.total,
      total_pages: response.data.total_pages,
      images: response.data.results,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Failed to search images",
      error: error.message,
    });
  }
});

/**
 * Catch-All Route: Handles undefined endpoints.
 */
app.use("*", (req, res) => {
  res.status(404).json({
    status: false,
    message: "Page not found",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${ENDPOINT}`);
});
