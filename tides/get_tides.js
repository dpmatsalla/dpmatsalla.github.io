# Get the tides from the BOM website for the entire year, and put them into JSON format, so that they're available for the Spearers website
# Just adjust the dates in the two urls and execute.  Cut and paste the result into the tide_list.js file.
# Remember to replace all of the single quotes with double  ' --> "

import requests
from bs4 import BeautifulSoup
from datetime import datetime

tide_info_list = []
# Add the User-Agent header to the request
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
}

url1 = "http://www.bom.gov.au/australia/tides/print.php?aac=QLD_TP138&type=tide&date=01-08-2023&region=QLD&tz=Australia/Brisbane&tz_js=AEST&days=367"
url2 = "http://www.bom.gov.au/australia/tides/print.php?aac=QLD_TP138&type=tide&date=01-01-2024&region=QLD&tz=Australia/Brisbane&tz_js=AEST&days=367"

# Download the webpage content
response = requests.get(url1, headers=headers)
if response.status_code != 200:
    print("Failed to download the webpage.")
    exit()
else:
    print(response.status_code)
# Parse the HTML content using BeautifulSoup
soup = BeautifulSoup(response.content, "html.parser")
elements = soup.find_all("td")  # Find all <td>
for i in range(0, len(elements), 2):
    if len(elements[i]["class"]) > 1:
        tide_type = "HIGH" if elements[i]["class"][1] == "high-tide" else "LOW"
        data_time_local = elements[i]["data-time-local"]
        #data_time_local = datetime.fromisoformat(data_time_local_str.replace('T', ' ').split('+')[0])
        height = float(elements[i + 1].text[:-2])
    tide_info = {
        "tide": tide_type,
        "time_local": data_time_local,
        "height": height
    }
    tide_info_list.append(tide_info)

# Download the webpage content
response = requests.get(url2, headers=headers)
if response.status_code != 200:
    print("Failed to download the webpage.")
    exit()
else:
    print(response.status_code)
# Parse the HTML content using BeautifulSoup
soup = BeautifulSoup(response.content, "html.parser")
elements = soup.find_all("td")  # Find all <td>
for i in range(0, len(elements), 2):
    if len(elements[i]["class"]) > 1:
        tide_type = "HIGH" if elements[i]["class"][1] == "high-tide" else "LOW"
        data_time_local = elements[i]["data-time-local"]
        #data_time_local = datetime.fromisoformat(data_time_local_str.replace('T', ' ').split('+')[0])
        height = float(elements[i + 1].text[:-2])
    tide_info = {
        "tide": tide_type,
        "time_local": data_time_local,
        "height": height
    }
    tide_info_list.append(tide_info)

print(tide_info_list)
