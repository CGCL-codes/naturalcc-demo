from flask import Flask, request
import json
# from flask_cors import CORS, cross_origin
import time
from typing import Dict, Any
import os
import ujson
from ncc.cli.predictor import main as cli_main

# app = Flask(__name__, template_folder='../../', static_folder='../../')
app = Flask(__name__)


# CORS(app, resources=r'/*')
# app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/hi')
def hi():
    return 'hi~'


# api_prefix = '/api/'

# headers = {
#     'Cache-Control' : 'no-cache, no-store, must-revalidate',
#     'Pragma' : 'no-cache' ,
#     'Expires': '' ,
#     'Access-Control-Allow-Origin' : 'http://127.0.0.1:3001',
#     'Access-Control-Allow-Origin' : '*',
#     'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
#     'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
# }

@app.route('/api/time', methods=['POST'])
def get_current_time():
    # return {'time': time.time()}
    inputs = request.get_data(as_text=True)
    output = {}
    output["top_tokens"] = ['aaaaaaa', 'bbbbbbb', 'cccccc', 'ddddd']
    output["top_indices"] = [1, 3, 5, 6]
    output["probabilities"] = [65, 44, 12, 4]
    output["time"] = time.time()
    return json.dumps(output)


@app.route('/api/predict', methods=['POST'])  # , methods=['POST']
# @cross_origin()
def predict():
    inputs = request.get_data(as_text=True)
    # input = inputs["sentence"]
    # tt = request.args.get('tt')
    # # re = {
    # # 'code': 0,
    # # 'data':'xxxxdata',
    # # 'message': "这是测试呀"
    # # }

    model_input = ujson.loads(inputs)["sentence"]
    model_path = '~/.ncc/demo/completion/seqrnn/py150.pt'

    topk_info = cli_main(os.path.expanduser(model_path), input=model_input)
    top_tokens, probabilities = list(zip(*topk_info))
    output = {
        'top_tokens': [token + ' ' for token in top_tokens],
        'probabilities': probabilities,
    }

    # # invoke our model API and obtain the output
    # output = {}
    # print(inputs)
    # # output["top_tokens"] = [['aaa', 'aaaaaaa'], ['bbb', 'bbbbbbb'], ['ccc', 'cccccc'], ['ddd', 'ddddd']]
    # # output["top_indices"] = [[1, 2], [3,4], [5,6], [7,8]]
    # # output["probabilities"] = [[0.11, 0.111], [0.22, 0.222], [0.33, 0.333], [0.44, 0.444]]
    #
    # if ujson.loads(inputs)["sentence"].strip().endswith('send('):
    #     output["top_tokens"] = ['request', 'self', 'response', 'url']
    #     output["top_indices"] = [27, 4, 37, 42]
    #     output["probabilities"] = [0.7793, 0.1738, 0.0322, 0.0016]
    # elif ujson.loads(inputs)["sentence"].strip().endswith('request'):
    #     output["top_tokens"] = ['header_parameters', 'response', 'self', 'request']
    #     output["top_indices"] = [37, 1977, 4, 27, ]
    #     output["probabilities"] = [0.6704, 0.2045, 0.0390, 0.0329, ]
    # elif ujson.loads(inputs)["sentence"].strip().endswith('header_parameters'):
    #     output["top_tokens"] = ['body_content', 'response', 'Content-Type', 'operation_config']
    #     output["top_indices"] = [20592, 37, 1034, 4519, ]
    #     output["probabilities"] = [0.9858, 0.0046, 0.0035, 0.0024, ]
    # elif ujson.loads(inputs)["sentence"].strip().endswith('body_content'):
    #     output["top_tokens"] = ['operation_config', 'self', 'response', 'Content-Length']
    #     output["top_indices"] = [4519, 4, 37, 2849, ]
    #     output["probabilities"] = [1, 0.0001, 3.0696e-05, 1.2577e-05, ]
    # else:
    #     output["top_tokens"] = ['response', 'request', 'self', 'body']
    #     output["top_indices"] = [37, 27, 4, 129]
    #     output["probabilities"] = [0.9868, 0.0025, 0.0021, 0.0017]
    #
    # output["top_tokens"] = [token + ' ' for token in output["top_tokens"]]

    # rsp = flask.Response(json.dumps(output))
    # rsp.headers = headers
    # rsp.headers['Cache-Control'] = 'no-cache'
    # return rsp

    return json.dumps(output)


@app.route('/api/retrieve', methods=['POST'])  # , methods=['POST']
# @cross_origin()
def retrieve():
    inputs = request.get_data(as_text=True)
    # input = inputs["sentence"]
    # tt = request.args.get('tt')
    # # re = {
    # # 'code': 0,
    # # 'data':'xxxxdata',
    # # 'message': "这是测试呀"
    # # }

    # invoke our model API and obtain the output
    model_path = '~/.ncc/demo/retrieval/nbow/csn_ruby.pt'
    model_input = ujson.loads(inputs)["utterance"]
    raw_code = cli_main(os.path.expanduser(model_path), input=model_input)
    raw_code = ujson.loads(raw_code)
    output = {'predicted_sql_query': raw_code}

    return json.dumps(output)


@app.route('/api/summarize', methods=['POST'])  # , methods=['POST']
# @cross_origin()
def summarize():
    inputs = request.get_data(as_text=True)
    # console.log(inputs)
    # input = inputs["sentence"]
    # tt = request.args.get('tt')
    # # re = {
    # # 'code': 0,
    # # 'data':'xxxxdata',
    # # 'message': "这是测试呀"
    # # }
    print(inputs)
    model_input = ujson.loads(inputs)["code"]
    model_path = '~/.ncc/demo/summarization/neural_transformer/python_wan.pt'
    predicted_summary = cli_main(os.path.expanduser(model_path), input=model_input)

    # invoke our model API and obtain the output
    output = {"predicted_summary": predicted_summary}
    # output["top_tokens"] = [['aaa', 'aaaaaaa'], ['bbb', 'bbbbbbb'], ['ccc', 'cccccc'], ['ddd', 'ddddd']]
    # output["top_indices"] = [[1, 2], [3,4], [5,6], [7,8]]
    # output["probabilities"] = [[0.11, 0.111], [0.22, 0.222], [0.33, 0.333], [0.44, 0.444]]
    # if ujson.loads(inputs)["code"].startswith("def mail_managers"):
    #     output["predicted_summary"] = "sends a message to the managers ."
    # elif ujson.loads(inputs)["code"].startswith("def getCarveIntersectionFromEdge"):
    #     output["predicted_summary"] = "get the complex where the carve intersects the edge .",
    # elif ujson.loads(inputs)["code"].startswith("def compare_package"):
    #     output["predicted_summary"] = "compare version packages .",

    # rsp = flask.Response(json.dumps(output))
    # rsp.headers = headers
    # rsp.headers['Cache-Control'] = 'no-cache'
    # return rsp

    return json.dumps(output)

# if __name__=="__main__":
#     app.run(debug=False,host='0.0.0.0', port=5002)
