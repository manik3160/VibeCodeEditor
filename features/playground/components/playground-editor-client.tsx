"use client";
import React from 'react'
import { PlaygroundEditor } from '@/features/playground/components/playground-editor'
import type { FileSystemItem } from '@/features/playground/components/playground-editor'

interface PlaygroundEditorClientProps {
  templateData: FileSystemItem
}

const PlaygroundEditorClient: React.FC<PlaygroundEditorClientProps> = ({ templateData }) => {
  const handleSave = async (file: FileSystemItem, content: string) => {
    // TODO: Implement save functionality
    console.log('Saving file:', file, 'with content:', content)
  }

  return (
    <div className="h-screen">
       
      <PlaygroundEditor 
        templateData={templateData}
        activeFile={undefined}
        content=""
        onContentChange={() => {}}
        suggestion={null}
        suggestionLoading={false}
        suggestionPosition={null}
        onAcceptSuggestion={() => {}}
        onRejectSuggestion={() => {}}
        onTriggerSuggestion={() => {}}
      />
    </div>
  )
}

export default PlaygroundEditorClient