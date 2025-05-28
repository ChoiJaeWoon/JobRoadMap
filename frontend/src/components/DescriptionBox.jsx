import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DescriptionBox = ({ selectedRegion, selectedJob }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedRegion) return;

    setLoading(true);
    setError("");
    axios.get(`http://localhost:8000/stats/tech-ratio?region=${selectedRegion}`)
      .then((res) => {
        const categoryData = res.data[selectedJob] || {};
        setData(categoryData);
      })
      .catch(() => {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedRegion, selectedJob]);

  if (!selectedRegion) {
    return (
      <div style={boxStyle}>
        <h3>📊 지역별 IT 직무 분석</h3>
        <p style={{ fontSize: "14px", color: "#555" }}>
          좌측에서 관심 있는 IT 직무를 선택하고,<br />
          지도의 지역을 클릭하여 해당 지역의<br />
          상세한 통계 정보를 확인할 수 있습니다.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={boxStyle}>
        <p>📡 데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={boxStyle}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div style={boxStyle}>
        <p>⚠️ 선택한 지역에 {selectedJob} 분야 데이터가 없습니다.</p>
      </div>
    );
  }

  const COLORS = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
    "#9966FF", "#FF9F40", "#C9CBCF", "#FF6666", "#00A86B", "#B22222"
  ];

  const chartData = {
    labels: Object.keys(data),
    datasets: [{
      data: Object.values(data),
      backgroundColor: Object.keys(data).map((_, i) => COLORS[i % COLORS.length])
    }]
  };

  return (
    <div style={boxStyle}>
      <h3>{selectedRegion} - {selectedJob} 기술 비율</h3>
      <Pie data={chartData} />
    </div>
  );
};

const boxStyle = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
  boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center"
};

export default DescriptionBox;
