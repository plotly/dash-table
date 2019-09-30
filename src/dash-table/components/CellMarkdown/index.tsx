import React, {
    PureComponent
} from 'react';
import { Remarkable } from 'remarkable';

import { memoizeOne } from 'core/memoizer';

interface IProps {
    className: string;
    value: any;
}

export default class CellMarkdown extends PureComponent<IProps> {
    private static md: Remarkable = new Remarkable();

    getMarkdown = memoizeOne((value: string) => ({
        dangerouslySetInnerHTML: {
            __html: CellMarkdown.md.render(value)
        }
    }));

    render() {
        const {
            className,
            value
        } = this.props;

        return (<div
            className={[className, 'cell-markdown'].join(' ')}
            {...this.getMarkdown(value)}
        />);
    }
}