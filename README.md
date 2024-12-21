# Bootcamp Management Platform

## Overview
This is a bootcamp management platform that allows users to explore bootcamps, view detailed information about courses, and read/write reviews. It provides features for bootcamp owners to manage their bootcamps and associated data.

## Features
- **Bootcamp Management**:
  - Create and manage bootcamp details.
  - Add geographic data for location-based searches.
  - Features like housing, job assistance, and GI Bill acceptance.

- **Course Management**:
  - Associate courses with bootcamps.
  - Manage course details (title, description, duration, tuition, etc.).
  - Automatic calculation of average tuition costs.

- **Review System**:
  - Leave ratings and reviews for bootcamps.
  - View reviews to evaluate bootcamps.

- **User Associations**:
  - Bootcamps, courses, and reviews are linked to users for accountability.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
- **Geocoding**: Node Geocoder for location-based features
- **Validation**: Custom validation for URLs, emails, and other fields.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bootcamp-management-platform.git
   cd bootcamp-management-platform
