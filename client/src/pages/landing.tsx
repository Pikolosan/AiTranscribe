import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, 
  FileText, 
  MessageSquareText, 
  Sparkles, 
  Upload, 
  FileOutput,
  CheckCircle,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  Users,
  Star,
  Play
} from "lucide-react";

export default function Landing() {
  return (
    <div className="bg-white font-inter min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
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
              <a href="#features" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">How it Works</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/app">
                <Button 
                  data-testid="button-get-started"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 bg-primary-100 text-primary-700 border-primary-200">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Meeting Intelligence
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Meeting
              <span className="text-primary-600"> Transcripts</span>
              <br />
              Into Actionable Insights
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload your meeting transcripts and get intelligent, customized summaries in seconds. 
              Extract key decisions, action items, and insights with the power of AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app">
                <Button 
                  data-testid="button-start-summarizing"
                  size="lg"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium text-lg px-8 py-4 h-auto"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Start Summarizing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                data-testid="button-watch-demo"
                variant="outline"
                size="lg"
                className="text-gray-700 border-gray-300 hover:border-gray-400 font-medium text-lg px-8 py-4 h-auto"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Meeting Intelligence
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to turn your meeting chaos into organized, actionable summaries.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <Upload className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart File Upload</h3>
                <p className="text-gray-600 leading-relaxed">
                  Support for multiple file formats including .txt, .docx, and .pdf. Drag and drop for effortless uploads.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <MessageSquareText className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Instructions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Tell the AI exactly what you need. Executive summaries, action items, or detailed notes - your choice.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <BrainCircuit className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Analysis</h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced language models extract key insights, decisions, and action items automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <FileOutput className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Rich Text Editor</h3>
                <p className="text-gray-600 leading-relaxed">
                  Edit and customize your summaries with formatting tools. Perfect for sharing and collaboration.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get your summaries in seconds, not minutes. Powered by cutting-edge AI infrastructure.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Private</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your data is processed securely and never stored permanently. Privacy-first approach.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three Simple Steps to Better Meetings
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From messy transcripts to organized insights in under a minute.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Upload Your Transcript</h3>
              <p className="text-gray-600 leading-relaxed">
                Drag and drop your meeting transcript file. We support .txt, .docx, and .pdf formats.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Add Custom Instructions</h3>
              <p className="text-gray-600 leading-relaxed">
                Tell us what you need - action items, executive summary, or detailed notes. Choose from templates or write your own.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Your Summary</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive an AI-generated summary in seconds. Edit, format, and share with your team instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Meetings?
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Join thousands of professionals who've already streamlined their meeting workflows with AItranscribe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app">
              <Button 
                data-testid="button-get-started-cta"
                size="lg"
                variant="secondary"
                className="bg-white text-primary-600 hover:bg-gray-50 font-medium text-lg px-8 py-4 h-auto"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-semibold">AItranscribe</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transform your meeting transcripts into actionable insights with the power of AI.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How it Works</a></li>              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AItranscribe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}