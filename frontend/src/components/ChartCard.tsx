// src/components/ChartCard.tsx
import {
  Pie,
  Doughnut,
  Bar,
  PolarArea
} from "react-chartjs-2";

const chartComponents: any = {
  pie: Pie,
  doughnut: Doughnut,
  bar: Bar,
  polar: PolarArea
};

export default function ChartCard({
  title,
  data,
  chartType
}: {
  title: string;
  data: any;
  chartType: "pie" | "doughnut" | "bar" | "polar";
}) {
  const ChartComponent = chartComponents[chartType];

  return (
    <div style={{
      background: "#fff",
      padding: "1.5rem",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      border: "1px solid #ccc"
    }}>
      <h3 style={{ marginBottom: "1rem", fontSize: "1.2rem", fontWeight: 600 }}>{title}</h3>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <ChartComponent data={data} />
      </div>
    </div>
  );
}
