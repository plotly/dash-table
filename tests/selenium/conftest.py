import pytest

from dash.testing.browser import Browser
from preconditions import preconditions
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait

validate_col = lambda col: (isinstance(col, str) and len(col) > 0) or (isinstance(col, int) and col >= 0)
validate_col_id = lambda col_id: isinstance(col_id, str) and len(col_id) > 0
validate_id = lambda id: isinstance(id, str) and len(id) > 0
validate_key = lambda key: isinstance(key, str) and len(key) == 1
validate_row = lambda row: isinstance(row, int) and row >= 0
validate_state = lambda state: state in [READY, LOADING, ANY]
validate_target = lambda target: isinstance(target, DataTableFacade)
validate_mixin = lambda mixin: isinstance(mixin, DataTableMixin)

READY = '.dash-spreadsheet:not(.dash-loading)'
LOADING = '.dash-spreadsheet.dash-loading'
ANY = '.dash-spreadsheet'
TIMEOUT = 10

class DataTableContext:
    @preconditions(validate_target)
    def __init__ (self, target):
        self.target = target

    def __enter__(self):
        return self.target

    def __exit__(self, type, value, traceback):
        return


class HoldKeyContext:
    @preconditions(validate_mixin, validate_key)
    def __init__ (self, mixin, key):
        self.mixin = mixin
        self.key = key

    def __enter__(self):
        ActionChains(self.mixin.driver).key_down(self.key).perform()

    def __exit__(self, type, value, traceback):
        ActionChains(self.mixin.driver).key_up(self.key).perform()


class DataTableCellFacade(object):
    @preconditions(validate_id, validate_mixin)
    def __init__(self, id, mixin):
        self.id = id
        self.mixin = mixin

    @preconditions(validate_row, validate_col, validate_state)
    def get(self, row, col, state=READY):
        self.mixin.wait_for_table(self.id, state)

        return self.mixin.find_elements(
            '#{} {} tbody tr td.dash-cell.column-{}'.format(self.id, state, col)
        )[row] if isinstance(col, int) else self.mixin.find_elements(
            '#{} {} tbody tr td.dash-cell[data-dash-column="{}"]'.format(self.id, state, col)
        )[row]

    @preconditions(validate_row, validate_col, validate_state)
    def click(self, row, col, state=READY):
        return self.get(row, col, state).click()

    @preconditions(validate_row, validate_col, validate_state)
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
    @preconditions(validate_id, validate_mixin)
    def __init__(self, id, mixin):
        self.id = id
        self.mixin = mixin

    @preconditions(validate_row, validate_col_id, validate_state)
    def get(self, row, col_id, state = READY):
        self.mixin.wait_for_table(self.id, state)

        return self.mixin.find_elements(
            '#{} {} tbody tr th.dash-header[data-dash-column="{}"]'.format(self.id, state, col_id)
        )[row]

    @preconditions(validate_row, validate_col_id, validate_state)
    def hide(self, row, col_id, state = READY):
        self.get(row, col_id, state).find_element_by_css_selector(
            '.column-header--hide'
        ).click()

    @preconditions(validate_row, validate_col_id, validate_state)
    def sort(self, row, col_id, state = READY):
        self.get(row, col_id, state).find_element_by_css_selector(
            '.column-header--sort'
        ).click()


class DataTableFacade(object):
    @preconditions(validate_id, validate_mixin)
    def __init__(self, id, mixin):
        self.id = id
        self.mixin = mixin

        self.cell = DataTableCellFacade(id, mixin)
        self.column = DataTableColumnFacade(id, mixin)

    def click_next_page(self):
        self.mixin.wait_for_table(self.id)

        self.mixin.find_element(
            '#{} button.next-page'.format(self.id)
        ).click()

    def click_prev_page(self):
        self.mixin.wait_for_table(self.id)

        self.mixin.find_element(
            '#{} button.previous-page'
        ).click()


class DataTableMixin(object):
    @preconditions(validate_id, validate_state)
    def wait_for_table(self, id, state=ANY):
        return WebDriverWait(self.driver, TIMEOUT).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, '#{} {}'.format(id, state)))
        )

    @preconditions(validate_id)
    def table(self, id):
        return DataTableContext(
            DataTableFacade(id, self)
        )

    def copy(self):
        ActionChains(self.driver).key_down(Keys.CONTROL).send_keys('c').key_up(
            Keys.CONTROL
        ).perform()

    def paste(self):
        ActionChains(self.driver).key_down(Keys.CONTROL).send_keys('v').key_up(
            Keys.CONTROL
        ).perform()


    @preconditions(validate_key)
    def hold(self, key):
        return HoldKeyContext(self, key)


class DataTableComposite(Browser, DataTableMixin):
    def __init__(self, server, **kwargs):
        super(DataTableComposite, self).__init__(**kwargs)
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
def test(request, dash_thread_server, tmpdir):
    with DataTableComposite(
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