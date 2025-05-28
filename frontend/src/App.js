import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import JobSelector from "./components/JobSelector";
import KoreaMap from "./components/KoreaMap";
import StatisticsTable from "./components/StatisticsTable";
import DescriptionBox from "./components/DescriptionBox";

const App = () => {
  const [selectedJob, setSelectedJob] = useState("Backend");
  const [stats, setStats] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  // ✅ 초기 로딩 시 전체 지역별 공고 현황 데이터 fetch
  useEffect(() => {
    fetch("http://localhost:8000/stats/jobtype-ratio-by-region")
      .then(res => res.json())
      .then(data => {
        console.log("✅ 지역별 모집 분야 비율:", data); // 확인용 콘솔 로그
        setStats(data);
      })
      .catch(err => {
        console.error("❌ API 호출 실패:", err);
      });
  }, []);

  return (
    <div style={{
      backgroundColor: "#f8f9fc",
      minHeight: "100vh",
      padding: "0 13%"
    }}>
      {/* 상단 네비게이션 */}
      <Navbar />

      {/* 직무 선택 버튼 */}
      <JobSelector selectedJob={selectedJob} setSelectedJob={setSelectedJob} />

      <div style={{ display: "flex", width: "100%", marginTop: "20px", height: "620px" }}>
        {/* 한국 지도 */}
        <KoreaMap
          selectedJob={selectedJob}
          setSelectedRegion={setSelectedRegion}
          setStats={setStats}
        />

        {/* 오른쪽 설명 박스 */}
        <div style={{
          flex: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px"
        }}>
          <DescriptionBox selectedRegion={selectedRegion} selectedJob={selectedJob} />
        </div>
      </div>

      {/* 하단 공고 통계 테이블 */}
      <StatisticsTable data={stats} />
    </div>
  );
};

export default App;
