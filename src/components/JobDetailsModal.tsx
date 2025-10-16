'use client';

interface JobDetails {
  _id: string;
  title: string;
  description: string;
  company: string;
  aadharNumber: string;
  aadharFileUrl: string;
  transactionId?: string;
  contactEmail?: string;
  postedBy: string;
  createdAt: string;
}

interface JobDetailsModalProps {
  job: JobDetails | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function JobDetailsModal({ job, onClose, onApprove, onReject }: JobDetailsModalProps) {
  if (!job) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500">Title</div>
                <div className="font-medium text-gray-900">{job.title}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Company</div>
                <div className="text-gray-900">{job.company}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Posted By</div>
                <div className="text-gray-900">{job.postedBy}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Created At</div>
                <div className="text-gray-900">{formatDate(job.createdAt)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Aadhaar</div>
                <div className="text-gray-900">{job.aadharNumber}</div>
              </div>
              {job.transactionId && (
                <div>
                  <div className="text-xs text-gray-500">Transaction ID</div>
                  <div className="text-gray-900 break-all">{job.transactionId}</div>
                </div>
              )}
              {job.contactEmail && (
                <div>
                  <div className="text-xs text-gray-500">Contact Email</div>
                  <div className="text-gray-900 break-all">{job.contactEmail}</div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500">Description</div>
                <div className="text-gray-900 whitespace-pre-line">{job.description}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-2">Uploaded Aadhaar File</div>
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                  {/* Render image if image url; otherwise show link */}
                  {job.aadharFileUrl.match(/\.(png|jpg|jpeg|gif|webp)$/i) ? (
                    <img src={job.aadharFileUrl} alt="Aadhaar" className="w-full object-contain max-h-96" />
                  ) : (
                    <a href={job.aadharFileUrl} target="_blank" rel="noreferrer" className="block p-4 text-blue-600 underline">
                      View uploaded file
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button onClick={() => onReject(job._id)} className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">Reject</button>
            <button onClick={() => onApprove(job._id)} className="btn-primary text-sm">Approve</button>
          </div>
        </div>
      </div>
    </div>
  );
}


