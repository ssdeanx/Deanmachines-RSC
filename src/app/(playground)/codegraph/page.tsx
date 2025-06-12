'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaygroundNav } from '../components/playground-nav';
import { useAgent } from '../layout';
import { GitBranch, FileText, Code, Network } from 'lucide-react';

export default function CodeGraphPage() {
    const [repoUrl, setRepoUrl] = useState('');
    const [graphData, setGraphData] = useState<string>('');
    const [analysisResults, setAnalysisResults] = useState<string>('');
    const [workflowStatus, setWorkflowStatus] = useState<string>('');
    const { setCurrentEndpoint } = useAgent();

    useCopilotReadable({
        description: "Current code graph analysis session",
        value: {
            repoUrl,
            graphData,
            analysisResults,
            workflowStatus,
            timestamp: new Date().toISOString(),
        }
    });

    useCopilotAction({
        name: "switchToGitAgent",
        description: "Switch to the git agent for repository operations",
        parameters: [],
        handler: async () => {
            setCurrentEndpoint('http://localhost:4111/copilotkit/git');
            return "Switched to Git Agent - specialized for repository analysis and version control";
        },
    });

    useCopilotAction({
        name: "switchToGraphAgent",
        description: "Switch to the graph agent for graph analysis and visualization",
        parameters: [],
        handler: async () => {
            setCurrentEndpoint('http://localhost:4111/copilotkit/graph');
            return "Switched to Graph Agent - specialized for graph analysis and visualization";
        },
    });

    useCopilotAction({
        name: "switchToCodeAgent",
        description: "Switch to the code agent for code analysis",
        parameters: [],
        handler: async () => {
            setCurrentEndpoint('http://localhost:4111/copilotkit/code');
            return "Switched to Code Agent - specialized for code analysis and generation";
        },
    });

    useCopilotAction({
        name: "setRepositoryUrl",
        description: "Set the repository URL for analysis",
        parameters: [
            {
                name: "url",
                type: "string",
                description: "GitHub repository URL to analyze",
            }
        ],
        handler: async ({ url }) => {
            setRepoUrl(url);
            setWorkflowStatus(`Repository URL set: ${url}`);
            return `Repository URL set to: ${url}`;
        },
    });

    useCopilotAction({
        name: "recordAnalysisResults",
        description: "Record code analysis results",
        parameters: [
            {
                name: "results",
                type: "string",
                description: "Analysis results to record",
            },
            {
                name: "analysisType",
                type: "string",
                description: "Type of analysis performed",
                enum: ["structure", "dependencies", "complexity", "patterns"],
            }
        ],
        handler: async ({ results, analysisType }) => {
            const timestamp = new Date().toISOString();
            const entry = `[${timestamp}] ${analysisType.toUpperCase()} ANALYSIS:\n${results}`;
            setAnalysisResults(prev => prev ? `${prev}\n\n${entry}` : entry);
            return `Recorded ${analysisType} analysis results`;
        },
    });

    useCopilotAction({
        name: "recordGraphData",
        description: "Record graph visualization data",
        parameters: [
            {
                name: "data",
                type: "string",
                description: "Graph data or visualization information",
            },
            {
                name: "graphType",
                type: "string",
                description: "Type of graph generated",
                enum: ["dependency", "call", "module", "class"],
            }
        ],
        handler: async ({ data, graphType }) => {
            const timestamp = new Date().toISOString();
            const entry = `[${timestamp}] ${graphType.toUpperCase()} GRAPH:\n${data}`;
            setGraphData(prev => prev ? `${prev}\n\n${entry}` : entry);
            return `Recorded ${graphType} graph data`;
        },
    });

    useCopilotAction({
        name: "updateWorkflowStatus",
        description: "Update the current workflow status",
        parameters: [
            {
                name: "status",
                type: "string",
                description: "Current workflow status",
            }
        ],
        handler: async ({ status }) => {
            const timestamp = new Date().toISOString();
            const entry = `[${timestamp}] ${status}`;
            setWorkflowStatus(prev => prev ? `${prev}\n${entry}` : entry);
            return `Workflow status updated: ${status}`;
        },
    });

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b bg-card/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                    >
                        <GitBranch className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Code Graph</h1>
                            <p className="text-muted-foreground mt-1">
                                Repository analysis and code visualization
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <PlaygroundNav />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Repository Configuration</CardTitle>
                                    <CardDescription>
                                        Set the repository URL for analysis
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Label htmlFor="repo-url">Repository URL</Label>
                                            <Input
                                                id="repo-url"
                                                value={repoUrl}
                                                onChange={(e) => setRepoUrl(e.target.value)}
                                                placeholder="https://github.com/user/repo"
                                                className="mt-1"
                                            />
                                        </div>
                                        <Button
                                            onClick={() => setWorkflowStatus(`Repository URL set: ${repoUrl}`)}
                                            className="mt-6"
                                        >
                                            Set URL
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Tabs defaultValue="analysis" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                                <TabsTrigger value="graph">Graph Data</TabsTrigger>
                                <TabsTrigger value="workflow">Workflow</TabsTrigger>
                            </TabsList>

                            <TabsContent value="analysis" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Code className="h-5 w-5" />
                                            Code Analysis Results
                                        </CardTitle>
                                        <CardDescription>
                                            Recorded analysis results from code agent
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {analysisResults ? (
                                            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96 whitespace-pre-wrap">
                                                {analysisResults}
                                            </pre>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p>No analysis results yet. Ask the AI to analyze code structure.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="graph" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Network className="h-5 w-5" />
                                            Graph Visualization Data
                                        </CardTitle>
                                        <CardDescription>
                                            Graph data and visualization information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {graphData ? (
                                            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96 whitespace-pre-wrap">
                                                {graphData}
                                            </pre>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p>No graph data yet. Ask the AI to generate graph visualizations.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="workflow" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <GitBranch className="h-5 w-5" />
                                            Workflow Status
                                        </CardTitle>
                                        <CardDescription>
                                            Current workflow progress and status updates
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {workflowStatus ? (
                                            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96 whitespace-pre-wrap">
                                                {workflowStatus}
                                            </pre>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p>No workflow status yet. Start by setting a repository URL.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="h-[800px]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Code Graph Assistant
                                </CardTitle>
                                <CardDescription>
                                    Multi-agent code analysis and visualization
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[calc(100%-120px)]">
                                <CopilotChat
                                    labels={{
                                        title: "Code Graph Assistant",
                                        initial: "I can help you analyze code repositories and create visualizations:\n\n• Switch between git, code, and graph agents\n• Set repository URLs for analysis\n• Record analysis results and findings\n• Generate graph visualization data\n• Track workflow progress\n\nStart by setting a repository URL or switching to a specialized agent!",
                                    }}
                                    className="h-full"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
