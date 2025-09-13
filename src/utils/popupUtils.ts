import type { GeoJsonProperties } from 'geojson';

const formatAltitude = (minFt?: number, maxFt?: number): string => {
  if (!minFt && !maxFt) return 'Unknown';
  return `${minFt || 0} - ${maxFt || 'Above'} ft`;
};

export const createPopupMarkup = (
  properties: GeoJsonProperties,
  popupType: 'SIGMET' | 'AIRSIGMET',
): string => {
  if (!properties) return '';

  const color = popupType === 'SIGMET' ? '#d9534f' : '#428bca';
  const altitude = formatAltitude(properties.minFt, properties.maxFt);
  const validFrom = new Date(properties.validTimeFrom).toLocaleString();
  const validTo = new Date(properties.validTimeTo).toLocaleString();

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
            <pre>${properties.rawSigmet || 'No raw text'}</pre>
        </div>
    </div>
`;
};
