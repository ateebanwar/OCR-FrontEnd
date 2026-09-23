import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { IssueResolutionCard } from './IssueResolutionCard';
import {
  ReviewIssue,
  IssueResolutionInput,
  ReviewResolutionRequest,
} from '../../types/review';
import { DocumentProcessingResult } from '../../types/document';
import { documentService } from '../../services/documentService';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewToken: string;
  issues: ReviewIssue[];
  onReviewResolved: (updatedResult: DocumentProcessingResult) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  reviewToken,
  issues,
  onReviewResolved,
}) => {
  // Initialize resolution state for each issue with its first available option
  const [resolutions, setResolutions] = useState<IssueResolutionInput[]>(() => {
    return issues.map((issue) => ({
      issueId: issue.id,
      userDecision: issue.resolutionOptions[0] || 'KEEP_AS_IS',
      customMeaning: '',
      customValue: undefined,
    }));
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleUpdateResolution = (index: number, updated: IssueResolutionInput) => {
    setResolutions((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const payload: ReviewResolutionRequest = {
        reviewToken,
        resolutions,
      };

      const updated = await documentService.submitReview(payload);
      onReviewResolved(updated);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError('Failed to apply review resolutions. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Document Review & Discrepancy Resolution"
      subtitle={`Please review ${issues.length} item${issues.length > 1 ? 's' : ''} requiring authoritative decision`}
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {submitError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
          {issues.map((issue, index) => {
            const resolution = resolutions[index] || {
              issueId: issue.id,
              userDecision: issue.resolutionOptions[0] || 'KEEP_AS_IS',
            };

            return (
              <IssueResolutionCard
                key={issue.id}
                issue={issue}
                resolution={resolution}
                onChangeResolution={(updated) => handleUpdateResolution(index, updated)}
              />
            );
          })}
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Apply & Recalculate
          </Button>
        </div>
      </div>
    </Modal>
  );
};
