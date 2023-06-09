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
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import pdfFile from "assets/images/flyer_waldbrand.pdf";
import pdfEnglish from "assets/images/fire-safety-english.pdf";
import {saveAs} from "file-saver";
import bgImage from "assets/images/forest-fire.jpeg";
import Chart from 'chart.js/auto';



// Data

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


//ReactDOM.render(<App />, document.getElementById('root'));

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
              (hours >= 18 || hours < 6) && intensity === Math.min(...data.map((item) => item.intensity)) // Red for highest intensity between 6 PM and 6 AM
            ) {
              return 'rgba(0, 255, 0, 0.8)'; // Green
            } 
            if (
              (hours >= 6 && hours < 18 && intensity === Math.max(...data.map((item) => item.intensity))) || // Red for highest intensity between 6 AM and 6 PM
              (hours >= 18 || hours < 6) && intensity === Math.max(...data.map((item) => item.intensity)) // Green for lowest intensity between 6 PM and 6 AM
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
     
      <canvas id="carbonIntensityChart" width="400" height="200"></canvas>
    
    </div>
      
     );
}

function Load(){

  const LoadShapeForm = ({ updateGraph }) => {
    const [userInput, setUserInput] = useState('');
  
    const handleInputChange = (event) => {
      setUserInput(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      // Assuming you have a function updateGraph that accepts the user input and updates the graph accordingly
      updateGraph(userInput);
      setUserInput('');
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          User Input:
          <input type="text" value={userInput} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  };
}




function Notifications() {
  const [chartData, setChartData] = useState([]);
  const [userDemand, setUserDemand] = useState('');
  const [increaseDemand, setIncreaseDemand] = useState('');
  const [decreaseDemand, setDecreaseDemand] = useState('');
  const [carbonIntensitySum, setCarbonIntensitySum] = useState(0);
  const [carbonIntensitySum2, setCarbonIntensitySum2] = useState(0);
  const [a, setA] = useState(0);
  const [adjustedChartData, setAdjustedChartData] = useState([]);
  const [previousUserDemand, setPreviousUserDemand] = useState('');
  const [demandChange, setDemandChange] = useState('');

  
  useEffect(() => {
    fetchChartData();

    setCarbonIntensitySum(0);
    
    
  }, []);

  useEffect(() => {
  calculateCarbonIntensitySum();
  calculateCarbonIntensitySum2();
  

 
}, [chartData]);


  const handleIncreaseDemandChange = (event) => {
    setPreviousUserDemand(0);
    setPreviousUserDemand(calculateCarbonIntensitySum());
    const sumD = chartData.reduce((total, item) => {
      return total + (item.intensity * item.demand);
    }, 0);
    setPreviousUserDemand(parseInt(sumD));
    const userInput =event.target.value ? parseInt(event.target.value) : 0;
    const sum = chartData.reduce((total, item) => total + item.demand, 0);
    const increaseMultiplier = sum !== 0 ? (sum + (userInput * 3)) / sum : 0;

    
  
    const updatedChartData = chartData.map((item) => {
      const updatedDemand =  (item.demand/sum * (userInput *3 ));
    return { ...item, demand: updatedDemand };
    });
  
    setChartData(updatedChartData);
    setIncreaseDemand(userInput.toString());
    //setDecreaseDemand('');
  
    calculateCarbonIntensitySum();
  };

  
  const handleDecreaseDemandChange = (event) => {
    
    const userInput =event.target.value ? parseInt(event.target.value) : 0;
    const sum = chartData.reduce((total, item) => total + item.demand, 0);
    const sumD = chartData.reduce((total, item) => {
      return total + (item.intensity * item.demand);
    }, 0);
    setPreviousUserDemand(parseInt(sumD));
    const decreaseMultiplier = sum !== 0 ? (sum - (userInput * 3)) / sum : 0;
    const solarGenerationData = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.009, 0.0, 0.009, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.122, 0.431, 1.247, 2.156, 3.038, 3.993, 4.885, 5.409, 5.71, 5.391, 4.827, 4.275, 3.366, 2.428, 1.425, 0.459, 0.131, 0.009, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.01, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.009, 0.0, 0.0, 0.0, 0.0, 0.132, 0.402, 1.088, 1.688, 2.615, 3.705, 4.958, 5.521, 5.879, 5.615, 4.913, 4.435, 3.496, 2.569, 1.519, 0.524, 0.104, 0.0, 0.0, 0.0, 0.0, 0.0, 0.01, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.009, 0.009, 0.131, 0.451, 1.171, 2.129, 3.562, 2.971, 3.104, 3.496, 4.651, 4.537, 3.572, 3.028, 2.793, 1.82, 1.218, 0.657, 0.122, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.009, 0.0, 0.0, 0.0, 0.009, 0.0];
    const sumSolar = solarGenerationData.reduce((partialSum, a) => partialSum + a, 0);
  
    const updatedChartData = chartData.map((item, index) => {
      const updatedDemand = item.demand - (((solarGenerationData[index])/sumSolar) * (userInput*3));
      return { ...item, demand: Math.max(updatedDemand, 0) };
    });
  
    
    setChartData(updatedChartData);
    //setIncreaseDemand('');
    setDecreaseDemand(userInput.toString());
   
    setA(parseInt(carbonIntensitySum));
   
  };
  

  
  const fetchChartData = async () => {
    try {
      const carbonIntensityData = await fetchCarbonIntensityData();
      const demandData = [9.787, 9.337, 9.601, 9.674, 9.488, 9.187, 9.309, 8.925, 8.897, 9.3, 9.975, 9.262, 8.7, 9.263, 9.675, 10.95, 11.165, 11.672, 10.669, 9.946, 10.369, 10.126, 9.617, 8.261, 8.108, 8.373, 8.091, 9.064, 9.899, 9.667, 8.578, 9.337, 11.184, 13.819, 13.087, 13.922, 14.1, 14.512, 12.938, 13.125, 14.25, 13.799, 14.175, 12.413, 11.963, 11.887, 11.738, 10.913, 10.836, 10.425, 9.836, 10.875, 10.725, 10.874, 10.238, 10.65, 10.35, 10.912, 11.776, 10.688, 10.283, 10.088, 10.462, 10.575, 10.491, 12.095, 11.389, 13.351, 13.8, 14.278, 13.343, 12.233, 12.083, 10.867, 10.864, 10.727, 10.585, 10.095, 10.707, 9.206, 9.712, 11.345, 11.427, 11.963, 13.2, 12.788, 11.962, 12.685, 13.05, 12.3, 12.188, 12.824, 13.013, 11.55, 11.55, 10.838, 10.125, 9.825, 9.225, 8.775, 9.0, 8.924, 9.038, 8.963, 9.037, 9.563, 10.125, 9.6, 8.962, 8.963, 9.375, 9.422, 10.208, 10.819, 9.563, 9.759, 9.217, 9.862, 10.657, 9.292, 9.758, 9.114, 9.711, 10.172, 11.241, 11.043, 10.557, 12.356, 11.944, 12.872, 14.429, 14.746, 13.313, 13.612, 13.575, 13.688, 13.088, 13.312, 12.983, 11.363, 11.887, 10.389, 10.396, 10.087]
      const solarGenerationData = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.009, 0.0, 0.009, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.122, 0.431, 1.247, 2.156, 3.038, 3.993, 4.885, 5.409, 5.71, 5.391, 4.827, 4.275, 3.366, 2.428, 1.425, 0.459, 0.131, 0.009, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.01, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.009, 0.0, 0.0, 0.0, 0.0, 0.132, 0.402, 1.088, 1.688, 2.615, 3.705, 4.958, 5.521, 5.879, 5.615, 4.913, 4.435, 3.496, 2.569, 1.519, 0.524, 0.104, 0.0, 0.0, 0.0, 0.0, 0.0, 0.01, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.009, 0.009, 0.131, 0.451, 1.171, 2.129, 3.562, 2.971, 3.104, 3.496, 4.651, 4.537, 3.572, 3.028, 2.793, 1.82, 1.218, 0.657, 0.122, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.009, 0.0, 0.0, 0.0, 0.009, 0.0];
      setPreviousUserDemand(parseInt(0));
      setCarbonIntensitySum(0);


      const chartData = carbonIntensityData.map((item, index) => ({
        time: item.time,
        intensity: item.intensity,
        demand: demandData[index],
        //solarGeneration: solarGenerationData[index],
      }));

      setChartData(chartData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const calculateCarbonIntensitySum = () => {
    const sum = chartData.reduce((total, item) => {
      return total + (item.intensity * item.demand);
    }, 0);
    setCarbonIntensitySum(parseInt(sum));
    
  };
  
  const calculateCarbonIntensitySum2 = () => {
    const sum = chartData.reduce((total, item) => {
      return total + (item.intensity * item.demand);
    }, 0);
    setCarbonIntensitySum2(parseInt(sum));
  };

  const isFormFilled = () => {
    return increaseDemand !== '' && decreaseDemand !== '';
  };

  const fetchCarbonIntensityData = async () => {
    try {
      const response = await axios.get(
        'https://api.carbonintensity.org.uk/regional/intensity/2023-01-19T23:30Z/2023-01-22T23:00Z/regionid/15'
      );

      const data = response.data.data.data;

      if (Array.isArray(data)) {
        const cleanedData = data.map((item) => ({
          time: new Date(item.from).toLocaleTimeString('en-GB'),
          intensity: item.intensity.forecast || 0,
        }));

        return cleanedData;
      } else {
        console.error('Error: Invalid carbon intensity data');
        return [];
      }
    } catch (error) {
      console.error('Error fetching carbon intensity data:', error);
      return [];
    }
  };


 
 
  return (
    <DashboardLayout>
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <MDBox p={2} lineHeight={0}>
            <MDBox p={2} textAlign="left">
              <MDTypography variant="h3">Your hourly carbon</MDTypography>
            </MDBox>
            </MDBox>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <ResponsiveContainer width="95%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" label={{ value: 'Intensity (grams)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Demand (kWh)', angle: -90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="intensity" name="Carbon Intensity" stroke="red" yAxisId="left" />
                  <Line type="monotone" dataKey="demand" name="Demand" stroke="blue" yAxisId="right" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            
            <MDBox p={2} textAlign="left">
              <MDTypography variant="h3">Personalise</MDTypography>
              <form  onSubmit={handleIncreaseDemandChange}>
                <MDBox mt={2} mb={1}>
                  <label>
                   Your daily demand:
                    <input type="number" value={increaseDemand} onChange={handleIncreaseDemandChange} /> kWh
                  </label>
                 
                </MDBox>
               
                <MDBox mt={1} mb={2}>
                  <label>
                    Your daily solar generation:
                    <input type="number" value={decreaseDemand} onChange={handleDecreaseDemandChange} /> kWh
                  </label>
                </MDBox>

               
              </form>


              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <MDBox p={2} textAlign="center">
                    <MDTypography variant="h5">Total Hourly Carbon</MDTypography>
                    {isFormFilled() && (
                    <MDTypography variant="h3">{previousUserDemand}</MDTypography>)}
                  </MDBox>
                </Grid>
                <Grid item xs={4}>
                  <MDBox p={2} textAlign="center">
                    <MDTypography variant="h5">Adjusted Hourly Carbon</MDTypography>
                    {isFormFilled() && (
                    <MDTypography variant="h3">{carbonIntensitySum}</MDTypography>)}
                  
                  </MDBox>
                </Grid>
                <Grid item xs={4}>
                  <MDBox p={2} textAlign="center">
                    <MDTypography variant="h5" style={{ color: 'green' }}>Avoided Hourly Carbon</MDTypography>
                    {isFormFilled() && (
                    <MDTypography variant="h3" style={{ color: 'green' }}>{previousUserDemand - carbonIntensitySum }</MDTypography>)}
                 
                  </MDBox>
                </Grid>
              </Grid>

              <br/>
              <br/>
              <br/>
              <br/>

              <MDTypography variant="h3">Optimise Your Hourly Carbon </MDTypography>
              <br/>
              <br/>
              <br/>
              <MDTypography variant="h5">Tomorrow's clean and dirty hours </MDTypography>
           
              <br/>
              <br/>
              <Tables />
              <br/>
              <br/>
              <br/>
            
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Grid container spacing={1} justifyContent="center">
      <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
             
             
            
            </Box>
       
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}






export default Notifications;