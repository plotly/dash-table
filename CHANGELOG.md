# Changelog

## RC6 - Sorting props

- Additional sorting_type prop that can take value 'multi' or 'single'
    This prop defines whether the user can sort based on multiple columns or can only sort by one column at a time. The default value is 'single'.

## RC9 - Treat empty strings as none

- sorting_treat_empty_string_as_none takes value True or False

    Overrides sorting default behavior to consider empty strings as a nully value.

    Note: This is a stopgag prop, full implementation of sorting overrides will most probably deprecate it.

    Default value is False.