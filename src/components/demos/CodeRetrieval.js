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
            {/*architecture with LSTMs and{' '}*/}
            {/*<a href="https://www.semanticscholar.org/paper/Neural-Semantic-Parsing-with-Type-Constraints-for-Krishnamurthy-Dasigi/8c6f58ed0ebf379858c0bbe02c53ee51b3eb398a">*/}
            {/*    {' '}*/}
            {/*    constrained type decoding{' '}*/}
            {/*</a>*/}
            {/*trained on the{' '}*/}
            {/*<a href="https://www.semanticscholar.org/paper/The-ATIS-Spoken-Language-Systems-Pilot-Corpus-Hemphill-Godfrey/1d19708290ef3cc3f43c2c95b07acdd4f52f5cda">*/}
            {/*    {' '}*/}
            {/*    ATIS{' '}*/}
            {/*</a>*/}
            {/*dataset. This model is still a proof-of-concept of what you can do with semantic parsing*/}
            {/*in AllenNLP and its performance is not state-of-the-art (this naive model gets around*/}
            {/*40% exact denotation accuracy on the contextual ATIS dataset).*/}
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
        utterance: "Execute the given command, yielding each line.",
    },
    {
        utterance: 'Matches the block or conditions hash.',
    },
    {
        utterance: 'Parse the service name from a path.',
    },
];

const apiUrl = () => `/api/retrieve`;

const modelProps = { apiUrl, title, description, fields, examples, Output };

export default withRouter((props) => <Model {...props} {...modelProps} />);
