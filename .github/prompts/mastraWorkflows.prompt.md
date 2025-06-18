---
mode: 'agent'
description: 'Mastra workflows urls'
---

# Workflows

https://mastra.ai/en/docs/workflows/overview
https://mastra.ai/en/docs/workflows/control-flow
https://mastra.ai/en/docs/workflows/suspend-and-resume
https://mastra.ai/en/docs/workflows/input-data-mapping
https://mastra.ai/en/docs/workflows/using-with-agents-and-tools

## Reference URLs

https://mastra.ai/en/reference/workflows/workflow
https://mastra.ai/en/reference/workflows/map
https://mastra.ai/en/reference/workflows/commit
https://mastra.ai/en/reference/workflows/create-run
https://mastra.ai/en/reference/workflows/snapshots
https://mastra.ai/en/reference/workflows/watch
https://mastra.ai/en/reference/workflows/stream
https://mastra.ai/en/reference/workflows/execute
https://mastra.ai/en/reference/workflows/resume
https://mastra.ai/en/reference/workflows/start
https://mastra.ai/en/reference/workflows/step
https://mastra.ai/en/reference/workflows/then
https://mastra.ai/en/reference/workflows/parallel
https://mastra.ai/en/reference/workflows/branch
https://mastra.ai/en/reference/workflows/dowhile
https://mastra.ai/en/reference/workflows/dountil
https://mastra.ai/en/reference/workflows/foreach

These are critical make sure you fetch each of these to make perfect workflows.

### Inngest

https://mastra.ai/en/docs/workflows/inngest-workflow

"/api/networks": {
      "get": {
        "responses": {
          "200": {
            "description": "List of all networks"
          }
        },
        "operationId": "getApiNetworks",
        "tags": [
          "networks"
        ],
        "parameters": [],
        "description": "Get all available networks"
      }
    },
    "/api/networks/{networkId}": {
      "get": {
        "responses": {
          "200": {
            "description": "Network details"
          },
          "404": {
            "description": "Network not found"
          }
        },
        "operationId": "getApiNetworksByNetworkId",
        "tags": [
          "networks"
        ],
        "parameters": [
          {
            "name": "networkId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get network by ID"
      }
    },
    "/api/networks/{networkId}/generate": {
      "post": {
        "responses": {
          "200": {
            "description": "Generated response"
          },
          "404": {
            "description": "Network not found"
          }
        },
        "operationId": "postApiNetworksByNetworkIdGenerate",
        "tags": [
          "networks"
        ],
        "parameters": [
          {
            "name": "networkId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Generate a response from a network",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "input": {
                    "oneOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "array",
                        "items": {
                          "type": "object"
                        }
                      }
                    ],
                    "description": "Input for the network, can be a string or an array of CoreMessage objects"
                  }
                },
                "required": [
                  "input"
                ]
              }
            }
          }
        }
      }
    },
    "/api/networks/{networkId}/stream": {
      "post": {
        "responses": {
          "200": {
            "description": "Generated response"
          },
          "404": {
            "description": "Network not found"
          }
        },
        "operationId": "postApiNetworksByNetworkIdStream",
        "tags": [
          "networks"
        ],
        "parameters": [
          {
            "name": "networkId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Generate a response from a network",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "input": {
                    "oneOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "array",
                        "items": {
                          "type": "object"
                        }
                      }
                    ],
                    "description": "Input for the network, can be a string or an array of CoreMessage objects"
                  }
                },
                "required": [
                  "input"
                ]
              }
            }
          }
        }
      }
    },