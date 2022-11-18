import styles from "./style.module.scss";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Bar } from "react-chartjs-2";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { ChartArea, ChartData } from "chart.js/auto";
import "chart.js/auto";

interface BaseData {
  label: string;
  value: number;
}

interface BarChartProps<DT extends BaseData = BaseData> {
  data: DT[];
  setTooltipData?: (data: DT | null) => void;
}

function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea) {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  gradient.addColorStop(0, "#0377a5");
  gradient.addColorStop(1, "#6fd6ff");

  return gradient;
}

export default function BarChart({ data, setTooltipData }: BarChartProps) {
  const intl = useIntl();

  const chartRef = useRef<ChartJSOrUndefined<"bar", number[], string>>();
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => item.value),
        borderRadius: 10,
      },
    ],
  });

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;

    const gradient = createGradient(chart.ctx, chart.chartArea);

    setChartData({
      ...chartData,
      datasets: chartData.datasets.map((dataset) => ({
        ...dataset,
        backgroundColor: gradient,
      })),
    });
  }, []);

  return (
    <Bar
      ref={chartRef}
      data={chartData}
      options={{
        animation: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            // enabled: false,
            external: ({ tooltip }) => {
              if (setTooltipData)
                setTooltipData(tooltip.opacity === 0 ? null : null);
              console.log(tooltip);
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#9c9c9c",
            },
          },
          y: {
            grid: {
              display: false,
            },
            beginAtZero: true,
            ticks: {
              callback: function (tickValue) {
                tickValue = tickValue as number;
                if (Math.floor(tickValue) === tickValue) {
                  return tickValue;
                }
              },
            },
          },
        },
      }}
    />
  );
}
