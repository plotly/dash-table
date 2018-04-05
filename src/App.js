import React, {Component} from 'react';
import Table from './Table.js';
import {DATA} from './data.js';
import './App.css'

class App extends Component {
    constructor() {
        super();
        this.state = {
            dataframe: DATA,
            column_order: ['NYC', 'Paris', 'Montreal'],
            columns: [
                {
                    'name': 'NYC',
                    // 'width': '10%',
                    'type': 'numeric'
                },
                {
                    'name': 'Paris',
                    // 'width': '20%',
                    'type': 'numeric'
                },
                {
                    'name': 'Montréal',
                    // 'width': '70%',
                    'type': 'numeric'
                }
            ],

            types: {
                'NYC': 'numeric',
                'Paris': 'numeric',
                'Montreal': 'numeric',
            },

            start_cell: [1, 1],
            end_cell: [1, 1],
            selected_cell: [
                [1, 1] // [row, column]
            ],

            is_focused: false,
            collapsable: false,
            expanded_rows: [0, 2]
        }
    }

    render() {
        return (
            <div class={'container'}>
                <h3>{'Table'}</h3>

                <Table
                    editable={true}
                    setProps={newProps => {
                        console.info('--->', newProps);
                        this.setState(newProps)
                    }}
                    {...this.state}
                />

                <pre>{JSON.stringify(this.state, null, 2)}</pre>

            </div>
        )
    }
}

class InputContainer extends Component {
    constructor() {
        super();
        this.state = {
            value: 3,
            isFocused: true
        }
    }

    render() {
        return <StatefulInput
            value={this.state.value}
            updateProps={
                newProps => this.setState(newProps)
            }
            isFocused={this.state.isFocused}
        />
    }
}

class StatefulInput extends Component {
    componentDidMount() {
        if (this.el && this.props.isFocused) {
            console.warn('componentDidMount - focus');
            this.el.focus();
        }
    }

    componentDidUpdate() {
        if (this.el && this.props.isFocused) {
            console.warn('componentDidUpdate - focus');
            this.el.focus();
        }
    }

    render() {
        return (
            <div style={{
                'padding': 50,
            }}
            >
                <button onClick={() => this.props.updateProps({
                    isFocused: false
                })}>
                    {'Unfocus'}
                </button>
                <button onClick={() => this.props.updateProps({
                    isFocused: true
                })}>
                    {'Focus'}
                </button>

                <div>
                    {`Focused: ${this.props.isFocused}`}
                </div>

                <input
                    className={`${
                        this.props.isFocused ?
                        'focused' : 'unfocused'
                    }`}
                    onChange={e => {
                        const newProps = {
                            value: e.target.value
                        };
                        if (!this.props.focused) {
                            newProps.isFocused = true;
                        }
                        this.props.updateProps(newProps);
                    }}

                    onClick={e => {
                        if(!this.props.isFocused) {
                            console.warn('click - preventDefault');
                            e.preventDefault();
                            this.props.updateProps({
                                isFocused: false
                            });
                        }
                        return e;
                    }}
                    onDoubleClick={e => {
                        if(!this.props.isFocused) {
                            console.warn('dblclick - preventDefault');
                            e.preventDefault();
                            this.props.updateProps({
                                isFocused: true
                            });
                        }
                        return e;
                    }}

                    type="text"
                    ref={el => this.el = el}
                    value={this.props.value}
                />
            </div>
        )
    }
}

export default App;
