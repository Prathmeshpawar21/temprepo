/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// frontend/src/component/pages/Records/Patient/components/RecordsList.jsx

import React from 'react';
import { motion } from 'framer-motion';
import RecordCard from './RecordCard';

const RecordsList = ({ 
  documents, 
  viewMode, 
  selectedDocuments,
  onToggleSelection,
  onView, 
  onEdit,
  onDelete,
  onDownload 
}) => {
  return (
    <motion.div
      key={viewMode}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-4"
      }
    >
      {documents.map((document, index) => (
        <RecordCard
          key={document.id}
          document={document}
          viewMode={viewMode}
          isSelected={selectedDocuments.includes(document.id)}
          onToggleSelection={onToggleSelection}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onDownload={onDownload}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default RecordsList;
