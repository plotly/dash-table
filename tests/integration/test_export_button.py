import dash
import dash_table
import pandas as pd
from selenium import webdriver
import os
from selenium.webdriver.chrome.options import Options
#from selenium.webdriver.firefox.options import Options

os.makedirs('/Users/hayleeluu/Downloads/tableDownload')

#For chrome
options = Options()
options.add_experimental_option("prefs", {
  "download.default_directory": "/Users/hayleeluu/Desktop",
  "download.prompt_for_download": False,
  "download.directory_upgrade": True,
  "safebrowsing.enabled": True
})

chrome_path = r'/usr/local/bin/chromedriver' #path from 'which chromedriver'
driver = webdriver.Chrome(options=options, executable_path=chrome_path)

#For firefox
# fp = webdriver.FirefoxProfile()
# fp.set_preference("browser.download.dir", r"/Users/hayleeluu/Desktop")
# fp.set_preference("browser.download.folderList", 2)
# fp.set_preference("browser.download.manager.showWhenStarting", False)
# fp.set_preference("browser.helperApps.neverAsk.saveToDisk","text/csv,application/vnd.ms-excel")

# driver = webdriver.Firefox(firefox_profile=fp)

df = pd.read_csv('https://raw.githubusercontent.com/plotly/datasets/master/solar.csv')

def test_(dash_duo):
    app = dash.Dash(__name__)
    app.layout = dash_table.DataTable(
    id='table',
    columns=[{"name": i, "id": i} for i in df.columns],
    data=df.to_dict('records'),
    export_format='xlsx'
)
    dash_duo.start_server(app)
    dash_duo.find_element(".export").click()

    path = '/Users/hayleeluu/Downloads/tableDownload'
    list = os.listdir(path)
    assert list.length == 1
    os.remove('/Users/hayleeluu/Downloads/tableDownload')
    driver.close()

