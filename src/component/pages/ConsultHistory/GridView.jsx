/*************************************************************************
* Copyright (c) 2025 Allcognix AI Technologies Pvt Limited.
* All rights reserved.
* This code is licensed under the 'Allcognix AI License' found in the LICENSE file.
* Unauthorized copying, sharing, or use of this code is prohibited.
* The intellectual and technical concepts are proprietary to Allcognix AI Technologies Pvt Limited.
* Author: prathamesh@allcognix.com
* Date: 16-03-2026
*************************************************************************/

// src/component/pages/ConsultHistory/GridView.jsx
import React from 'react';
import EmptyState from './EmptyState';
import ConsultationCard from './ConsultationCard';

/**
 * GridView
 *
 * Props:
 *   filteredAndSortedConsultations — transformed consultation array
 *   toggleExpand                   — open detail drawer
 *   toggleBookmark                 — bookmark handler
 *   onResume                       — async fn(id) from useConsultations hook
 *   globalResuming                 — boolean lock from hook
 */
const GridView = ({
  filteredAndSortedConsultations,
  toggleExpand,
  toggleBookmark,
  onResume,
  globalResuming = false,
  onDelete,
}) => {
  if (filteredAndSortedConsultations.length === 0) {
    return <EmptyState resetFilters={() => {}} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {filteredAndSortedConsultations.map((consult, index) => (
        <ConsultationCard
          key={consult.id}
          consult={consult}
          index={index}
          onResume={onResume}
          globalResuming={globalResuming}
          onDelete={onDelete}   
          onClick={() => toggleExpand(consult.id)}
        />
      ))}
    </div>
  );
};

export default GridView;
