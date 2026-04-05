import React from 'react';
import { Award, CheckCircle2, Calendar, Share2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import './SampleCertificate.css';

const SampleCertificate = ({ 
    studentName = "Alex Johnson", 
    eventName = "Advanced Web Development Workshop", 
    date = "October 24, 2023",
    certificateId = "CERT-2023-EVF-001",
    isSample = true 
}) => {
    return (
        <motion.div 
            className={`certificate-preview-container ${isSample ? 'is-sample' : ''}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            {isSample && <div className="sample-watermark">PREVIEW ONLY</div>}
            
            <div className="certificate-inner">
                {/* Certificate Header */}
                <div className="cert-header">
                    <div className="cert-logo">
                        <div className="logo-ring">
                            <Award className="logo-icon" size={32} />
                        </div>
                    </div>
                    <div className="cert-title-group">
                        <h1 className="cert-org-name">EVENTFLOW</h1>
                        <p className="cert-subtitle">Official Certificate of Achievement</p>
                    </div>
                </div>

                {/* Certificate Body */}
                <div className="cert-body">
                    <p className="cert-award-text">This is to certify that</p>
                    <h2 className="cert-recipient-name">{studentName}</h2>
                    <p className="cert-completion-text">
                        has successfully completed the immersive program in
                    </p>
                    <h3 className="cert-event-name">{eventName}</h3>
                    
                    <div className="cert-stats">
                        <div className="cert-stat">
                            <CheckCircle2 size={16} />
                            <span>100% Curriculum Completion</span>
                        </div>
                        <div className="cert-stat">
                            <Calendar size={16} />
                            <span>Issued on {date}</span>
                        </div>
                    </div>
                </div>

                {/* Certificate Footer */}
                <div className="cert-footer">
                    <div className="cert-id-group">
                        <span className="cert-id-label">Verify at eventflow.example/verify</span>
                        <span className="cert-id-value">{certificateId}</span>
                    </div>
                    <div className="cert-sig-group">
                        <div className="cert-signature">
                            <span className="sig-line"></span>
                            <span className="sig-name">Sarah Miller</span>
                            <span className="sig-title">Program Director</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions for the Sample */}
            <div className="cert-actions">
                <button className="btn btn-secondary btn-sm">
                    <Share2 size={14} /> Share
                </button>
                <button className="btn btn-primary btn-sm">
                    <Download size={14} /> Download PDF
                </button>
            </div>
        </motion.div>
    );
};

export default SampleCertificate;
