#!/bin/bash

docker run -d \
  --env-file .env \
  -v $(pwd)/config.json:/app/config.json:ro \
  -v $(pwd)/insult.json:/app/insult.json:ro \
  -v $(pwd)/database.sqlite3:/app/database.sqlite3 \
  --restart unless-stopped \
  --name dr-k-bot \
  dr-k-bot