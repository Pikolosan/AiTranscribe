import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FileUpload } from "@/components/file-upload";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  BrainCircuit, 
  Upload, 
  MessageSquareText, 
  Sparkles, 
  FileOutput,
  Copy,
  Download,
  Share2,
  FileText,
  ChevronRight,
  HelpCircle,
  User,
  Save,
  Mail,
  ExternalLink
} from "lucide-react";
import type { Summary } from "@shared/schema";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [customInstructions, setCustomInstructions] = useState("");
  const [currentSummary, setCurrentSummary] = useState<Summary | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  // Fetch recent summaries
  const { data: recentSummaries = [] } = useQuery<Summary[]>({
    queryKey: ["/api/summaries"],
  });

  // Generate summary mutation
  const generateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/summaries/generate", formData);
      return response.json();
    },
    onSuccess: (summary: Summary) => {
      setCurrentSummary(summary);
      setCurrentStep(3);
      queryClient.invalidateQueries({ queryKey: ["/api/summaries"] });
      toast({
        title: "Summary generated successfully!",
        description: "Ready for editing and sharing",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error generating summary",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update summary mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, editedSummary }: { id: string; editedSummary: string }) => {
      const response = await apiRequest("PATCH", `/api/summaries/${id}`, { editedSummary });
      return response.json();
    },
    onSuccess: (summary: Summary) => {
      setCurrentSummary(summary);
      queryClient.invalidateQueries({ queryKey: ["/api/summaries"] });
      toast({
        title: "Summary updated",
        description: "Your changes have been saved",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating summary",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setCurrentStep(2);
  };

  const handleGenerateSummary = () => {
    if (!uploadedFile) {
      toast({
        title: "No file uploaded",
        description: "Please upload a transcript file first",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("transcript", uploadedFile);
    formData.append("customInstructions", customInstructions);
    formData.append("title", `Summary - ${uploadedFile.name}`);

    generateMutation.mutate(formData);
  };

  const handleSummaryUpdate = (editedContent: string) => {
    if (!currentSummary) return;
    
    updateMutation.mutate({
      id: currentSummary.id,
      editedSummary: editedContent,
    });
  };

  const handleTemplateSelect = (template: string) => {
    const templates = {
      "Executive Summary": "Summarize the key discussion points and decisions in bullet format for executive review. Include important metrics, deadlines, and strategic implications.",
      "Action Items Only": "Extract and list only the action items, next steps, and deliverables. Include responsible parties and deadlines where mentioned.",
      "Key Decisions": "Focus on the important decisions made during the meeting. Include the rationale behind each decision and any dissenting opinions.",
      "Meeting Notes": "Create comprehensive meeting notes with all discussion points, attendee contributions, and outcomes organized by topic.",
    };
    setCustomInstructions(templates[template as keyof typeof templates] || template);
  };

  return (
    <div className="bg-gray-50 font-inter min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">AItranscribe</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Dashboard</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">History</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Settings</a>
            </nav>
            <div className="flex items-center space-x-3">
              <button className="text-gray-400 hover:text-gray-500">
                <HelpCircle className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Processing Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Create Summary</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 ${currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'} rounded-full flex items-center justify-center text-sm font-medium`}>1</div>
                <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-primary-600' : 'text-gray-500'}`}>Upload</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 ${currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'} rounded-full flex items-center justify-center text-sm font-medium`}>2</div>
                <span className={`text-sm ${currentStep >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>Instruct</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 ${currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'} rounded-full flex items-center justify-center text-sm font-medium`}>3</div>
                <span className={`text-sm ${currentStep >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>Generate</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Input Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Upload Transcript</h3>
                </div>
                
                <FileUpload 
                  onFileUpload={handleFileUpload} 
                  uploadedFile={uploadedFile}
                  onFileRemove={() => {
                    setUploadedFile(null);
                    setCurrentStep(1);
                  }}
                />
              </CardContent>
            </Card>

            {/* Custom Instructions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <MessageSquareText className="w-5 h-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Custom Instructions</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                </div>
                
                <div className="space-y-4">
                  <Textarea
                    data-testid="input-custom-instructions"
                    rows={4}
                    className="resize-none"
                    placeholder="e.g., 'Summarize in bullet points for executives' or 'Highlight only action items and next steps'"
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                  />
                  
                  {/* Quick Templates */}
                  <div className="flex flex-wrap gap-2">
                    {["Executive Summary", "Action Items Only", "Key Decisions", "Meeting Notes"].map((template) => (
                      <button
                        key={template}
                        data-testid={`button-template-${template.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button 
              data-testid="button-generate-summary"
              onClick={handleGenerateSummary}
              disabled={!uploadedFile || generateMutation.isPending}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 h-auto"
            >
              {generateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span>Generating Summary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  <span>Generate Summary</span>
                </>
              )}
            </Button>
          </div>

          {/* Right Column: Output Section */}
          <div className="space-y-6">
            {/* Summary Output */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FileOutput className="w-5 h-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Generated Summary</h3>
                  </div>
                  {currentSummary && (
                    <div className="flex items-center space-x-2">
                      <button 
                        data-testid="button-copy-summary"
                        className="text-gray-400 hover:text-gray-600 p-1" 
                        title="Copy to clipboard"
                        onClick={() => {
                          navigator.clipboard.writeText(currentSummary.editedSummary || currentSummary.generatedSummary);
                          toast({ title: "Copied to clipboard" });
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        data-testid="button-download-summary"
                        className="text-gray-400 hover:text-gray-600 p-1" 
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        data-testid="button-share-summary"
                        className="text-gray-400 hover:text-gray-600 p-1" 
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {!currentSummary ? (
                  <div data-testid="summary-empty-state" className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium mb-2">No summary generated yet</p>
                    <p className="text-sm text-gray-400">Upload a transcript and click "Generate Summary" to get started</p>
                  </div>
                ) : (
                  <RichTextEditor
                    data-testid="rich-text-editor"
                    initialContent={currentSummary.editedSummary || currentSummary.generatedSummary}
                    onUpdate={handleSummaryUpdate}
                    isUpdating={updateMutation.isPending}
                  />
                )}
              </CardContent>
            </Card>

            {/* Save Options */}
            {currentSummary && (
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Save & Share</h4>
                  <div className="space-y-3">
                    <button 
                      data-testid="button-save-to-library"
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors flex items-center"
                    >
                      <Save className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Save to Library</p>
                        <p className="text-sm text-gray-500">Store in your personal collection</p>
                      </div>
                    </button>
                    <button 
                      data-testid="button-email-summary"
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors flex items-center"
                    >
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Email Summary</p>
                        <p className="text-sm text-gray-500">Send to meeting participants</p>
                      </div>
                    </button>
                    <button 
                      data-testid="button-export-to-notion"
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors flex items-center"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Export to Notion</p>
                        <p className="text-sm text-gray-500">Add to your workspace</p>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Summaries */}
        <Card className="mt-12">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Summaries</h3>
              <a href="#" className="text-primary-600 hover:text-primary-700 text-sm font-medium">View All</a>
            </div>
            
            {recentSummaries.length === 0 ? (
              <div data-testid="recent-summaries-empty" className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No summaries yet</p>
                <p className="text-sm text-gray-400">Your recent summaries will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSummaries.slice(0, 3).map((summary, index) => (
                  <div 
                    key={summary.id}
                    data-testid={`recent-summary-${index}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-green-100' : 'bg-purple-100'} rounded-lg flex items-center justify-center`}>
                        <FileText className={`w-5 h-5 ${index === 0 ? 'text-blue-600' : index === 1 ? 'text-green-600' : 'text-purple-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{summary.title}</p>
                        <p className="text-sm text-gray-500">
                          Generated {new Date(summary.createdAt).toLocaleDateString()} • {summary.generatedSummary.split(' ').length} words
                        </p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
