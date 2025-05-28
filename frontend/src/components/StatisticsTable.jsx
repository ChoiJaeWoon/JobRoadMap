const StatisticsTable = ({ data }) => {
  const sorted = [...data].sort((a, b) => b.count - a.count);

  const colorMap = {
    backend: "#2ecc71",
    frontend: "#3498db",
    mobile: "#f1c40f",
    fullstack: "#e74c3c",
    embedded: "#9b59b6",
    data: "#1abc9c",
    design: "#34495e",
    other: "#bdc3c7"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>📈 지역별 공고 현황</h3>
      <table style={{ width: "100%", marginTop: "12px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={thStyle}>순위</th>
            <th style={thStyle}>지역</th>
            <th style={thStyle}>공고수</th>
            <th style={thStyle}>모집분야 비율</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, idx) => {
            // jobTypeRatio를 비율 높은 순으로 정렬
            const sortedRatioEntries = Object.entries(row.jobTypeRatio)
              .sort(([, a], [, b]) => b - a); // 내림차순 정렬

            return (
              <tr key={row.region}>
                <td style={tdStyle}>{idx + 1}</td>
                <td style={tdStyle}>{row.region}</td>
                <td style={tdStyle}>{row.count.toLocaleString()}개</td>
                <td style={{ ...tdStyle, textAlign: "left" }}>
                  <div style={{
                    display: "flex",
                    height: "20px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    backgroundColor: "#eee",
                    marginBottom: "8px"
                  }}>
                    {sortedRatioEntries.map(([type, ratio]) => (
                      <div
                        key={type}
                        style={{
                          width: `${ratio}%`,
                          backgroundColor: colorMap[type] || "#95a5a6"
                        }}
                        title={`${type}: ${ratio.toFixed(1)}%`}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: "13px", color: "#444" }}>
                    {sortedRatioEntries.map(([type, ratio]) => (
                      <span key={type} style={{ marginRight: "10px" }}>
                        <strong style={{ color: colorMap[type] || "#888" }}>{type}</strong>: {ratio.toFixed(1)}%
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  padding: "10px",
  textAlign: "center",
  fontWeight: "bold",
  borderBottom: "1px solid #ddd"
};

const tdStyle = {
  padding: "10px",
  textAlign: "center",
  verticalAlign: "top",
  borderBottom: "1px solid #eee"
};

export default StatisticsTable;
