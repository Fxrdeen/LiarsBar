#!/bin/bash

# Server URL
SERVER_URL="https://liarsbar-x8ta.onrender.com"

# Function to ping the server
ping_server() {
  while true; do
    echo "Pinging $SERVER_URL at $(date)"
    curl -s -o /dev/null -w "%{http_code}" $SERVER_URL
    echo " - Ping complete."
    # Wait for 10 minutes (600 seconds)
    sleep 600
  done
}

# Start the pinging function
ping_server
