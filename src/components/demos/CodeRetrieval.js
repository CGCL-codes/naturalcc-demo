import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { Collapse } from 'antd';

import HeatMap from '../HeatMap';
import Model from '../Model';
import OutputField from '../OutputField';
import SyntaxHighlight from '../highlight/SyntaxHighlight.js';

const title = 'Code Retrieval';

const description = (
    <span>
        <span>
            Searching  semantically  similar  codesnippets given a natural language query can provide developersa series of templates for reference for rapid prototyping.
            <p>Dataset: <a href="https://github.com/github/codesearchnet#data">CodeSearchNet(ruby)</a></p>
            <p><i>*Code is running on 2 core cpu. If it is slow, please wait. Thanks!*</i></p>
        </span>
    </span>
);

const fields = [
    {
        name: 'utterance',
        label: 'Utterance',
        type: 'TEXT_INPUT',
        placeholder: `E.g. "show me the flights from detroit to westchester county"`,
    },
];

const Output = ({ responseData }) => {
    const {
        predicted_sql_query,
    } = responseData;

    let code_snippet, internals;

    // if (predicted_sql_query.length > 1) {
    //     query = <SyntaxHighlight>{predicted_sql_query}</SyntaxHighlight>;
    // } else {
    //     query = <p>No query found!</p>;
    //     internals = null;
    // }
    code_snippet = <SyntaxHighlight language='python'>{predicted_sql_query}</SyntaxHighlight>;
    internals = null;
    return (
        <div className="model__content answer">
            <OutputField label="Retrieved Code" suppressSummary>
                {code_snippet}
            </OutputField>
            {internals}
        </div>
    );
};

const PanelDesc = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const examples = [
    {
        utterance: "Create a missing file if the path is valid.",
    },
    {
        utterance: 'Assign the value to the given attribute of the item',
    },
    {
        utterance: 'Validate the requested filter query strings. If all filters are valid\\n then return them as {Hash hashes}, otherwise halt 400 Bad Request and\\n return JSON error response.',
    },
];

const apiUrl = () => `/api/retrieve`;

const modelProps = { apiUrl, title, description, fields, examples, Output };

export default withRouter((props) => <Model {...props} {...modelProps} />);
