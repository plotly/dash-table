import React, { Component } from 'react';
import { IPageNavigationProps } from 'dash-table/components/PageNavigation/props';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { KEY_CODES } from 'dash-table/utils/unicode';

export default class PageNavigation extends Component<IPageNavigationProps> {

    constructor(props: IPageNavigationProps) {
        super(props);
    }

    goToPage = (page_number: string) => {
        const { paginator } = this.props;

        let page = parseInt(page_number, 10);

        if (isNaN(page)) {
            return;
        }

        paginator.toIndex(page);
    }

    render() {
        const {
            paginator,
            page_current
        } = this.props;

        return (!paginator.hasLast ? null : (
            <div className='previous-next-container'>
                <button
                    className='first-page'
                    onClick={paginator.toFirst}
                    disabled={paginator.isFirst}>
                    <FontAwesomeIcon icon='angle-double-left' />
                </button>

                <button
                    className='previous-page'
                    onClick={paginator.toPrevious}
                    disabled={!paginator.hasPrevious}>
                    <FontAwesomeIcon icon='angle-left' />
                </button>

                <div className='page-number'>
                    <input
                        type='text'
                        className='current-page'
                        onBlur={event => { this.goToPage(event.target.value); event.target.value = ''; }}
                        onKeyDown={event => { if (event.keyCode === KEY_CODES.ENTER) { event.currentTarget.blur(); } }}
                        placeholder={(page_current + 1).toString()}
                        defaultValue=''
                    >
                    </input>

                    {paginator.hasLast ? ' / ' : ''}

                    {paginator.hasLast ? <div className='last-page'>
                        {paginator.count}
                    </div> : ''}
                </div>

                <button
                    className='next-page'
                    onClick={paginator.toNext}
                    disabled={!paginator.hasNext} >
                    <FontAwesomeIcon icon='angle-right' />
                </button>

                <button
                    className='last-page'
                    onClick={paginator.toLast}
                    disabled={!paginator.hasCount || paginator.isLast}>
                    <FontAwesomeIcon icon='angle-double-right' />
                </button>
            </div>
        ));
    }
}
