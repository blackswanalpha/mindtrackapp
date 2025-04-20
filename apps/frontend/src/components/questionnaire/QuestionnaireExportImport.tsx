'use client';

import React, { useState, useRef } from 'react';
import { Card, Button, Alert } from '@/components/common';
import { 
  Download, 
  Upload, 
  FileText, 
  Check, 
  AlertTriangle,
  Info,
  Copy,
  Clipboard,
  ClipboardCheck
} from 'lucide-react';
import api from '@/services/api';

type QuestionnaireExportImportProps = {
  questionnaireId?: number;
  onImportSuccess?: (questionnaire: any) => void;
};

const QuestionnaireExportImport: React.FC<QuestionnaireExportImportProps> = ({
  questionnaireId,
  onImportSuccess
}) => {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [importedData, setImportedData] = useState<any>(null);
  const [importPreview, setImportPreview] = useState<boolean>(false);
  
  const [jsonText, setJsonText] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle export questionnaire
  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(null);
    
    try {
      if (!questionnaireId) {
        throw new Error('No questionnaire selected for export');
      }
      
      // In a real implementation, this would call the API
      // const data = await api.questionnaires.export(questionnaireId, exportFormat);
      
      // Mock export data
      const mockQuestionnaire = {
        id: questionnaireId,
        title: 'Depression Assessment (PHQ-9)',
        description: 'A standardized questionnaire for screening and measuring the severity of depression.',
        instructions: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
        type: 'assessment',
        category: 'mental_health',
        estimated_time: 5,
        is_active: true,
        is_public: true,
        questions: [
          {
            id: 1,
            text: 'Little interest or pleasure in doing things',
            type: 'single_choice',
            required: true,
            order_num: 1,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ],
            scoring_weight: 1
          },
          {
            id: 2,
            text: 'Feeling down, depressed, or hopeless',
            type: 'single_choice',
            required: true,
            order_num: 2,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ],
            scoring_weight: 1
          },
          {
            id: 3,
            text: 'Trouble falling or staying asleep, or sleeping too much',
            type: 'single_choice',
            required: true,
            order_num: 3,
            options: [
              { value: 0, label: 'Not at all' },
              { value: 1, label: 'Several days' },
              { value: 2, label: 'More than half the days' },
              { value: 3, label: 'Nearly every day' }
            ],
            scoring_weight: 1
          }
        ]
      };
      
      // Convert to selected format
      let exportData;
      let fileName;
      let dataUrl;
      
      if (exportFormat === 'json') {
        exportData = JSON.stringify(mockQuestionnaire, null, 2);
        fileName = `questionnaire_${questionnaireId}.json`;
        dataUrl = `data:application/json;charset=utf-8,${encodeURIComponent(exportData)}`;
        setJsonText(exportData);
      } else {
        // Simple CSV conversion for demo purposes
        const header = 'id,text,type,required,order_num,options\n';
        const rows = mockQuestionnaire.questions.map(q => 
          `${q.id},"${q.text}",${q.type},${q.required},${q.order_num},"${JSON.stringify(q.options).replace(/"/g, '""')}"`
        ).join('\n');
        exportData = header + rows;
        fileName = `questionnaire_${questionnaireId}.csv`;
        dataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(exportData)}`;
      }
      
      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportSuccess(`Questionnaire exported successfully as ${fileName}`);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Failed to export questionnaire');
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    setImportedData(null);
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          // Parse JSON
          const data = JSON.parse(content);
          setImportedData(data);
          setImportPreview(true);
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          // Simple CSV parsing for demo purposes
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          
          const questions = lines.slice(1).map((line, index) => {
            const values = line.split(',');
            return {
              id: index + 1,
              text: values[1].replace(/^"|"$/g, ''),
              type: values[2],
              required: values[3] === 'true',
              order_num: parseInt(values[4]),
              options: JSON.parse(values[5].replace(/^"|"$/g, '').replace(/""/g, '"'))
            };
          });
          
          setImportedData({
            title: 'Imported Questionnaire',
            description: 'Imported from CSV file',
            questions
          });
          setImportPreview(true);
        } else {
          throw new Error('Unsupported file format. Please upload a JSON or CSV file.');
        }
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Failed to parse import file');
        console.error(err);
      }
    };
    
    reader.onerror = () => {
      setImportError('Error reading file');
    };
    
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      setImportError('Unsupported file format. Please upload a JSON or CSV file.');
    }
  };

  // Handle import questionnaire
  const handleImport = async () => {
    setIsImporting(true);
    setImportError(null);
    setImportSuccess(null);
    
    try {
      if (!importedData) {
        throw new Error('No data to import');
      }
      
      // In a real implementation, this would call the API
      // const result = await api.questionnaires.import(importedData);
      
      // Mock import success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResult = {
        ...importedData,
        id: Math.floor(Math.random() * 1000) + 100,
        created_at: new Date().toISOString()
      };
      
      setImportSuccess('Questionnaire imported successfully');
      setImportPreview(false);
      
      // Call success callback if provided
      if (onImportSuccess) {
        onImportSuccess(mockResult);
      }
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Failed to import questionnaire');
      console.error(err);
    } finally {
      setIsImporting(false);
    }
  };

  // Handle copy JSON to clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle paste JSON from clipboard
  const handlePasteJson = async () => {
    try {
      const text = await navigator.clipboard.readText();
      try {
        const data = JSON.parse(text);
        setImportedData(data);
        setImportPreview(true);
        setImportError(null);
      } catch (err) {
        setImportError('Invalid JSON format');
      }
    } catch (err) {
      setImportError('Failed to read from clipboard');
    }
  };

  return (
    <div className="space-y-8">
      {/* Export Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Export Questionnaire</h2>
        
        <div className="space-y-6">
          {exportError && (
            <Alert type="error" message={exportError} />
          )}
          
          {exportSuccess && (
            <Alert type="success" message={exportSuccess} />
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  id="format-json"
                  name="export-format"
                  type="radio"
                  checked={exportFormat === 'json'}
                  onChange={() => setExportFormat('json')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="format-json" className="ml-2 block text-sm text-gray-700">
                  JSON
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="format-csv"
                  name="export-format"
                  type="radio"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="format-csv" className="ml-2 block text-sm text-gray-700">
                  CSV
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Button
              type="button"
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={handleExport}
              disabled={isExporting || !questionnaireId}
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export Questionnaire'}
            </Button>
            
            {!questionnaireId && (
              <p className="text-sm text-yellow-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Select a questionnaire to export
              </p>
            )}
          </div>
          
          {exportFormat === 'json' && jsonText && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  JSON Data
                </label>
                <Button
                  type="button"
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm py-1"
                  onClick={handleCopyJson}
                >
                  {isCopied ? (
                    <>
                      <ClipboardCheck className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-60">
                <pre className="text-xs text-gray-800">{jsonText}</pre>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Import Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Import Questionnaire</h2>
        
        <div className="space-y-6">
          {importError && (
            <Alert type="error" message={importError} />
          )}
          
          {importSuccess && (
            <Alert type="success" message={importSuccess} />
          )}
          
          {!importPreview ? (
            <>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      You can import a questionnaire from a JSON or CSV file. The file should contain the questionnaire structure including questions and options.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File
                  </label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".json,.csv"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select File
                    </Button>
                    <span className="ml-3 text-sm text-gray-500">
                      {fileInputRef.current?.files?.[0]?.name || 'No file selected'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Accepted formats: JSON, CSV
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-700 mb-2">Or paste JSON data:</p>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={handlePasteJson}
                    >
                      <Clipboard className="h-4 w-4 mr-2" />
                      Paste from Clipboard
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      File parsed successfully. Review the questionnaire details below.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {importedData.title || 'Untitled Questionnaire'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {importedData.description || 'No description provided'}
                </p>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-md font-medium text-gray-800 mb-2">
                    Questions ({importedData.questions?.length || 0})
                  </h4>
                  <ul className="space-y-2">
                    {importedData.questions?.slice(0, 3).map((question: any, index: number) => (
                      <li key={index} className="text-sm text-gray-700">
                        {index + 1}. {question.text}
                      </li>
                    ))}
                    {(importedData.questions?.length || 0) > 3 && (
                      <li className="text-sm text-gray-500 italic">
                        ...and {importedData.questions.length - 3} more questions
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button
                  type="button"
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setImportPreview(false);
                    setImportedData(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  onClick={handleImport}
                  disabled={isImporting}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isImporting ? 'Importing...' : 'Import Questionnaire'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuestionnaireExportImport;
