import pytest
from dash.testing.browser import Browser

from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait

READY = '.dash-spreadsheet:not(.dash-loading)'
LOADING = '.dash-spreadsheet.dash-loading'
ANY = '.dash-spreadsheet'
TIMEOUT = 10

class CopyPasteContext:
    def __init__ (self, dt):
        self.dt = dt

    def __enter__(self):
        ActionChains(self.dt.driver).key_down(Keys.CONTROL).send_keys('c').key_up(
            Keys.CONTROL
        ).perform()

    def __exit__(self, type, value, traceback):
        ActionChains(self.dt.driver).key_down(Keys.CONTROL).send_keys('v').key_up(
            Keys.CONTROL
        ).perform()


class DataTableContext:
    def __init__ (self, target):
        self.target = target

    def __enter__(self):
        return self.target

    def __exit__(self, type, value, traceback):
        return


class HoldKeyContext:
    def __init__ (self, dt, key):
        self.dt = dt
        self.key = key

    def __enter__(self):
        ActionChains(self.dt.driver).key_down(self.key).perform()

    def __exit__(self, type, value, traceback):
        ActionChains(self.dt.driver).key_up(self.key).perform()


class DataTableCellFacade(object):
    def __init__(self, id, dt):
        self.id = id
        self.dt = dt

    def get(self, row, col, state=READY):
        self.dt.wait_for_table(self.id, state)

        return self.dt.find_elements(
            '#{} {} tbody tr td.dash-cell.column-{}'.format(self.id, state, col)
        )[row] if isinstance(col, int) else self.dt.find_elements(
            '#{} {} tbody tr td.dash-cell[data-dash-column="{}"]'.format(self.id, state, col)
        )[row]

    def click(self, row, col, state=READY):
        return self.get(row, col, state).click()

    def get_text(self, row, col, state=READY):
        cell = self.get(row, col, state).find_element_by_css_selector(
            '.dash-cell-value'
        )

        value = cell.get_attribute('value')
        return (
            value
            if value is not None and value != ''
            else cell.get_attribute('innerHTML')
        )


class DataTableColumnFacade(object):
    def __init__(self, id, dt):
        self.id = id
        self.dt = dt

    def get(self, row, col_id, state = READY):
        self.dt.wait_for_table(self.id, state)

        return self.dt.find_elements(
            '#{} {} tbody tr th.dash-header[data-dash-column="{}"]'.format(self.id, state, col_id)
        )[row]

    def hide(self, row, col_id, state = READY):
        self.get(row, col_id, state).find_element_by_css_selector(
            '.column-header--hide'
        ).click()

    def sort(self, row, col_id, state = READY):
        self.get(row, col_id, state).find_element_by_css_selector(
            '.column-header--sort'
        ).click()


class DataTableFacade(object):
    def __init__(self, id, dt):
        self.id = id
        self.dt = dt

        self.cell = DataTableCellFacade(id, dt)
        self.column = DataTableColumnFacade(id, dt)

    def click_next_page(self):
        self.dt.wait_for_table(self.id)

        self.dt.find_element(
            '#{} button.next-page'.format(self.id)
        ).click()

    def click_prev_page(self):
        self.dt.wait_for_table(self.id)

        self.dt.find_element(
            '#{} button.previous-page'
        ).click()


class DashTableMixin(object):
    def wait_for_table(self, id, state=ANY):
        return WebDriverWait(self.driver, TIMEOUT).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '#{} {}'.format(id, state)))
        )

    def table(self, id):
        return DataTableContext(
            DataTableFacade(id, self)
        )

    def copy(self):
        return CopyPasteContext(self)

    def hold(self, key):
        return HoldKeyContext(self, key)


class DashTableComposite(Browser, DashTableMixin):
    def __init__(self, server, **kwargs):
        super(DashTableComposite, self).__init__(**kwargs)
        self.server = server

        self.READY = READY
        self.LOADING = LOADING
        self.ANY = ANY

    def start_server(self, app, **kwargs):
        """start the local server with app"""

        # start server with app and pass Dash arguments
        self.server(app, **kwargs)

        # set the default server_url, it implicitly call wait_for_page
        self.server_url = self.server.url


@pytest.fixture
def dt(request, dash_thread_server, tmpdir):
    with DashTableComposite(
        dash_thread_server,
        browser=request.config.getoption("webdriver"),
        remote=request.config.getoption("remote"),
        remote_url=request.config.getoption("remote_url"),
        headless=request.config.getoption("headless"),
        options=request.config.hook.pytest_setup_options(),
        download_path=tmpdir.mkdir("download").strpath,
        percy_assets_root=request.config.getoption("percy_assets"),
        percy_finalize=request.config.getoption("nopercyfinalize"),
    ) as dc:
        yield dc