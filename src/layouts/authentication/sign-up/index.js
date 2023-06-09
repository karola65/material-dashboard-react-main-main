/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link } from "react-router-dom";
import React, { useState } from 'react';
import { Select, MenuItem, Typography } from '@material-ui/core';
// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/london.jpeg";
import qrcode from "assets/images/QR.png";
import { useEffect } from "react";

const LocationComponent = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  return (
    <div>
      {userLocation ? (
        <div>

<br/><br/>
          Your location:
          <br/><br/>
          Latitude: {userLocation.latitude}<br/>
          Longitude: {userLocation.longitude}
        </div>
      ) : (
        <button onClick={() => getLocation()}>Get Location</button>
      )}
    </div>
  );
};


const DropdownMenu1 = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Select value={selectedOption} onChange={handleOptionChange}>
      <MenuItem value="option1">Smoke</MenuItem>
      <MenuItem value="option2">Open Fire</MenuItem>
      <MenuItem value="option3">Dangerous Activities that may cause forest fire</MenuItem>
    </Select>
  );
};

const DropdownMenu2 = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Select value={selectedOption} onChange={handleOptionChange}>
      <MenuItem value="option1">Grid</MenuItem>
      <MenuItem value="option2">Solar</MenuItem>
      <MenuItem value="option3">Mix</MenuItem>
    </Select>
  );
};

const DropdownMenu3 = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Select value={selectedOption} onChange={handleOptionChange}>
      <MenuItem value="option1">1</MenuItem>
      <MenuItem value="option2">1-3</MenuItem>
      <MenuItem value="option3">More than 3</MenuItem>
    </Select>
  );
};

function Cover() {
  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign up for our pilot
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Follow the QR code
          </MDTypography>
          <img src={qrcode} alt="QR code" width="200" height="200" />
  
         
        </MDBox>
       
      </Card>
    </CoverLayout>
  );
}

export default Cover;
