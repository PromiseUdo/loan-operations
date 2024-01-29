"use client";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loan } from "@prisma/client";

interface DashboardClientProps {
  loans: Loan[] | null;
}
// const ReactApexChart = dynamic(() => import("react-apexcharts"), {
//   ssr: false,
// });

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div>Loading Chart...</div>, // Add a loading indicator
});

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    // events: {
    //   beforeMount: (chart) => {
    //     chart.windowResizeHandler();
    //   },
    // },
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE", "#00dd00"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
    max: 1000000,
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

const ChartOne: React.FC<DashboardClientProps> = ({ loans }) => {
  const [state, setState] = useState<ChartOneState>({
    series: [],
  });

  // const handleReset = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //   }));
  // };

  // handleReset;

  useEffect(() => {
    // Restructure loan data to fit the chart state format
    const restructuredData = transformLoanData(loans);
    console.log("Restructured Data:", restructuredData);

    // Set the state with the restructured data
    setState({
      series: restructuredData,
    });
  }, []);

  const transformLoanData = (data: Loan[] | null): ChartOneState["series"] => {
    if (!data) {
      return [];
    }

    // Initialize monthly data arrays
    const loanAmountData: number[] = Array(12).fill(0);
    const interestRevenueData: number[] = Array(12).fill(0);
    const paidData: number[] = Array(12).fill(0);

    // Iterate over each loan and aggregate data by month
    data.forEach((loan) => {
      const monthIndex = new Date(loan.createdAt).getMonth();
      loanAmountData[monthIndex] += loan.loanAmount;
      interestRevenueData[monthIndex] += loan.interestRevenue || 0;
      paidData[monthIndex] += loan.paid || 0;
    });

    // Create the series array with correct month order
    const monthsInOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const seriesData = [
      {
        name: "Total Borrowed",
        data: monthsInOrder.map(
          (month) => loanAmountData[monthsInOrder.indexOf(month)]
        ),
      },
      {
        name: "Total Revenue",
        data: monthsInOrder.map(
          (month) => interestRevenueData[monthsInOrder.indexOf(month)]
        ),
      },
      {
        name: "Total Paid",
        data: monthsInOrder.map(
          (month) => paidData[monthsInOrder.indexOf(month)]
        ),
      },
    ];

    return seriesData;
  };

  // NextJS Requirement
  const isWindowAvailable = () => typeof window !== "undefined";

  if (!isWindowAvailable()) return <></>;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="w-full flex items-center justify-between gap-3 sm:gap-5">
          <div className="flex w-full">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Total Borrowed</p>
            </div>
          </div>
          <div className="flex w-full">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">
                Total Interest Revenue
              </p>
            </div>
          </div>
          <div className="flex w-full">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-[#00dd00]"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-[#00dd00]">Total Paid</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5 h-[355px] w-[105%]">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
