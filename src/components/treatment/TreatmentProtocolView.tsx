'use client';

import React, { useState, useEffect } from 'react';
import ApiManager from '@/services/api';
import { TreatmentProtocol, ProtocolStatus } from '@/lib/types';
import { 
  X, FileText, Download, Clock, User, Calendar,
  ChevronRight, Play, CheckCircle, AlertTriangle,
  Target, Dumbbell, Heart, Brain, Book, Shield
} from 'lucide-react';

interface TreatmentProtocolViewProps {
  visitId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TreatmentProtocolView({ 
  visitId, 
  isOpen, 
  onClose 
}: TreatmentProtocolViewProps) {
  const [protocol, setProtocol] = useState<TreatmentProtocol | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'exercises' | 'areas' | 'recommendations'>('overview');

  useEffect(() => {
    if (isOpen && visitId) {
      fetchProtocol();
    }
  }, [isOpen, visitId]);

  const fetchProtocol = async () => {
    try {
      setLoading(true);
      const response = await ApiManager.getTreatmentProtocolByVisit(visitId);
      if (response.success && response.data) {
        setProtocol(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch treatment protocol:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'LIFESTYLE':
        return <Heart className="h-4 w-4" />;
      case 'PRECAUTION':
        return <Shield className="h-4 w-4" />;
      case 'MEDICATION':
        return <AlertTriangle className="h-4 w-4" />;
      case 'FOLLOW_UP':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Book className="h-4 w-4" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'LIFESTYLE':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'PRECAUTION':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'MEDICATION':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'FOLLOW_UP':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Treatment Protocol</h2>
              {protocol && (
                <p className="text-sm text-gray-500">{protocol.protocol_title}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {protocol && protocol.status === ProtocolStatus.FINALIZED && (
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading treatment protocol...</p>
              </div>
            </div>
          ) : protocol ? (
            <div className="h-full overflow-y-auto">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 px-6">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview', icon: FileText },
                    { id: 'exercises', label: 'Exercises', icon: Dumbbell },
                    { id: 'areas', label: 'Treatment Areas', icon: Target },
                    { id: 'recommendations', label: 'Recommendations', icon: Brain }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                      {id === 'exercises' && protocol.exercises && (
                        <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                          {protocol.exercises.length}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Protocol Info */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Protocol Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              protocol.status === ProtocolStatus.FINALIZED
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {protocol.status === ProtocolStatus.FINALIZED ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Clock className="h-3 w-3 mr-1" />
                              )}
                              {protocol.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        
                        {protocol.finalized_at && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Finalized On</label>
                            <p className="mt-1 text-sm text-gray-900">
                              {new Date(protocol.finalized_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Current Complaint */}
                    {protocol.current_complaint && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Current Complaint</h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{protocol.current_complaint}</p>
                      </div>
                    )}

                    {/* General Notes */}
                    {protocol.general_notes && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">General Notes</h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{protocol.general_notes}</p>
                      </div>
                    )}

                    {/* Additional Notes */}
                    {protocol.additional_manual_notes && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Notes</h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{protocol.additional_manual_notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'exercises' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Exercise Plan</h3>
                    {protocol.exercises && protocol.exercises.length > 0 ? (
                      <div className="space-y-4">
                        {protocol.exercises.map((exercise, index) => (
                          <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-2">{exercise.exercise_name}</h4>
                                {exercise.exercise_description && (
                                  <p className="text-sm text-gray-600 mb-3">{exercise.exercise_description}</p>
                                )}
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Sets:</span>
                                    <span className="ml-1 font-medium text-gray-900">{exercise.custom_sets}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Reps:</span>
                                    <span className="ml-1 font-medium text-gray-900">{exercise.custom_reps}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Duration:</span>
                                    <span className="ml-1 font-medium text-gray-900">
                                      {formatDuration(exercise.custom_duration_seconds)}
                                    </span>
                                  </div>
                                  {exercise.frequency && (
                                    <div>
                                      <span className="text-gray-500">Frequency:</span>
                                      <span className="ml-1 font-medium text-gray-900">{exercise.frequency}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {exercise.custom_notes && (
                                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-700">{exercise.custom_notes}</p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="ml-4 text-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                  {index + 1}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No exercises added to this protocol yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'areas' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Treatment Areas</h3>
                    {protocol.affectedAreas && protocol.affectedAreas.length > 0 ? (
                      <div className="space-y-3">
                        {protocol.affectedAreas.map((area) => (
                          <div key={area.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{area.area_name}</h4>
                                {area.description && (
                                  <p className="text-sm text-gray-600 mt-1">{area.description}</p>
                                )}
                                {area.severity_level && (
                                  <div className="mt-2">
                                    <span className="text-xs text-gray-500">Severity: </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      area.severity_level >= 7 ? 'bg-red-100 text-red-700' :
                                      area.severity_level >= 4 ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-green-100 text-green-700'
                                    }`}>
                                      {area.severity_level}/10
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {area.area_type}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No treatment areas specified.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'recommendations' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
                    {protocol.recommendations && protocol.recommendations.length > 0 ? (
                      <div className="space-y-3">
                        {protocol.recommendations.map((rec) => (
                          <div key={rec.id} className={`border rounded-lg p-4 ${getRecommendationColor(rec.recommendation_type)}`}>
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                {getRecommendationIcon(rec.recommendation_type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium mb-1">{rec.title}</h4>
                                <p className="text-sm">{rec.description}</p>
                                <div className="mt-2">
                                  <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                                    {rec.recommendation_type.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Brain className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No recommendations added yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Treatment protocol not found.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}