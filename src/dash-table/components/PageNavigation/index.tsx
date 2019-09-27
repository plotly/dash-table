import React, { Component } from 'react';
import { IPageNavigationProps } from 'dash-table/components/PageNavigation/props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class PageNavigation extends Component<IPageNavigationProps> {

    constructor(props: IPageNavigationProps) {
        super(props);
    }

    loadNext = () => {
        const { paginator } = this.props;
        paginator.loadNext();
    }

    loadPrevious = () => {
        const { paginator } = this.props;
        paginator.loadPrevious();
    }

    loadFirst = () => {
        const { paginator } = this.props;
        paginator.loadFirst();
    }

    loadLast = () => {
        const { paginator } = this.props;
        paginator.loadLast();
    }

    goToPage = (page_number: string) => {
        const { paginator } = this.props;

        let page = parseInt(page_number, 10);

        if (isNaN(page)) {
            return;
        }

        paginator.goToPage(page);
    }

    render() {
        const {
            paginator,
            page_current
        } = this.props;

        return (paginator.lastPage === 0 ? null : (
            <div className='previous-next-container'>
                <button
                    className='first-page'
                    onClick={this.loadFirst}
                    disabled={paginator.disablePrevious()}>
                    <FontAwesomeIcon icon='angle-double-left' />
                </button>

                <button
                    className='previous-page'
                    onClick={this.loadPrevious}
                    disabled={paginator.disablePrevious()}>
                    <FontAwesomeIcon icon='angle-left' />
                </button>

                <div className='page-number'>
                    <input
                        type='text'
                        className='current-page'
                        onBlur={event => { this.goToPage(event.target.value); event.target.value = ''; }}
                        placeholder={(page_current + 1).toString()}
                        defaultValue=''
                    >
                    </input>

                    {paginator.lastPage ? ' / ' : ''}

                    {paginator.lastPage ? <div className='last-page'>
                        {paginator.lastPage ? paginator.lastPage + 1 : ''}
                    </div> : ''}
                </div>

                <button
                    className='next-page'
                    onClick={this.loadNext}
                    disabled={paginator.disableNext()} >
                    <FontAwesomeIcon icon='angle-right' />
                </button>

                <button
                    className='last-page'
                    onClick={this.loadLast}
                    disabled={paginator.disableLast()}>
                    <FontAwesomeIcon icon='angle-double-right' />
                </button>
            </div>
        ));
    }
}
