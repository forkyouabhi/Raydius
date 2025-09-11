import axios from 'axios';

// IMPORTANT: Replace with your computer's local network IP address.
// On Windows, run `ipconfig` in Command Prompt. Find the "IPv4 Address".
// On Mac, run `ifconfig` in Terminal. Find the "inet" address under "en0".
const API_BASE_URL = 'http://localhost:4000'; // <--- REPLACE THIS

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;