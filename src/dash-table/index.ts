import Environment from 'core/environment';
import Logger from 'core/Logger';

import Table from 'dash-table/Table';
import TableLite from 'dash-table/TableLite';

Logger.setDebugLevel(Environment.debugLevel);
Logger.setLogLevel(Environment.logLevel);

export {
    Table,
    TableLite
};
