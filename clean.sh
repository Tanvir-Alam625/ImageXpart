#!/bin/bash

# Clean Yarn cache
yarn cache clean

# Remove node_modules and .next directories
rm -rf node_modules .next

