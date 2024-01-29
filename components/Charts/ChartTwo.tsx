"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loan } from "@prisma/client";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
interface DashboardClientProps {
  loans: Loan[] | null;
}
const options: ApexOptions = {
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    // events: {
    //   beforeMount: (chart) => {
    //     chart.windowResizeHandler();
    //   },
    // },
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },

  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "25%",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: ["M", "T", "W", "T", "F", "S"],
  },
  yaxis: {
    min: 0,
    max: 1000000,
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",

    markers: {
      radius: 99,
    },
  },
  fill: {
    opacity: 1,
  },
};

interface ChartTwoState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartTwo: React.FC<DashboardClientProps> = ({ loans }) => {
  const [state, setState] = useState<ChartTwoState>({
    series: [],
  });
  // const [state, setState] = useState<ChartTwoState>({
  //   series: [
  //     {
  //       name: "Sales",
  //       data: [44, 55, 41, 67, 22, 43, 65],
  //     },
  //     {
  //       name: "Revenue",
  //       data: [13, 23, 20, 8, 13, 27, 15],
  //     },
  //   ],
  // });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;

  useEffect(() => {
    // Restructure loan data to fit the chart state format
    const restructuredData = transformLoanData(loans);

    // Set the state with the restructured data
    setState({
      series: restructuredData,
    });
  }, [loans]);

  const transformLoanData = (data: Loan[] | null): ChartTwoState["series"] => {
    if (!data) {
      return [];
    }

    // Get the current date
    const currentDate = new Date();

    // Get the start and end dates of the current week (Monday to Saturday)
    const currentWeekStartDate = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)
    );
    const currentWeekEndDate = new Date(
      currentDate.setDate(currentWeekStartDate.getDate() + 5)
    );

    // Initialize weekly data arrays
    const totalLoanAmountData: number[] = Array(7).fill(0);
    const totalInterestRevenueData: number[] = Array(7).fill(0);

    // Iterate over each loan within the current week and aggregate data by day
    data
      .filter(
        (loan) =>
          new Date(loan.createdAt) >= currentWeekStartDate &&
          new Date(loan.createdAt) <= currentWeekEndDate
      )
      .forEach((loan) => {
        const dayIndex = new Date(loan.createdAt).getDay() - 1; // Adjust day index (0-based)
        totalLoanAmountData[dayIndex] += loan.loanAmount;
        totalInterestRevenueData[dayIndex] += loan.interestRevenue || 0;
      });

    // Create the series array with the correct day order
    const daysInOrder = ["M", "T", "W", "T", "F", "S"];

    const seriesData = [
      {
        name: "Total Loan Amount",
        data: daysInOrder.map(
          (day) => totalLoanAmountData[daysInOrder.indexOf(day)]
        ),
      },
      {
        name: "Total Interest Revenue",
        data: daysInOrder.map(
          (day) => totalInterestRevenueData[daysInOrder.indexOf(day)]
        ),
      },
    ];

    return seriesData;
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Profit this week
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ApexCharts
            options={options}
            series={state.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
