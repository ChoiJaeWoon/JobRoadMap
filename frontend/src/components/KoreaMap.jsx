// ✅ KoreaMap.jsx
import React, { useLayoutEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_krLow from "@amcharts/amcharts4-geodata/southKoreaLow";

const nameKoMap = {
  "Seoul": "서울특별시",
  "Busan": "부산광역시",
  "Daegu": "대구광역시",
  "Incheon": "인천광역시",
  "Gwangju": "광주광역시",
  "Daejeon": "대전광역시",
  "Ulsan": "울산광역시",
  "Sejong": "세종특별자치시",
  "Gyeonggi": "경기도",
  "Gangwon": "강원도",
  "North Chungcheong": "충청북도",
  "South Chungcheong": "충청남도",
  "North Jeolla": "전라북도",
  "South Jeolla": "전라남도",
  "North Gyeongsang": "경상북도",
  "South Gyeongsang": "경상남도"
};

const KoreaMap = ({ setSelectedRegion }) => {
  const chartRef = useRef(null);
  const polygonSeriesRef = useRef(null);

  useLayoutEffect(() => {
    const chart = am4core.create("chartdiv", am4maps.MapChart);
    chartRef.current = chart;

    chart.geodata = {
      ...am4geodata_krLow,
      features: am4geodata_krLow.features.map(f => {
        if (f.id === "KR-49") return null;
        if (f.id === "KR-47" && f.geometry.type === "MultiPolygon") {
          const sorted = f.geometry.coordinates.sort((a, b) => {
            const area = poly =>
              Math.abs(poly[0].reduce((acc, [x, y], i, arr) => {
                const [x2, y2] = arr[(i + 1) % arr.length];
                return acc + (x * y2 - x2 * y);
              }, 0) / 2);
            return area(b) - area(a);
          });
          f.geometry.coordinates = [sorted[0]];
        }
        f.properties.name_ko = nameKoMap[f.properties.name] || f.properties.name;
        return f;
      }).filter(Boolean)
    };

    chart.projection = new am4maps.projections.Miller();
    chart.seriesContainer.draggable = false;
    chart.seriesContainer.resizable = false;

    const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeriesRef.current = polygonSeries;
    polygonSeries.useGeodata = true;

    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name_ko}";
    polygonTemplate.fill = am4core.color("#ffffff");
    polygonTemplate.stroke = am4core.color("#000000");
    polygonTemplate.strokeWidth = 1;

    polygonTemplate.states.create("hover").properties.fill = am4core.color("#007BFF");
    polygonTemplate.states.create("active").properties.fill = am4core.color("#007BFF");

    polygonTemplate.events.on("hit", function (ev) {
      polygonSeries.mapPolygons.each(p => p.isActive = false);
      ev.target.isActive = true;
      chart.zoomToMapObject(ev.target.dataItem.mapPolygon);

      const regionEng = ev?.target?.dataItem?.dataContext?.name;
      if (regionEng) {
        console.log("🗺 선택된 지역:", regionEng);
        setSelectedRegion(regionEng);
      } else {
        console.warn("⚠️ 지역명을 찾을 수 없습니다:", ev?.target?.dataItem?.dataContext);
      }
    });

    return () => chart.dispose();
  }, [setSelectedRegion]);

  const resetMap = () => {
    chartRef.current?.goHome();
    polygonSeriesRef.current?.mapPolygons.each(p => p.isActive = false);
    setSelectedRegion(null); // ✅ 추가된 부분
  };

  return (
    <div style={{
      flex: 6,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#fff",
      padding: "10px",
      borderRadius: "10px"
    }}>
      <div id="chartdiv" style={{ flex: 1, width: "100%", height: "100%" }} />
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button onClick={resetMap} style={btnStyle}>🏠</button>
      </div>
    </div>
  );
};

const btnStyle = {
  width: "36px",
  height: "36px",
  border: "none",
  borderRadius: "5px",
  fontSize: "18px",
  cursor: "pointer",
  backgroundColor: "#444",
  color: "#fff"
};

export default KoreaMap;
