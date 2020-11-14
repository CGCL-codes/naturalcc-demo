import React from 'react';
import styled from 'styled-components';
import {withRouter} from 'react-router-dom';
import {Collapse} from '@allenai/varnish';

import HeatMap from '../HeatMap'
import Model from '../Model'
import OutputField from '../OutputField'
import SyntaxHighlight from '../highlight/SyntaxHighlight.js';

const title = "Code Summarization";

// description for task
const description = (
    <span>
        <span>
        Code summarization is the task of summarizing code snippets with natural language descriptions.
            more description...
        </span>
    </span>
)

// tasks that have only 1 model, and models that do not define usage will use this as a default
// undefined is also fine, but no usage will be displayed for this task/model
const defaultUsage = undefined;

const buildUsage = (modelUrl, configPath) => {
    const fullModelUrl = `https://storage.googleapis.com/allennlp-public-models/${modelUrl}`;
    const fullConfigPath = `https://raw.githubusercontent.com/allenai/allennlp-models/v1.0.0/training_config/rc/${configPath}`;
    return {
        installCommand: 'pip install ncc==1.0.0',
        bashCommand: bashCommand(fullModelUrl),
        pythonCommand: pythonCommand(fullModelUrl),
        evaluationCommand: `allennlp evaluate \\
    ${fullModelUrl} \\
    https://s3-us-west-2.amazonaws.com/allennlp/datasets/squad/squad-dev-v1.1.json`,
        trainingCommand: `allennlp train ${fullConfigPath} -s output_path`
    }
}

// models
const taskModels = [
    {
        name: "Seq2Seq",
        desc: <span>
      This model is the baseline model described
      in <a href="https://arxiv.org/pdf/1409.3215.pdf">Sequence to Sequence Learning with Neural Networks</a>.
      It uses a RNN based encoder as well as a RNN based encoder for text generation task.
      </span>,
        modelId: "code-summarization-seq2seq",
        usage: buildUsage("fine-grained-ner.2020-06-24.tar.gz")
    },
    {
        name: "transformer",
        desc: <span>
      Transformer, proposed in <a href="https://arxiv.org/abs/1603.01360">Attention Is All You Need</a>,
             employs self-attention for neural machine translation task .
      </span>,
        modelId: "code-summarization-transformer",
        usage: buildUsage("fine-grained-ner.2020-06-24.tar.gz")
    }
]

const fields = [
    {
        name: "code", label: "Code", type: "TEXT_INPUT",
        placeholder: `E.g. "def addition(a, b):\\n\\treturn a+b"`
    },
    {name: "model", label: "Model", type: "RADIO", options: taskModels, optional: true}
]

const ActionInfo = ({action, tokenized_utterance}) => {
    const utterance_attention = action['utterance_attention'].map(x => [x]);
    const considered_actions = action['considered_actions'];
    const action_probs = action['action_probabilities'].map(x => [x]);

    const probability_heatmap = (
        <div className="heatmap, heatmap-tile">
            <HeatMap colLabels={['Prob']} rowLabels={considered_actions} data={action_probs}/>
        </div>
    );

    const utterance_attention_heatmap = utterance_attention.length > 0 ? (
        <div className="heatmap, heatmap-tile">
            <HeatMap colLabels={['Prob']} rowLabels={tokenized_utterance} data={utterance_attention}/>
        </div>
    ) : (
        ""
    )

    return (
        <div className="flex-container">
            {probability_heatmap}
            {utterance_attention_heatmap}
        </div>
    )
}


const Output = ({responseData}) => {
    const {predicted_actions, entities, linking_scores, predicted_sql_query, tokenized_utterance} = responseData

    let query, internals

    if (predicted_sql_query.length > 1) {
        query = <SyntaxHighlight>{predicted_sql_query}</SyntaxHighlight>
        internals = (
            <OutputField label="Model internals">
                <Collapse defaultActiveKey={['default']}>
                    <Collapse.Panel header="Predicted production rules" key="default">
                        <PanelDesc>
                            The sequence of grammar production rules predicted by the model, which together determine an
                            abstract syntax tree for the program shown above.
                        </PanelDesc>
                        {predicted_actions.map((action, action_index) => (
                            <Collapse key={"action_" + action_index}>
                                <Collapse.Panel header={action['predicted_action']}>
                                    <ActionInfo action={action} tokenized_utterance={tokenized_utterance}/>
                                </Collapse.Panel>
                            </Collapse>
                        ))}
                    </Collapse.Panel>
                    <Collapse.Panel header="Entity linking scores">
                        <HeatMap colLabels={tokenized_utterance} rowLabels={entities} data={linking_scores}/>
                    </Collapse.Panel>
                </Collapse>
            </OutputField>
        )
    } else {
        query = <p>No query found!</p>
        internals = null
    }

    return (
        <div className="model__content answer">
            <OutputField label="SQL Query" suppressSummary>
                {query}
            </OutputField>
            {internals}
        </div>
    )
}

const PanelDesc = styled.div`
  margin-bottom: ${({theme}) => theme.spacing.sm};
`;

const examples = [
    {
        code: "def addition(a, b):\\n\\treturn a+b",
    },
    {
        code: "def addition(a, b):\\n\\treturn a+b",
    },
    {
        code: "def addition(a, b):\\n\\treturn a+b",
    },
];

const apiUrl = () => `/api/atis-parser/predict`

const modelProps = {apiUrl, title, description, fields, examples, Output}

export default withRouter(props => <Model {...props} {...modelProps}/>)



















