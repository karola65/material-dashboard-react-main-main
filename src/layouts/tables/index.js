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

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import Chart from 'chart.js/auto';


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import axios from 'axios';
// Data
import React, { useEffect, useState } from 'react';
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function Tables() {
  const [carbonIntensityData, setCarbonIntensityData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://api.carbonintensity.org.uk/intensity/date'
      );

      const data = response.data.data;

      if (Array.isArray(data)) {
        const cleanedData = data.map(item => ({
          from: item.from,
          intensity: item.intensity.forecast|| 0,
        }));

        setCarbonIntensityData(cleanedData);
        createBarChart(cleanedData);
      } else {
        console.error('Error: Invalid carbon intensity data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const createBarChart = (data) => {
    const chartData = {
      labels: data.map((item) => {
        const time = new Date(item.from);
        const hours = time.getHours();
        const minutes = time.getMinutes();
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
      }),
      datasets: [
        {
          label: 'Carbon Intensity',
          data: data.map((item) => item.intensity),
          backgroundColor: data.map((item) => {
            const time = new Date(item.from);
            const hours = time.getHours();
            const intensity = item.intensity;
  
            if (
              (hours >= 6 && hours < 18 && intensity === Math.min(...data.map((item) => item.intensity))) || // Green for lowest intensity between 6 AM and 6 PM
              (hours >= 18 || hours < 6) && intensity === Math.max(...data.map((item) => item.intensity)) // Red for highest intensity between 6 PM and 6 AM
            ) {
              return 'rgba(0, 255, 0, 0.8)'; // Green
            } else if (
              (hours >= 6 && hours < 18 && intensity === Math.max(...data.map((item) => item.intensity))) || // Red for highest intensity between 6 AM and 6 PM
              (hours >= 18 || hours < 6) && intensity === Math.min(...data.map((item) => item.intensity)) // Green for lowest intensity between 6 PM and 6 AM
            ) {
              return 'rgba(255, 0, 0, 0.8)'; // Red
            } else {
              return 'rgba(75, 192, 192, 0.8)'; // Default color
            }
          }),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  
    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Intensity',
          },
        },
      },
      plugins: {
        legend: {
          display: false, // Hide the legend
        },
      },
      layout: {
        padding: {
          left: 50,
          right: 50,
          top: 0,
          bottom: 0,
        },
      },
    };
  
    const ctx = document.getElementById('carbonIntensityChart');
    new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });
  };
  
  
  
  
  
  
  
  

  return (
    <div>
      Carbon intensity for tomorrow
      <canvas id="carbonIntensityChart" width="400" height="200"></canvas>
    
    </div>
      
     );
}

export default Tables;