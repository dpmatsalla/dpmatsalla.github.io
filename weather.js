// METAR: https://tgftp.nws.noaa.gov/data/observations/metar/stations/YBBN.TXT
// TAF: https://tgftp.nws.noaa.gov/data/forecasts/taf/stations/YBBN.TXT

function getForecastedWinds(tafMessage, targetTime) {
    const tafLines = tafMessage.split('\n');
    let forecastedWinds = null;

    for (let i = 0; i < tafLines.length; i++) {
        const line = tafLines[i].trim();
        if (line.startsWith(targetTime)) {
            const windMatch = line.match(/\b(\d{3}|VRB)(\d{2,3})(G(\d{2,3}))?KT\b/);
            if (windMatch) {
                const direction = windMatch[1];
                const speed = parseInt(windMatch[2]);
                forecastedWinds = {
                    direction: direction === 'VRB' ? 'Variable' : parseInt(direction),
                    speed: speed,
                    gusts: windMatch[4] ? parseInt(windMatch[4]) : null
                };
                break;
            }
        }
    }

    return forecastedWinds;
}

// Example usage:
const tafMessage = `
TAF AMD KJFK 071730Z 0718/0824 23012KT 6SM HZ BKN025
TEMPO 0718/0722 4SM BR
FM080000 19010KT P6SM SCT025
FM080500 17008KT P6SM FEW025
FM081000 16005KT P6SM SCT015
FM081800 13007KT P6SM SCT025
FM082300 18006KT P6SM SKC
`;

const targetTime = '081800';
const forecastedWinds = getForecastedWinds(tafMessage, targetTime);
console.log(forecastedWinds);
