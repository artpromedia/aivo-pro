import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Users, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BulkUploadStudent {
  firstName: string;
  lastName: string;
  studentId: string;
  grade: number;
  parentEmail: string;
  parentName: string;
  dateOfBirth: string;
  status: 'pending' | 'valid' | 'error';
  error?: string;
}

export default function BulkAddStudents() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [students, setStudents] = useState<BulkUploadStudent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [classId, setClassId] = useState('');

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      parseCSV(file);
    }
  }, []);

  const parseCSV = async (file: File) => {
    setIsProcessing(true);
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    const parsedStudents: BulkUploadStudent[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(',').map(v => v.trim());
      const student: BulkUploadStudent = {
        firstName: values[headers.indexOf('firstName')] || '',
        lastName: values[headers.indexOf('lastName')] || '',
        studentId: values[headers.indexOf('studentId')] || '',
        grade: parseInt(values[headers.indexOf('grade')] || '0'),
        parentEmail: values[headers.indexOf('parentEmail')] || '',
        parentName: values[headers.indexOf('parentName')] || '',
        dateOfBirth: values[headers.indexOf('dateOfBirth')] || '',
        status: 'pending',
      };

      // Validate
      if (!student.firstName || !student.lastName) {
        student.status = 'error';
        student.error = 'Missing name';
      } else if (!student.parentEmail || !student.parentEmail.includes('@')) {
        student.status = 'error';
        student.error = 'Invalid parent email';
      } else if (!student.grade || student.grade < 1 || student.grade > 12) {
        student.status = 'error';
        student.error = 'Invalid grade';
      } else {
        student.status = 'valid';
      }

      parsedStudents.push(student);
    }

    setStudents(parsedStudents);
    setIsProcessing(false);
  };

  const handleSubmit = async () => {
    const validStudents = students.filter(s => s.status === 'valid');
    
    if (validStudents.length === 0) {
      alert('No valid students to add');
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In production, this would call the API
    console.log('Adding students:', validStudents);
    
    setIsProcessing(false);
    navigate('/dashboard');
  };

  const downloadTemplate = () => {
    const template = 'firstName,lastName,studentId,grade,parentEmail,parentName,dateOfBirth\n' +
      'John,Doe,STU001,4,john.parent@email.com,Jane Doe,2015-03-15\n' +
      'Emily,Smith,STU002,4,emily.parent@email.com,Michael Smith,2015-07-22';
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = students.filter(s => s.status === 'valid').length;
  const errorCount = students.filter(s => s.status === 'error').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bulk Add Students</h1>
          <p className="text-gray-600">
            Import multiple students at once using a CSV file
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Import</h2>
          <ol className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">1</span>
              <span>Download the CSV template below</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">2</span>
              <span>Fill in student information (firstName, lastName, studentId, grade, parentEmail, parentName, dateOfBirth)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">3</span>
              <span>Upload the completed CSV file</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">4</span>
              <span>Review and confirm the import</span>
            </li>
          </ol>

          <button
            onClick={downloadTemplate}
            className="mt-6 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download CSV Template
          </button>
        </motion.div>

        {/* Class Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8"
        >
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Select Class
          </label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none"
          >
            <option value="">Choose a class...</option>
            <option value="1">Period 1 - Mathematics (Grade 4)</option>
            <option value="2">Period 2 - Science (Grade 4)</option>
            <option value="3">Period 4 - Reading (Grade 3)</option>
          </select>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8"
        >
          <label
            className={`block border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
              selectedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-indigo-400'
            }`}
          >
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            {selectedFile ? (
              <>
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedFile.name}
                </p>
                <p className="text-gray-600">
                  Click to select a different file
                </p>
              </>
            ) : (
              <>
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  Drop CSV file here or click to browse
                </p>
                <p className="text-gray-600">
                  Supports .csv files only
                </p>
              </>
            )}
          </label>
        </motion.div>

        {/* Preview Table */}
        {students.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-lg p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Preview ({students.length} students)
              </h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-700">{validCount} valid</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-red-700">{errorCount} errors</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Student ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Grade</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Parent Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        {student.status === 'valid' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                      </td>
                      <td className="py-3 px-4">{student.firstName} {student.lastName}</td>
                      <td className="py-3 px-4">{student.studentId}</td>
                      <td className="py-3 px-4">{student.grade}</td>
                      <td className="py-3 px-4">{student.parentEmail}</td>
                      <td className="py-3 px-4 text-red-600 text-sm">{student.error || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Submit */}
        {students.length > 0 && validCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-4"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isProcessing || !classId}
              className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                isProcessing || !classId
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
              }`}
            >
              {isProcessing ? 'Adding Students...' : `Add ${validCount} Students`}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
