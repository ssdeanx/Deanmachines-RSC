'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { CopilotChat, CopilotPopup, CopilotSidebar } from "@copilotkit/react-ui";
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
import { Search, FileText, Code, Database } from 'lucide-react';

export default function ResearchPage() {
    const [searchResults, setSearchResults] = useState<string>('');
    const [analysisResults, setAnalysisResults] = useState<string>('');
    const [vectorResults, setVectorResults] = useState<string>('');
    const { setCurrentEndpoint } = useAgent();

    useCopilotReadable({
        description: "Current research session data and results",
        value: {
            searchResults,
            analysisResults,
            vectorResults,
            timestamp: new Date().toISOString(),
        }
    });

    useCopilotAction({
        name: "saveSearchQuery",
        description: "Save a search query for research tracking",
        parameters: [
            {
                name: "query",
                type: "string",
                description: "Search query to save",
            }
        ],
        handler: async ({ query }) => {
            const timestamp = new Date().toISOString();
            const result = `[${timestamp}] Search Query: ${query}`;
            setVectorResults(prev => prev ? `${prev}\n${result}` : result);
            return `Saved search query: ${query}`;
        },
    });

    useCopilotAction({
        name: "recordAnalysis",
        description: "Record analysis findings and insights",
        parameters: [
            {
                name: "data",
                type: "string",
                description: "Data or findings to record",
            },
            {
                name: "analysisType",
                type: "string",
                description: "Type of analysis performed",
                enum: ["statistical", "pattern", "trend", "correlation"],
            }
        ],
        handler: async ({ data, analysisType }) => {
            const timestamp = new Date().toISOString();
            const result = `[${timestamp}] ${analysisType.toUpperCase()} ANALYSIS:\n${data}`;
            setAnalysisResults(prev => prev ? `${prev}\n\n${result}` : result);
            return `Recorded ${analysisType} analysis findings`;
        },
    });

    useCopilotAction({
        name: "recordResearchFindings",
        description: "Record research findings and sources",
        parameters: [
            {
                name: "findings",
                type: "string",
                description: "Research findings to record",
            },
            {
                name: "source",
                type: "string",
                description: "Source of the findings",
            }
        ],
        handler: async ({ findings, source }) => {
            const timestamp = new Date().toISOString();
            const result = `[${timestamp}] SOURCE: ${source}\nFINDINGS: ${findings}`;
            setSearchResults(prev => prev ? `${prev}\n\n${result}` : result);
            return `Recorded research findings from: ${source}`;
        },
    });

    useCopilotAction({
        name: "switchToResearchAgent",
        description: "Switch to the research agent for specialized research tasks",
        parameters: [],
        handler: async () => {
            setCurrentEndpoint('http://localhost:4111/copilotkit/research');
            return "Switched to Research Agent - specialized for research and analysis tasks";
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
                        <Search className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Research Lab</h1>
                            <p className="text-muted-foreground mt-1">
                                Advanced research tracking with CopilotKit
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <PlaygroundNav />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Research Tools</CardTitle>
                                    <CardDescription>Configure your research session</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="research-topic">Research Topic</Label>
                                            <Input id="research-topic" placeholder="Enter research topic" />
                                        </div>
                                        <div>
                                            <Label htmlFor="research-type">Research Type</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="academic">Academic</SelectItem>
                                                    <SelectItem value="market">Market Research</SelectItem>
                                                    <SelectItem value="technical">Technical</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="research-notes">Research Notes</Label>
                                        <Textarea id="research-notes" placeholder="Add your research notes here" />
                                    </div>
                                    <Separator />
                                    <div className="flex gap-2">
                                        <Button>Save Research</Button>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">Advanced Settings</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Advanced Research Settings</DialogTitle>
                                                    <DialogDescription>Configure advanced research parameters</DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label>Research Depth</Label>
                                                        <Select>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select depth" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="surface">Surface</SelectItem>
                                                                <SelectItem value="detailed">Detailed</SelectItem>
                                                                <SelectItem value="comprehensive">Comprehensive</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Tabs defaultValue="search" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="search">Findings</TabsTrigger>
                                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                                <TabsTrigger value="findings">Queries</TabsTrigger>
                            </TabsList>

                            <TabsContent value="search" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Database className="h-5 w-5" />
                                            Research Findings
                                        </CardTitle>
                                        <CardDescription>
                                            Recorded research findings and sources
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {searchResults ? (
                                            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96">
                                                {searchResults}
                                            </pre>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p>No research findings yet. Ask the AI to record research findings.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="analysis" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Code className="h-5 w-5" />
                                            Analysis Results
                                        </CardTitle>
                                        <CardDescription>
                                            Recorded analysis findings and insights
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {analysisResults ? (
                                            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96">
                                                {analysisResults}
                                            </pre>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p>No analysis recorded yet. Ask the AI to record analysis findings.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="findings" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Database className="h-5 w-5" />
                                            Search Queries
                                        </CardTitle>
                                        <CardDescription>
                                            Saved search queries and research topics
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {vectorResults ? (
                                            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96">
                                                {vectorResults}
                                            </pre>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p>No search queries saved yet. Ask the AI to save search queries.</p>
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
                                    Research Assistant
                                </CardTitle>
                                <CardDescription>
                                    Research tracking with CopilotKit actions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="h-[calc(100%-120px)]">
                                <CopilotChat
                                    labels={{
                                        title: "Research Assistant",
                                        initial: "I can help you track and organize research:\n\n• Save search queries and research topics\n• Record analysis findings and insights\n• Document research findings with sources\n• Organize research data for review\n\nTry asking me to save a search query or record some findings!",
                                    }}
                                    className="h-full"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="h-[800px]">
                            <CopilotSidebar
                                labels={{
                                    title: "Research Sidebar",
                                    initial: "Quick research help available here!",
                                }}
                                className="h-full"
                            />
                        </div>

                        <CopilotPopup
                            labels={{
                                title: "Research Popup",
                                initial: "Research assistant popup ready!",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
