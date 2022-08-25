#!/bin/bash

cd "$(git rev-parse --show-toplevel)" && cd "backend" || (
  echo "Couldn't find project folder. Please check your working dir."
  exit 1
)

python -m ensysmod
