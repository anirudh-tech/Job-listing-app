interface PendingJob {
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

interface PendingJobCardProps {
  job: PendingJob;
  onApprove: () => void;
  onReject: () => void;
  onOpen?: (job: PendingJob) => void;
}

export default function PendingJobCard({ job, onApprove, onReject, onOpen }: PendingJobCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show full Aadhaar number for admin view

  return (
    <div
      className="bg-white rounded-lg shadow-md border-l-4 border-yellow-400 p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onOpen && onOpen(job)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
        <span className="text-sm text-gray-500">{formatDate(job.createdAt)}</span>
      </div>
      
      <div className="mb-4 space-y-2">
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Company:</span> {job.company}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Posted by:</span> {job.postedBy}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Aadhaar:</span> {job.aadharNumber}
        </p>
        {job.transactionId && (
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Txn ID:</span> {job.transactionId}
          </p>
        )}
        {job.contactEmail && (
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Email:</span> {job.contactEmail}
          </p>
        )}
      </div>
      
      <p className="text-gray-700 mb-6 line-clamp-3">{job.description}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Pending approval
        </span>
        <div className="flex space-x-2">
          <button
            onClick={(e) => { e.stopPropagation(); onReject(); }}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            Reject
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onApprove(); }}
            className="btn-primary text-sm"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
