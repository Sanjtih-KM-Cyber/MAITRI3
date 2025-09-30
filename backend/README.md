# MAITRI Backend Server

This is the local, offline-first backend server for the MAITRI application. It acts as an AI proxy to a local Ollama instance and handles data persistence simulations by saving files locally.

## Prerequisites

- Node.js (v18 or later recommended)
- A running instance of [Ollama](https://ollama.ai/) with the `gemma:2b` model pulled (`ollama pull gemma:2b`).

## Installation

Navigate to the `backend` directory and install the required dependencies:

```bash
npm install
```

## Running the Server

To run the server in development mode with automatic reloading, use:

```bash
npm run dev
```

The server will start on `http://localhost:3001`.

## API Endpoints

### 1. AI Chat (Streaming)

- **Endpoint**: `POST /api/chat`
- **Description**: Proxies a chat request to the local Ollama server and streams the response back to the client. This enables the real-time "typing" effect in the UI.
- **Request Body**:
  ```json
  {
    "messages": [
      { "role": "system", "content": "You are a helpful AI." },
      { "role": "user", "content": "Why is the sky blue?" }
    ]
  }
  ```
- **Response**: A streamed JSON response from the Ollama API.

### 2. Data Uplink

- **Endpoint**: `POST /api/uplink`
- **Description**: Simulates sending a data packet to a base station. The server receives a JSON payload and saves it as a timestamped `.json` file in the `/uplink_data` directory.
- **Request Body**: Any valid JSON object.
- **Response**:
  ```json
  { "message": "Uplink successful. Data saved to [filename]" }
  ```

### 3. Base Station Sync

- **Endpoint**: `GET /api/sync`
- **Description**: Simulates receiving a data packet (like a new mission plan) from a base station. It reads and returns the contents of the `mission_update_packet.json` file.
- **Response**: The JSON content of `mission_update_packet.json`.
