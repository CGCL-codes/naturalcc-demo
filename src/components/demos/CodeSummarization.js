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
        enerating comments forcode snippets is an effective way for program understandingand facilitate the software development and maintenance.
        </span>
    </span>
)


// TODO: NCC cli
// const bashCommand = (modelUrl) => {
//     return `echo '{"code": "def addition(a, b):\\n\\treturn a+b"}' | \\
// allennlp predict ${modelUrl} -`
// }

// TODO: NCC predictor
// const pythonCommand = (modelUrl) => {
//     return `from allennlp.predictors.predictor import Predictor
// import allennlp_models.rc
// predictor = Predictor.from_path("${modelUrl}")
// predictor.predict(
//   passage="The Matrix is a 1999 science fiction action film written and directed by The Wachowskis, starring Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, and Joe Pantoliano.",
//   question="Who stars in The Matrix?"
// )`
// }

// tasks that have only 1 model, and models that do not define usage will use this as a default
// undefined is also fine, but no usage will be displayed for this task/model
const defaultUsage = undefined;

// TODO: define model
// const buildUsage = (modelUrl, configPath) => {
//     // model file, *.pt
//     const fullModelUrl = `https://storage.googleapis.com/allennlp-public-models/${modelUrl}`;
//     // model config, *.yml
//     const fullConfigPath = `https://raw.githubusercontent.com/allenai/allennlp-models/v1.0.0/training_config/rc/${configPath}`;
//     return {
//         installCommand: 'pip install ncc==0.1.0',
//         bashCommand: bashCommand(fullModelUrl),
//         pythonCommand: pythonCommand(fullModelUrl),
//         evaluationCommand: `allennlp evaluate \\
//     ${fullModelUrl} \\
//     https://s3-us-west-2.amazonaws.com/allennlp/datasets/squad/squad-dev-v1.1.json`,
//         trainingCommand: `allennlp train ${fullConfigPath} -s output_path`
//     }
// }

// models
const taskModels = [
    {
        name: "transformer",
        desc: <span>
      Transformer, proposed in <a href="https://arxiv.org/abs/1603.01360">Attention Is All You Need</a>,
             employs self-attention for neural machine translation task .
      </span>,
        modelId: "code-summarization-transformer",
        // usage: buildUsage("fine-grained-ner.2020-06-24.tar.gz")
    },
    {
        name: "Seq2Seq",
        desc: <span>
      This model is the baseline model described
      in <a href="https://arxiv.org/pdf/1409.3215.pdf">Sequence to Sequence Learning with Neural Networks</a>.
      It uses a RNN based encoder as well as a RNN based encoder for text generation task.
      </span>,
        modelId: "code-summarization-seq2seq",
        // usage: buildUsage("fine-grained-ner.2020-06-24.tar.gz")
    },

]

const fields = [
    {
        name: "code", label: "Code", type: "TEXT_INPUT",
        placeholder: `E.g. "def addition(a, b):\\n\\treturn a+b"`
    },
    {name: "model", label: "Model", type: "RADIO", options: taskModels, optional: true}
]


const Output = ({responseData}) => {
    const {
        predicted_summary,
    } = responseData;

    let code_summary, internals;

    // if (predicted_sql_query.length > 1) {
    //     query = <SyntaxHighlight>{predicted_sql_query}</SyntaxHighlight>;
    // } else {
    //     query = <p>No query found!</p>;
    //     internals = null;
    // }
    code_summary = <SyntaxHighlight language='python'>{predicted_summary}</SyntaxHighlight>;
    internals = null;
    return (
        <div className="model__content answer">
            <OutputField label="Generated Code Comment" suppressSummary>
                {code_summary}
            </OutputField>
            {internals}
        </div>
    );
};

const PanelDesc = styled.div`
  margin-bottom: ${({theme}) => theme.spacing.sm};
`;

const examples = [
    {
        code: "def mail_managers(subject, message, fail_silently=False, connection=None):\n\tif (not settings.MANAGERS):\n\t\treturn\n\tEmailMessage((u'%s%s' % (settings.EMAIL_SUBJECT_PREFIX, subject)), message, settings.SERVER_EMAIL, [a[1] for a in settings.MANAGERS], connection=connection).send(fail_silently=fail_silently)\n",
    },
    {
        code: "def getCarveIntersectionFromEdge(edge, vertexes, z):\n\tfirstVertex = vertexes[edge.vertexIndexes[0]]\n\tfirstVertexComplex = firstVertex.dropAxis(2)\n\tsecondVertex = vertexes[edge.v      ertexIndexes[1]]\n\tsecondVertexComplex = secondVertex.dropAxis(2)\n\tzMinusFirst = (z - firstVertex.z)\n\tup = (secondVertex.z - firstVertex.z)\n\treturn (((zMinusFirst * (secondVerte      xComplex - firstVertexComplex)) \/ up) + firstVertexComplex)\n",
    },
    {
        code: "def compare_package(version1, version2):\n\tdef normalize(v):\n\t\treturn [int(x) for x in re.sub('(\\\\.0+)*$', '', v).split('.')]\n\treturn cmp(normalize(version1), normalize(version2))\n",
    },
];

const apiUrl = () => `/api/summarize`

const modelProps = {apiUrl, title, description, fields, examples, Output}

export default withRouter(props => <Model {...props} {...modelProps}/>)
