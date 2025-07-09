// src/pages/Dashboard.tsx

import { useEffect, useState } from "react";
import API from "../api";
import ChartCard from "../components/ChartCard";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    RadialLinearScale
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    RadialLinearScale
);


export default function Dashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [chartType, setChartType] = useState<"pie" | "doughnut" | "bar" | "polar">("pie");


    const fetchSummary = () => {
        const params: any = {};
        if (fromDate) params.from = fromDate;
        if (toDate) params.to = toDate;

        API.get("/insights/summary", { params })
            .then((res) => {
                setSummary(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch summary", err);
            });
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    if (loading) return <p style={{ padding: "2rem", fontSize: "1.2rem" }}>Loading...</p>;

    const buySellChart = {
        labels: ["Buys", "Sells"],
        datasets: [
            {
                label: "Transactions",
                data: [summary.totalBuys, summary.totalSells],
                backgroundColor: ["#4caf50", "#f44336"]
            }
        ]
    };

    const protocolChart = {
        labels: Object.keys(summary.protocolUsage),
        datasets: [
            {
                label: "Protocol Usage",
                data: Object.values(summary.protocolUsage),
                backgroundColor: ["#2196f3", "#ff9800", "#9c27b0", "#00bcd4", "#f50057"]
            }
        ]
    };

    return (
        <div style={{ padding: "2rem", background: "#f9fafb", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <div style={{display: "flex",
                alignItems: "center",
                justifyContent: "space-between", alignContent: "center",marginBottom: "2rem",}}>
            <h1 style={{  fontSize: "2rem", fontWeight: 600, }}>TokenWise Dashboard</h1>
            <span style={{ border: "1px solid #ccc", padding: "0.5rem", borderRadius: "5px" , background: "#fff",}}> Target Token Contract Address: 9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump (Solana)</span>

            </div>
            <hr />

            <div style={{
                marginTop: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "2rem",
                gap: "1rem",
                flexWrap: "wrap"
                
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "5px", background: "#fff", }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <label style={{ fontWeight: 500 }}>From:</label>
                        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={inputStyle} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <label style={{ fontWeight: 500 }}>To:</label>
                        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={inputStyle} />
                    </div>
                    <button onClick={fetchSummary} style={primaryBtn}>Apply Filter</button>
                </div>
            
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "5px", paddingLeft: "1rem", paddingRight: "1rem", background: "#fff", }}>
                    <div >
                <label style={{ marginRight: "0.5rem", fontWeight: 500 }}>View as:</label>
                <select value={chartType} onChange={(e) => setChartType(e.target.value as any)} style={inputStyle}>
                    <option value="pie">Pie</option>
                    <option value="doughnut">Doughnut</option>
                    <option value="bar">Bar</option>
                    <option value="polar">Polar Area</option>
                </select>
            </div>
                    <a href="https://tokenwise-vl6y.onrender.com/api/insights/export/json" target="_blank" rel="noopener noreferrer">
                        <button style={secondaryBtn}>Export JSON</button>
                    </a>
                    <a href="https://tokenwise-vl6y.onrender.com/api/insights/export/csv" target="_blank" rel="noopener noreferrer">
                        <button style={secondaryBtn}>Export CSV</button>
                    </a>

                </div>
            </div>

           


            {/* Chart Cards */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem"
            }}>
                <ChartCard title="Buy vs Sell" data={buySellChart} chartType={chartType} />
                <ChartCard title="Protocol Usage" data={protocolChart} chartType={chartType} />

            </div>
        </div>
    );
}

const inputStyle = {
    padding: "0.4rem 0.6rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    background: "#fff"
};

const primaryBtn = {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.6rem 1rem",
    borderRadius: "5px",
    cursor: "pointer"
};

const secondaryBtn = {
    backgroundColor: "#4CBB17",
    color: "#333",
    border: "none",
    padding: "0.6rem 1rem",
    borderRadius: "5px",
    cursor: "pointer"
};
