import annotateIcon from './icons/annotate-14px.svg';
import otherIcon from './icons/other-14px.svg';
import parseIcon from './icons/parse-14px.svg';
import passageIcon from './icons/passage-14px.svg';
import questionIcon from './icons/question-14px.svg';
import addIcon from './icons/add-14px.svg';

// code summarization task
import CodeSummarization from './components/demos/CodeSummarization'
import CodeRetrieval from './components/demos/CodeRetrieval'
import TypeInference from './components/demos/TypeInference'
import CodePrediction from './components/demos/CodePrediction'

// This is the order in which they will appear in the menu
const modelGroups = [
    // NCC examples
    {
        label: "Code Completion",
        iconSrc: addIcon,
        defaultOpen: true,
        models: [
            {model: "code-prediction", name: "Programming Language Modeling", component: CodePrediction},
        ]
    },
    {
        label: "Code Docummendation",
        iconSrc: annotateIcon,
        defaultOpen: true,
        models: [
            {model: "code-summarization", name: "Code Comment Generation", component: CodeSummarization},
        ]
    },
    {
        label: "Code Retrieval",
        iconSrc: questionIcon,
        defaultOpen: true,
        models: [
            {model: "code-retrieval", name: "Code Retrieval", component: CodeRetrieval},
        ]
    },
    // {
    //     label: "Type Inference",
    //     iconSrc: parseIcon,
    //     defaultOpen: true,
    //     models: [
    //         {model: "type-inference", name: "Type Inference", component: TypeInference},
    //     ]
    // },
    {
        label: "Ongoing",
        iconSrc: otherIcon,
        defaultOpen: true,
        models: [
            {model: "type-inference", name: "Type Inference", component: TypeInference},
            {model: "type-xxx", name: "Code Clone Detection", component: TypeInference},
            {model: "type-xx", name: "API Recommendation", component: TypeInference},
            {model: "type-x", name: "Masked Language Modeling", component: TypeInference},
        ]
    },
]

// Create mapping from model to component
let modelComponents = {}
modelGroups.forEach((mg) => mg.models.forEach(({model, component}) => modelComponents[model] = component));

let modelRedirects = {}
modelGroups.forEach((mg) => mg.models.forEach(
    ({model, redirects}) => {
        if (redirects) {
            redirects.forEach((redirect) => modelRedirects[redirect] = model)
        }
    }
));

export {modelComponents, modelGroups, modelRedirects}
