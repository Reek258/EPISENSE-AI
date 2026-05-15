import { MapContainer, TileLayer, GeoJSON, Popup, LayersControl, Marker } from 'react-leaflet';
import { type FC, useEffect, useState } from 'react';
import L from 'leaflet';
import { Hospital } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

interface Zone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  risk_level?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  composite_score?: number;
  hospitals?: number;
}

interface RiskHeatmapProps {
  zones: Zone[];
  predictions?: Record<string, any>;
  center?: [number, number];
  zoom?: number;
}

const hospitalIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div className="bg-white p-1 rounded-full shadow-md border-2 border-blue-600 text-blue-600">
      <Hospital size={16} />
    </div>
  ),
  className: 'hospital-marker',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const getRiskColor = (level?: string) => {
  switch (level?.toUpperCase()) {
    case 'CRITICAL': return '#DC2626';
    case 'HIGH': return '#EA580C';
    case 'MODERATE': return '#CA8A04';
    case 'LOW': return '#16A34A';
    default: return '#64748B';
  }
};

const RiskHeatmap: FC<RiskHeatmapProps> = ({ 
  zones, 
  predictions = {},
  center = [18.5204, 73.8567],
  zoom = 12 
}) => {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('/pune-wards.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Error loading GeoJSON:', err));
  }, []);

  const findZoneForFeature = (feature: any) => {
    const props = feature.properties;
    const featName = (props.name || props.ward_name || props.ward_no || props.WARD_NAME || props.Label || "Unknown").toString().toLowerCase();
    const stopWords = ['admin', 'ward', 'pune', 'corporation', 'pmc', 'zone', 'no', 'number', 'vasti', 'goan'];
    const featTokens = featName.split(/[\s-]+/).filter(t => t.length > 2 && !stopWords.includes(t));
    
    return zones.find(z => {
      const zoneName = z.name.toLowerCase();
      if (zoneName.includes(featName) || featName.includes(zoneName)) return true;
      const zoneTokens = zoneName.split(/[\s-]+/).filter(t => t.length > 1 && !stopWords.includes(t));
      const hasOverlap = featTokens.some(ft => zoneTokens.some(zt => ft.includes(zt) || zt.includes(ft)));
      if (hasOverlap) return true;
      return zoneTokens.some(zt => {
        let matches = 0;
        for (let i = 0; i < Math.min(zt.length, featName.length); i++) {
            if (zt[i] === featName[i]) matches++;
        }
        return (matches / zt.length) > 0.7;
      });
    });
  };

  const handleRiskUpdate = async (zoneId: string, level: string) => {
    try {
      const apiClient = (await import('../../api/client')).default;
      await apiClient.post(`/zones/${zoneId}/risk`, { risk_level: level });
      window.location.reload();
    } catch (err) {
      console.error('Failed to update risk:', err);
    }
  };

  useEffect(() => {
    (window as any).handleMapRiskUpdate = handleRiskUpdate;
  }, []);

  const getFeatureStyle = (feature: any) => {
    const zone = findZoneForFeature(feature);
    const color = getRiskColor(zone?.risk_level);
    return { fillColor: color, fillOpacity: 0.65, color: '#ffffff', weight: 1.5, opacity: 1 };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const zone = findZoneForFeature(feature);
    if (zone) {
      // Add Permanent Label
      layer.bindTooltip(zone.name, { 
        permanent: true, 
        direction: 'center', 
        className: 'ward-label' 
      });

      layer.bindPopup(`
        <div class="p-2 min-w-[180px]">
          <h4 class="font-bold text-primary-900 border-b border-surface-50 pb-1 mb-2">${zone.name}</h4>
          <div class="space-y-2">
            <div class="flex justify-between items-center text-xs">
              <span class="text-text-600">Risk Level:</span>
              <span class="font-black" style="color: ${getRiskColor(zone.risk_level)}">${zone.risk_level || 'LOW'}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-text-600">Hospitals:</span>
              <span class="font-bold text-blue-600">${zone.hospitals || 0} Facilities</span>
            </div>
            ${predictions[zone.id] ? `
              <div class="mt-2 p-2 bg-teal-50 rounded border border-teal-100">
                <div class="flex justify-between items-center text-[10px]">
                  <span class="text-teal-800 font-bold uppercase tracking-tighter">7-Day Forecast:</span>
                  <span class="text-teal-900 font-extrabold">${predictions[zone.id].predicted_risk_score_7d.toFixed(1)}%</span>
                </div>
              </div>
            ` : ''}
            <div class="pt-2 border-t border-surface-100 mt-2">
              <p class="text-[9px] font-black text-text-400 uppercase tracking-widest mb-2">Admin: Override Risk</p>
              <div class="grid grid-cols-2 gap-1.5">
                <button onclick="window.handleMapRiskUpdate('${zone.id}', 'CRITICAL')" class="px-1 py-1 bg-red-600 text-white text-[8px] font-bold rounded hover:bg-red-700 transition-colors">CRITICAL</button>
                <button onclick="window.handleMapRiskUpdate('${zone.id}', 'HIGH')" class="px-1 py-1 bg-orange-600 text-white text-[8px] font-bold rounded hover:bg-orange-700 transition-colors">HIGH</button>
                <button onclick="window.handleMapRiskUpdate('${zone.id}', 'MODERATE')" class="px-1 py-1 bg-yellow-500 text-black text-[8px] font-bold rounded hover:bg-yellow-600 transition-colors">MODERATE</button>
                <button onclick="window.handleMapRiskUpdate('${zone.id}', 'LOW')" class="px-1 py-1 bg-green-600 text-white text-[8px] font-bold rounded hover:bg-green-700 transition-colors">LOW</button>
              </div>
            </div>
          </div>
        </div>
      `);
    }
  };

  return (
    <div className="h-[75vh] w-full rounded-lg overflow-hidden border border-surface-100 shadow-sm relative group">
      <style>{`
        .ward-label {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: white !important;
          font-weight: 900 !important;
          font-size: 10px !important;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.8) !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
        }
      `}</style>
      <MapContainer center={center} zoom={zoom} className="h-full w-full" style={{ height: '100%', width: '100%', background: '#000' }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
        </LayersControl>
        {geoData && (
          <GeoJSON key={`pune-${Object.keys(predictions).length}-${zones.map(z => z.risk_level).join('-')}`} data={geoData} style={getFeatureStyle} onEachFeature={onEachFeature} />
        )}
        {zones.map(zone => (
          zone.hospitals > 0 && (
            <Marker key={`hosp-${zone.id}`} position={[zone.latitude, zone.longitude]} icon={hospitalIcon}>
              <Popup><div class="p-1"><h4 class="font-bold text-blue-700">${zone.name} Medical</h4><p class="text-xs">Surveillance facilities available.</p></div></Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default RiskHeatmap;
