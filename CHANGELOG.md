# Changelog

## RC7 - Sorting props

- Additional sorting_type prop that can take value 'multi' or 'single'
    This prop defines whether the user can sort based on multiple columns or can only sort by one column at a time.

    The default value is 'single'.

## RC8 - Filtering (Basic & Advanced)

- Additional filtering_type prop that can take value 'basic' or 'advanced'
    This prop defines whether the user can filter by column or with complex expressions (and toggle between basic and advanced)

    The default value is 'basic'

    Note: The filtering row counts against n_fixed_rows