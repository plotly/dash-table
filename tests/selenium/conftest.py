import pytest

from dash.testing.browser import Browser
from preconditions import preconditions
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait

_validate_col = lambda col: (isinstance(col, str) and len(col) > 0) or (
    isinstance(col, int) and col >= 0
)
_validate_col_id = lambda col_id: isinstance(col_id, str) and len(col_id) > 0
_validate_id = lambda id: isinstance(id, str) and len(id) > 0
_validate_key = lambda key: isinstance(key, str) and len(key) == 1
_validate_keys = lambda keys: isinstance(keys, str) and len(keys) > 0
_validate_mixin = lambda mixin: isinstance(mixin, DataTableMixin)
_validate_row = lambda row: isinstance(row, int) and row >= 0
_validate_state = lambda state: state in [_READY, _LOADING, _ANY]
_validate_target = lambda target: isinstance(target, DataTableFacade)

_READY = ".dash-spreadsheet:not(.dash-loading)"
_LOADING = ".dash-spreadsheet.dash-loading"
_ANY = ".dash-spreadsheet"
_TIMEOUT = 10


class HoldKeyContext:
    @preconditions(_validate_mixin, _validate_key)
    def __init__(self, mixin, key):
        self.mixin = mixin
        self.key = key

    def __enter__(self):
        ActionChains(self.mixin.driver).key_down(self.key).perform()

    def __exit__(self, type, value, traceback):
        ActionChains(self.mixin.driver).key_up(self.key).perform()


class DataTableCellFacade(object):
    @preconditions(_validate_id, _validate_mixin)
    def __init__(self, id, mixin):
        self.id = id
        self.mixin = mixin

    @preconditions(_validate_row, _validate_col, _validate_state)
    def _get_cell_value(self, row, col, selector, state=_ANY):
        return self.get(row, col, state).find_element_by_css_selector(
            ".dash-cell-value"
        )

    @preconditions(_validate_row, _validate_col, _validate_state)
    def click(self, row, col, state=_ANY):
        return self.get(row, col, state).click()

    @preconditions(_validate_row, _validate_col, _validate_state)
    def double_click(self, row, col, state=_ANY):
        ac = ActionChains(self.mixin.driver)
        ac.move_to_element(self._get_cell_value(row, col, state))
        ac.pause(1)  # sometimes experiencing incorrect behavior on scroll otherwise
        ac.double_click()
        return ac.perform()

    @preconditions(_validate_row, _validate_col, _validate_state)
    def get(self, row, col, state=_ANY):
        self.mixin._wait_for_table(self.id, state)

        return (
            self.mixin.find_element(
                '#{} {} tbody td.dash-cell.column-{}[data-dash-row="{}"]'.format(
                    self.id, state, col, row
                )
            )
            if isinstance(col, int)
            else self.mixin.find_element(
                '#{} {} tbody td.dash-cell[data-dash-column="{}"][data-dash-row="{}"]'.format(
                    self.id, state, col, row
                )
            )
        )

    @preconditions(_validate_row, _validate_col, _validate_state)
    def get_text(self, row, col, state=_ANY):
        el = self._get_cell_value(row, col, state)

        value = el.get_attribute("value")
        return (
            value
            if value is not None and value != ""
            else el.get_attribute("innerHTML")
        )

    @preconditions(_validate_row, _validate_col, _validate_state)
    def is_active(self, row, col, state=_ANY):
        input = self.get(row, col, state).find_element_by_css_selector("input")

        return "focused" in input.get_attribute("class").split(" ")

    @preconditions(_validate_row, _validate_col, _validate_state)
    def is_focused(self, row, col, state=_ANY):
        cell = self.get(row, col, state)

        return "focused" in cell.get_attribute("class").split(" ")


class DataTableColumnFacade(object):
    @preconditions(_validate_id, _validate_mixin)
    def __init__(self, id, mixin):
        self.id = id
        self.mixin = mixin

    @preconditions(_validate_row, _validate_col_id, _validate_state)
    def get(self, row, col_id, state=_ANY):
        self.mixin._wait_for_table(self.id, state)

        return self.mixin.find_elements(
            '#{} {} tbody tr th.dash-header[data-dash-column="{}"]'.format(
                self.id, state, col_id
            )
        )[row]

    @preconditions(_validate_row, _validate_col_id, _validate_state)
    def hide(self, row, col_id, state=_ANY):
        self.get(row, col_id, state).find_element_by_css_selector(
            ".column-header--hide"
        ).click()

    @preconditions(_validate_row, _validate_col_id, _validate_state)
    def sort(self, row, col_id, state=_ANY):
        self.get(row, col_id, state).find_element_by_css_selector(
            ".column-header--sort"
        ).click()

    @preconditions(_validate_col_id, _validate_state)
    def filter(self, col_id, state=_ANY):
        return self.mixin.find_element(
            '#{} {} tbody tr th.dash-filter[data-dash-column="{}"]'.format(
                self.id, state, col_id
            )
        ).click()


class DataTableRowFacade(object):
    @preconditions(_validate_id, _validate_mixin)
    def __init__(self, id, mixin):
        self.id = id
        self.mixin = mixin

    @preconditions(_validate_row, _validate_state)
    def delete(self, row, state=_ANY):
        return self.mixin.find_elements(
            "#{} {} tbody tr td.dash-delete-cell".format(self.id, state)
        )[row].click()

    @preconditions(_validate_row, _validate_state)
    def select(self, row, state=_ANY):
        return self.mixin.find_elements(
            "#{} {} tbody tr td.dash-select-cell".format(self.id, state)
        )[row].click()

    @preconditions(_validate_row, _validate_state)
    def is_selected(self, row, state=_ANY):
        return (
            self.mixin.find_elements(
                "#{} {} tbody tr td.dash-select-cell".format(self.id, state)
            )[row]
            .find_element_by_css_selector("input")
            .is_selected()
        )


class DataTablePagingFacade(object):
    @preconditions(_validate_id, _validate_mixin)
    def __init__(self, id, mixin):
        self.id = id
        self.mixin = mixin

    def click_next_page(self):
        self.mixin._wait_for_table(self.id)

        return self.mixin.find_element("#{} button.next-page".format(self.id)).click()

    def click_prev_page(self):
        self.mixin._wait_for_table(self.id)

        return self.mixin.find_element(
            "#{} button.previous-page".format(self.id)
        ).click()

    def click_first_page(self):
        self.mixin._wait_for_table(self.id)

        return self.mixin.find_element("#{} button.first-page".format(self.id)).click()

    def click_last_page(self):
        self.mixin._wait_for_table(self.id)

        return self.mixin.find_element("#{} button.last-page".format(self.id)).click()

    def has_pagination(self):
        self.mixin._wait_for_table(self.id)

        return len(self.mixin.find_elements(".previous-next-container")) != 0

    def has_next_page(self):
        self.mixin._wait_for_table(self.id)

        el = self.mixin.find_element("#{} button.next-page".format(self.id))

        return el is not None and el.is_enabled()

    def has_prev_page(self):
        self.mixin._wait_for_table(self.id)

        el = self.mixin.find_element("#{} button.previous-page".format(self.id))

        return el is not None and el.is_enabled()

    def has_first_page(self):
        self.mixin._wait_for_table(self.id)

        el = self.mixin.find_element("#{} button.first-page".format(self.id))

        return el is not None and el.is_enabled()

    def has_last_page(self):
        self.mixin._wait_for_table(self.id)

        el = self.mixin.find_element("#{} button.last-page".format(self.id))

        return el is not None and el.is_enabled()

    def click_current_page(self):
        self.mixin._wait_for_table(self.id)

        return self.mixin.find_element("#{} input.current-page".format(self.id)).click()

    def get_current_page(self):
        self.mixin._wait_for_table(self.id)

        return self.mixin.find_element(
            "#{} input.current-page".format(self.id)
        ).get_attribute("placeholder")


class DataTableFacade(object):
    @preconditions(_validate_id, _validate_mixin)
    def __init__(self, id, mixin):
        self.id = id
        self.mixin = mixin

        self.cell = DataTableCellFacade(id, mixin)
        self.column = DataTableColumnFacade(id, mixin)
        self.paging = DataTablePagingFacade(id, mixin)
        self.row = DataTableRowFacade(id, mixin)

    def is_ready(self):
        return self.mixin._wait_for_table(self.id, _READY)

    def is_loading(self):
        return self.mixin._wait_for_table(self.id, _LOADING)


class DataTableMixin(object):
    @preconditions(_validate_id, _validate_state)
    def _wait_for_table(self, id, state=_ANY):
        return WebDriverWait(self.driver, _TIMEOUT).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "#{} {}".format(id, state))
            )
        )

    @preconditions(_validate_id)
    def table(self, id):
        return DataTableFacade(id, self)

    def copy(self):
        with self.hold(Keys.CONTROL):
            self.send_keys("c")

    def paste(self):
        with self.hold(Keys.CONTROL):
            self.send_keys("v")

    @preconditions(_validate_key)
    def hold(self, key):
        return HoldKeyContext(self, key)

    def get_selected_text(self):
        return self.driver.execute_script("return window.getSelection().toString()")

    @preconditions(_validate_keys)
    def send_keys(self, keys):
        self.driver.switch_to.active_element.send_keys(keys)


class DataTableComposite(Browser, DataTableMixin):
    def __init__(self, server, **kwargs):
        super(DataTableComposite, self).__init__(**kwargs)
        self.server = server

        self.READY = _READY
        self.LOADING = _LOADING
        self.ANY = _ANY

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
        percy_run=False,
    ) as dc:
        yield dc
