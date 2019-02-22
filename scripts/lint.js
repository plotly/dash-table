const execSh = require('exec-sh');

execSh(
    'flake8 --exclude=DataTable.py,__init__.py,_imports_.py --ignore=E501,F401,F841,F811 dash_table',
    err => {
        if (err) {
            throw err;
        }
    }
);