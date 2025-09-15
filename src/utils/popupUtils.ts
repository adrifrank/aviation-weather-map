import type { GeoJsonProperties } from 'geojson';
import { formatDate } from './commonUtils';

const formatAltitude = (
  properties: GeoJsonProperties,
  type: 'SIGMET' | 'AIRSIGMET',
): string => {
  if (!properties) return 'Unknown';

  if (type === 'SIGMET') {
    const base = properties.base;
    const top = properties.top;

    if (base !== undefined && top !== undefined) {
      return `${base} ft - ${top} ft`;
    }

    if (top !== undefined) {
      return `${top} ft`;
    }
  } else {
    const alt1 = properties.altitudeHi1;
    const alt2 = properties.altitudeHi2;

    if (alt1 !== undefined && alt2 !== undefined && alt1 !== alt2) {
      const minAlt = Math.min(alt1, alt2);
      const maxAlt = Math.max(alt1, alt2);
      return `${minAlt} ft - ${maxAlt} ft`;
    }

    const altitude = alt1 || alt2;
    if (altitude !== undefined) {
      return `${altitude} ft`;
    }
  }

  return 'Unknown';
};

export const createPopupMarkup = (
  properties: GeoJsonProperties,
  popupType: 'SIGMET' | 'AIRSIGMET',
): string => {
  if (!properties) return '';

  const color = popupType === 'SIGMET' ? '#d9534f' : '#428bca';
  const altitude = formatAltitude(properties, popupType);
  const validFrom = formatDate(properties.validTimeFrom);
  const validTo = formatDate(properties.validTimeTo);
  const rawText =
    properties.rawSigmet || properties.rawAirSigmet || 'No raw text';

  return `
    <style>
        .popup-container {
            font-family: Roboto, sans-serif;
            color: #333;
            padding: 8px;
        }
        .popup-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .popup-header-dot {
            width: 14px;
            height: 14px;
            background-color: ${color};
            border-radius: 50%;
            margin-right: 8px;
        }
        .popup-header-text {
            font-size: 0.9rem;
            font-weight: bold;
            color: ${color};
        }
        .popup-container p {
            margin: 4px 0;
            font-size: 0.9rem;
        }
        .raw-text-container {
            background-color: #f5f5f5;
            padding: 8px;
            border-radius: 4px;
            margin-top: 8px;
            max-height: 150px;
            overflow-y: auto;
            font-size: 0.9rem;
        }
        .raw-text-container pre {
            margin: 0;
            white-space: pre-wrap; 
            font-family: monospace;
        }
    </style>
    <div class="popup-container">
        <div class="popup-header">
            <div class="popup-header-dot"></div>
            <span class="popup-header-text">${popupType}</span>
        </div>
        <p><strong>Hazard:</strong> ${properties.hazard || 'N/A'}</p>
        <p><strong>Altitude:</strong> ${altitude}</p>
        <p><strong>Valid From:</strong> ${validFrom}</p>
        <p><strong>Valid To:</strong> ${validTo}</p>
        <div class="raw-text-container">
            <strong>Raw Text:</strong>
            <pre>${rawText}</pre>
        </div>
    </div>
`;
};
